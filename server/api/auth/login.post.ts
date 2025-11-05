import bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from '~/models/User'
import { connectDb } from '~/server/utils/db'
import { signToken } from '~/server/utils/auth'
export default eventHandler(async (event) => {
  await connectDb()
  const { email, password } = await readBody(event)
  const user = await User.findOne({ email })
  if (!user) throw createError({ statusCode: 401 })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw createError({ statusCode: 401 })
  const token = signToken({ sub: String(user._id), email: user.email, role: user.role as any })
  return { token, user: { id: user._id, email: user.email, role: user.role } }
})
