/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

// model
export {default as Model} 	from "./modules/Model"
export {default as Table} 	from "./modules/ModelDecorator"

// typings
export { default as typeManager } from "./types"

// extra
export { getModels } 			from "./modules/ModelDecorator"
export { default as Hasher } 	from "./utils/Hasher"
export { default as Relation }	from "./interfaces/relation"

// Field and relations
import FieldDecoratorInterface 	from "./interfaces/fieldDecorator"
import _Field 					from "./modules/FieldDecorator"
import _HasOne 					from "./modules/HasOneDecorator"
import _HasMany					from "./modules/HasManyDecorator"
import _BelongsTo				from "./modules/BelongsToDecorator"

export const Field 	= _Field as FieldDecoratorInterface
Field.hasOne 		= _HasOne
Field.hasMany		= _HasMany
Field.belongsTo		= _BelongsTo
