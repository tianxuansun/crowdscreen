import { connectDb } from '~/server/utils/db'
import { getUserFromEvent } from '~/server/utils/auth'
import { canModerate } from '~/server/utils/roles'
import Decision from '~/models/Decision'
import Item from '~/models/Item'

function io(){ // @ts-ignore
  return useNitroApp()['io'] as import('socket.io').Server
}

export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user || !canModerate(user.role)) throw createError({ statusCode: 403 })

  const { itemId, decision, notes } = await readBody(event)
  await Decision.create({ itemId, moderatorId: user.sub, decision, notes })
  const status = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'pending'
  await Item.findByIdAndUpdate(itemId, { status })
  io().emit('item:update', { itemId, status })
  return { ok: true }
})
