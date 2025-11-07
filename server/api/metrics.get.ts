import Item from '../models/Item'
import Decision from '../models/Decision'
import { connectDb } from '../utils/db'
export default eventHandler( async () => {
  await connectDb()
  const [pending, approved, rejected, decisions] = await Promise.all([
    Item.countDocuments({ status: 'pending' }),
    Item.countDocuments({ status: 'approved' }),
    Item.countDocuments({ status: 'rejected' }),
    Decision.countDocuments({})
  ])
  return { pending, approved, rejected, decisions }
})
