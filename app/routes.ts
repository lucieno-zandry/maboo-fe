import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    route('/', 'routes/frontoffice/layout.tsx', [
        index('routes/frontoffice/home.tsx'),
        route('products', 'routes/frontoffice/products.tsx'),
        route('product/:slug', 'routes/frontoffice/product.tsx'),
        route('/settings', 'routes/common/settings.tsx'),
        route('/addresses', 'routes/frontoffice/addresses.tsx'),
        route('/checkout', 'routes/frontoffice/checkout.tsx'),
        route('/orders', 'routes/frontoffice/orders.tsx'),
        route('/order/:uuid', 'routes/frontoffice/order-details.tsx'),
    ]),
    route('/auth', 'routes/auth/layout.tsx', [
        index('routes/auth/index.tsx'),
        route('login', 'routes/auth/login.tsx'),
        route('register', 'routes/auth/register.tsx'),
        route('verify-email', 'routes/auth/email-verification.tsx'),
        route('password-forgotten', 'routes/auth/password-forgotten.tsx'),
        route('reset-password/:token', 'routes/auth/reset-password.tsx'),
    ]),
] satisfies RouteConfig;
