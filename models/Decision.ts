import { Schema, model, models, Types } from 'mongoose'
const DecisionSchema = new Schema({
  itemId: { type: Types.ObjectId, ref: 'Item', index: true },
  moderatorId: { type: Types.ObjectId, ref: 'User' },
  decision: { type: String, enum: ['approve','reject','escalate'] },
  notes: String
}, { timestamps: true })
export default models.Decision || model('Decision', DecisionSchema)
