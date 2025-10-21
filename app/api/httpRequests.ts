import mockApiRequest from "~/lib/mockApiRequest";
import appFetch from "./appFetch";

export function getEmailInfo(email: string) {
    return appFetch.post<{ is_taken: boolean }>('/auth/email/info', { email });
}

export function logUserIn(data: { email: string, password: string }) {
    return appFetch.post<{
        auth: User,
        token: string,
    }>('/auth/login', data);
}

export function registerUser(data: {
    email: string,
    password: string,
    password_confirmation: string,
    name: string
}) {
    return appFetch.post<{
        auth: User,
        token: string,
    }>('/auth/register', data)
}