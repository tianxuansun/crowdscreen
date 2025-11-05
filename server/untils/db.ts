import mongoose from 'mongoose'
let isConnected = false

export async function connectDb(uri?: string) {
  if (isConnected) return
  const mongoUri = uri || useRuntimeConfig().mongodbUri
  if (!mongoUri) throw new Error('MONGODB_URI missing')

  await mongoose.connect(mongoUri)
  isConnected = true
  console.log('[db] connected', mongoUri)
}
