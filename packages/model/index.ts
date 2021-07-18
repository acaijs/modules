/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

// model
export {default as Model} 	from "./src/modules/Model";
export {default as Table} 	from "./src/modules/ModelDecorator";

// typings
export { default as typeManager } from "./src/types";

// extra
export { getModels } 			from "./src/modules/ModelDecorator";
export { default as Hasher } 	from "./src/utils/Hasher";
export { default as Relation }	from "./src/interfaces/relation";

// Field and relations
import FieldDecoratorInterface 	from "./src/interfaces/fieldDecorator";
import _Field 					from "./src/modules/FieldDecorator";
import _HasOne 					from "./src/modules/HasOneDecorator";
import _HasMany					from "./src/modules/HasManyDecorator";
import _BelongsTo				from "./src/modules/BelongsToDecorator";

export const Field 	= _Field as FieldDecoratorInterface;
Field.hasOne 		= _HasOne;
Field.hasMany		= _HasMany;
Field.belongsTo		= _BelongsTo;
