interface StringToTypeMap {
	string	: string;
	boolean	: boolean;
	number	: number;
	float	: number;
	integer	: number;

	object				: Record<string, any>;
	"object:string"		: Record<string, string>;
	"object:number"		: Record<string, number>;
	"object:boolean"	: Record<string, boolean>;
	"object:array"		: Record<string, any[]>;
	"object:object"		: Record<string, Record<string, any>>;

	array			: any[];
	"array:string"	: string[];
	"array:boolean"	: boolean[];
	"array:number"	: number[];
	"array:object"	: Record<string, any>[];
}

type StringToType<T extends string> = StringToTypeMap[Extract<T, keyof StringToTypeMap>];

export default StringToType