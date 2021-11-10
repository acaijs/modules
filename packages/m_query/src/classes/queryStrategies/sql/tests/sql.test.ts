// Strategies
import SQL from ".."

// Utils
import adapterTests from "../../../../utils/tests"

adapterTests("SQL", SQL, {
	user		: "root",
	password	: "",
	database	: "acai_query",
})