import ServerInterface from "./server.interface";
import RequestInterface from "./request.interface";
import CustomExceptionInterface from "./exception.interface";
export default interface ProviderInterface {
    new (): ProviderInterface;
    boot?(server: ServerInterface): Promise<void>;
    onError?(data: {
        error: CustomExceptionInterface;
        request: RequestInterface;
        server: ServerInterface;
    }): Promise<unknown>;
}
