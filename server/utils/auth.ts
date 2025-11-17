// server/utils/auth.ts
import jwt from 'jsonwebtoken'
import { getHeader } from 'h3'
import type { Role } from './roles'

type JwtPayload = { sub: string; email: string; role: Role }

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // Be explicit so CI/dev knows what's wrong
    throw new Error('JWT_SECRET is not set')
  }
  return secret
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, getSecret()) as JwtPayload
}

export function getUserFromEvent(event: any): JwtPayload | null {
  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  try { return verifyToken(token) } catch { return null }
}
