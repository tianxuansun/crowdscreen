// server/utils/rulesEngine.ts
import Rule from '../models/Rule'
import Flag from '../models/Flag'
import Item from '../models/Item'

export async function evaluateItemAndFlag(itemId: string) {
  const item = await Item.findById(itemId)
  if (!item) return { total: 0 }

  const text = String(item.payload?.text || item.payload?.title || '')
  const rules = await Rule.find({ enabled: true })
  let total = 0
  await Flag.deleteMany({ itemId }) // re-eval idempotently

  for (const r of rules) {
    if (r.type === 'keyword') {
      const kws: string[] = r.config?.keywords || []
      const hits = kws.some(kw => text.toLowerCase().includes(kw.toLowerCase()))
      if (hits) { await Flag.create({ itemId, ruleId: r._id, reason: 'keyword', score: r.score }); total += r.score }
    } else if (r.type === 'regex' && r.config?.pattern) {
      const re = new RegExp(r.config.pattern, 'i')
      if (re.test(text)) { await Flag.create({ itemId, ruleId: r._id, reason: 'regex', score: r.score }); total += r.score }
    }
  }
  const min = (rules.find(r => r.type === 'threshold')?.config?.minScore) ?? 2
  await Item.findByIdAndUpdate(itemId, { status: total >= min ? 'pending' : 'approved' })
  return { total }
}
