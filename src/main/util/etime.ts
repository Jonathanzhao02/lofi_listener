const MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
const MILLIS_LABELS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

export function etimeLabeled(etime: number, numLabels = 2): string {
    let result = '';
    let nonZero = false;
    let millis = etime;
    let labelsCount = 0;

    for (let i = 0; i < MILLIS.length; i++) {
        const time = Math.floor(millis / MILLIS[i]);
        if (nonZero && labelsCount < numLabels) {
            result += `, \`${time}\` ${MILLIS_LABELS[i]}`;
            labelsCount++;
            if (labelsCount >= numLabels) break;
        } else if (time > 0) {
            result = `\`${time}\` ${MILLIS_LABELS[i]}`;
            nonZero = true;
            labelsCount++;
        }

        millis %= MILLIS[i];
    }

    return result || '0 seconds';
}
