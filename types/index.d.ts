
export enum DataType {
  N = 'N',
  ANS = 'ANS',
  Z = 'Z',
  B = 'B',
}

export enum LengthType {
  FIX = 'FIX',
  LLVAR = 'LLVAR',
  LLLVAR = 'LLLVAR',
}

export enum Alignment {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT'
}

export interface ISOField{
  bitNo: number
  dataType: DataType,
  lengthType: LengthType,
  maxLength: number,
  alignment: Alignment,
  padding: string | null,
  describe: string,
}

export interface MacGenerate {
  generate(sPacket: string): Promise<string>
  verify(sPacket: string, sChkMac: string): Promise<boolean>
}

export interface HeaderDecorate {
  decorate(sPacket: string): void
  recover(sPacket: string): void
}

export interface PackOptions {
  isGenMac: boolean
}

export interface UnpackOptions {
  data: string
  isVerifyMac: boolean
}

export default class ISO8583 {
  init(configs: ISOField[]): void
  setMacGenerate(macGenerate: MacGenerate): void
  setHeaderDecorate(headerDecorate: HeaderDecorate): void
  set(bitNo: number, data: string): void
  get(bitNo: number): string
  clear(bitNo: number): void
  clearAll(): void
  pack(options: PackOptions): Promise<string>
  unpack(options: UnpackOptions): Promise<void>
}  

