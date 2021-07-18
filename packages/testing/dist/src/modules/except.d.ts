import { ExpectAssertionInterface } from "../interfaces/expect";
export default function except(title: string, callback: (expect: ExpectAssertionInterface) => Promise<void> | void): {
    tag: (tag: string | string[]) => any;
    timeout: (time: number) => any;
};
