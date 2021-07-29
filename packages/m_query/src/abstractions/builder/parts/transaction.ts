// Interfaces
import { ModelContent } from "../../../interfaces/ModelContent";

// Parts
import TableClass from "./table";

export default abstract class TransactionClass<T = Record<string, ModelContent>> extends TableClass<T> {
	public async transact (callback: (config: any) => Promise<void>) {
		await this.startTransaction();
		try {
			await callback({
				savePoint	: this.savepointTransaction,
				release		: this.releaseTransaction,
			});
		}
		catch (e) {
			await this.rollbackTransaction();
			throw e;
		}
		await this.commitTransaction();
	}

	public async startTransaction () {
		await this.getAdapter().startTransaction();
	}

	public async savepointTransaction (name: string) {
		await this.getAdapter().savepointTransaction(name);
	}

	public async releaseTransaction (name: string) {
		await this.getAdapter().releaseTransaction(name);
	}

	public async rollbackTransaction () {
		await this.getAdapter().rollbackTransaction();
	}

	public async commitTransaction () {
		await this.getAdapter().commitTransaction();
	}
}