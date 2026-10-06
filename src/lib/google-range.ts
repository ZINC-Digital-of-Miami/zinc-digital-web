/** Calendar days in the GA property timezone, independent of daylight-saving hour shifts. */
export function googleReportRange(now: number, timeZone: string) {
  const today = new Intl.DateTimeFormat('en-CA', {timeZone, year:'numeric', month:'2-digit', day:'2-digit'}).format(now);
  const day = new Date(today + 'T12:00:00Z');
  const offset = (days: number) => {
    const date = new Date(day);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  return {start:offset(-30), end:offset(-1)};
}
