#!/usr/bin/env node

// Modules
import build from "./modules/build"
import * as path from "path"

const pkg = require(path.join(process.cwd(), "package.json"))

// CLI setup
build(pkg)