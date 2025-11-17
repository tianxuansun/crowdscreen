// server/utils/guards.ts
import { createError, type H3Event } from 'h3'
import { getUserFromEvent } from './auth'
import { canModerate, type Role } from './roles'

export function requireUser(event: H3Event) {
  const user = getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return user
}

export function requireModerator(event: H3Event) {
  const user = requireUser(event)
  if (!canModerate(user.role as Role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}
