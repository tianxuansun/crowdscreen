import { Schema, model, models } from 'mongoose'
const UserSchema = new Schema({
  email: { type: String, unique: true, index: true },
  name: String,
  passwordHash: String,
  role: { type: String, enum: ['user','moderator','admin'], default: 'user' }
}, { timestamps: true })
export default models.User || model('User', UserSchema)
