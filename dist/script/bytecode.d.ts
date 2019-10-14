/**
 * Copyright (c) 2017-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="node" />
export declare const OPS: Map<number, string>;
export declare const REVERSE_OPS: Map<string, number>;
export declare const BYTECODE_VERSIONS: Map<number, Buffer>;
export declare function fromASM(asm: string, version: number): Buffer;
export declare function toASM(bytecode: Buffer, version: number): string;
