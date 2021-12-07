// Packages
import config from "@acai/config"

const isDevelopment = () => !["prod", "production"].includes(config.env.APP_ENV || "")
export default isDevelopment
