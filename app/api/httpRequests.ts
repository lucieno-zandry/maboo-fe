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

export function getAuthUser() {
    return appFetch.get<{ user: User }>('/auth/user/get');
}

export function getProducts() {
    return appFetch.get<{ products: Product[] }>('/product/all?limit=10&with=variants&images');
}

export function getProduct(slug: string) {
    return appFetch.get<{ product: Product }>(`/product/get/${slug}`);
}

export function sendEmailVerificationCode() {
    return appFetch.post<{ link_sent: boolean }>('/auth/email/send-validation-code', {});
}

export function attemptEmailVerification(code: FormDataEntryValue) {
    return appFetch.post<{ user: User }>('/auth/email/verify', { code });
}

export function addVariantToCart(payload: {
    variant_id: number,
    count: number,
}) {
    return appFetch.post<{ cart_item: CartItem }>(`/cart/create/${payload.variant_id}`, { count: payload.count });
}

export function getCartItems() {
    return appFetch.get<{ cart_items: CartItem[] }>('/cart/all');
}