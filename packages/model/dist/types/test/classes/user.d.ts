import { Model } from "../../index";
import Relation from "../../src/interfaces/relation";
import Comment from "./comment";
export default class User extends Model {
    id: string;
    name: string;
    age: number;
    comments: Relation<Comment, "hasMany">;
}
