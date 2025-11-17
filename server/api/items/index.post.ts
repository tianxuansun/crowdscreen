import Item from '../../models/Item'
import { connectDb } from '../../utils/db'
import { evaluateItemAndFlag } from '../../utils/rulesEngine'
import { getUserFromEvent } from '../../utils/auth'
import { eventHandler, createError, readBody } from 'h3'
import { getIO } from '../../utils/socket'

export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event) // { type, payload:{text|link|...} }
  const item = await Item.create({
    authorId: user.sub,
    type: body.type || 'text',
    payload: body.payload
  })

  const res = await evaluateItemAndFlag(String(item._id))

  // SAFE EMIT: only if io exists
  getIO()?.emit('queue:update', {
    itemId: item._id,
    status: item.status,
    score: res?.total || 0
  })

  return { item }
})
