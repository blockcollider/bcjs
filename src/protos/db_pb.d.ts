// package: bc
// file: db.proto

import * as jspb from "google-protobuf";

export class DbValue extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getVersion(): number;
  setVersion(value: number): void;

  getIsNative(): boolean;
  setIsNative(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DbValue.AsObject;
  static toObject(includeInstance: boolean, msg: DbValue): DbValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DbValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DbValue;
  static deserializeBinaryFromReader(message: DbValue, reader: jspb.BinaryReader): DbValue;
}

export namespace DbValue {
  export type AsObject = {
    type: string,
    data: Uint8Array | string,
    version: number,
    isNative: boolean,
  }
}

