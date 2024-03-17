const RETRY_DELAY_MS = 500;

export async function fetchRetry(...args: any) {
    while (true) {
        try {
            return await fetch(...args as [RequestInfo, RequestInit]);
        } catch (error) {
            await sleep(RETRY_DELAY_MS)
        }
    }
}


function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}