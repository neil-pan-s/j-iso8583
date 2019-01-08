export default class LeftAlignDecorator {

  constructor(superDecorator) {
    this.superDecorator = superDecorator
  }

  /**
   * LeftAlign data decorate
   *
   * @param {String} data field original data
   */
  decorate(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.decorate(data, attr)
    }

    if (attr.lengthType !== 'FIX') { return data }

    for (let i = data.length; i < attr.maxLength; i++) {
      data += String(attr.padding)
    }

    return data
  }

  /**
   * LeftAlign data recover
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
