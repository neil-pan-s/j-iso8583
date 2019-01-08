export default class RightAlignDecorator {


  constructor(superDecorator) {
    this.superDecorator = superDecorator
  }

  /**
   * RightAlign data decorate
   *
   * @param {String} data field original data
   */
  decorate(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.decorate(data, attr)
    }

    if (attr.lengthType !== 'FIX') { return data }

    let padding = ''

    for (let i = 0; i < attr.maxLength - data.length; i++) {
      padding += String(attr.padding)
    }

    return padding + data
  }

  /**
   * RightAlign data recover
   *
   * @param {String} data packet data
   */
  recover(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.recover(data, attr)
    }

    // Do Nothing
    return data
  }
}
