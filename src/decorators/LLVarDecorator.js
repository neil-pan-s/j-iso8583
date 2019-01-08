export default class LLVarDecorator {

  constructor(superDecorator, transfer) {
    this.superDecorator = superDecorator
    this.transfer = transfer
  }

  /**
   * LLVar Length decorate
   *
   * @param {String} data field original data
   */
  decorate(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.decorate(data, attr)
    }

    const maxLength = (attr.dataType === 'B' || attr.dataType === 'ANS') ? attr.maxLength * 2 : attr.maxLength

    if (data.length > maxLength) {
      throw Error(`data.length overflow, data=[${data}]`)
    }

    let lenByte = '00'

    if (attr.dataType === 'B' || attr.dataType === 'ANS') {
      lenByte += parseInt((data.length + 1) / 2, 10)
    } else {
      lenByte += data.length
    }

    // odd length padding
    if (data.length % 2) {
      data += attr.padding
    }

    return lenByte.slice(-2) + data
  }

  /**
   * LLVar Length recover
   *
   * @param {String} data packet data
   */
  recover(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.recover(data, attr)
    }

    let lenByte = parseInt(data.slice(0, 2), 10)

    lenByte = (attr.dataType === 'B' || attr.dataType === 'ANS') ? lenByte * 2 : lenByte

    // console.log("#LLVarDecorate-recover#[" + lenByte + "]" + data.slice(2, lenByte + 2))

    // odd length padding
    if (lenByte % 2) {
      lenByte += 1
    }

    // update the packet
    if (this.transfer) {
      this.transfer.data = data.slice(2 + lenByte)
    }

    return data.slice(2, lenByte + 2)
  }
}
