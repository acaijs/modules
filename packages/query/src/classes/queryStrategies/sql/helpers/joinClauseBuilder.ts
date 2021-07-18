// Interfaces
import JoinClauseInterface 	from "../../../../interfaces/JoinClause";

const types = {
	"inner": "INNER",
	"left": "LEFT",
	"right": "RIGHT",
	"outer": "FULL OUTER"
};

export default function joinClauseBuilder (joinClause: JoinClauseInterface) {
	const type = types[joinClause.type];

	return `${type} JOIN ${joinClause.table} ON ${joinClause.firstColumn}${joinClause.operator}${joinClause.secondColumn}`;
} 