import Rule from '../../models/Rule'
import { connectDb } from '../../utils/db'
import { requireModerator } from '../../utils/guards'
import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  await connectDb()
  requireModerator(event)
  const id = event.context.params?.id
  await Rule.findByIdAndDelete(id)
  return { ok: true }
})
