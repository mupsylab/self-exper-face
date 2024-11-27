import { GenerialDictionary } from "../../../type/interface";

/**
 * Finds all of the unique items in an array.
 * @param arr The array to extract unique values from
 * @returns An array with one copy of each unique item in `arr`
 */
export function unique(arr: Array<any>) {
  return [...new Set(arr)];
}

export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    // 使用类型断言确保返回类型为 T
    const arrCopy = (obj as unknown as Array<any>).map(item => deepCopy(item));
    return arrCopy as unknown as T;
  }

  const objCopy: GenerialDictionary = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 使用类型断言确保属性值的类型正确
      objCopy[key] = deepCopy((obj as GenerialDictionary)[key]);
    }
  }

  return objCopy as T;
}

/**
 * Merges two objects, recursively.
 * @param obj1 Object to merge
 * @param obj2 Object to merge
 */
export function deepMerge(obj1: any, obj2: any): any {
  let merged: { [key: string]: any } = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === "object" && obj2.hasOwnProperty(key)) {
        merged[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        merged[key] = obj1[key];
      }
    }
  }
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!merged.hasOwnProperty(key)) {
        merged[key] = obj2[key];
      } else if (typeof obj2[key] === "object") {
        merged[key] = deepMerge(merged[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }
  }

  return merged;
}
