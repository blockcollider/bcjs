// package: bcsdk
// file: p2p.proto

import * as jspb from "google-protobuf";

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

