export default (n?: number, fractionDigits: number = 2) =>
    n === undefined ? "-" : `€${Number(n).toFixed(fractionDigits)}`;