// Packages
import * as Client from "mysql2";
import QueryException from "../../../../exceptions/query";

export default async function queryResolver (client: Client.Connection, queryString: string, params: unknown[] = []): Promise<any> {
	let result;

	try {
		result = await new Promise((resolve, reject) => {
			client.query(queryString, params,
				(error, results) => {
					if (error) reject(error);

					resolve(results);
				});
		});
	}
	catch (e) {
		if (e.sqlMessage || e.sqlState) {
			throw new QueryException(e.sqlMessage, e.sqlState, queryString);
		}
	}

	return result;
}