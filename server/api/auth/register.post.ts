import * as bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from '../../models/User'
import { connectDb } from '../../utils/db'
import { signToken } from '../../utils/auth'
import { eventHandler, createError, readBody } from 'h3'
const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6)
})

export default eventHandler(async (event) => {
  await connectDb()
  const body = await readBody(event)
  const data = bodySchema.parse(body)
  const exists = await User.findOne({ email: data.email })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Email exists' })
  const passwordHash = await bcrypt.hash(data.password, 10)
  const user = await User.create({ email: data.email, name: data.name, passwordHash, role: 'user' })
  const token = signToken({ sub: String(user._id), email: user.email, role: user.role as any })
  return { token, user: { id: user._id, email: user.email, role: user.role } }
})
