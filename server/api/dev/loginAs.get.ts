import { eventHandler, createError, getQuery } from 'h3'
import { signToken } from '../../utils/auth'
import type { Role } from '../../utils/roles'

export default eventHandler((event) => {
  // Allow in CI, non-production, or when explicitly enabled
  const allow = process.env.AUTH_DEV_BYPASS === 'true' || process.env.CI === 'true' || process.env.NODE_ENV !== 'production'
  if (!allow) {
    throw createError({ statusCode: 403, statusMessage: 'Dev login disabled' })
  }

  const query = getQuery(event)
  const role = (query.role as Role) || 'moderator'
  const email = (query.email as string) || 'mod@demo.dev'

  const token = signToken({
    sub: 'dev-user-id',
    email,
    role
  })

  return { token }
})
