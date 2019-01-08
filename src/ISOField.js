import DecorateFactory from './DecorateFactory'
import Console from './Console'

export default class ISOField {

  // /**
  //  * isofield attribute define
  //  *
  //  * @static
  //  * @memberof ISOField
  //  */
  // static $attribute = {
  //   /**
  //    * @type {Number} bitNo
  //    * field bitno.
  //    */
  //   bitNo: -1,
  //   /**
  //    * @type {String} dataType
  //    * field data type
  //    *
  //    * 'ANS' - letter/number/special character;0x01--0xFF, Finaly Convert To ASCII <br/>
  //    * 'N'   - number;'0' -- '9'; Finaly Convert To BCD  <br/>
  //    * 'Z'   - 2th/3th track data    '0' -- '9'; '='; Finaly Convert To BCD  <br/>
  //    * 'B'   - binary system data  0x00 -- 0xFF; Use Origin  <br/>
  //    *
  //    */
  //   dataType: 'ANS|N|Z|B',
  //   /**
  //    * @type {String} lengthType
  //    * field length type
  //    *
  //    * 'FIX'    - fixed length <br/>
  //    * 'LLVAR'  - variational  length :0 -- 99 <br/>
  //    * 'LLLVAR' - variational  length :0 -- 999 <br/>
  //    *
  //    */
  //   lengthType: 'FIX|LLVAR|LLLVAR',
  //   /**
  //    * @type {Number} maxLength
  //    * field maxLength
  //    */
  //   maxLength: 0,
  //   /**
  //    * @type {String} alignment
  //    * field alignment type
  //    *
  //    * 'LEFT' - padding ' ' right <br/>
  //    * 'RIGHT' - padding '0' left <br/>
  //    */
  //   alignment: 'LEFT|RIGHT',
  //   /**
  //    * @type {String} padding
  //    * field padding value
  //    */
  //   padding: '',
  //   /**
  //    * @type {String} describe
  //    * field describe
  //    */
  //   describe: 'Default',
  // }

  constructor(attribute) {
    this.attr = attribute
    this.data = null

    const decorateFactory = new DecorateFactory(attribute)
    const DataDecorator = decorateFactory.getDataDecorator()
    const AlignDecorator = decorateFactory.getAlignDecorator()
    const LengthDecorator = decorateFactory.getLengthDecorator()

    this.decorateFactory = decorateFactory

    // 域组包装饰器： 对齐方式 => 数据格式化 => 拼接长度
    this.sealDecorators = new LengthDecorator(new DataDecorator(new AlignDecorator()))
      // 域解包装饰器：剥离长度 => 数据格式化还原 => 解析对齐方式
    this.unsealDecorators = new AlignDecorator(new DataDecorator(new LengthDecorator()))
  }

  /**
   * Set the isofield data.
   * @param {String} sData isofield data
   */
  setData(sData) {
    this.data = sData
  }

  /**
   * Get the isofield data.
   * @return {String}  the isofield data
   */
  getData() {
    return this.data
  }

  /**
   * Set the isofield attribute.
   * @return {String}  attribute the isofield attribute
   */
  setAttr(attribute) {
    this.attr = attribute
  }

  /**
   * Get the isofield attribute.
   * @return {String}  the isofield attribute
   */
  getAttr() {
    return this.attr
  }

  /**
   * seal the isofield data <br/>
   * 域组包装饰器： 对齐方式 => 数据格式化 => 拼接长度
   *
   * @return {String}  the isofield seal data
   */
  seal() {
    Console.log(`#seal field- ${this.attr.bitNo} # - [${this.data}]`)
    return this.sealDecorators.decorate(this.data, this.attr)
  }

  /**
   * unseal the isofield data <br/>
   * 域解包装饰器：剥离长度 => 数据格式化还原 => 解析对齐方式
   *
   * @return {String}  the isofield unseal data
   */
  unseal(sPacket) {
    const transfer = {
      data: sPacket,
    }

    this.data = this.unsealDecorators.recover(sPacket, this.attr)
    Console.log(`#unseal field- ${this.attr.bitNo} # - [${this.data}]`)

    // 去除已处理的报文长度
    const LengthDecorator = this.decorateFactory.getLengthDecorator()
    const lenProc = new LengthDecorator(null, transfer)
    lenProc.recover(sPacket, this.attr)

    return transfer.data
  }
}
