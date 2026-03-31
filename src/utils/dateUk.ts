const UK_TIMEZONE = 'Europe/London';

export const ukTodayIso = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;

  if (!day || !month || !year) {
    return new Date().toISOString().split('T')[0]!;
  }

  return `${year}-${month}-${day}`;
};
