import * as Client from "mysql2";
export default function queryResolver(client: Client.Connection, queryString: string, params?: unknown[]): Promise<any>;
