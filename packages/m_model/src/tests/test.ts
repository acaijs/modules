import { Model, Table, Field } from "../"
import type { Relation } from "../"

@Table("user")
class User extends Model {
	@Field("uuid")
	public id: string;
}

@Table("comment")
class Comment extends Model {
	@Field("uuid")
	public id: string;

	@Field.belongsTo(() => User, "id_user")
	public user: Relation<User, "belongsTo", "id">;
}

const comment = new Comment()
const userId = comment.user.value()

console.log(userId)