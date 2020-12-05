function traverse<T>(obj: any, paths: string[]): T ***REMOVED***
    let val = obj;

    for (let i = 0; i < paths.length - 1; i++) ***REMOVED***
        if (paths[i].length == 0) continue;
        if (!val[paths[i]]) val[paths[i]] = ***REMOVED******REMOVED***;
        val = val[paths[i]];
    ***REMOVED***

    return val;
***REMOVED***

export function traverseGet<T>(obj: any, paths: string[]): T ***REMOVED***
    const traversedObj = traverse<***REMOVED*** T ***REMOVED***>(obj, paths);
    return traversedObj[paths[paths.length - 1]];
***REMOVED***

export function traverseSet<T>(obj: any, paths: string[], value: T) ***REMOVED***
    const traversedObj = traverse<***REMOVED*** T ***REMOVED***>(obj, paths);
    traversedObj[paths[paths.length - 1]] = value;
***REMOVED***

export function traverseDelete(obj: any, paths: string[]) ***REMOVED***
    const traversedObj = traverse(obj, paths);
    delete traversedObj[paths[paths.length - 1]];
***REMOVED***
