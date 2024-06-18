import { PgTableFn, PgDatabase } from "drizzle-orm/pg-core";
import type { Adapter } from "@auth/core/adapters";
export declare function createTables(pgTable: PgTableFn): {
    users: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "user";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/pg-core").PgColumn<{
                name: "id";
                tableName: "user";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            name: import("drizzle-orm/pg-core").PgColumn<{
                name: "name";
                tableName: "user";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            email: import("drizzle-orm/pg-core").PgColumn<{
                name: "email";
                tableName: "user";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            emailVerified: import("drizzle-orm/pg-core").PgColumn<{
                name: "emailVerified";
                tableName: "user";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            image: import("drizzle-orm/pg-core").PgColumn<{
                name: "image";
                tableName: "user";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    accounts: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "account";
        schema: undefined;
        columns: {
            userId: import("drizzle-orm/pg-core").PgColumn<{
                name: "userId";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            type: import("drizzle-orm/pg-core").PgColumn<{
                name: "type";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: "email" | "oidc" | "oauth";
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            provider: import("drizzle-orm/pg-core").PgColumn<{
                name: "provider";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            providerAccountId: import("drizzle-orm/pg-core").PgColumn<{
                name: "providerAccountId";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            refresh_token: import("drizzle-orm/pg-core").PgColumn<{
                name: "refresh_token";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            access_token: import("drizzle-orm/pg-core").PgColumn<{
                name: "access_token";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            expires_at: import("drizzle-orm/pg-core").PgColumn<{
                name: "expires_at";
                tableName: "account";
                dataType: "number";
                columnType: "PgInteger";
                data: number;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            token_type: import("drizzle-orm/pg-core").PgColumn<{
                name: "token_type";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            scope: import("drizzle-orm/pg-core").PgColumn<{
                name: "scope";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            id_token: import("drizzle-orm/pg-core").PgColumn<{
                name: "id_token";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            session_state: import("drizzle-orm/pg-core").PgColumn<{
                name: "session_state";
                tableName: "account";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    sessions: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "session";
        schema: undefined;
        columns: {
            sessionToken: import("drizzle-orm/pg-core").PgColumn<{
                name: "sessionToken";
                tableName: "session";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            userId: import("drizzle-orm/pg-core").PgColumn<{
                name: "userId";
                tableName: "session";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            expires: import("drizzle-orm/pg-core").PgColumn<{
                name: "expires";
                tableName: "session";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    verificationTokens: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "verificationToken";
        schema: undefined;
        columns: {
            identifier: import("drizzle-orm/pg-core").PgColumn<{
                name: "identifier";
                tableName: "verificationToken";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            token: import("drizzle-orm/pg-core").PgColumn<{
                name: "token";
                tableName: "verificationToken";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            expires: import("drizzle-orm/pg-core").PgColumn<{
                name: "expires";
                tableName: "verificationToken";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
};
export type DefaultSchema = ReturnType<typeof createTables>;
export declare function pgDrizzleAdapter(client: InstanceType<typeof PgDatabase>, tableFn?: PgTableFn<undefined>): Adapter;
//# sourceMappingURL=pg.d.ts.map