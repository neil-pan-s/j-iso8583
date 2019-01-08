export default class LLLVarDecorate {

  constructor(superDecorator, transfer) {
    this.superDecorator = superDecorator
    this.transfer = transfer
  }

  /**
   * LLLVar Length decorate
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

    let lenByte = '0000'

    if (attr.dataType === 'B' || attr.dataType === 'ANS') {
      lenByte += parseInt((data.length + 1) / 2, 10)
    } else {
      lenByte += data.length
    }

    // odd length padding
    if (data.length % 2) {
      data += attr.padding
    }

    return lenByte.slice(-4) + data
  }

  /**
   * LLLVar Length recover
   *
   * @param {String} data packet data
   */
  recover(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.recover(data, attr)
    }

    let lenByte = parseInt(data.slice(0, 4), 10)

    lenByte = (attr.dataType === 'B' || attr.dataType === 'ANS') ? lenByte * 2 : lenByte

    // console.log("#LLLVarDecorate-recover#[" + lenByte + "]" + data.slice(4, lenByte + 4))

    // odd length padding
    if (lenByte % 2) {
      lenByte += 1
    }

    // update the packet
    if (this.transfer) {
      this.transfer.data = data.slice(4 + lenByte)
    }

    return data.slice(4, lenByte + 4)
  }
}
