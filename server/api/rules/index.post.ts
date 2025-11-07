import Rule from '../../models/Rule'
import { connectDb } from '../../utils/db'
import { getUserFromEvent } from '../../utils/auth'
import { canModerate } from '../../utils/roles'
import { eventHandler, createError, getQuery, readBody} from 'h3'
export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user || !canModerate(user.role)) throw createError({ statusCode: 403 })
  const body = await readBody(event)
  const r = await Rule.create(body)
  return { rule: r }
})
