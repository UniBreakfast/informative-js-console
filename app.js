class NamedArray extends Array {
  static create(name, ...pairs) {
    if (typeof name != 'string') pairs.unshift(name)

    const arr = pairs.map(pair => NamedObject.create(...pair))

    if (typeof name != 'string') return new NamedArray(...arr)

    const Class = eval(`(class ${name} extends NamedArray {})`)

    return new Class(...arr)
  }

  getNames() {
    return this.map(item => item.getName())
  }
}

class NamedObject {
  static create(name, props) {
    const Class = eval(`(class ${name} extends NamedObject {})`)
    const obj = new Class

    Object.assign(obj, props)
    return obj
  }

  getName() {
    return this.__proto__.constructor.name
      .replace(/υ/g, 'u')
      .replace(/с/g, 'c')
      .replace(/о/g, 'o')
  }
}

const filingHolders = NamedArray.create('filing_holders',
  ['file', {}],
  ['folder', {}],
  ['repository', {}],
  ['workspace', {}],
  ['project', {}],
  ['userscript', {}],
  ['REPL', {}],
  ['sandbox', {}],
  ['container', {}],
  ['documentation', {}],
)

const tokenCategories = NamedArray.create('token_categories',
  ['keyword', {list: []}],
  ['identifier', {list: []}],
  ['operator', {list: []}],
  ['literal', {list: []}],
  ['punctuation', {list: []}],
  ['comment', {list: []}],
  ['whitespace', {list: []}],
)

const dataTypes = NamedArray.create('data_types',
  ['boolean', {сonstructor: Boolean}],
  ['number', {сonstructor: Number}],
  ['string', {сonstructor: String}],
  ['undefined', {the_only_value: undefined}],
  ['nυll', {the_only_value: null}],
  ['bigint', {сonstructor: BigInt}],
  ['symbol', {сonstructor: Symbol}],
  ['object', {сonstructor: Object}],
)

const bindingCategories = NamedArray.create('binding_categories',
  ['constant', {exampleLog: ``}],
  ['variable', {exampleLog: ``}],
  ['functiоn', {exampleLog: ``}],
  ['parameter', {exampleLog: ``}],
  ['property', {exampleLog: ``}],
  ['method', {exampleLog: ``}],
  ['сlass', {exampleLog: ``}],
)

const interfaces = NamedArray.create('interfaces',
  ['GUI', {}],
  ['CLI', {}],
  ['API', {}],
)

const thinkingLevels = NamedArray.create('thinking_levels',
  ['filing', {reference: filingHolders}],
  ['code', {reference: tokenCategories}],
  ['data', {reference: dataTypes}],
  ['binding', {reference: bindingCategories}],
  ['interfaсe', {reference: interfaces}],
)

window.thinkingLevels = thinkingLevels

console.log(thinkingLevels)
