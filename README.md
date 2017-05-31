# J-ISO8583
ISO8583 Js Support, for POS Developer.

# Installation

    npm install j-iso8583


# Features
__&#10084; 支持报文域属性配置:__
开放报文域属性配置（fileds.json），兼容处理不同收单行之间报文格式差异。

__&#991; 委托macGenerate和headerDecorate接口:__
将ISO8583处理中和硬件相关或是其他参数耦合的部分剥离，委托给调用层实现。

__&#10049; 完整的ISO8583接口支持:__
提供一套完整的JS操作ISO8583报文接口

# Attributes

```js
[
	{ "bitNo": 2, "dataType": "N", "lengthType": "LLVAR", "maxLength": 19, "alignment": "LEFT", "padding": "F", "describe": "" },
	{ "bitNo": 3, "dataType": "N", "lengthType": "FIX", "maxLength": 6, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 4, "dataType": "N", "lengthType": "FIX", "maxLength": 12, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 11, "dataType": "N", "lengthType": "FIX", "maxLength": 6, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 12, "dataType": "N", "lengthType": "FIX", "maxLength": 6, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 13, "dataType": "N", "lengthType": "FIX", "maxLength": 4, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 14, "dataType": "N", "lengthType": "FIX", "maxLength": 4, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 15, "dataType": "N", "lengthType": "FIX", "maxLength": 4, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 22, "dataType": "N", "lengthType": "FIX", "maxLength": 3, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 23, "dataType": "N", "lengthType": "FIX", "maxLength": 4, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 25, "dataType": "N", "lengthType": "FIX", "maxLength": 2, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 26, "dataType": "N", "lengthType": "FIX", "maxLength": 2, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 32, "dataType": "N", "lengthType": "LLVAR", "maxLength": 11, "alignment": "RIGHT", "padding": "0", "describe": "" },
	{ "bitNo": 35, "dataType": "Z", "lengthType": "LLVAR", "maxLength": 37, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 36, "dataType": "Z", "lengthType": "LLLVAR", "maxLength": 104, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 37, "dataType": "ANS", "lengthType": "FIX", "maxLength": 12, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 38, "dataType": "ANS", "lengthType": "FIX", "maxLength": 6, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 39, "dataType": "ANS", "lengthType": "FIX", "maxLength": 2, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 41, "dataType": "ANS", "lengthType": "FIX", "maxLength": 8, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 42, "dataType": "ANS", "lengthType": "FIX", "maxLength": 15, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 44, "dataType": "ANS", "lengthType": "LLVAR", "maxLength": 25, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 48, "dataType": "N", "lengthType": "LLLVAR", "maxLength": 322, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 49, "dataType": "ANS", "lengthType": "FIX", "maxLength": 3, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 52, "dataType": "B", "lengthType": "FIX", "maxLength": 8, "alignment": "LEFT", "padding": null, "describe": "" },
	{ "bitNo": 53, "dataType": "N", "lengthType": "FIX", "maxLength": 16, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 54, "dataType": "ANS", "lengthType": "LLLVAR", "maxLength": 20, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 55, "dataType": "B", "lengthType": "LLLVAR", "maxLength": 700, "alignment": "LEFT", "padding": null, "describe": "" },
	{ "bitNo": 58, "dataType": "B", "lengthType": "LLLVAR", "maxLength": 100, "alignment": "LEFT", "padding": null, "describe": "" },
	{ "bitNo": 60, "dataType": "N", "lengthType": "LLLVAR", "maxLength": 17, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 61, "dataType": "N", "lengthType": "LLLVAR", "maxLength": 29, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 62, "dataType": "B", "lengthType": "LLLVAR", "maxLength": 999, "alignment": "LEFT", "padding": "0", "describe": "" },
	{ "bitNo": 63, "dataType": "ANS", "lengthType": "LLLVAR", "maxLength": 163, "alignment": "LEFT", "padding": " ", "describe": "" },
	{ "bitNo": 64, "dataType": "B", "lengthType": "FIX", "maxLength": 8, "alignment": "LEFT", "padding": "", "describe": "" }
]
	
```

