import { MySqlTableFn, MySqlDatabase } from "drizzle-orm/mysql-core";
import type { Adapter } from "@auth/core/adapters";
export declare function createTables(mySqlTable: MySqlTableFn): {
    users: import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: "user";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "id";
                tableName: "user";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            name: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "name";
                tableName: "user";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            email: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "email";
                tableName: "user";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            emailVerified: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "emailVerified";
                tableName: "user";
                dataType: "date";
                columnType: "MySqlTimestamp";
                data: Date;
                driverParam: string | number;
                notNull: false;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            image: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "image";
                tableName: "user";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
        };
        dialect: "mysql";
    }>;
    accounts: import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: "account";
        schema: undefined;
        columns: {
            userId: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "userId";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            type: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "type";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: "email" | "oidc" | "oauth";
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            provider: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "provider";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            providerAccountId: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "providerAccountId";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            refresh_token: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "refresh_token";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            access_token: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "access_token";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            expires_at: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "expires_at";
                tableName: "account";
                dataType: "number";
                columnType: "MySqlInt";
                data: number;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            token_type: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "token_type";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            scope: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "scope";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            id_token: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "id_token";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            session_state: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "session_state";
                tableName: "account";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
        };
        dialect: "mysql";
    }>;
    sessions: import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: "session";
        schema: undefined;
        columns: {
            sessionToken: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "sessionToken";
                tableName: "session";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            userId: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "userId";
                tableName: "session";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            expires: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "expires";
                tableName: "session";
                dataType: "date";
                columnType: "MySqlTimestamp";
                data: Date;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
        };
        dialect: "mysql";
    }>;
    verificationTokens: import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: "verificationToken";
        schema: undefined;
        columns: {
            identifier: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "identifier";
                tableName: "verificationToken";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            token: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "token";
                tableName: "verificationToken";
                dataType: "string";
                columnType: "MySqlVarChar";
                data: string;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            expires: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: "expires";
                tableName: "verificationToken";
                dataType: "date";
                columnType: "MySqlTimestamp";
                data: Date;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
        };
        dialect: "mysql";
    }>;
};
export type DefaultSchema = ReturnType<typeof createTables>;
export declare function mySqlDrizzleAdapter(client: InstanceType<typeof MySqlDatabase>, tableFn?: MySqlTableFn<undefined>): Adapter;
//# sourceMappingURL=mysql.d.ts.map