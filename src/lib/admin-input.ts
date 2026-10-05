export const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const text = (value: unknown, limit: number, required = false) => {
  if (value != null && typeof value !== 'string') throw new Error('Invalid text field.');
  const result = (value as string || '').trim();
  if (result.length > limit || (required && !result)) throw new Error(required ? 'Complete the required fields within their length limits.' : 'A field exceeds its length limit.');
  return result;
};
export function inquiryInput(input: Record<string, unknown>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if ('stage' in input) {
    if (!['new', 'contacted', 'qualified', 'closed'].includes(String(input.stage))) throw new Error('Choose a valid stage.');
    patch.stage = input.stage;
  }
  if ('notes' in input) patch.notes = text(input.notes, 20000);
  if ('next_step' in input) patch.next_step = text(input.next_step, 2000);
  if ('archived' in input) {
    if (typeof input.archived !== 'boolean') throw new Error('Invalid archive action.');
    patch.archived_at = input.archived ? new Date().toISOString() : null;
  }
  if (!Object.keys(patch).length) throw new Error('Choose a change to save.');
  return patch;
}
export function contentInput(input: Record<string, unknown>, paths: string[]) {
  const kind = input.kind;
  if (kind !== 'page' && kind !== 'post') throw new Error('Choose a page or post.');
  const key = text(kind === 'page' ? input.path : input.slug, 200, true);
  if (kind === 'page' ? !paths.includes(key) : !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) throw new Error('Choose a valid page or post address.');
  const patch: Record<string, unknown> = {};
  const limits: Record<string, number> = { title: 200, meta_title: 200, meta_description: 500, focus_keyword: 200, excerpt: 2000, body: 200000, author: 100 };
  for (const [field, limit] of Object.entries(limits)) if (field in input && (kind === 'post' || !['excerpt', 'body', 'author'].includes(field))) patch[field] = text(input[field], limit, field === 'title');
  if ('status' in input) {
    if (!['draft', 'published'].includes(String(input.status))) throw new Error('Choose Draft or Published.');
    patch.status = input.status;
  }
  if ('noindex' in input) {
    if (typeof input.noindex !== 'boolean') throw new Error('Invalid indexing preference.');
    patch.noindex = input.noindex;
  }
  if (kind === 'post' && 'layer' in input) {
    if (!['Build', 'Demand', 'Intelligence'].includes(String(input.layer))) throw new Error('Choose a layer.');
    patch.layer = input.layer;
  }
  return { kind, key, patch };
}
