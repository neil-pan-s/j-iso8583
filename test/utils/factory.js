
import ISOfields from '../../example/fields.json'
import MacGenerate from '../../example/mac-generate'
import HeaderDecorate from '../../example/header-decorate'

export default class ISO8583Factory {

  constructor(ISO8583) {
    const iso8583 = new ISO8583()

    // 载入8583 域属性表
    iso8583.init(ISOfields)

    // 设置 MacGenerate
    iso8583.setMacGenerate(new MacGenerate())

    // 设置 HeaderDecorate (set/get: TPDU + Header)
    iso8583.setHeaderDecorate(new HeaderDecorate())

    iso8583.clearAll();

    return iso8583
  }
}

