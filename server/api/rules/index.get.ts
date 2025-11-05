import Rule from '~/models/Rule'
import { connectDb } from '~/server/utils/db'
export default eventHandler(async () => { await connectDb(); return { rules: await Rule.find().lean() } })
