import Utils from '../Utils'

export default class AsciiDecorator {

  constructor(superDecorator) {
    this.superDecorator = superDecorator
  }

  /**
   * Ascii data decorate
   *
   * @param {String} data field original data
   */
  decorate(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.decorate(data, attr)
    }

    return Utils.bcdToAsc(data, data.length)
  }

  /**
   * Ascii data recover
   *
   * @param {String} data packet data
   */
  recover(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.recover(data, attr)
    }

    // console.log("#AsciiDecorate-recover#" + data);

    return Utils.ascToBcd(data, data.length)
  }
}
