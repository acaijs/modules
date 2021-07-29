// Packages
import config from "@acai/config";

export default function isDevelopment () {
	return !["prod", "production"].includes(config.env.APP_ENV);
}