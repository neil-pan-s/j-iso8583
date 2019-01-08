export default class FixLenDecorator {

  constructor(superDecorator, transfer) {
    this.superDecorator = superDecorator
    this.transfer = transfer
  }

  /**
   * Fix Length decorate
   *
   * @param {String} data field original data
   */
  decorate(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.decorate(data, attr)
    }

    const maxLength = (attr.dataType === 'B' || attr.dataType === 'ANS') ?
      attr.maxLength * 2 : attr.maxLength

    if (data.length > maxLength) {
      throw Error(`data.length overflow, data=[${data}]`)
    }

    // odd length padding
    if (data.length % 2) {
      data += attr.padding
    }

    return data
  }

  /**
   * Fix Length recover
   *
   * @param {String} data packet data
   */
  recover(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.recover(data, attr)
    }

    const len = (attr.dataType === 'B' || attr.dataType === 'ANS') ?
      attr.maxLength * 2 : attr.maxLength

    // update the packet
    if (this.transfer) {
      this.transfer.data = data.slice(len)
    }

    // console.log("#FixLenDecorate-recover#[" + attr.maxLength + "]" + data.slice(0, len));

    return data.slice(0, len)
  }
}
