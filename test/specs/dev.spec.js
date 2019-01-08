
import ISO8583 from '@/src'
import ISO8583Factory from '../utils/factory'
import BaseSpec from '../utils/spec'

BaseSpec.run(new ISO8583Factory(ISO8583))

