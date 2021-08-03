// Packages
import * as supertest from "supertest"

const instance = supertest("http://0.0.0.0:8000")

export default instance