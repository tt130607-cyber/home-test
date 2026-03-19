function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object' || typeof obj === 'function') {
    return obj;
  }

  if (cache.has(obj)) return cache.get(obj);
  let copy;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  
  if (obj instanceof Set) {
    copy = new Set();
    cache.set(obj, copy);
    obj.forEach(v => copy.add(deepClone(v, cache)));
    return copy;
  }

  if (obj instanceof Map) {
    copy = new Map();
    cache.set(obj, copy);
    obj.forEach((v, k) => copy.set(deepClone(k, cache), deepClone(v, cache)));
    return copy;
  }

  copy = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  cache.set(obj, copy);

  Reflect.ownKeys(obj).forEach(key => {
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc.get || desc.set) {
      Object.defineProperty(copy, key, desc);
    } else {
      Object.defineProperty(copy, key, {
        ...desc,
        value: deepClone(obj[key], cache)
      });
    }
  });

  return copy;
}

const original = { a: 1, b: { c: 2 }, d: new Date(), s: new Set([10]) };
original.self = original;

const copy = deepClone(original);
console.log(copy !== original && copy.self === copy);
