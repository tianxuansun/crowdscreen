import Decision from '../../models/Decision'
import Item from '../../models/Item'
import { connectDb } from '../../utils/db'
import { getUserFromEvent } from '../../utils/auth'
import { canModerate } from '../../utils/roles'
import { eventHandler, createError, readBody } from 'h3'
import { getIO } from '../../utils/socket'
import { z } from 'zod'
import mongoose from 'mongoose'

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

  await Decision.create({ itemId, moderatorId: user.sub, decision, notes })

  const status =
    decision === 'approve' ? 'approved' :
    decision === 'reject'  ? 'rejected'  : 'pending'

  await Item.findByIdAndUpdate(itemId, { status })

  getIO()?.emit('item:update', { itemId, status })

  return { ok: true }
})
