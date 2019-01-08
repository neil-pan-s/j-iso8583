
export default class MacGenerate {

  /**
   * generate mac
   *
   * @param {String} sPacket 8583 packet
   * @return {String} 8 bytes mac
   */
  async generate(sPacket) {
    // TODO: call PED API generate mac
    let sMac = '8888888888888888'

    return sMac
  }

  /**
   * verify mac
   *
   * @param {String} sPacket 8583 packet
   * @param {String} sChkMac check mac
   * @return {String} 8 bytes mac
   */
  async verify(sPacket, sChkMac) {
    // TODO: call PED generate mac
    let sMac = '8888888888888888'
    
    return sChkMac === sMac
  }
}