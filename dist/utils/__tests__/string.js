"use strict";
/**
 * Copyright (c) 2018-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../string");
describe('string utils', () => {
    describe('isHexString', () => {
        const tests = [
            ['c0ffee', true],
            ['C0FFEE', true],
            ['C0fFeE', true],
            ['A', true],
            ['a', true],
            ['1', true],
            ['nC0fFeE', false],
            ['C0fFeEn', false],
            ['', false],
            ['0x', false],
            ['0x1', true],
            ['cf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701', true],
            ['0xcf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701', true],
            ['0Xcf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701', false]
        ];
        for (const [testData, result] of tests) {
            it(`recognizes ${JSON.stringify(testData)} as ${result ? 'valid' : 'invalid'} hex string`, () => {
                expect(string_1.isHexString(testData)).toBe(result);
            });
        }
    });
    describe('normalizeHexString', () => {
        const tests = [
            ['c0ffee', '0xc0ffee'],
            ['C0FFEE', '0xc0ffee'],
            ['C0fFeE', '0xc0ffee'],
            ['A', '0xa'],
            ['a', '0xa'],
            ['1', '0x1'],
            ['0x1', '0x1'],
            [
                'cf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701',
                '0xcf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701'
            ],
            [
                '0xcf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701',
                '0xcf8ea96aee4752b794558649acfafc0db1cf6206bdfd8ec2f2de6654893af14d0a7991c4a76f5a55232c9ddd5cb3aeabecc4b5cd69b83680ceacb18dff81972701'
            ]
        ];
        for (const [testData, result] of tests) {
            it(`normalizes ${JSON.stringify(testData)} as ${result}`, () => {
                expect(string_1.normalizeHexString(testData)).toBe(result);
            });
        }
    });
});
//# sourceMappingURL=string.js.map