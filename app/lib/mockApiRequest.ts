export default function mockApi<T>(
    payload: T,
    status = 200,
    shouldFail = false,
    delay = 1000,
): Promise<{ data?: T, error?: { message: string, errors?: T }, status: number }> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                resolve({ error: { message: "Mock API error", errors: payload }, status });
            } else {
                resolve({ data: payload, status });
            }
        }, delay);
    });
}
