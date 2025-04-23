class NamedArray extends Array {
  static create(name, ...pairs) {
    if (typeof name != 'string') pairs.unshift(name)

    const arr = pairs.map(
      pair => pair instanceof NamedObject || pair instanceof NamedArray 
        ? pair : NamedObject.create(...pair)
    )

    if (typeof name != 'string') return new NamedArray(...arr)

    name = name.replace(/ /g, '_')
      
    if (doesNeedCheating(name)) name = cheat(name)

    const Class = eval(`(class ${name.replace(/ /g, '_')} extends NamedArray {
      ${arr.map((item, i) => `get ${item.getName()}() { return this[${i}] }`).join('\n')}
    })`)

    const namedArr = new Class(...arr)

    for (const item of namedArr) {
      try {
        namedArr[item.getName()] = item
      } catch {}
    }
    
    return namedArr
  }

  getName() {
    return NamedObject.prototype.getName.call(this)
  }

  getNames() {
    return this.map(item => item.getName())
  }
}

class NamedObject {
  static create(name, props) {
    name = name.replace(/ /g, '_')
      
    if (doesNeedCheating(name)) name = cheat(name)

    const Class = eval(`(class ${name.replace(/ /g, '_')} extends NamedObject {})`)
    const obj = new Class

    Object.assign(obj, props)
    return obj
  }

  getName() {
    return uncheat(this.__proto__.constructor.name)
  }
}

const cheats = {c: 'с', o: 'о', i: 'і', e: 'е', a: 'а', p: 'р', u: 'υ'}

const filingHolders = NamedArray.create('filing holders',
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

const tokenCategories = NamedArray.create('token categories',
  ['keyword', { list: [] }],
  ['identifier', { list: [] }],
  ['operator', { list: [] }],
  ['literal', { list: [] }],
  ['punctuation', { list: [] }],
  ['comment', { list: [] }],
  ['whitespace', { list: [] }],
)

const statementCategories = NamedArray.create('statement categories',
  ['declaration', { reference: 'declarationStatements' }],
  ['control flow', { reference: 'controlFlowStatements' }],
  ['expression', { reference: 'expressionCategories' }],
  ['code block', { exampleLog: `` }],
  ['error handling', { exampleLog: `` }],
  ['empty', { exampleLog: `` }],
  ['debugger', { exampleLog: `` }],
  ['with', { exampleLog: `` }],
)

const monoliterals = NamedArray.create('monoliterals',

)

const identifiers = NamedArray.create('identifiers',

)

const soloKeywords = NamedArray.create('solo keywords',

)

const structuredLiterals = NamedArray.create('structured literals',

)

const operatorExpressions = NamedArray.create('operator expressions',

)

const simpleExpressions = NamedArray.create('simple expressions',
  ['monoliteral', { reference: monoliterals }],
  ['identifier', { reference: identifiers }],
  ['solo keyword', { reference: soloKeywords }],
)

const expressionCategories = NamedArray.create('expression categories',
  ['simple expressions', { reference: simpleExpressions }],
  ['structured literals', { reference: structuredLiterals }],
  ['operator expressions', { reference: operatorExpressions }],
  ['nested expressions', { exampleLog: `` }],
)

const dataTypes = NamedArray.create('data types',
  ['boolean', { [cheat('constructor')]: Boolean }],
  ['number', { [cheat('constructor')]: Number }],
  ['string', { [cheat('constructor')]: String }],
  ['undefined', { value: undefined }],
  ['null', { value: null }],
  ['bigint', { [cheat('constructor')]: BigInt }],
  ['symbol', { [cheat('constructor')]: Symbol }],
  ['object', { [cheat('constructor')]: Object }],
)

const bindingCategories = NamedArray.create('binding categories',
  ['constant', { exampleLog: `` }],
  ['variable', { exampleLog: `` }],
  ['function', { exampleLog: `` }],
  ['parameter', { exampleLog: `` }],
  ['property', { exampleLog: `` }],
  ['method', { exampleLog: `` }],
  ['class', { exampleLog: `` }],
)

const interfaces = NamedArray.create('interfaces',
  ['GUI', {}],
  ['CLI', {}],
  ['API', {}],
)

const codeSegments = NamedArray.create('code segments',
  tokenCategories, statementCategories, expressionCategories
)

const thinkingLevels = NamedArray.create('thinking levels',
  ['filing', { reference: filingHolders }],
  ['code', { references: codeSegments }],
  ['data', { reference: dataTypes }],
  ['binding', { reference: bindingCategories }],
  ['interface', { reference: interfaces }],
)

window.thinkingLevels = thinkingLevels

console.log(thinkingLevels)

function doesNeedCheating(name) {
  try {
    eval(`class ${name} {}`)
    return false
  } catch {
    return true
  }
}

function cheat(name) {
  for (const key in cheats) {
    name = name.replace(key, cheats[key])
    if (!doesNeedCheating(name)) return name
  }
  throw new Error(`Can't cheat ${name}`)
}

function uncheat(name) {
  for (const key in cheats) {
    name = name.replace(cheats[key], key)
  }
  return name
}
