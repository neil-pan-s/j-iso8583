

export default class HeaderDecorate {

  /**
   * Add TPDU + Message Header before Packet
   *
   * @param {String} sPacket 8583 packet whitout 2 bytes length
   */
  decorate(sPacket) {
    let sHeader = ''

    // + TPDU
    sHeader += '6000030000'

    // + Header 
    sHeader += '603100011001'

    return sHeader + sPacket
  }


  /**
   * Remove TPDU + Message Header before Packet
   *
   * @param {String} sPacket 8583 packet whitout 2 bytes length
   */
  recover(sPacket) {
    const sTpdu = sPacket.slice(0, 10)
    const sHeader = sPacket.slice(10, 12)

    // TODO TPDU 验证
    // ...

    // TODO:
    // 传回报文头 用于报文头判断 是否需要参数下载等

    return sPacket.slice(22)
  }

}