import { RequestInterface } from "@acai/interfaces";
export default function findController(controller: string | ((req: RequestInterface) => any), method: string | undefined, request: RequestInterface): Promise<any>;
