// package: bcsdksdk
// file: protocol.proto

import * as jspb from "google-protobuf";

export class MessageGetObjectsRequest extends jspb.Message {
  getType(): MsgTypeMap[keyof MsgTypeMap];
  setType(value: MsgTypeMap[keyof MsgTypeMap]): void;

  getBody(): ObjTypeMap[keyof ObjTypeMap];
  setBody(value: ObjTypeMap[keyof ObjTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageGetObjectsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MessageGetObjectsRequest): MessageGetObjectsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageGetObjectsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageGetObjectsRequest;
  static deserializeBinaryFromReader(message: MessageGetObjectsRequest, reader: jspb.BinaryReader): MessageGetObjectsRequest;
}

export namespace MessageGetObjectsRequest {
  export type AsObject = {
    type: MsgTypeMap[keyof MsgTypeMap],
    body: ObjTypeMap[keyof ObjTypeMap],
  }
}

export interface ObjTypeMap {
  BLOCKHEADERS: 0;
  BLOCKBODIES: 1;
  BLOCKTRANSACTIONS: 2;
  ROVERBESTHEIGHTS: 3;
  ROVERBLOCKHEADERS: 4;
  ROVERBLOCKBODIES: 5;
  ROVERTRANSACTIONHEADERS: 6;
  ROVERMARKEDHEADERS: 7;
}

export const ObjType: ObjTypeMap;

export interface MsgTypeMap {
  GETOBJECTSREQUEST: 0;
}

export const MsgType: MsgTypeMap;

