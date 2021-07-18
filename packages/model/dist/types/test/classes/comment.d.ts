import { Model } from "../../index";
import Relation from "../../src/interfaces/relation";
import User from "./user";
export default class Comment extends Model {
    id: string;
    text: string;
    linkId?: string;
    user: Relation<User, "belongsTo">;
}
