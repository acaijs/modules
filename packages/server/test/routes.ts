// Packages
import { route } 	from "@acai/router";

// -------------------------------------------------
// Organization routes
// -------------------------------------------------

route.options({ middleware: ["auth"] }, () => {
	route.group("/organizations", () => {
		// indexes
		route.get("/", "organization.controller@index");
		route.get("/all", "organization.controller@indexAll");
		route.get("/member", "organization.controller@indexByMember");
		route.get("/owner", "organization.controller@indexByOwner");
		
		
		route.get("/{id_organization}", 	"organization.controller@show");
		route.post("/", "organization.controller@store");

		// TODO Remove it when the bug of middlewares be fixed.
		// https://gitlab.com/acaijs/modules/server/-/issues/2
		route.options({ middleware: ["organization", "member"] }, () => {
			route.group("/{id_organization}", () => {
				route.put("/", 		"organization.controller@update");
				route.patch("/", 	"organization.controller@update");
				route.delete("/",	"organization.controller@destroy");
	
				// -------------------------------------------------
				// Roles routes
				// -------------------------------------------------

				route.group("/roles", () => {
					route.get("/", 			"role.organization.controller@index");
					route.get("/{id_role}", 	"role.organization.controller@show");
	
					route.options({ middleware: ["member"] }, () => {
						route.group("/{id_role}", () => {
							route.post("/", "role.organization.controller@store");
		
							route.options({}, () => {
								route.put("/",		"role.organization.controller@update");
								route.patch("/",	() => "patch");
								route.delete("/",	"role.organization.controller@destroy");
							});
						});
					});
				});
	
				// -------------------------------------------------
				// Member routes
				// -------------------------------------------------
	
				route.group("/members", () => {
					route.get("/", 				"member.organization.controller@index");
					route.get("/{id_member}", 	"member.organization.controller@show");
	
					route.options({ middleware: ["member"] }, () => {
						route.post("/", "member.organization.controller@store");
	
						route.group("/{id_member}", () => {
							route.put("/",		"member.organization.controller@update");
							route.patch("/",	"member.organization.controller@update");
							route.delete("/",	"member.organization.controller@destroy");
						});
					});
				});
			});
		});
	});
});