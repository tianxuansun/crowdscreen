import Rule from '~/models/Rule'
import { connectDb } from '~/server/utils/db'
import { getUserFromEvent } from '~/server/utils/auth'
import { canModerate } from '~/server/utils/roles'
export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user || !canModerate(user.role)) throw createError({ statusCode: 403 })
  const body = await readBody(event)
  const r = await Rule.create(body)
  return { rule: r }
})
