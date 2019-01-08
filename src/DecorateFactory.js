import AsciiDecorator from './decorators/AsciiDecorator'
import MummyDecorator from './decorators/MummyDecorator'
import FixLenDecorator from './decorators/FixLenDecorator'
import LLVarDecorator from './decorators/LLVarDecorator'
import LLLVarDecorator from './decorators/LLLVarDecorator'
import LeftAlignDecorator from './decorators/LeftAlignDecorator'
import RightAlignDecorator from './decorators/RightAlignDecorator'

export default class DecoratorFactory {

  /**
   * Creates an instance of DecoratorFactory.
   * @param {Object} attribute - isofiled attribute via $ISOFieldFactory.$attribute
   * @memberof DecoratorFactory
   */
  constructor(attribute) {
    this.attr = attribute
  }

  /**
   * Get the field data Decorator
   *
   * @returns {Object} DataDecorator (AsciiDecorator、MummyDecorator)
   * @memberof DecoratorFactory
   */
  getDataDecorator() {
    const binding = {
      ANS: AsciiDecorator,
      N: MummyDecorator,
      Z: MummyDecorator,
      B: MummyDecorator,
    }
    return binding[this.attr.dataType]
  }

  /**
   * Get the field Length Decorator
   *
   * @return {Object} LengthDecorator (LLLVarDecorator、LLVarDecorator、FixLenDecorator)
   */
  getLengthDecorator() {
    const binding = {
      FIX: FixLenDecorator,
      LLVAR: LLVarDecorator,
      LLLVAR: LLLVarDecorator,
    }
    return binding[this.attr.lengthType]
  }

  /**
   * Get the field Align Decorator
   *
   * @return {Object} AlignDecorator (LeftAlignDecorator、RightAlignDecorator)
   */
  getAlignDecorator() {
    const binding = {
      LEFT: LeftAlignDecorator,
      RIGHT: RightAlignDecorator,
    }
    return binding[this.attr.alignment]
  }
}
