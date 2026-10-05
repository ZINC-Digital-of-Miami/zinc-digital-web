/** Owner-facing inventory dates use CT calendar days, independent of the machine's timezone. */
export function googleInventoryRange(now = new Date()): {startDate: string; endDate: string} {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part = (name: string) => Number(parts.find(value => value.type === name)!.value);
  const year = part('year'), month = part('month'), day = part('day');
  const start = new Date(Date.UTC(year, month - 17, 1));
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  start.setUTCDate(Math.min(day, lastDay));
  return {startDate:start.toISOString().slice(0,10),endDate:year+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0')};
}
