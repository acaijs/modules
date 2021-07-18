import { Model, Relation } from "../..";
import User from "./User";
export default class Comment extends Model {
    id: string;
    text: string;
    user: Relation<User, "belongsTo">;
}
