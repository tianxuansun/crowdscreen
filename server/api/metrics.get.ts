import Item from '../models/Item'
import Decision from '../models/Decision'
import { connectDb } from '../utils/db'
import { eventHandler } from 'h3'

export default eventHandler( async () => {
  await connectDb()
  const [pending, approved, rejected, decisions] = await Promise.all([
    Item.countDocuments({ status: 'pending' }),
    Item.countDocuments({ status: 'approved' }),
    Item.countDocuments({ status: 'rejected' }),
    Decision.countDocuments({})
  ])

  // avg decision time in last 24h
  const cutoff = new Date(Date.now() - 24*60*60*1000)
  const recent = await Decision.aggregate([
    { $match: { createdAt: { $gte: cutoff } } },
    { $lookup: { from: 'items', localField: 'itemId', foreignField: '_id', as: 'item' } },
    { $unwind: '$item' },
    { $project: { dt: { $subtract: ['$createdAt', '$item.createdAt'] } } },
    { $group: { _id: 1, avgMs: { $avg: '$dt' }, count: { $sum: 1 } } }
  ])
  const avgDecisionMs24h = recent[0]?.avgMs ?? null
  const decisions24h = recent[0]?.count ?? 0

  return { pending, approved, rejected, decisions, decisions24h, avgDecisionMs24h }
})
