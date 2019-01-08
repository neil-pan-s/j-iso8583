import BitMap from './Bitmap'
import ISOField from './ISOField'
import Console from './Console'

export default class ISO8583 {

  constructor() {
    // Max 128 Field
    this.iso8583Map = new Array(129)
    this.bFields128 = false
    this.macGenerate = null
    this.headerDecorate = null

    // 消息类型 - !Important, Do not Change this!
    this.attrMessageType = { bitNo: 0, dataType: 'N', lengthType: 'FIX', maxLength: 4, alignment: 'RIGHT', padding: '0', describe: '' }
      // BitMap - !Important, Do not Change this!
    this.attrBitmap = { bitNo: 1, dataType: 'B', lengthType: 'FIX', maxLength: 8, alignment: 'RIGHT', padding: '0', describe: '' }

    this.bitMap = new BitMap()
  }

  /**
   * init iso8583 fields whit attributes
   *
   * @param {Object} configs isofield attribute object array
   * Link to {@link iso8583.isofield  external class}
   */
  init(configs) {
    let attrLast

    configs.forEach((attr) => {
      // hack: 低版本浏览器 扩展Prototype方法后数组便利最后一项为 扩展的Function -_-!!
      if (typeof attr === 'function') {
        return
      }

      const field = new ISOField(attr)
      this.iso8583Map[attr.bitNo] = field

      attrLast = attr
    }, this)

    // Judge 128 or 64
    if (attrLast.bitNo > 64) {
      this.bFields128 = true
      this.attrBitmap.maxLength = 16
    } else {
      this.bFields128 = false
      this.attrBitmap.maxLength = 8
    }

    // Load MessageType && BitMap
    this.iso8583Map[0] = new ISOField(this.attrMessageType)
    this.iso8583Map[1] = new ISOField(this.attrBitmap)
  }
  
  /**
   * set iso8583 MacGenerate
   * @param {Object} macGenerate Mac Generate obejct
   * @param {Object} macGenerate.generate  generate method
   * @param {Object} macGenerate.verify    verify method
   *
   */
  setMacGenerate(macGenerate) {
    this.macGenerate = macGenerate
  }

  /**
   * set iso8583 headerDecorate
   * @param {Object} headerDecorate Header Decorate obejct
   * @param {Object} headerDecorate.decorate  decorate method , add tpdu + header
   * @param {Object} headerDecorate.recover   recover method, remove tpdu + header
   *
   */
  setHeaderDecorate(headerDecorate) {
    this.headerDecorate = headerDecorate
  }

  /**
   * set iso8583 fields data
   *
   * @param {Number} bitNo iso8583 field no.
   * @param {String} data  iso8583 field data.
   *
   */
  set(bitNo, data) {
    if (data === null || data === undefined) { return }

    const field = this.iso8583Map[bitNo]
    field.setData(data)

    if (bitNo >= 2) {
      this.bitMap.setBit(bitNo, true)
    }
  }

  /**
   * get iso8583 fields data
   *
   * @param {Number} bitNo iso8583 field no.
   * @return {String} iso8583 field data.
   *
   */
  get(bitNo) {
    const field = this.iso8583Map[bitNo]
    return field.getData()
  }

  /**
   * clear iso8583 fields data
   *
   * @param {Number} bitNo iso8583 field no.
   *
   */
  clear(bitNo) {
    const field = this.iso8583Map[bitNo]
    field.setData(null)
    this.bitMap.setBit(bitNo, false)
  }

  /**
   * clear all iso8583 fields data
   *
   */
  clearAll() {
    this.iso8583Map.forEach((field, index) => {
      if (field) {
        field.setData(null)
        this.bitMap.setBit(index, false)
      }
    }, this)
  }

  /**
   * pack all iso8583 fields
   *
   * @param {Object} options pack options
   * @param {Boolean} options.isGenMac Generate Mac or not
   *
   * @return {String} the packed result. fieldno [0,64)  or [0, 128)
   */
  async pack(options) {
    let sTemp = ''

    options.isGenMac && this.bitMap.setBit(this.bFields128 ? 128 : 64, true)

    // Auto Set BitMap Data
    const lenBitMap = (this.bFields128) ? 16 : 8
    this.iso8583Map[this.attrBitmap.bitNo].setData(this.bitMap.toString().slice(0, lenBitMap * 2))

    sTemp += this.iso8583Map[0].seal()
    sTemp += this.iso8583Map[1].seal()

    this.iso8583Map.forEach((field, index) => {
      // BitMap Not SetBit Continue, Mac Field Continue
      if (!this.bitMap.checkBit(index) || (+index === (this.bFields128 ? 128 : 64))) {
        return
      }

      if (field) {
        sTemp += field.seal()
      }

      // console.log("[" + index + "]-[" + sTemp + "]");
    }, this)

    // Mac Gen
    if (options.isGenMac) {
      const sMac = await this.macGenerate.generate(sTemp)
      sTemp += sMac
    }

    // Header Gen, add Tpdu + Header
    sTemp = this.headerDecorate.decorate(sTemp)

    // + 2 bytes hex len
    const highByte = parseInt((sTemp.length / 2) / 256, 10).toString(16)
    const lowByte = (parseInt((sTemp.length / 2), 10) % 256).toString(16)
    const lenBytes = `00${highByte}`.slice(-2) + `00${lowByte}`.slice(-2)
    sTemp = lenBytes.slice(-4) + sTemp

    return sTemp
  }

  /**
   * unpack and save all iso8583 fields
   *
   * @param {Object} options pack options
   * @param {String} options.data string packet, whit 2 bytes len 、tpdu and message header
   * @param {Boolean} options.isVerifyMac Verify Mac or Not
   *
   */
  async unpack(options) {
    let sTemp

    // Header Recover, remove TPDU + Header
    let sPacket = this.headerDecorate.recover(options.data.slice(4))

    try {
      // Unseal MessageType
      sTemp = this.iso8583Map[0].unseal(sPacket)
        // Unseal Bitmap
      sTemp = this.iso8583Map[1].unseal(sTemp)
    } catch (e) {
      throw e
    }

    Console.log(`#bitmap# ${this.iso8583Map[1].getData()}`)

    this.bitMap.init(this.iso8583Map[1].getData())

    this.iso8583Map.forEach((field, index) => {
      // BitMap Not SetBit Continue
      if (!this.bitMap.checkBit(index)) {
        return
      }
      if (field) {
        sTemp = field.unseal(sTemp)
      }
    }, this)

    if (options.isVerifyMac) {
      const sChkMac = sPacket.slice(-16)
      sPacket = sPacket.slice(0, -16)

      // Field 39 equal to rspType A, verify mac!
      if ('00 10 11 A2 A4 A5 A6'.split(' ').indexOf(this.iso8583Map[39].getData()) >= 0) {
        await this.macGenerate.verify(sPacket, sChkMac)
      }
    }
  }
}

export { ISO8583 }