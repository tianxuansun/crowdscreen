import Decision from '../../models/Decision'
import Item from '../../models/Item'
import { connectDb } from '../../utils/db'
import { getUserFromEvent } from '../../utils/auth'
import { canModerate } from '../../utils/roles'
import { eventHandler, createError, readBody } from 'h3'
import { getIO } from '../../utils/socket'
import { z } from 'zod'
import mongoose from 'mongoose'
import User from '../../models/User'

const bodySchema = z.object({
  itemId: z.string().refine(mongoose.isValidObjectId, 'Invalid item id'),
  decision: z.enum(['approve','reject','escalate']),
  notes: z.string().max(2000).optional()
})

export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user || !canModerate(user.role)) throw createError({ statusCode: 403 })

  const { itemId, decision, notes } = bodySchema.parse(await readBody(event))

  const item = await Item.findById(itemId).lean()
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  let moderatorId: any = mongoose.isValidObjectId(user.sub) ? user.sub : null
  if (!moderatorId) {
    const me = await User.findOne({ email: user.email }).select('_id').lean()
    if (me?._id) moderatorId = me._id
  }
  if (!moderatorId) {
    const mod = await User.findOne({ role: 'moderator' }).select('_id').lean()
    if (mod?._id) moderatorId = mod._id
  }
  if (!moderatorId) {
    throw createError({ statusCode: 500, statusMessage: 'No valid moderator id' })
  }

  await Decision.create({ itemId, moderatorId, decision, notes })
  const status =
    decision === 'approve' ? 'approved' :
    decision === 'reject'  ? 'rejected'  : 'pending'

  await Item.findByIdAndUpdate(itemId, { status })

  getIO()?.emit('item:update', { itemId, status })

  return { ok: true }
})
