import { Model } from "../..";
import RelationDataInterface from "../interfaces/relationData";
export default function foreignHandler(this: Model, foreign: RelationDataInterface): {
    get: () => Promise<void | Model>;
    set: (value: string | number | Model) => void;
    value: () => void;
    create?: undefined;
    find?: undefined;
    query?: undefined;
    findOrCreate?: undefined;
    delete?: undefined;
} | {
    create: (fields?: Record<string, unknown>) => Promise<Model>;
    get: () => Promise<Model[]>;
    find: (id: string | number) => Promise<Model>;
    query: () => import("@acai/query").AbstractQuery<Model>;
    set?: undefined;
    value?: undefined;
    findOrCreate?: undefined;
    delete?: undefined;
} | {
    findOrCreate: (fields?: Record<string, unknown>) => Promise<Model>;
    get: () => Promise<Model>;
    delete: () => Promise<void>;
    query: () => import("@acai/query").AbstractQuery<Model>;
    set?: undefined;
    value?: undefined;
    create?: undefined;
    find?: undefined;
};
