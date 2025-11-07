import mongoose, { Document, Model } from 'mongoose';

const { Schema, model, models, Types } = mongoose;

interface IRule {
  name?: string;
  type: 'regex' | 'keyword' | 'threshold';
  config: any; // { pattern, keywords[], minScore }
  enabled: boolean;
  score: number;
}

export interface IRuleDocument extends IRule, Document {}

const RuleSchema = new Schema<IRuleDocument>({
  name: String,
  type: { type: String, enum: ['regex', 'keyword', 'threshold'] },
  config: Schema.Types.Mixed,
  enabled: { type: Boolean, default: true },
  score: { type: Number, default: 1 },
}, { timestamps: true });

const RuleModel: Model<IRuleDocument> = models.Rule || model<IRuleDocument>('Rule', RuleSchema);

export default RuleModel;
