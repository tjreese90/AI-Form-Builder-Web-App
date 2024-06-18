/**
 *
 * :::warning Experimental
 * `@auth/core` is under active development.
 * :::
 *
 * This is the main entry point to the Auth.js library.
 *
 * Based on the {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Request}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} Web standard APIs.
 * Primarily used to implement [framework](https://authjs.dev/concepts/frameworks)-specific packages,
 * but it can also be used directly.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {...})
 *
 * console.log(response instanceof Response) // true
 * ```
 *
 * ## Resources
 *
 * - [Getting started](https://authjs.dev/getting-started/introduction)
 * - [Most common use case guides](https://authjs.dev/guides)
 *
 * @module @auth/core
 */
import { assertConfig } from "./lib/utils/assert.js";
import { AuthError, ErrorPageLoop } from "./errors.js";
import { AuthInternal, raw, skipCSRFCheck } from "./lib/index.js";
import renderPage from "./lib/pages/index.js";
import { logger, setLogger } from "./lib/utils/logger.js";
import { toInternalRequest, toResponse } from "./lib/utils/web.js";
export { skipCSRFCheck, raw };
/**
 * Core functionality provided by Auth.js.
 *
 * Receives a standard {@link Request} and returns a {@link Response}.
 *
 * @example
 * ```ts
 * import Auth from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, {
 *   providers: [...],
 *   secret: "...",
 *   trustHost: true,
 * })
 *```
 * @see [Documentation](https://authjs.dev)
 */
export async function Auth(request, config) {
    setLogger(config.logger, config.debug);
    const internalRequest = await toInternalRequest(request);
    if (internalRequest instanceof Error) {
        logger.error(internalRequest);
        return Response.json(`Error: This action with HTTP ${request.method} is not supported.`, { status: 400 });
    }
    const assertionResult = assertConfig(internalRequest, config);
    if (Array.isArray(assertionResult)) {
        assertionResult.forEach(logger.warn);
    }
    else if (assertionResult instanceof Error) {
        // Bail out early if there's an error in the user config
        logger.error(assertionResult);
        const htmlPages = ["signin", "signout", "error", "verify-request"];
        if (!htmlPages.includes(internalRequest.action) ||
            internalRequest.method !== "GET") {
            return new Response(JSON.stringify({
                message: "There was a problem with the server configuration. Check the server logs for more information.",
                code: assertionResult.name,
            }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        const { pages, theme } = config;
        const authOnErrorPage = pages?.error &&
            internalRequest.url.searchParams
                .get("callbackUrl")
                ?.startsWith(pages.error);
        if (!pages?.error || authOnErrorPage) {
            if (authOnErrorPage) {
                logger.error(new ErrorPageLoop(`The error page ${pages?.error} should not require authentication`));
            }
            const render = renderPage({ theme });
            const page = render.error("Configuration");
            return toResponse(page);
        }
        return Response.redirect(`${pages.error}?error=Configuration`);
    }
    const isRedirect = request.headers?.has("X-Auth-Return-Redirect");
    const isRaw = config.raw === raw;
    let response;
    try {
        const rawResponse = await AuthInternal(internalRequest, config);
        if (isRaw)
            return rawResponse;
        response = await toResponse(rawResponse);
    }
    catch (e) {
        const error = e;
        logger.error(error);
        const isAuthError = error instanceof AuthError;
        if (isAuthError && isRaw && !isRedirect)
            throw error;
        // If the CSRF check failed for POST/session, return a 400 status code.
        // We should not redirect to a page as this is an API route
        if (request.method === "POST" && internalRequest.action === "session")
            return Response.json(null, { status: 400 });
        const type = isAuthError ? error.type : "Configuration";
        const page = (isAuthError && error.kind) || "error";
        const params = new URLSearchParams({ error: type });
        const path = config.pages?.[page] ??
            `${internalRequest.url.pathname}/${page.toLowerCase()}`;
        const url = `${internalRequest.url.origin}${path}?${params}`;
        if (isRedirect)
            return Response.json({ url });
        return Response.redirect(url);
    }
    const redirect = response.headers.get("Location");
    if (!isRedirect || !redirect)
        return response;
    return Response.json({ url: redirect }, { headers: response.headers });
}
