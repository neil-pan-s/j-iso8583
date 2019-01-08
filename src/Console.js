export class Console {

  constructor() {
    this.isEnable = false

    // debug use 
    // if (process.env.NODE_ENV === 'developement') {
    //   this.isEnable = true
    // }
  }

  enable() {
    this.isEnable = true
  }

  disable() {
    this.isEnable = false
  }

  log(...args) {
    if (!this.isEnable) { return }
    console.log(...args)
  }
}

export default new Console()