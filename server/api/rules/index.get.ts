import Rule from '../../models/Rule'
import { connectDb } from '../../utils/db'
import { eventHandler } from 'h3'

export default eventHandler(async () => { await connectDb(); return { rules: await Rule.find().lean() } })
