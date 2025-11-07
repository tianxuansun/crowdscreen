import mongoose, { Document, Model } from 'mongoose';

const { Schema, model, models } = mongoose;

interface IItem {
  authorId: any; // Adjusted to a generic type for debugging
  type: 'text' | 'image' | 'link';
  payload: any;
  status: 'pending' | 'approved' | 'rejected';
}

export interface IItemDocument extends IItem, Document {}

const ItemSchema = new Schema<IItemDocument>({
  authorId: { type: Schema.Types.Mixed, ref: 'User', index: true }, // Adjusted to a generic type for debugging
  type: { type: String, enum: ['text', 'image', 'link'], default: 'text' },
  payload: Schema.Types.Mixed,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
}, { timestamps: true });

const ItemModel: Model<IItemDocument> = models.Item || model<IItemDocument>('Item', ItemSchema);

export default ItemModel;
