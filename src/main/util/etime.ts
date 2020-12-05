const MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
const MILLIS_LABELS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

export function etimeLabeled(etime: number): string ***REMOVED***
    let result = '';
    let nonZero = false;
    let millis = etime;

    for (let i = 0; i < MILLIS.length; i++) ***REMOVED***
        const time = Math.floor(millis / MILLIS[i]);
        if (nonZero) ***REMOVED***
            result += `, \`$***REMOVED***time***REMOVED***\` $***REMOVED***MILLIS_LABELS[i]***REMOVED***`;
            break;
        ***REMOVED*** else if (time > 0) ***REMOVED***
            result = `\`$***REMOVED***time***REMOVED***\` $***REMOVED***MILLIS_LABELS[i]***REMOVED***`;
            nonZero = true;
        ***REMOVED***

        millis %= MILLIS[i];
    ***REMOVED***

    return result || '0 seconds';
***REMOVED***