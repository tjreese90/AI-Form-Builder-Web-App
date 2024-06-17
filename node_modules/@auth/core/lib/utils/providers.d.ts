import type { Provider } from "../../providers/index.js";
import type { InternalProvider } from "../../types.js";
import type { AuthConfig } from "../../index.js";
/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
export default function parseProviders(params: {
    providers: Provider[];
    url: URL;
    providerId?: string;
    options: AuthConfig;
}): {
    providers: InternalProvider[];
    provider?: InternalProvider;
};
//# sourceMappingURL=providers.d.ts.map