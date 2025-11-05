import jwt from 'jsonwebtoken'
import type { Role } from './roles'

type JwtPayload = { sub: string; email: string; role: Role }

export function signToken(payload: JwtPayload) {
  const secret = useRuntimeConfig().jwtSecret
  return jwt.sign(payload, secret!, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  const secret = useRuntimeConfig().jwtSecret
  return jwt.verify(token, secret!) as JwtPayload
}

export function getUserFromEvent(event: any): JwtPayload | null {
  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  try { return verifyToken(token) } catch { return null }
}
