import Item from '../../models/Item'
import Flag from '../../models/Flag'
import { connectDb } from '../../utils/db'
import { eventHandler, createError } from 'h3'
import mongoose from 'mongoose'
import { requireUser } from '../../utils/guards'

export default eventHandler(async (event) => {
  await connectDb()
  requireUser(event)
  const id = event.context.params?.id
  if (!id || !mongoose.isValidObjectId(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const item = await Item.findById(id).lean()
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const flags = await Flag.find({ itemId: id }).lean()
  return { item, flags }
})
