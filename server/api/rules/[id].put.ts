import Rule from '../../models/Rule'
import { connectDb } from '../../utils/db'
import { requireModerator } from '../../utils/guards'
import { eventHandler, readBody, createError } from 'h3'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
  score: z.number().int().min(0).max(10).optional(),
  config: z.any().optional(),
  type: z.enum(['keyword', 'regex', 'threshold']).optional()
})

export default eventHandler(async (event) => {
  await connectDb()
  requireModerator(event)
  const id = event.context.params?.id
  const raw = await readBody(event)
  const data = updateSchema.parse(raw)

  if (data.type === 'threshold') {
    const others = await Rule.countDocuments({ type: 'threshold', _id: { $ne: id } })
    if (others > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Only one threshold rule allowed' })
    }
  }

  const r = await Rule.findByIdAndUpdate(id, data, { new: true })
  if (!r) throw createError({ statusCode: 404, statusMessage: 'Rule not found' })
  return { rule: r }
})
