// server/api/items/index.get.ts
import { eventHandler, getQuery } from 'h3'
import { connectDb } from '../../utils/db'
import Item from '../../models/Item'
// If you have a Flag model, keep this import; otherwise you can remove it and return flags: []
import Flag from '../../models/Flag'

export default eventHandler(async (event) => {
  await connectDb()

  const q = getQuery(event) as {
    status?: string
    page?: string | number
    pageSize?: string | number
  }

  // Default to pending (this is what the moderator queue expects)
  const statusParam = typeof q.status === 'string' ? q.status : 'pending'
  const valid = new Set(['pending', 'approved', 'rejected', 'all'])
  const status = valid.has(statusParam) ? statusParam : 'pending'

  const page = Math.max(1, parseInt(String(q.page ?? '1'), 10))
  const pageSize = Math.min(50, Math.max(1, parseInt(String(q.pageSize ?? '10'), 10)))

  const filter: Record<string, any> = {}
  if (status !== 'all') filter.status = status

  const total = await Item.countDocuments(filter)

  const items = await Item.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()

  // Return per-item flags if you track them
  const ids = items.map(i => i._id)
  const flags = ids.length ? await Flag.find({ itemId: { $in: ids } }).lean() : []

  return { items, flags, total }
})
