// Strategies
import SQL from ".."

// Utils
import adapterTests from "../../../../utils/tests"

adapterTests("SQL", SQL, {
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: "acai_query",
})