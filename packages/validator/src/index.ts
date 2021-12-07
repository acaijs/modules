/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

import Validator from "./modules/validator"
export default Validator

// rules export
export { default as rules } 		from "./rules/index"
export { setRule as setRule } 		from "./rules/index"
export { setRules as setRules } 	from "./rules/index"
export { clearRules as clearRules } from "./rules/index"