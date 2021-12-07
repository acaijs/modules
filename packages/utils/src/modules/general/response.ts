// Interfaces
import ResponseUtilityOptions from "../../interfaces/responseUtility"

/**
 * ### Response utility
 *
 * This is a general utility response that helps bundle your data in an easy format for the server to build a response
 *
 * @param {ResponseUtilityOptions?} options
 */
function response (options?: Partial<ResponseUtilityOptions>) {
	const preparedoptions = options || {}

	function responseUtility () {
		return preparedoptions
	}

	// Hard bind response utility name so it's not lost during production build
	(responseUtility as unknown as {utility: string}).utility = "response"

	responseUtility.headers	= (append: Record<string, string>)	=> {preparedoptions.headers	= append; 	return responseUtility}
	responseUtility.view 	= (name: string) 					=> {preparedoptions.view 	= name; 	return responseUtility}
	responseUtility.status 	= (status: number) 					=> {preparedoptions.status 	= status; 	return responseUtility}
	responseUtility.body 	= (body: unknown) 					=> {preparedoptions.body 	= body; 	return responseUtility}
	responseUtility.json 	= (body: unknown) 					=> {preparedoptions.body 	= body; 	return responseUtility}
	responseUtility.data 	= (body: unknown) 					=> {preparedoptions.body 	= body; 	return responseUtility}

	return responseUtility
}

export default response