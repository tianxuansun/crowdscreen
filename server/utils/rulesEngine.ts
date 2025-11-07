import Rule from '../models/Rule';
import type { IRuleDocument } from '../models/Rule';
import Item from '../models/Item';
import type { IItemDocument } from '../models/Item';
import Flag from '../models/Flag';

export async function evaluateItemAndFlag(itemId: string) {
  const item = await Item.findById(itemId) as IItemDocument | null;
  if (!item) return;
  const rules = await Rule.find({ enabled: true }) as IRuleDocument[];
  const text = String(item.payload?.text || item.payload?.title || '');

  let total = 0;
  for (const r of rules) {
    if (r.type === 'keyword') {
      const hits = (r.config?.keywords || []).some((kw: string) =>
        text.toLowerCase().includes(kw.toLowerCase()));
      if (hits) {
        await Flag.create({ itemId, ruleId: r._id, reason: 'keyword', score: r.score });
        total += r.score;
      }
    } else if (r.type === 'regex') {
      const re = new RegExp(r.config?.pattern || '', 'i');
      if (re.test(text)) {
        await Flag.create({ itemId, ruleId: r._id, reason: 'regex', score: r.score });
        total += r.score;
      }
    }
  }
  // threshold decision (simple)
  const min = (rules.find((r: IRuleDocument) => r.type === 'threshold')?.config?.minScore) ?? 2;
  await Item.findByIdAndUpdate(itemId, { status: total >= min ? 'pending' : 'approved' });
  return { total };
}
