export function parseDates<I>(obj: I, paths: string[]): I {
  let newObj: I = JSON.parse(JSON.stringify(obj));

  for (const path of paths) {
    const subpaths = path.split('.');

    setPathValue(
      newObj,
      [...subpaths],
      new Date(getPathValue(obj, [...subpaths]))
    );
  }

  return newObj;
}

function getPathValue<I extends Record<string, any>, R>(
  obj: I,
  path: string[]
): R {
  const value = obj[path[0]];
  path.shift();

  if (!path.length || typeof value === 'undefined' || value === null)
    return value;

  return getPathValue(value, path);
}

function setPathValue(
  obj: { [key: string]: any },
  path: string[],
  value: any
): { [key: string]: typeof value } {
  const subPath = path[0];

  if (path.length === 1 && subPath) {
    obj[subPath] = value;
    return obj;
  }

  path.shift();

  return setPathValue(obj[subPath], path, value);
}
