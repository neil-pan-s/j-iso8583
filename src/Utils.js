export default class Utils {

  /**
   * 将hex解码成string,仅支持ascii码
   * ```
   * eg. "\x12\x34\x56" to "123456"
   * eg. "123456" to "313233343536"
   * ```
   * @param {String} raw hex数据
   * @param {Number} len 可选参数，表示截取len位hex数据长度，从左边开始
   * @return {String} 转换后数据
   */
  static bcdToAsc(sraw, len) {
    let compactHex = ''
    let hexChar = 0
    let raw = sraw

    if (arguments.length >= 2) {
      raw = raw.slice(0, len)
    }

    for (let i = 0; i < raw.length; i++) {
      hexChar = raw.charCodeAt(i).toString(16).toUpperCase()
      compactHex += (hexChar.length === 1 ? `0${hexChar}` : hexChar)
    }

    return compactHex.trim()
  }

  /**
   * 将string转换成hex string输出，仅支持ascii码
   * ```
   * eg. "123456" to "\x12\x34\x56"
   * eg. "313233343536" to "123456"
   * ```
   * @param {String} raw hex数据
   * @param {Number} len 可选参数，表示截取len位hex数据长度，从左边开始
   * @returns {string} 转换后数据
   */
  static ascToBcd(sraw, len) {
    let charCode
    let hexChar
    let hexStr = []
    let raw = sraw

    if (!/[0-9a-fA-F]/m.test(raw)) {
      throw new Error('Wrong Format!')
    }

    if (raw.length % 2) {
      throw new Error('Length not times to 2')
    }

    if (arguments.length >= 2) {
      raw = raw.slice(0, len)
    }

    for (let i = 0; i < raw.length / 2; i++) {
      hexChar = raw.substr(i * 2, 2)
      charCode = parseInt(hexChar, 16)
      hexStr.push(charCode)
    }

    hexStr = String.fromCharCode.apply(null, hexStr)
    return hexStr
  }

  /**
   * 获取位图的位数据
   *
   * @param {String} srcStr 传入位图的hexstring
   * @param {Number} idx 要设置的index (从0开始)
   * @returns {bit} 位数据
   */
  static bitGet(srcStr, idx) {
    if (idx < 0) {
      return srcStr
    }
    const index = parseInt(idx / 4, 10)
    const pos = idx % 4
    if (index >= srcStr.length) {
      throw new Error(`length exceed ${index}`)
    }
    const expected = srcStr.charAt(index)
      /* eslint no-bitwise: ["error", { "allow": [">>", "&"] }] */
    const bit = (parseInt(expected, 16) >> (3 - pos)) & 0x01
    return bit
  }

  /**
   * 位图的位设置操作
   * ```
   * eg. "000000", 0, true  => "800000"
   *      位图第0位置位 即 第一字节 (0000 0000)Binary to (1000 0000)Binary
   * ```
   *
   * @param {String} srcStr 传入位图的hexstring
   * @param {Number} idxs 要设置的index (从0开始)
   * @param {boolean} flag 是否设置,true表示设置，false表示不设置. 若常数未传递或者参数为空，则默认为true
   * @returns {String} 设置后的hexstring
   */
  static bitSet(srcStr, idx, flag) {
    if (idx < 0) {
      return srcStr
    }
    const index = parseInt(idx / 4, 10)
    const pos = idx % 4
    if (index >= srcStr.length) {
      throw new Error(`length exceed ${index}`)
    }
    let expected = srcStr.charAt(index)
      // const bit = Math.pow(2, 3 - pos)
    const bit = 2 ** (3 - pos)
      /* eslint no-bitwise: ["error", { "allow": ["|", "~", "&"] }] */
    if (flag) {
      expected = (bit | parseInt(expected, 16)).toString(16)
    } else {
      expected = ((~bit) & parseInt(expected, 16)).toString(16)
    }

    return srcStr.substring(0, index) + expected + srcStr.substring(index + 1).toUpperCase()
  }
}
