// server/api/dev/loginAs.post.ts
import { eventHandler, createError, getQuery } from 'h3'
import { signToken } from '../../utils/auth'
import type { Role } from '../../utils/roles'

export default eventHandler((event) => {
  // Only allow when explicitly enabled
  if (process.env.AUTH_DEV_BYPASS !== 'true') {
    throw createError({ statusCode: 403, statusMessage: 'Dev login disabled' })
  }

  const query = getQuery(event)
  const role = (query.role as Role) || 'moderator'
  const email = (query.email as string) || 'mod@demo.dev'

  // For tests/dev we don't care about real user ID
  const token = signToken({
    sub: 'dev-user-id',
    email,
    role
  })

  // Return token in response (your tests/clients can store it)
  return { token }
})
