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

export class Service extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getUuid(): string;
  setUuid(value: string): void;

  getPid(): string;
  setPid(value: string): void;

  getText(): string;
  setText(value: string): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Service.AsObject;
  static toObject(includeInstance: boolean, msg: Service): Service.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Service, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Service;
  static deserializeBinaryFromReader(message: Service, reader: jspb.BinaryReader): Service;
}

export namespace Service {
  export type AsObject = {
    version: number,
    uuid: string,
    pid: string,
    text: string,
    data: string,
  }
}

export class PutService extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getUuid(): string;
  setUuid(value: string): void;

  getPid(): string;
  setPid(value: string): void;

  getEncrypted(): boolean;
  setEncrypted(value: boolean): void;

  getText(): string;
  setText(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PutService.AsObject;
  static toObject(includeInstance: boolean, msg: PutService): PutService.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PutService, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PutService;
  static deserializeBinaryFromReader(message: PutService, reader: jspb.BinaryReader): PutService;
}

export namespace PutService {
  export type AsObject = {
    version: number,
    uuid: string,
    pid: string,
    encrypted: boolean,
    text: string,
    data: Uint8Array | string,
  }
}

export class Record extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getHost(): string;
  setHost(value: string): void;

  getPort(): number;
  setPort(value: number): void;

  getLastSeen(): number;
  setLastSeen(value: number): void;

  getLastSeenHash(): string;
  setLastSeenHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Record.AsObject;
  static toObject(includeInstance: boolean, msg: Record): Record.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Record, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Record;
  static deserializeBinaryFromReader(message: Record, reader: jspb.BinaryReader): Record;
}

export namespace Record {
  export type AsObject = {
    version: number,
    host: string,
    port: number,
    lastSeen: number,
    lastSeenHash: string,
  }
}

export class Config extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getSecureAdmin(): string;
  setSecureAdmin(value: string): void;

  getSecureGroup(): string;
  setSecureGroup(value: string): void;

  clearServicesList(): void;
  getServicesList(): Array<Service>;
  setServicesList(value: Array<Service>): void;
  addServices(value?: Service, index?: number): Service;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Config.AsObject;
  static toObject(includeInstance: boolean, msg: Config): Config.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Config, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Config;
  static deserializeBinaryFromReader(message: Config, reader: jspb.BinaryReader): Config;
}

export namespace Config {
  export type AsObject = {
    version: number,
    secureAdmin: string,
    secureGroup: string,
    servicesList: Array<Service.AsObject>,
  }
}

export class PutConfig extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getAdmin(): boolean;
  setAdmin(value: boolean): void;

  getSecureSignature(): string;
  setSecureSignature(value: string): void;

  clearServicesList(): void;
  getServicesList(): Array<PutService>;
  setServicesList(value: Array<PutService>): void;
  addServices(value?: PutService, index?: number): PutService;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PutConfig.AsObject;
  static toObject(includeInstance: boolean, msg: PutConfig): PutConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PutConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PutConfig;
  static deserializeBinaryFromReader(message: PutConfig, reader: jspb.BinaryReader): PutConfig;
}

export namespace PutConfig {
  export type AsObject = {
    version: number,
    admin: boolean,
    secureSignature: string,
    servicesList: Array<PutService.AsObject>,
  }
}

