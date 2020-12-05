const MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
const MILLIS_LABELS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

export function etimeLabeled(etime: number): string {
    let result = '';
    let nonZero = false;
    let millis = etime;

    for (let i = 0; i < MILLIS.length; i++) {
        const time = Math.floor(millis / MILLIS[i]);
        if (nonZero) {
            result += `, \`${time}\` ${MILLIS_LABELS[i]}`;
            break;
        } else if (time > 0) {
            result = `\`${time}\` ${MILLIS_LABELS[i]}`;
            nonZero = true;
        }

        millis %= MILLIS[i];
    }

    return result || '0 seconds';
}
