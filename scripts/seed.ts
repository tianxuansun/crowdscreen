// scripts/seed.ts
import { connectDb } from '../server/utils/db'
import User from '../server/models/User'
import Rule from '../server/models/Rule'
import * as bcrypt from 'bcryptjs'
import 'dotenv/config'


async function run() {
  await connectDb()

  const pw = await bcrypt.hash('password123', 10)

  const admin = await User.findOneAndUpdate(
    { email: 'admin@demo.dev' },
    { email: 'admin@demo.dev', name: 'Admin', passwordHash: pw, role: 'admin' },
    { upsert: true, new: true }
  )

  const mod = await User.findOneAndUpdate(
    { email: 'mod@demo.dev' },
    { email: 'mod@demo.dev', name: 'Moderator', passwordHash: pw, role: 'moderator' },
    { upsert: true, new: true }
  )

  await Rule.deleteMany({})
  await Rule.insertMany([
    {
      name: 'Spam keywords',
      type: 'keyword',
      config: { keywords: ['spam', 'clickbait', 'free $$$'] },
      enabled: true,
      score: 2
    },
    {
      name: 'Profanity regex',
      type: 'regex',
      config: { pattern: '\\b(darn|heck)\\b' },
      enabled: true,
      score: 1
    },
    {
      name: 'Flag threshold',
      type: 'threshold',
      config: { minScore: 2 },
      enabled: true,
      score: 0
    }
  ])

  console.log('Seeded users:', admin.email, mod.email)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
