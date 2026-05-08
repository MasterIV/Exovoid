const fmt = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

export function relativeTime(ts: number, now: number = Date.now()): string {
    const sec = Math.round((ts - now) / 1000);
    const abs = Math.abs(sec);
    if (abs < 45) return 'just now';
    if (abs < 3600) return fmt.format(Math.round(sec / 60), 'minute');
    if (abs < 86400) return fmt.format(Math.round(sec / 3600), 'hour');
    return fmt.format(Math.round(sec / 86400), 'day');
}
