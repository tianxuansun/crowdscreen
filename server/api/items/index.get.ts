import Item from '../../models/Item'
import Flag from '../../models/Flag'
import { connectDb } from '../../utils/db'
import { eventHandler, getQuery } from 'h3'
import { requireUser, requireModerator } from '../../utils/guards'

export default eventHandler(async (event) => {
  await connectDb()
  const query = getQuery(event)
  const status = (query.status as string) || 'pending'
  const page = Math.max(1, Number(query.page || 1))
  const pageSize = Math.max(1, Math.min(50, Number(query.pageSize || 10)))
  const skip = (page - 1) * pageSize

  if (status !== 'pending') requireModerator(event) // only moderators can see non-pending
  else requireUser(event)

  const [items, count] = await Promise.all([
    Item.find({ status }).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    Item.countDocuments({ status })
  ])
  const ids = items.map(i => i._id)
  const flags = await Flag.find({ itemId: { $in: ids } }).lean()
  return { items, flags, page, pageSize, total: count }
})
