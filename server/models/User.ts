import mongoose, { Document, Model } from 'mongoose'
const { Schema, model, models } = mongoose

interface IUser {
  email: string
  name?: string
  passwordHash?: string
  role: 'user' | 'moderator' | 'admin'
}

interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, unique: true, index: true },
  name: String,
  passwordHash: String,
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }
}, { timestamps: true })

const UserModel: Model<IUserDocument> = models.User || model<IUserDocument>('User', UserSchema)

export default UserModel
