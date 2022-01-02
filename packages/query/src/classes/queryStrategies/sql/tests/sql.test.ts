// Strategies
import SQL from ".."

// Utils
import adapterTests from "../../../../utils/tests"

adapterTests("SQL", SQL, {
	user		: "acai_user",
	password	: "acai_password",
	database	: "acai_query",
})