// Utils
import { getCurr } from "./run";

export default function cache (arg1: string | any, arg2?: any) {
	if (!getCurr()) throw new Error("Trying to use cache outside of a test context");

	getCurr().messages = [...(getCurr().messages || []), [ arg2 ? arg2:arg1, arg2 ? arg1:undefined ]];
}