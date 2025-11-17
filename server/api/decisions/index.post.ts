import Decision from '../../models/Decision'
import Item from '../../models/Item'
import { connectDb } from '../../utils/db'
import { getUserFromEvent } from '../../utils/auth'
import { canModerate } from '../../utils/roles'
import { eventHandler, createError, readBody } from 'h3'
import { getIO } from '../../utils/socket'

export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user || !canModerate(user.role)) throw createError({ statusCode: 403 })

  const { itemId, decision, notes } = await readBody(event)
  await Decision.create({ itemId, moderatorId: user.sub, decision, notes })

  const status =
    decision === 'approve' ? 'approved' :
    decision === 'reject'  ? 'rejected'  : 'pending'

  await Item.findByIdAndUpdate(itemId, { status })

  // SAFE EMIT
  getIO()?.emit('item:update', { itemId, status })

  return { ok: true }
})
