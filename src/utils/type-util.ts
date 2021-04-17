const os = Object.prototype.toString;

const getTypeOf = (arg: any) => os.call(arg).slice(8, -1).toLowerCase();

const assert = (arg: any, type: string) => getTypeOf(arg) === type;

export default class TypeUtil {
  // 属于广泛对象
  static isObject = (obj) => typeof obj === 'object';

  // 简单对象
  static isPlainObject = obj => assert(obj, 'object');

  // 没有值、空数组、空对象
  static isEmptyObject = obj => TypeUtil.isEmpty(obj) || (TypeUtil.isArray(obj) && !obj.length) || (TypeUtil.isPlainObject(obj) && !Object.keys(obj).length);

  // 属于日期类型
  static isDate = date => assert(date, 'date');

  // 属于数组类型
  static isArray = arr => assert(arr, 'array');

  // 是函数类型
  static isFunction = fun => assert(fun, 'function');

  // 是数字类型
  static isNumber = num => assert(num, 'number');

  // 是整数类型
  static isInteger = int => TypeUtil.isNumber(int) && !`${int}`.includes('.');

  static isString = str => assert(str, 'string');

  // 获取type
  static getTypeOf = getTypeOf;

  // 是 undefined
  static isUndefined = arg => arg === undefined;

  // 是 NaN
  static isNaN = arg => Number.isNaN(arg);

  // 是 null
  static isNull = arg => arg === null;

  // 没有值或者空字符
  static isEmpty = arg => ['', undefined, null].includes(arg);
}
