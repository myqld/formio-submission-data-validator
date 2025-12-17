/*
 * Attribution Notice:
 * This file is a derivative work of the Form.io project (https://github.com/formio/formio),
 * based on version v4.2.8-rc.2, and has been modified.
 * Original work: Copyright (c) 2020 Form.io LLC
 * Licensed under the Open Software License version 3.0.
 */

'use strict';
const fs = require('fs');
const resolve = require('resolve/sync');

const lodashCode = fs.readFileSync(resolve('lodash/lodash.min.js'), 'utf8');
const momentCode = fs.readFileSync(resolve('moment/min/moment.min.js'), 'utf8');
const inputmaskCode = fs.readFileSync(resolve('inputmask/dist/inputmask.min.js'), 'utf8');
const formioCoreCode = fs.readFileSync(resolve('@formio/core/dist/formio.core.min.js'), 'utf8');
const fastJsonPatchCode = fs.readFileSync(resolve('fast-json-patch/dist/fast-json-patch.min.js'), 'utf8');
const nunjucksCode = fs.readFileSync(resolve('nunjucks/browser/nunjucks.min.js'), 'utf8');

module.exports = {
    lodash: lodashCode,
    moment: momentCode,
    inputmask: inputmaskCode,
    core: formioCoreCode,
    fastJsonPatch: fastJsonPatchCode,
    nunjucks: nunjucksCode,
};
