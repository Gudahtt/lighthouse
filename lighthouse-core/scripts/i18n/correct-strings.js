#!/usr/bin/env node
/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-disable no-console, max-len */

const fs = require('fs');
const path = require('path');
const collUtil = require('./collection-util.js');

/**
 * @typedef ICUMessageDefn
 * @property {string} message
 * @property {string} [description]
 */

const ignoredPathComponents = [
  '/.git',
  '/scripts',
  '/node_modules',
  '/test/',
  '-test.js',
  '-renderer.js',
];

/**
 * @param {*} file
 */
function collectPreLocaleStrings(file) {
  const rawdata = fs.readFileSync(file, 'utf8');
  const messages = JSON.parse(rawdata);
  return messages;
}

/**
 * @param {*} path
 * @param {*} output
 */
function saveLocaleStrings(path, output) {
  fs.writeFileSync(path, JSON.stringify(output, null, 2) + '\n');
}

/**
 * @param {string} dir
 * @param {string} output
 */
function collectAllPreLocaleStrings(dir, output) {
  for (const name of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, name);
    const relativePath = fullPath;// path.relative(LH_ROOT, fullPath);
    if (ignoredPathComponents.some(p => fullPath.includes(p))) continue;

    if (name.endsWith('.json')) {
      if (!process.env.CI) console.log('Correcting from', relativePath);
      const preLocaleStrings = collectPreLocaleStrings(relativePath);
      const strings = collUtil.bakePlaceholders(preLocaleStrings);
      saveLocaleStrings(output + path.basename(name), strings);
    }
  }
}

module.exports = {
  collectAllPreLocaleStrings,
};