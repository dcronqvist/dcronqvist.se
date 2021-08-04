// Contains utility functions that are used anywhere on the site.

export function removeDuplicates<Type>(arr: Type[] ): Type[] {
    const seen = new Set()
    return arr.filter(x => {
        if (seen.has(x)) {
            return false
        }
        seen.add(x)
        return true
    })
}