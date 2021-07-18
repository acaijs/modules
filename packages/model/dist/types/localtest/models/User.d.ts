import { Model, Relation } from "../..";
import Comment from "./Comment";
export default class User extends Model {
    id: string;
    name: string;
    description?: string;
    comments: Relation<Comment, "hasMany">;
}
