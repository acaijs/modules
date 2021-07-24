// Packages
import * as http	from "http";

// Interfaces
import AdapterInterface from "../interfaces/adapter";

class HTTPAdapter implements AdapterInterface {
	protected config: any;
	protected conn: http.Server;
	protected requestCb: any;

	public async boot (config) {
		this.config = config;
		this.conn	= http.createServer();

		this.conn.on("request", async (req, res) => {
			if (this.requestCb) {
				const response = this.requestCb({req, res});
			}
		});

		await new Promise(r => void this.conn.on("listening", () => r(true)));

		return false;
	}

	public async onRequest (cb) {
		this.requestCb = cb;
	}

	public async onParse () {

	}
}

const httpAdapter = new HTTPAdapter();
export default httpAdapter;