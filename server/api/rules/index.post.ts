import Rule from '../../models/Rule'
import { connectDb } from '../../utils/db'
import { getUserFromEvent } from '../../utils/auth'
import { canModerate } from '../../utils/roles'
import { eventHandler, createError, readBody } from 'h3'
import { z } from 'zod'

const keywordSchema = z.object({
  name: z.string().min(1),
  type: z.literal('keyword'),
  config: z.object({ keywords: z.array(z.string().min(1)).min(1) }),
  enabled: z.boolean().default(true),
  score: z.number().int().min(0).max(10).default(1)
})

const regexSchema = z.object({
  name: z.string().min(1),
  type: z.literal('regex'),
  config: z.object({ pattern: z.string().min(1) }),
  enabled: z.boolean().default(true),
  score: z.number().int().min(0).max(10).default(1)
})

const thresholdSchema = z.object({
  name: z.string().min(1),
  type: z.literal('threshold'),
  config: z.object({ minScore: z.number().int().min(0).max(100) }),
  enabled: z.boolean().default(true),
  score: z.number().int().default(0)
})

const bodySchema = z.union([keywordSchema, regexSchema, thresholdSchema])

export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user || !canModerate(user.role)) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const raw = await readBody(event)
  // Normalize keywords when passed as comma-separated string
  if (raw?.type === 'keyword' && typeof raw?.config?.keywords === 'string') {
    raw.config.keywords = raw.config.keywords.split(',').map((s: string) => s.trim()).filter(Boolean)
  }
  const data = bodySchema.parse(raw)
  if (data.type === 'keyword') {
  // normalize + dedupe
    data.config.keywords = Array.from(
      new Set(data.config.keywords.map((s: string) => s.trim()).filter(Boolean))
    )
  }

  if (data.type === 'regex') {
  // ensure the regex compiles
    try {
    // eslint-disable-next-line no-new
      new RegExp(data.config.pattern, 'i')
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Invalid regex pattern' })
    }
  }
  if (data.type === 'threshold') {
    const existing = await Rule.countDocuments({ type: 'threshold' })
    if (existing > 0) {
      throw createError({ statusCode: 409, statusMessage: 'A threshold rule already exists' })
    }
  }

  const r = await Rule.create(data)
  return { rule: r }
})
