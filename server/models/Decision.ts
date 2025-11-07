import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for the Decision document
export interface IDecision extends Document {
  itemId: mongoose.Types.ObjectId;
  moderatorId: mongoose.Types.ObjectId;
  decision: 'approve' | 'reject' | 'escalate';
  notes?: string;
}

// Define the Decision schema
const DecisionSchema = new Schema<IDecision>({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', index: true, required: true },
  moderatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  decision: { type: String, enum: ['approve', 'reject', 'escalate'], required: true },
  notes: { type: String },
}, { timestamps: true });

// Export the Decision model with proper typing
const DecisionModel: Model<IDecision> = mongoose.models.Decision || mongoose.model<IDecision>('Decision', DecisionSchema);
export default DecisionModel;
