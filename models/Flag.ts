import { Schema, model, models, Types } from 'mongoose'
const FlagSchema = new Schema({
  itemId: { type: Types.ObjectId, ref: 'Item', index: true },
  ruleId: { type: Types.ObjectId, ref: 'Rule' },
  reason: String,
  score: Number
}, { timestamps: true })
export default models.Flag || model('Flag', FlagSchema)
