import { Schema, model, models } from 'mongoose'
const RuleSchema = new Schema({
  name: String,
  type: { type: String, enum: ['regex','keyword','threshold'] },
  config: Schema.Types.Mixed, // { pattern, keywords[], minScore }
  enabled: { type: Boolean, default: true },
  score: { type: Number, default: 1 }
}, { timestamps: true })
export default models.Rule || model('Rule', RuleSchema)