# Delegate Interface 

## macGenerate

```js
// iso8583 delegate function, implement as x9.9/PBOC/ECB/CBC
var macGenerate = {
	/**
	 * generate mac
	 *
	 * @param {String} sPacket 8583 packet
	 * @return {String} 8 bytes mac
	 */
	generate: function(sPacket) {

	    // TODO: 
	    // call device calc mac 
	    // ... 

	    // mock	
	    return "4235333641323341";
	},
	/**
	 * verify mac
	 *
	 * @param {String} sPacket 8583 packet
	 * @param {String} sChkMac check mac
	 * @return {Boolean} true/false
	 */
	verify: function(sPacket, sChkMac) {

	    // TODO: 
	    // call device calc mac then compare
	    // ... 

	    // mock
	    return true;
	}
};
```

## headerDecorate

```js
// iso8583 delegate function, implement handle TPDU/Message Header
var headerDecorate = {
	/**
	 * Add TPDU + Message Header before Packet
	 *
	 * @param {String} sPacket 8583 packet whitout 2 bytes length
	 */
	decorate: function(sPacket) {

	    var sTpdu = "6000030000";
	    var sHeader = "603100011001";

	    return sTpdu + sHeader + sPacket;
	},
	/**
	 * Remove TPDU + Message Header before Packet
	 * 
	 * @param {String} sPacket 8583 packet whitout 2 bytes length
	 * @param {Function} cb Message Header handler
	 */
	recover: function(sPacket, cb) {

	    var sTpdu = sPacket.slice(0, 10);
	    var sHeader = sPacket.slice(10, 12);

	    //TODO: TPDU verify
	    // ...

	    //TODO: Message Header handle
	    cb && cb(sHeader);

	    return sPacket.slice(22);
	}
};
```

# Examples

```js
    //load isofields attr
    iso8583.init(isofields);

    //handle MacGenerate 
    iso8583.setMacGenerate(macGenerate);

    //handle HeaderDecorate (set/get: TPDU + Header)
    iso8583.setHeaderDecorate(headerDecorate);

    iso8583.clearAll();

    /**
     *  iso8583 pack test
     */
    iso8583.set(0, "0200");
    iso8583.set(3, "000000");
    iso8583.set(4, "000000000001");
    iso8583.set(11, "001082");
    iso8583.set(22, "021");
    iso8583.set(25, "00");
    iso8583.set(26, "06");
    iso8583.set(35, "6226097806938388D491C8C34DB509A8C85E9");
    iso8583.set(36, "996226097806938388D1561560500050000001015949849214000049120D7806938388D000000000D050002AA0C3787788A4AC00");
    iso8583.set(41, "00000026");
    iso8583.set(42, "852331059980072");
    iso8583.set(49, "156");
    iso8583.set(52, "60D894D6F4978EF5");
    iso8583.set(53, "2610000000000000");
    iso8583.set(60, "22000015000501");
    iso8583.set(64, "4235333641323341");
    var sSend = iso8583.pack({ isGenMac: true });
    console.log("correct packet:");
    console.log("00aa600003000060310001100100200302004C030C0981100000000000000000100108202100006376226097806938388D491C8C34DB509A8C85E900104996226097806938388D1561560500050000001015949849214000049120D7806938388D000000000D050002AA0C3787788A4AC00303030303030323638353233333130353939383030373231353660D894D6F4978EF526100000000000000014220000150005014235333641323341");
    console.log("iso8583 packet:");
    console.log(sSend);

    /**
     *  iso8583 unpack test
     */
    var sRecv = "00aa60000300006031000110010210703E00810AD0801316622609780693838800000000000000000100108215343812014912120100084852331032393039383331353334333830303030303030303236383532333331303539393830303732223033303830303030202020343835323030303020202031353600142200001500050100034355504235333641323341";
    try {
        iso8583.unpack({ data: sRecv, isVerifyMac: false });
    } catch (e) {
        throw e;
    }
```

## License
MIT
