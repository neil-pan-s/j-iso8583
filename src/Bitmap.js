import Utils from './Utils'

export default class BitMap {

  constructor() {
    const mask = '00000000000000000000000000000000'

    this.mask = mask
    this.bitMap = mask
  }

  /**
   * init bitmap
   *
   * @param {String} data data == null时清空， data != null时使用data更新bitMap
   */
  init(data) {
    if (data == null) {
      this.bitMap = this.mask
    } else {
      this.bitMap = data
    }
  }

  /**
   * Bitmap set bitNo. value
   *
   * @param {Number} bitNo iso8583 field no.
   * @param {Boolean} state true/false
   */
  setBit(bitNo, state) {
    if (bitNo < 2 || bitNo > 128) {
      // throw new Error("bitNo is Error");
      return
    }
    this.bitMap = Utils.bitSet(this.bitMap, bitNo - 1, state)
  }

  /**
   * Bitmap get bitNo. value
   *
   * @param  {Number} bitNo iso8583 field no.
   * @return {Boolean}  true/false
   */
  checkBit(bitNo) {
    if (bitNo < 2 || bitNo > 128) {
      // throw new Error("bitNo is Error");
      return false
    }
    return Utils.bitGet(this.bitMap, bitNo - 1)
  }

  /**
   * Bitmap to string
   *
   * @return {String} String Bitmap
   */
  toString() {
    return this.bitMap.toUpperCase()
  }
}
