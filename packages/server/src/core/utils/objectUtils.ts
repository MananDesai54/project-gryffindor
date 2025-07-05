export class ObjectUtils {
  static flattenObject(obj: object, parentKey = '', result = {}) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (
          typeof obj[key] === 'object' &&
          !Array.isArray(obj[key]) &&
          obj[key] !== null
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          this.flattenObject(obj[key], newKey, result);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  }
}
