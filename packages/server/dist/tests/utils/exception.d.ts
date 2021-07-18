import CustomException from "../../modules/CustomException";
export default class Exception extends CustomException {
    status: number;
    shouldReport: boolean;
    constructor(message: string);
    render(): string;
}
