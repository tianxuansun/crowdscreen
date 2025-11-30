// server/api/items/index.get.ts
import Item from '../../models/Item'
import Flag from '../../models/Flag'
import { connectDb } from '../../utils/db'
import { eventHandler, getQuery } from 'h3'
import { z } from 'zod'

const qSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
})

export default eventHandler(async (event) => {
  await connectDb()

  const { status, page, pageSize } = qSchema.parse(getQuery(event))
  const where: any = { status }

  const total = await Item.countDocuments(where)

  const items = await Item.find(where)
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()

  const ids = items.map(i => i._id)
  const flags = ids.length
    ? await Flag.find({ itemId: { $in: ids } }).lean()
    : []

  return { items, total, flags }
})
