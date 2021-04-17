import TypeUtil from './type-util';

/**
 * 合并className
 * @param classnames
 * @param args
 */
export default function classnames(classnames: object | any[] | string, ...args) {
  if (TypeUtil.isPlainObject(classnames)) {
    return Object.keys(classnames).filter(key => !!classnames[key]).join(' ');
  } else if (TypeUtil.isArray(classnames)) {
    /* @ts-ignore */
    return classnames.filter(Boolean).join(' ');
  } else {
    return [classnames, ...args].filter(Boolean).join(' ');
  }
}
