import Rule from '../../../models/Rule'
import { connectDb } from '../../../utils/db'
import { requireModerator } from '../../../utils/guards'
import { eventHandler, createError } from 'h3'

export default eventHandler(async (event) => {
  await connectDb()
  requireModerator(event)
  const id = event.context.params?.id
  const r = await Rule.findById(id)
  if (!r) throw createError({ statusCode: 404, statusMessage: 'Rule not found' })
  r.enabled = !r.enabled
  await r.save()
  return { rule: r }
})
