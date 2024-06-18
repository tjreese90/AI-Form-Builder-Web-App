import { renderToString } from "preact-render-to-string";
import ErrorPage from "./error.js";
import SigninPage from "./signin.js";
import SignoutPage from "./signout.js";
import css from "./styles.js";
import VerifyRequestPage from "./verify-request.js";
function send({ html, title, status, cookies, theme }) {
    return {
        cookies,
        status,
        headers: { "Content-Type": "text/html" },
        body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style><title>${title}</title></head><body class="__next-auth-theme-${theme?.colorScheme ?? "auto"}"><div class="page">${renderToString(html)}</div></body></html>`,
    };
}
/**
 * Unless the user defines their [own pages](https://authjs.dev/reference/core#pages),
 * we render a set of default ones, using Preact SSR.
 */
export default function renderPage(params) {
    const { url, theme, query, cookies, pages } = params;
    return {
        csrf(skip, options, cookies) {
            if (!skip) {
                return {
                    headers: { "Content-Type": "application/json" },
                    body: { csrfToken: options.csrfToken },
                    cookies,
                };
            }
            options.logger.warn("csrf-disabled");
            cookies.push({
                name: options.cookies.csrfToken.name,
                value: "",
                options: { ...options.cookies.csrfToken.options, maxAge: 0 },
            });
            return { status: 404, cookies };
        },
        providers(providers) {
            return {
                headers: { "Content-Type": "application/json" },
                body: providers.reduce((acc, { id, name, type, signinUrl, callbackUrl }) => {
                    acc[id] = { id, name, type, signinUrl, callbackUrl };
                    return acc;
                }, {}),
            };
        },
        signin(error) {
            if (pages?.signIn) {
                let signinUrl = `${pages.signIn}${pages.signIn.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: params.callbackUrl ?? "/" })}`;
                if (error)
                    signinUrl = `${signinUrl}&${new URLSearchParams({ error })}`;
                return { redirect: signinUrl, cookies };
            }
            return send({
                cookies,
                theme,
                html: SigninPage({
                    csrfToken: params.csrfToken,
                    // We only want to render providers
                    providers: params.providers?.filter((provider) => 
                    // Always render oauth and email type providers
                    ["email", "oauth", "oidc"].includes(provider.type) ||
                        // Only render credentials type provider if credentials are defined
                        (provider.type === "credentials" && provider.credentials) ||
                        // Don't render other provider types
                        false),
                    callbackUrl: params.callbackUrl,
                    theme: params.theme,
                    error,
                    ...query,
                }),
                title: "Sign In",
            });
        },
        signout() {
            if (pages?.signOut)
                return { redirect: pages.signOut, cookies };
            return send({
                cookies,
                theme,
                html: SignoutPage({ csrfToken: params.csrfToken, url, theme }),
                title: "Sign Out",
            });
        },
        verifyRequest(props) {
            if (pages?.verifyRequest)
                return { redirect: pages.verifyRequest, cookies };
            return send({
                cookies,
                theme,
                html: VerifyRequestPage({ url, theme, ...props }),
                title: "Verify Request",
            });
        },
        error(error) {
            if (pages?.error) {
                return {
                    redirect: `${pages.error}${pages.error.includes("?") ? "&" : "?"}error=${error}`,
                    cookies,
                };
            }
            return send({
                cookies,
                theme,
                // @ts-expect-error fix error type
                ...ErrorPage({ url, theme, error }),
                title: "Error",
            });
        },
    };
}
