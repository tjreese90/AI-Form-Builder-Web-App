import { BaseSQLiteDatabase, SQLiteTableFn } from "drizzle-orm/sqlite-core";
import type { Adapter } from "@auth/core/adapters";
export declare function createTables(sqliteTable: SQLiteTableFn): {
    users: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "user";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "user";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            name: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "name";
                tableName: "user";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            email: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "email";
                tableName: "user";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            emailVerified: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "emailVerified";
                tableName: "user";
                dataType: "date";
                columnType: "SQLiteTimestamp";
                data: Date;
                driverParam: number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            image: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "image";
                tableName: "user";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
    accounts: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "account";
        schema: undefined;
        columns: {
            userId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "userId";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            type: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "type";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: "email" | "oidc" | "oauth";
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            provider: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "provider";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            providerAccountId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "providerAccountId";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            refresh_token: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "refresh_token";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            access_token: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "access_token";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            expires_at: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "expires_at";
                tableName: "account";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            token_type: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "token_type";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            scope: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "scope";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            id_token: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id_token";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            session_state: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "session_state";
                tableName: "account";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
    sessions: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "session";
        schema: undefined;
        columns: {
            sessionToken: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "sessionToken";
                tableName: "session";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            userId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "userId";
                tableName: "session";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            expires: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "expires";
                tableName: "session";
                dataType: "date";
                columnType: "SQLiteTimestamp";
                data: Date;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
    verificationTokens: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "verificationToken";
        schema: undefined;
        columns: {
            identifier: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "identifier";
                tableName: "verificationToken";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            token: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "token";
                tableName: "verificationToken";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            expires: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "expires";
                tableName: "verificationToken";
                dataType: "date";
                columnType: "SQLiteTimestamp";
                data: Date;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
};
export type DefaultSchema = ReturnType<typeof createTables>;
export declare function SQLiteDrizzleAdapter(client: InstanceType<typeof BaseSQLiteDatabase>, tableFn?: SQLiteTableFn<undefined>): Adapter;
//# sourceMappingURL=sqlite.d.ts.map