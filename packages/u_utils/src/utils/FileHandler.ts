// Packages
import * as fs 		from "fs";
import * as path 	from "path";

// Interfaces
import BodyParseConfig from "../interfaces/bodyParserConfig";

export default class FileHandler {
	// -------------------------------------------------
	// Helper methods
	// -------------------------------------------------

	private config?		: Partial<BodyParseConfig>;
	private data		: any;
	private filepath	: string;
	private isTmp		= true;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (rawFile: any, server?: Partial<BodyParseConfig>) {
		this.config 	= server;
		this.data 		= rawFile;
		this.filepath 	= rawFile.path;
	}

	/** Serialization of file into json */
	public toJson () {
		return this.data.toJSON();
	}

	/** This will remove the file from the temp directory and move it to a permanently location */
	public store (pathString: string, name?: string) {
		const [oldname] = this.filepath.split(/(\\|\/)/).reverse();
		const ext 		= oldname.match(/\.(?:.(?!\.))+$/);
		const newpath 	= path.join(process.cwd(), this.config?.uploadDir || "storage", pathString, name ? `${name}${ext}` : oldname);

		// check if path exists
		fs.mkdirSync(newpath.replace(/(\\|\/)(?:.(?!(\\|\/)))+$/, ""), { recursive: true });

		// transfer path
		fs.renameSync(this.filepath, newpath);

		// update reference
		this.filepath = newpath;
	}

	/** Simple copy of the file */
	public copy (newpath: string) {
		fs.copyFileSync(this.filepath, newpath);
	}

	/** Delete file wherever it is */
	public delete (onlyTmp = false) {
		if (!onlyTmp || (onlyTmp && this.isTmp))
			fs.unlinkSync(this.filepath);
	}
}