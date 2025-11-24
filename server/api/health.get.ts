import { eventHandler } from 'h3'
import mongoose from 'mongoose'

export default eventHandler(() => {
  const dbState = mongoose.connection.readyState // 0=disconnected 1=connected 2=connecting 3=disconnecting
  return {
    ok: dbState === 1,
    db: dbState,
    time: new Date().toISOString(),
    version: process.env.GIT_SHA || 'dev'
  }
})
