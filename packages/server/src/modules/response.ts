// Interfaces
import ResponseUtilityOptions from "../interfaces/responseUtility";

/**
 * ### Response utility
 * 
 * This is a general utility response that helps bundle your data in an easy format for the server to build a response
 * 
 * @param {ResponseUtilityOptions?} options 
 */
export default function response (options?: Partial<ResponseUtilityOptions>) {
	const preparedoptions = options || {};

	function responseUtility () {
		return preparedoptions;
	}

	responseUtility.headers	= (append: Record<string, string>)	=> {preparedoptions.headers	= append; 	return responseUtility};
	responseUtility.view 	= (name: string) 					=> {preparedoptions.view 	= name; 	return responseUtility};
	responseUtility.status 	= (status: number) 					=> {preparedoptions.status 	= status; 	return responseUtility};
	responseUtility.data 	= (data: unknown) 					=> {preparedoptions.data 	= data; 	return responseUtility};
	responseUtility.json 	= (json: Record<string, unknown>) 	=> {preparedoptions.json 	= json;		return responseUtility};

	return responseUtility;
}