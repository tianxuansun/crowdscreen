import Item from '../../models/Item'
import { connectDb } from '../../utils/db'
import { evaluateItemAndFlag } from '../../utils/rulesEngine'
import { getUserFromEvent } from '../../utils/auth'
import { eventHandler, createError, readBody } from 'h3'
import { getIO } from '../../utils/socket'
import { z } from 'zod'

const payloadSchema = z.object({
  text: z.string().min(1, 'text required').max(10_000).optional(),
  link: z.string().url('invalid url').max(2048).optional(),
  category: z.string().min(1).max(120).optional(),
  tags: z.array(z.string().min(1).max(64)).max(50).optional()
})

const bodySchema = z.object({
  type: z.enum(['text', 'link']).default('text'),
  payload: payloadSchema
}).superRefine((val, ctx) => {
  // Require text when type=text; require link when type=link
  if (val.type === 'text' && !val.payload.text) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['payload', 'text'],
      message: 'text required for type="text"'
    })
  }
  if (val.type === 'link' && !val.payload.link) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['payload', 'link'],
      message: 'link required for type="link"'
    })
  }
})

export default eventHandler(async (event) => {
  await connectDb()
  const user = getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const raw = await readBody(event)
  const { type, payload } = bodySchema.parse(raw)

  const item = await Item.create({
    authorId: user.sub,
    type,
    payload
  })

  const res = await evaluateItemAndFlag(String(item._id))

  getIO()?.emit('queue:update', {
    itemId: item._id,
    status: item.status,
    score: res?.total || 0
  })

  return { item }
})
