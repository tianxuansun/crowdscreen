import Item from '~/models/Item'
import Flag from '~/models/Flag'
import { connectDb } from '~/server/utils/db'
import { getUserFromEvent } from '~/server/utils/auth'
import { canModerate } from '~/server/utils/roles'

export default eventHandler( async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401 })
  const { status='pending' } = getQuery(event)
  if (status !== 'pending' && !canModerate(user.role)) throw createError({ statusCode: 403 })
  const items = await Item.find({ status }).sort({ createdAt: -1 }).limit(100).lean()
  const ids = items.map(i => i._id)
  const flags = await Flag.find({ itemId: { $in: ids } }).lean()
  return { items, flags }
})
