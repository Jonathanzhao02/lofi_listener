function traverse<T>(obj: any, paths: string[]): T {
    let val = obj;

    for (let i = 0; i < paths.length - 1; i++) {
        if (paths[i].length == 0) continue;
        if (!val[paths[i]]) val[paths[i]] = {};
        val = val[paths[i]];
    }

    return val;
}

export function traverseGet<T>(obj: any, paths: string[]): T {
    const traversedObj = traverse<{ T }>(obj, paths);
    return traversedObj[paths[paths.length - 1]];
}

export function traverseSet<T>(obj: any, paths: string[], value: T) {
    const traversedObj = traverse<{ T }>(obj, paths);
    traversedObj[paths[paths.length - 1]] = value;
}

export function traverseDelete(obj: any, paths: string[]) {
    const traversedObj = traverse(obj, paths);
    delete traversedObj[paths[paths.length - 1]];
}
