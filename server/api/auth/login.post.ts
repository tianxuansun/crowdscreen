import * as bcrypt from 'bcryptjs'
import { z } from 'zod'
import { eventHandler, createError, readBody } from 'h3'
import User from '../../models/User'
import { connectDb } from '../../utils/db'
import { signToken } from '../../utils/auth'
export default eventHandler(async (event) => {
  await connectDb()
  const { email, password } = await readBody(event)
  const user = await User.findOne({ email })
  if (!user || !user.passwordHash) throw createError({ statusCode: 401 })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw createError({ statusCode: 401 })
  const token = signToken({ sub: String(user._id), email: user.email, role: user.role as any })
  return { token, user: { id: user._id, email: user.email, role: user.role } }
})
