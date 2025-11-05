import { Schema, model, models, Types } from 'mongoose'
const ItemSchema = new Schema({
  authorId: { type: Types.ObjectId, ref: 'User', index: true },
  type: { type: String, enum: ['text','image','link'], default: 'text' },
  payload: Schema.Types.Mixed,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true }
}, { timestamps: true })
export default models.Item || model('Item', ItemSchema)
