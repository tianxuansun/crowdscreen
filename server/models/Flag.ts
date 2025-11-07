import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Define the interface for the Flag document
export interface IFlag extends Document {
  itemId: mongoose.Types.ObjectId;
  ruleId: mongoose.Types.ObjectId;
  reason?: string;
  score?: number;
}

// Define the Flag schema
const FlagSchema = new Schema<IFlag>({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', index: true, required: true },
  ruleId: { type: Schema.Types.ObjectId, ref: 'Rule', required: true },
  reason: { type: String },
  score: { type: Number },
}, { timestamps: true });

// Export the Flag model with proper typing
const FlagModel: Model<IFlag> = mongoose.models.Flag || mongoose.model<IFlag>('Flag', FlagSchema);
export default FlagModel;
