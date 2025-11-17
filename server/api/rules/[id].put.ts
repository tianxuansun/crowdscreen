import Rule from '../../models/Rule'
import { connectDb } from '../../utils/db'
import { requireModerator } from '../../utils/guards'
import { eventHandler, readBody, createError } from 'h3'

export default eventHandler(async (event) => {
  await connectDb()
  requireModerator(event)
  const id = event.context.params?.id
  const body = await readBody(event)
  const r = await Rule.findByIdAndUpdate(id, body, { new: true })
  if (!r) throw createError({ statusCode: 404, statusMessage: 'Rule not found' })
  return { rule: r }
})
