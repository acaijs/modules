// Packages
import { promises as fs } from "fs"

export const exists = (path) => fs.stat(path).then(() => true).catch(() => false)