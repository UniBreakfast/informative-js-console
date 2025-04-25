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

const declarationStatements = NamedArray.create('declaration statements',
  ['variable declaration', { exampleLog: `` }],
  ['function declaration', { exampleLog: `` }],
  ['class declaration', { exampleLog: `` }],
  ['import declaration', { exampleLog: `` }],
  ['export declaration', { exampleLog: `` }],
)

const conditionals = NamedArray.create('conditionals',
  ['if else statement', { exampleLog: `` }],
  ['switch statement', { exampleLog: `` }],
)

const loops = NamedArray.create('loops',
  ['while loop', { exampleLog: `` }],
  ['do while loop', { exampleLog: `` }],
  ['classic for loop', { exampleLog: `` }],
  ['for of loop', { exampleLog: `` }],
  ['for in loop', { exampleLog: `` }],
)

const interruptions = NamedArray.create('interruptions',
  ['continue statement', { exampleLog: `` }],
  ['break statement', { exampleLog: `` }],
  ['return statement', { exampleLog: `` }],
  ['throw statement', { exampleLog: `` }],
)

const controlFlowStatements = NamedArray.create('control flow statements',
  ['conditionals', { reference: conditionals }],
  ['loops', { reference: loops }],
  ['interruptions', { reference: interruptions }],
)

const statementCategories = NamedArray.create('statement categories',
  ['declaration', { reference: declarationStatements }],
  ['control flow', { reference: controlFlowStatements }],
  ['expression', { reference: 'expressionCategories' }],
  ['code block', { exampleLog: `` }],
  ['error handling', { exampleLog: `` }],
  ['empty', { exampleLog: `` }],
  ['debugger', { exampleLog: `` }],
  ['with', { exampleLog: `` }],
)

const monoliterals = Object.assign(NamedArray.create('monoliterals',
  ['number literal', {exampleLog: ``}],
  ['string literal', {exampleLog: ``}],
  ['bigint literal', {exampleLog: ``}],
  ['regexp literal', {exampleLog: ``}],
  ['empty array literal', {exampleLog: ``}],
  ['empty object literal', {exampleLog: ``}],
  ['boolean literal', {exampleLog: ``}],
  ['null literal', {exampleLog: ``}],
  ['undefined literal', {exampleLog: ``}],
), {
  disclaimer_1: `The term 'monoliteral' is not a standard term in JavaScript. It is used here to refer to literals that are parsed as a single token. It resembles the term 'monolithic' in that it refers to a single unit. However, it is important to note that this term is not widely recognized or used in the JavaScript community. Single token literals may also be referred to as 'atomic literals' or 'simple literals', or just 'literals'.`,
  disclaimer_2: `Categorizing some of these as monoliterals is subjective and debateable. For instance, an empty array literal or an empty object literal might be considered structured literals by some, even without elements or properties. Similarly, regular expression literals could also be seen as complex, as they are constructed from regex syntax tokens and flags, even though these are not parsed as JavaScript tokens. On the other hand, boolean literals, null literals, and undefined literals might be viewed as keywords or even identifiers rather than literals.`
})

const structuredLiterals = NamedArray.create('structured literals',
  ['template literal with interpolation', { exampleLog: `` }],
  ['array literal with elements', { exampleLog: `` }],
  ['object literal with properties', { exampleLog: `` }],
  ['arrow function literal', { exampleLog: `` }],
  ['classic function literal', { exampleLog: `` }],
  ['class literal', { exampleLog: `` }],
)

const operatorExpressions = NamedArray.create('operator expressions',
  ['arithmetic expressions', { exampleLog: `` }],
  ['logical expressions', { exampleLog: `` }],
  ['comparison expressions', { exampleLog: `` }],
  ['member expressions', { exampleLog: `` }],
  ['assignment expressions', { exampleLog: `` }],
  ['call expressions', { exampleLog: `` }],
  ['bitwise expressions', { exampleLog: `` }],
  ['unary keyword expressions', { exampleLog: `` }],
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

const simpleExpressions = NamedArray.create('simple expressions',
  ['monoliteral', { reference: monoliterals }],
  ['identifier', { 
    exampleLog: ``,
    disclaimer: `Identifiers in the context of simple expressions only refer to lexical bindings, which are available in some scope and evaluated as is to read the value bound to the identifier. This means that only five out of seven binding categories are considered: constants, variables, functions, parameters and classes. Member bindings like properties and methods are left out as those require an expression mentioning the object to which those members are bound for their identifier to read them.`,
    relevantBindings: [
      bindingCategories.constant,
      bindingCategories.variable,
      bindingCategories.function,
      bindingCategories.parameter,
      bindingCategories.class,
    ],
  }],
  ['solo keyword', {
    exampleLog: ``,
    disclaimer: `NaN, Infinity, true, false, undefined and/or null debatably can also be put in this category by some if they are considered keywords`,
  }],
)

const expressionCategories = NamedArray.create('expression categories',
  ['simple expressions', { reference: simpleExpressions }],
  ['structured literals', { reference: structuredLiterals }],
  ['operator expressions', { reference: operatorExpressions }],
  ['nested expressions', { exampleLog: `` }],
)
statementCategories.expression.reference = expressionCategories

const constructor = cheat('constructor')
const dataTypes = NamedArray.create('data types',
  ['boolean', { [constructor]: Boolean }],
  ['number', { [constructor]: Number }],
  ['string', { [constructor]: String }],
  ['undefined', { value: undefined }],
  ['null', { value: null }],
  ['bigint', { [constructor]: BigInt }],
  ['symbol', { [constructor]: Symbol }],
  ['object', { [constructor]: Object }],
)

const interfaces = NamedArray.create('interfaces',
  ['GUI', {}],
  ['CLI', {}],
  ['API', {}],
)

const codeSegments = NamedArray.create('code segments',
  tokenCategories, expressionCategories, statementCategories
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
