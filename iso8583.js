(function(global) {

    'use strict';

    /**
     * # isofield 
     * 
     * @class iso8583.isofield  
     * Implenment isofield methods
     */
    var ISOFieldFactory = function(utils) {

        // field attribute define 
        var ATTRIBUTE = {
            /**
             * @cfg {Number} bitNo
             * field bitno.
             */
            bitNo: -1,
            /**
             * @cfg {String} dataType
             * field data type
             * 
             * 'ANS' - letter/number/special character;0x01--0xFF, Finaly Convert To ASCII <br/>   
             * 'N'   - number;'0' -- '9'; Finaly Convert To BCD  <br/>
             * 'Z'   - 2th/3th track data    '0' -- '9'; '='; Finaly Convert To BCD  <br/>
             * 'B'   - binary system data  0x00 -- 0xFF; Use Origin  <br/>
             * 
             */
            dataType: "ANS|N|Z|B",
            /**
             * @cfg {String} lengthType
             * field length type
             * 
             * 'FIX'    - fixed length <br/>
             * 'LLVAR'  - variational  length :0 -- 99 <br/>
             * 'LLLVAR' - variational  length :0 -- 999 <br/>
             * 
             */
            lengthType: "FIX|LLVAR|LLLVAR",
            /**
             * @cfg {Number} maxLength
             * field maxLength 
             */
            maxLength: 0,
            /**
             * @cfg {String} alignment
             * field alignment type
             * 
             * 'LEFT' - padding ' ' right <br/>
             * 'RIGHT' - padding '0' left <br/>
             * 
             */
            alignment: "LEFT|RIGHT",
            /**
             * @cfg {String} padding
             * field padding value
             */
            padding: '',
            /**
             * @cfg {String} describe
             * field describe 
             */
            describe: "Default"
        };


        /**
         * @class iso8583.isofield.DecorateFactory
         * DecorateFactory Constructor.
         * 
         * @param {Object} [cfg]  attribute config object
         * 
         * @return {Object} isofield decorate object
         * 
         */
        var DecorateFactory = function(attribute) {

            var attr = attribute;

            /**
             * @class iso8583.isofield.DecorateFactory.LLVarDecorate
             * LLVarDecorate Constructor.
             * 
             * @param {Object} superDecorate super decorate object
             * @param {Object} transfer json object: { data: xxx }, deliver the data out
             * 
             */
            var LLVarDecorate = function(superDecorate, transfer) {
                return {

                    /**
                     * LLVar Length decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {

                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }

                        var maxLength = (attr.dataType === 'B' || attr.dataType === 'ANS') ? attr.maxLength * 2 : attr.maxLength;

                        if (data.length > maxLength) {
                            throw Error('data.length overflow, data=[' + data + ']');
                        }

                        var lenByte = "00";

                        if (attr.dataType === 'B' || attr.dataType === 'ANS') {
                            lenByte += parseInt((data.length + 1) / 2);
                        } else {
                            lenByte += data.length;
                        }

                        //odd length padding 
                        if (data.length % 2) {
                            data += attr.padding;
                        }

                        return lenByte.slice(-2) + data;
                    },
                    /**
                     * LLVar Length recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        var lenByte = parseInt(data.slice(0, 2));

                        lenByte = (attr.dataType === 'B' || attr.dataType === 'ANS') ? lenByte * 2 : lenByte;

                        //console.log("#LLVarDecorate-recover#[" + lenByte + "]" + data.slice(2, lenByte + 2));

                        //odd length padding 
                        if (lenByte % 2) {
                            lenByte += 1;
                        }


                        //update the packet
                        if (transfer) {
                            transfer.data = data.slice(2 + lenByte);
                        }

                        return data.slice(2, lenByte + 2);
                    }
                };
            };

            /**
             * @class iso8583.isofield.DecorateFactory.LLLVarDecorate
             * LLLVarDecorate Constructor.
             * 
             * @param {Object} superDecorate super decorate object
             * @param {Object} transfer json object: { data: xxx }, deliver the data out
             * 
             */
            var LLLVarDecorate = function(superDecorate, transfer) {

                return {
                    /**
                     * LLLVar Length decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {

                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }

                        var maxLength = (attr.dataType === 'B' || attr.dataType === 'ANS') ? attr.maxLength * 2 : attr.maxLength;

                        if (data.length > maxLength) {
                            throw Error('data.length overflow, data=[' + data + ']');
                        }

                        var lenByte = "0000";

                        if (attr.dataType === 'B' || attr.dataType === 'ANS') {
                            lenByte += parseInt((data.length + 1) / 2);
                        } else {
                            lenByte += data.length;
                        }

                        //odd length padding 
                        if (data.length % 2) {
                            data += attr.padding;
                        }

                        return lenByte.slice(-4) + data;
                    },
                    /**
                     * LLLVar Length recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        var lenByte = parseInt(data.slice(0, 4));

                        lenByte = (attr.dataType === 'B' || attr.dataType === 'ANS') ? lenByte * 2 : lenByte;

                        //console.log("#LLLVarDecorate-recover#[" + lenByte + "]" + data.slice(4, lenByte + 4));

                        //odd length padding 
                        if (lenByte % 2) {
                            lenByte += 1;
                        }

                        //update the packet
                        if (transfer) {
                            transfer.data = data.slice(4 + lenByte);
                        }

                        return data.slice(4, lenByte + 4);
                    }
                };
            };

            /**
             * @class iso8583.isofield.DecorateFactory.FixLenDecorate
             * FixLenDecorate Constructor.
             * 
             * @param {Object} superDecorate super decorate object
             * @param {Object} transfer json object: { data: xxx }, deliver the data out
             * 
             */
            var FixLenDecorate = function(superDecorate, transfer) {
                return {
                    /**
                     * Fix Length decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {

                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }

                        var maxLength = (attr.dataType === 'B' || attr.dataType === 'ANS') ? attr.maxLength * 2 : attr.maxLength;

                        if (data.length > maxLength) {
                            throw Error('data.length overflow, data=[' + data + ']');
                        }

                        //odd length padding 
                        if (data.length % 2) {
                            data += attr.padding;
                        }

                        return data;
                    },
                    /**
                     * Fix Length recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        var len = (attr.dataType === 'B' || attr.dataType === 'ANS') ? attr.maxLength * 2 : attr.maxLength;

                        //update the packet
                        if (transfer) {
                            transfer.data = data.slice(len);
                        }

                        //console.log("#FixLenDecorate-recover#[" + attr.maxLength + "]" + data.slice(0, len));

                        return data.slice(0, len);
                    }
                };
            };

            /**
             * @class iso8583.isofield.DecorateFactory.AsciiDecorate
             * AsciiDecorate Constructor.
             * 
             * @param {Object} superDecorate super decorate object
             * 
             */
            var AsciiDecorate = function(superDecorate) {
                return {
                    /**
                     * Ascii data decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {
                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }

                        return utils.bcdToAsc(data, data.length);
                    },
                    /**
                     * Ascii data recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        //console.log("#AsciiDecorate-recover#" + data);

                        return utils.ascToBcd(data, data.length);
                    }
                };
            };

            /**
             * @class iso8583.isofield.DecorateFactory.MummyDecorate
             * MummyDecorate Constructor. 
             * 
             * @param {Object} superDecorate super decorate object
             * 
             */
            var MummyDecorate = function(superDecorate) {
                return {
                    /**
                     * Mummy data decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {
                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }
                        return data;
                    },
                    /**
                     * Mummy data recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        return data;
                    }
                };
            };

            /**
             * @class iso8583.isofield.DecorateFactory.LeftAlignDecorate
             * LeftAlignDecorate Constructor. 
             * 
             * @param {Object} superDecorate super decorate object
             * 
             */
            var LeftAlignDecorate = function(superDecorate) {
                return {
                    /**
                     * LeftAlign data decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {

                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }

                        if (attr.lengthType !== 'FIX') { return data; }

                        for (var i = data.length; i < attr.maxLength; i++) {
                            data += ('' + attr.padding);
                        }

                        return data;
                    },
                    /**
                     * LeftAlign data recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        // Do Nothing
                        return data;
                    }
                };
            };

            /**
             * @class iso8583.isofield.DecorateFactory.RightAlignDecorate
             * RightAlignDecorate Constructor. 
             * 
             * @param {Object} superDecorate super decorate object
             * 
             */
            var RightAlignDecorate = function(superDecorate) {
                return {
                    /**
                     * RightAlign data decorate 
                     * 
                     * @param {String} data field original data
                     */
                    decorate: function(data) {

                        if (superDecorate) {
                            data = superDecorate.decorate(data);
                        }

                        if (attr.lengthType !== 'FIX') { return data; }

                        var padding = "";

                        for (var i = 0; i < attr.maxLength - data.length; i++) {
                            padding += ('' + attr.padding);
                        }

                        return padding + data;
                    },
                    /**
                     * RightAlign data recover 
                     * 
                     * @param {String} data packet data
                     */
                    recover: function(data) {

                        if (superDecorate) {
                            data = superDecorate.recover(data);
                        }

                        // Do Nothing
                        return data;
                    }
                };
            };

            return {
                /**
                 * Get the field data decorate
                 * 
                 * @return {Object} DataDecorate (AsciiDecorate、MummyDecorate)
                 */
                getDataDecorate: function() {
                    var binding = {
                        'ANS': AsciiDecorate,
                        'N': MummyDecorate,
                        'Z': MummyDecorate,
                        'B': MummyDecorate
                    };
                    return binding[attr.dataType];
                },
                /**
                 * Get the field Length decorate
                 * 
                 * @return {Object} LengthDecorate (LLLVarDecorate、LLVarDecorate、FixLenDecorate)
                 */
                getLengthDecorate: function() {
                    var binding = {
                        'FIX': FixLenDecorate,
                        'LLVAR': LLVarDecorate,
                        'LLLVAR': LLLVarDecorate
                    };
                    return binding[attr.lengthType];
                },
                /**
                 * Get the field Align decorate
                 * 
                 * @return {Object} AlignDecorate (LeftAlignDecorate、RightAlignDecorate)
                 */
                getAlignDecorate: function() {
                    var binding = {
                        'LEFT': LeftAlignDecorate,
                        'RIGHT': RightAlignDecorate
                    };
                    return binding[attr.alignment];
                }
            };
        };

        /**
         * @class iso8583.isofield
         * DecorateFactory Constructor.
         * 
         * @param {Object} [cfg]  attribute config object
         * 
         * @return {Object} ISOField Object
         * 
         */
        var ISOField = function(attribute) {

            var attr = attribute,
                data = null;

            var decorateFactory = new DecorateFactory(attribute);
            var DataDecorate = decorateFactory.getDataDecorate();
            var AlignDecorate = decorateFactory.getAlignDecorate();
            var LengthDecorate = decorateFactory.getLengthDecorate();

            //域组包装饰器： 对齐方式 => 数据格式化 => 拼接长度
            var sealDecorates = new LengthDecorate(new DataDecorate(new AlignDecorate()));
            //域解包装饰器：剥离长度 => 数据格式化还原 => 解析对齐方式  
            var unsealDecorates = new AlignDecorate(new DataDecorate(new LengthDecorate()));

            return {
                /**
                 * Set the isofield data.
                 * @param {String} sData isofield data
                 */
                setData: function(sData) {
                    data = sData;
                },
                /**
                 * Get the isofield data.
                 * @return {String}  the isofield data
                 */
                getData: function() {
                    return data;
                },
                /**
                 * Set the isofield attribute.
                 * @return {String}  attribute the isofield attribute
                 */
                setAttr: function(attribute) {
                    attr = attribute;
                },
                /**
                 * Get the isofield attribute.
                 * @return {String}  the isofield attribute
                 */
                getAttr: function() {
                    return attr;
                },
                /**
                 * seal the isofield data <br/>
                 * 域组包装饰器： 对齐方式 => 数据格式化 => 拼接长度
                 * 
                 * @return {String}  the isofield seal data
                 */
                seal: function() {

                    console.log("#seal field-" + attr.bitNo + "# - [" + data + "]");
                    return sealDecorates.decorate(data);
                },
                /**
                 * unseal the isofield data <br/>
                 * 域解包装饰器：剥离长度 => 数据格式化还原 => 解析对齐方式
                 * 
                 * @return {String}  the isofield unseal data
                 */
                unseal: function(sPacket) {

                    var transfer = {
                        data: sPacket
                    };

                    data = unsealDecorates.recover(sPacket);
                    console.log("#unseal field-" + attr.bitNo + "# - [" + data + "]");

                    //去除已处理的报文长度
                    var lenProc = new LengthDecorate(null, transfer);
                    lenProc.recover(sPacket);

                    return transfer.data;
                }
            };
        };

        return ISOField;
    };

    /**
     * # iso8583 
     * 
     * @class iso8583.iso8583  
     * @singleton 
     * 
     * default use bitNo 0 as message type field <br/> 
     * default use bitNo 1 as bitmap  field <br/>
     * 
     * Implenment iso8583 methods
     * 
     */
    var ISO8583Service = function(utils, ISOField) {

        //Max 128 Field
        var iso8583Map = new Array(129);
        var bFields128 = false;
        var _macGenerate = null;
        var _headerDecorate = null;

        //消息类型 - !Important, Do not Change this!
        var attrMessageType = { "bitNo": 0, "dataType": "N", "lengthType": "FIX", "maxLength": 4, "alignment": "RIGHT", "padding": "0", "describe": "" };
        //BitMap - !Important, Do not Change this!
        var attrBitmap = { "bitNo": 1, "dataType": "B", "lengthType": "FIX", "maxLength": 8, "alignment": "RIGHT", "padding": "0", "describe": "" };


        /**
         * @class iso8583.iso8583.BitMap
         * BitMap Constructor.
         * Support Bitmap Api
         * 
         * @return {Object} BitMap Object
         * 
         */
        var BitMap = function() {

            var mask = "00000000000000000000000000000000";
            var bitMap = mask;

            return {
                /**
                 * init bitmap
                 * 
                 * @param {String} data data == null时清空， data != null时使用data更新bitMap
                 */
                init: function(data) {
                    if (data == null) {
                        bitMap = mask;
                    } else {
                        bitMap = data;
                    }
                },
                /**
                 * Bitmap set bitNo. value  
                 * 
                 * @param {Number} bitNo iso8583 field no.
                 * @param {Boolean} state true/false
                 */
                setBit: function(bitNo, state) {
                    if (bitNo < 2 || bitNo > 128) {
                        //throw new Error("bitNo is Error");
                        return;
                    }
                    bitMap = utils.bitSet(bitMap, bitNo - 1, state);
                },
                /**
                 * Bitmap get bitNo. value  
                 * 
                 * @param  {Number} bitNo iso8583 field no.
                 * @return {Boolean}  true/false
                 */
                checkBit: function(bitNo) {
                    if (bitNo < 2 || bitNo > 128) {
                        //throw new Error("bitNo is Error");
                        return;
                    }
                    return utils.bitGet(bitMap, bitNo - 1);
                },
                /**
                 * Bitmap to string  
                 * 
                 * @return {String} String Bitmap
                 */
                toString: function() {
                    return bitMap;
                }
            };
        };

        var bitMap = new BitMap();

        /**
         * @class iso8583.iso8583
         * ISO8583 Constructor.
         * 
         * @return {Object} iso8583 Object
         * 
         */

        /**
         * init iso8583 fields whit attributes
         * 
         * @param {Object} configs isofield attribute object array
         * Link to {@link iso8583.isofield  external class}
         */
        function init(configs) {
            var field, attr;

            for (var index in configs) {
                attr = configs[index];

                //hach: 低版本浏览器 扩展Prototype方法后数组便利最后一项为 扩展的Function -_-!!
                if (typeof attr === 'function') {
                    continue;
                }
                field = new ISOField(attr);
                iso8583Map[attr.bitNo] = field;
            }

            //Judge 128 or 64 
            if (attr.bitNo > 64) {
                bFields128 = true;
                attrBitmap.maxLength = 16;
            } else {
                bFields128 = false;
                attrBitmap.maxLength = 8;
            }

            //Load MessageType && BitMap
            iso8583Map[0] = new ISOField(attrMessageType);
            iso8583Map[1] = new ISOField(attrBitmap);
        }


        /**
         * set iso8583 MacGenerate
         * @param {Object} macGenerate Mac Generate obejct 
         * @param {Object} macGenerate.Generate  generate method 
         * @param {Object} macGenerate.verify    verify method 
         * 
         */
        function setMacGenerate(macGenerate) {
            _macGenerate = macGenerate;
        }

        /**
         * set iso8583 headerDecorate
         * @param {Object} headerDecorate Header Decorate obejct 
         * @param {Object} headerDecorate.decorate  decorate method , add tpdu + header
         * @param {Object} headerDecorate.recover   recover method, remove tpdu + header 
         * 
         */
        function setHeaderDecorate(headerDecorate) {
            _headerDecorate = headerDecorate;
        }

        /**
         * set iso8583 fields data
         * 
         * @param {Number} bitNo iso8583 field no.
         * @param {String} data  iso8583 field data.
         * 
         */
        function set(bitNo, data) {

            if (data === null || data === undefined) { return; }

            var field = iso8583Map[bitNo];
            field.setData(data);

            if (bitNo >= 2) {
                bitMap.setBit(bitNo, true);
            }
        }

        /**
         * get iso8583 fields data
         * 
         * @param {Number} bitNo iso8583 field no.
         * @return {String} iso8583 field data.
         * 
         */
        function get(bitNo) {
            var field = iso8583Map[bitNo];
            return field.getData();
        }

        /**
         * clear iso8583 fields data
         * 
         * @param {Number} bitNo iso8583 field no.
         * 
         */
        function clear(bitNo) {
            var field = iso8583Map[bitNo];
            field.setData(null);
            bitMap.setBit(bitNo, false);
        }

        /**
         * clear all iso8583 fields data
         *  
         */
        function clearAll() {
            var field;

            for (var index in iso8583Map) {
                var field = iso8583Map[index];
                if (field) {
                    field.setData(null);
                    bitMap.setBit(index, false);
                }
            }
        }

        /**
         * pack all iso8583 fields 
         * 
         * @param {Object} options pack options
         * @param {Boolean} options.isGenMac Generate Mac or not  
         * 
         * @return {String} the packed result. fieldno [0,64)  or [0, 128)
         */
        function pack(options) {
            var field, sTemp = "";

            options.isGenMac && bitMap.setBit(bFields128 ? 128 : 64, true);

            //Auto Set BitMap Data
            var lenBitMap = (bFields128) ? 16 : 8;
            iso8583Map[attrBitmap.bitNo].setData(bitMap.toString().slice(0, lenBitMap * 2));

            sTemp += iso8583Map[0].seal();
            sTemp += iso8583Map[1].seal();

            for (var index in iso8583Map) {

                //BitMap Not SetBit Continue, Mac Field Continue
                if (!bitMap.checkBit(index) || (+index === (bFields128 ? 128 : 64))) {
                    continue;
                }

                field = iso8583Map[index];
                if (field) {
                    sTemp += field.seal();
                }

                //console.log("[" + index + "]-[" + sTemp + "]");
            }

            //Mac Gen
            if (options.isGenMac) {
                var sMac = _macGenerate.generate(sTemp);
                sTemp += sMac;
            }

            //Header Gen, add Tpdu + Header
            sTemp = _headerDecorate.decorate(sTemp);

            //+ 2 bytes hex len
            var highByte = "00" + parseInt((sTemp.length / 2) / 256).toString(16);
            var lowByte = "00" + (parseInt((sTemp.length / 2)) % 256).toString(16);
            var lenBytes = highByte.slice(-2) + lowByte.slice(-2);
            sTemp = lenBytes.slice(-4) + sTemp;

            return sTemp;
        }

        /**
         * unpack and save all iso8583 fields 
         * 
         * @param {Object} options pack options
         * @param {String} options.sPacket string packet, whit 2 bytes len 、tpdu and message header 
         * @param {Boolean} options.isVerifyMac Verify Mac or Not  
         * 
         */
        function unpack(options) {
            var field, sTemp;

            //Header Recover, remove TPDU + Header
            var sPacket = _headerDecorate.recover(options.data.slice(4));

            try {
                //Unseal MessageType 
                sTemp = iso8583Map[0].unseal(sPacket);
                //Unseal Bitmap
                sTemp = iso8583Map[1].unseal(sTemp);
            } catch (e) {
                throw e;
            }

            console.log("#bitmap#" + iso8583Map[1].getData());

            bitMap.init(iso8583Map[1].getData());

            for (var index in iso8583Map) {

                //BitMap Not SetBit Continue
                if (!bitMap.checkBit(index)) {
                    continue;
                }

                field = iso8583Map[index];
                if (field) {
                    sTemp = field.unseal(sTemp);
                }
            }

            if (options.isVerifyMac) {
                var sChkMac = sPacket.slice(-16);
                sPacket = sPacket.slice(0, -16);

                //Field 39 equal to rspType A, verify mac!
                if ('00 10 11 A2 A4 A5 A6'.split(' ').indexOf(iso8583Map[39].getData()) >= 0) {
                    _macGenerate.verify(sPacket, sChkMac);
                }
            }
        }

        return {
            init: init,
            get: get,
            set: set,
            pack: pack,
            unpack: unpack,
            clear: clear,
            clearAll: clearAll,
            setMacGenerate: setMacGenerate,
            setHeaderDecorate: setHeaderDecorate,
        };
    };

    var utils = {
        arrayCopy: function(dest, offset, src, start, len) {
            for (var i = 0; i < len; i++) {
                dest[offset + i] = src[start + i];
            }
        },
        /**
         * 将hex解码成string,仅支持ascii码
         * ```
         * eg. "\x12\x34\x56" to "123456"
         * eg. "123456" to "313233343536"
         * ```
         * @param {String} raw hex数据
         * @param {Number} len 可选参数，表示截取len位hex数据长度，从左边开始
         * @param {String} dest 目标数据
         * @returns {String} 转换后数据
         */
        bcdToAsc: function(raw, len, dest) {
            var compactHex = '',
                hexChar = 0;

            if (arguments.length >= 2) {
                raw = raw.slice(0, len);
            }

            for (var i = 0; i < raw.length; i++) {
                hexChar = raw.charCodeAt(i).toString(16).toUpperCase();
                compactHex += (hexChar.length === 1 ? '0' + hexChar : hexChar);
            }

            var result = compactHex.trim();

            if (arguments.length == 3) {
                this.arrayCopy(dest, 0, result, 0, result.length);
            }

            return result;
        },
        /**
         * 将string转换成hex string输出，仅支持ascii码
         * ```
         * eg. "123456" to "\x12\x34\x56"
         * eg. "313233343536" to "123456"
         * ```
         * @param {String} raw hex数据
         * @param {Number} len 可选参数，表示截取len位hex数据长度，从左边开始
         * @param {String} dest 目标数据
         * @returns {string} 转换后数据
         */
        ascToBcd: function(raw, len, dest) {
            var charCode, hexChar,
                hexStr = [];
            if (!/[0-9a-fA-F]/m.test(raw)) {
                throw new Error('Wrong Format!');
            }

            if (raw.length % 2) {
                throw new Error('Length not times to 2');
            }

            if (arguments.length >= 2) {
                raw = raw.slice(0, len);
            }

            for (var i = 0; i < raw.length / 2; i++) {
                hexChar = raw.substr(i * 2, 2);
                charCode = parseInt(hexChar, 16);
                hexStr.push(charCode);
            }
            hexStr = String.fromCharCode.apply(null, hexStr);

            if (arguments.length == 3) {
                this.arrayCopy(dest, 0, hexStr, 0, hexStr.length);
            }

            return hexStr;
        },
        /**
         * 获取位图的位数据
         *
         * @param {String} srcStr 传入位图的hexstring 
         * @param {Number} idx 要设置的index (从0开始)
         * @returns {bit} 位数据 
         */
        bitGet: function(srcStr, idx) {
            if (idx < 0) {
                return srcStr;
            }
            var index = parseInt(idx / 4);
            var pos = idx % 4;
            if (index >= srcStr.length) {
                throw new Error("超出长度限制:" + index);
            }
            var expected = srcStr.charAt(index);
            var bit = (parseInt(expected, 16) >> (3 - pos)) & 0x01;
            return bit;
        },
        /**
         * 位图的位设置操作
         * ```
         * eg. "000000", 0, true  => "800000"
         *      位图第0位置位 即 第一字节 (0000 0000)Binary to (1000 0000)Binary
         * ```
         *
         * @param {String} srcStr 传入位图的hexstring 
         * @param {Number} idxs 要设置的index (从0开始)
         * @param {boolean} flag 是否设置,true表示设置，false表示不设置. 若常数未传递或者参数为空，则默认为true
         * @returns {String} 设置后的hexstring 
         */
        bitSet: function(srcStr, idx, flag) {
            if (idx < 0) {
                return srcStr;
            }
            var index = parseInt(idx / 4);
            var pos = idx % 4;
            if (index >= srcStr.length) {
                throw new Error("超出长度限制:" + index);
            }
            var expected = srcStr.charAt(index);
            var bit = Math.pow(2, 3 - pos);
            if (flag) {
                expected = (bit | parseInt(expected, 16)).toString(16);
            } else {
                expected = ((~bit) & parseInt(expected, 16)).toString(16);
            }

            srcStr = srcStr.substring(0, index) + expected + srcStr.substring(index + 1).toUpperCase();
            return srcStr;
        }
    };

    var ISOField = new ISOFieldFactory(utils);
    var iso8583 = new ISO8583Service(utils, ISOField);

    // export iso8583 service
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = iso8583;

    } else if (typeof requirejs === 'object' && typeof require === 'object') {
        define(function() {
            return iso8583;
        });
    } else {
        global.ISO8583 = iso8583;
    }

})(this);