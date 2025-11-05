import Item from '~/models/Item'
import { connectDb } from '~/server/utils/db'
import { evaluateItemAndFlag } from '~/server/utils/rulesEngine'
import { getUserFromEvent } from '~/server/utils/auth'

function io() { // helper
  // @ts-ignore
  return useNitroApp()['io'] as import('socket.io').Server
}

export default eventHandler( async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event) // { type, payload:{text|link|...} }
  const item = await Item.create({ authorId: user.sub, type: body.type || 'text', payload: body.payload })
  const res = await evaluateItemAndFlag(String(item._id))
  io().emit('queue:update', { itemId: item._id, status: item.status, score: res?.total || 0 })
  return { item }
})
