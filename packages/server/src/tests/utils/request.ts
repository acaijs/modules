// Packages
import * as supertest from "supertest"

const request = supertest.agent("http://localhost:3000")

export default request