/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

import configModule from "./modules/config"

const instance = new configModule()
export default instance

export const createConfig = () => new configModule()