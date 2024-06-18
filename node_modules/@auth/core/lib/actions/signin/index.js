import { getAuthorizationUrl } from "./authorization-url.js";
import { sendToken } from "./send-token.js";
export async function signIn(request, cookies, options) {
    const signInUrl = `${options.url}/signin`;
    if (!options.provider)
        return { redirect: signInUrl, cookies };
    switch (options.provider.type) {
        case "oauth":
        case "oidc": {
            const { redirect, cookies: authCookies } = await getAuthorizationUrl(request.query, options);
            if (authCookies)
                cookies.push(...authCookies);
            return { redirect, cookies };
        }
        case "email": {
            return await sendToken(request, options);
        }
        default:
            return { redirect: signInUrl, cookies };
    }
}
