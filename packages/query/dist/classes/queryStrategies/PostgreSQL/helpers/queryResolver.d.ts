import * as Client from "pg";
export default function queryResolver(client: Client.Client, queryString: string, params?: unknown[]): Promise<any>;
