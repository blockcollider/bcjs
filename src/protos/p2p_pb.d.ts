// package: bcsdk
// file: p2p.proto

import * as jspb from "google-protobuf";
import * as core_pb from "./core_pb";

export class InitialPeer extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getExpires(): number;
  setExpires(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitialPeer.AsObject;
  static toObject(includeInstance: boolean, msg: InitialPeer): InitialPeer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitialPeer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitialPeer;
  static deserializeBinaryFromReader(message: InitialPeer, reader: jspb.BinaryReader): InitialPeer;
}

export namespace InitialPeer {
  export type AsObject = {
    address: string,
    expires: number,
  }
}

export class InitialPeerEvents extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitialPeerEvents.AsObject;
  static toObject(includeInstance: boolean, msg: InitialPeerEvents): InitialPeerEvents.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitialPeerEvents, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitialPeerEvents;
  static deserializeBinaryFromReader(message: InitialPeerEvents, reader: jspb.BinaryReader): InitialPeerEvents;
}

export namespace InitialPeerEvents {
  export type AsObject = {
  }
}

export class BcBlocks extends jspb.Message {
  clearBlocksList(): void;
  getBlocksList(): Array<core_pb.BcBlock>;
  setBlocksList(value: Array<core_pb.BcBlock>): void;
  addBlocks(value?: core_pb.BcBlock, index?: number): core_pb.BcBlock;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BcBlocks.AsObject;
  static toObject(includeInstance: boolean, msg: BcBlocks): BcBlocks.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BcBlocks, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BcBlocks;
  static deserializeBinaryFromReader(message: BcBlocks, reader: jspb.BinaryReader): BcBlocks;
}

export namespace BcBlocks {
  export type AsObject = {
    blocksList: Array<core_pb.BcBlock.AsObject>,
  }
}

