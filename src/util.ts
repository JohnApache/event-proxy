export const uniqueArray = <T>(sourceArray: T[]): T[] => {
    const uniqueArray: T[] = [];
    sourceArray.forEach(v => {
        if(uniqueArray.indexOf(v) === -1) {
            uniqueArray.push(v);
        }
    })
    return uniqueArray;
}
