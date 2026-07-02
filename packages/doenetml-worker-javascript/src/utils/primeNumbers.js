export function createPrimesList({ from = 2, to = 100, exclude = [] }) {
    // Use Sieve of Eratosthenes to generate list of all prime numbers in the range [from, to]
    // and exclude values from exclude

    from = Math.max(from, 2);

    if (!(Number.isFinite(from) && Number.isFinite(to) && to >= from)) {
        return [];
    }

    let valueList = [...Array(to + 1).keys()];

    let sqrtMax = Math.sqrt(to);

    for (let i = 2; i <= sqrtMax; i++) {
        if (valueList[i]) {
            for (let j = i * i; j <= to; j += i) {
                valueList[j] = 0;
            }
        }
    }

    let primes = valueList.slice(from).filter((x) => x && !exclude.includes(x));

    return primes;
}
