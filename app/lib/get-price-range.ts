export function getUrlPriceRange(searchParams: URLSearchParams): [number, number] | null {
    if (searchParams.get('min_price') && searchParams.get('max_price')) return [
        parseInt(searchParams.get('min_price')!),
        parseInt(searchParams.get('max_price')!),
    ]

    return null;
}

export function getDefaultPriceRange(): [number, number] {
    return [
        0,
        1000
    ]
}

export function getDefaultRangeConfig() {
    const [min, max] = getDefaultPriceRange();

    return {
        min,
        max,
        step: 10
    }
}