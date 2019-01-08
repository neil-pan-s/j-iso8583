export default class MummyDecorate {

  constructor(superDecorator) {
    this.superDecorator = superDecorator
  }


  /**
   * Mummy data decorate
   *
   * @param {String} data field original data
   */
  decorate(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.decorate(data, attr)
    }
    return data
  }

  /**
   * Mummy data recover
   *
   * @param {String} data packet data
   */
  recover(sdata, attr) {
    let data = sdata

    if (this.superDecorator) {
      data = this.superDecorator.recover(data, attr)
    }

    return data
  }
}
