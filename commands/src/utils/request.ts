import axios from "axios"

axios.defaults.headers.common = { "Authorization": `Bearer ${process.env.GITHUB_TOKEN}` }

export default axios