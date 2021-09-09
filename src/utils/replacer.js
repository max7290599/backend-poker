module.exports = function replacer(key, value) {
  if (value instanceof Map) {
    const reducer = (obj, mapKey) => {
      obj[mapKey] = value.get(mapKey);
      return obj;
    };
    return [...value.keys()].sort().reduce(reducer, {});
  } else if (value instanceof Set) {
    return [...value].sort();
  }
  return value;
}