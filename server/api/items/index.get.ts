// server/api/items/index.get.ts
import { eventHandler, getQuery } from 'h3'
import { connectDb } from '../../utils/db'
import Item from '../../models/Item'
import Flag from '../../models/Flag'

export default eventHandler(async (event) => {
  await connectDb()

  const q = getQuery(event)
  const status = typeof q.status === 'string' ? q.status : 'pending'
  const page = Math.max(1, parseInt(String(q.page ?? '1'), 10) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(String(q.pageSize ?? '10'), 10) || 10))

  const filter: Record<string, any> = {}
  if (['pending', 'approved', 'rejected'].includes(status)) {
    filter.status = status
  }

  const [items, total] = await Promise.all([
    Item.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Item.countDocuments(filter)
  ])

  const ids = items.map(i => i._id)
  const flags = ids.length ? await Flag.find({ itemId: { $in: ids } }).lean() : []

  return { items, flags, total }
})
