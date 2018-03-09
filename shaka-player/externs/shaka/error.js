/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/** @externs */



/**
 * @interface
 * @exportDoc
 */
shakaExtern.Error = function() {};


/**
 * @type {shaka.util.Error.Severity}
 */
shakaExtern.Error.prototype.severity;


/**
 * @const {shaka.util.Error.Category}
 */
shakaExtern.Error.prototype.category;


/**
 * @const {shaka.util.Error.Code}
 */
shakaExtern.Error.prototype.code;


/**
 * @const {!Array.<*>}
 */
shakaExtern.Error.prototype.data;


/**
 * @type {boolean}
 */
shakaExtern.Error.prototype.handled;

