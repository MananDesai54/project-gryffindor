import { differenceBy, isObject } from 'lodash';

export class ArrayUtils {
  static calculateIdDiff<T>(
    oldArr: T[],
    newArr: T[],
    idSelector: (item: T) => string = (item) => {
      if (isObject(item) && item !== null && 'id' in (item as any)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return String((item as any).id);
      }
      return String(item);
    },
  ): { added: T[]; removed: T[] } {
    const added = differenceBy(newArr, oldArr, idSelector);
    const removed = differenceBy(oldArr, newArr, idSelector);

    return { added, removed };
  }
}
