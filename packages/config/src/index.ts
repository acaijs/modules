import configModule from "./modules/config"

export const createConfig = () => new configModule()
const instance = new configModule()
export default instance
