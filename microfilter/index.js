class Microfilter {
  constructor (model, logger) {
    this.model = model || {}
    this.logger = logger || console.log
    this.prepare = this.prepare.bind(this)
  }

  prepare (data = {}) {
    // if this is an array of entities
    if (data && data.length) {
      return this.collection(data)
    }

    const response = {}
    let error = null

    Object.keys(this.model).map((publicKey) => {
      const privateKey = this.model[publicKey].key
      const model = this.model[publicKey]

      let source = data[privateKey]

      // set default value if set
      if (!model.required &&
          typeof model.defaultValue !== 'undefined' &&
          !source) {
        source = typeof model.defaultValue === 'function'
          ? model.defaultValue(source, data)
          : model.defaultValue
      }

      // is the key required?
      if (model.required && !source) {
        error = `${publicKey} parameter is required`
        this.logger(error)
        return
      }

      // test the value if test exists
      if (model.test && !model.test(source)) {
        let message = `Validation error for key ${privateKey}`
        message += model.testMessage ? ': ' + model.testMessage(source) : ''
        error = message
        this.logger(message)
        return
      }

      // apply transfomations if any
      if (model.autoCorrect) {
        source = model.autoCorrect(source, data)
      }

      // apply transfomations if any
      if (model.decorator) {
        source = model.decorator(source, data)
      }

      response[publicKey] = source
    })

    return error || response
  }

  collection (arr) {
    const data = []
    arr.map((value, key) => {
      data.push(this.prepare(value))
    })
    return data
  }

  static isString (test) {
    return typeof test === 'string'
  }

  static isNumber (test) {
    return typeof test === 'number'
  }

  static isBool (test) {
    return typeof test === 'boolean'
  }
}

module.exports = Microfilter
