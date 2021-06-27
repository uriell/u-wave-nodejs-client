export function parseDates<I extends Nested>(obj: I, paths: string[]): I {
  const newObj: I = JSON.parse(JSON.stringify(obj)) as I;

  paths.forEach((path) => {
    const subpaths = path.split('.');

    setPathValue(
      newObj,
      [...subpaths],
      new Date(getPathValue(obj, [...subpaths]))
    );
  });

  return newObj;
}

function getPathValue<I extends Nested, R>(obj: I, path: string[]): R {
  const value = obj[path[0]] as Nested | R;
  path.shift();

  if (!path.length || typeof value === 'undefined' || value === null)
    return value as R;

  return getPathValue(value as Nested, path);
}

type Nested = { [key: string]: unknown | Nested };

export function setPathValue<Value>(
  obj: Nested,
  path: string[],
  value: Value
): void {
  const subPath = path[0];

  if (path.length === 1 && subPath) {
    // eslint-disable-next-line no-param-reassign
    obj[subPath] = value;
    return;
  }

  path.shift();

  if (!obj[subPath]) {
    // eslint-disable-next-line no-param-reassign
    obj[subPath] = {};
  }

  setPathValue(obj[subPath] as Nested, path, value);
}

export function groupById<I extends { _id: string }>(
  arr: I[]
): Record<string, I> {
  return arr.reduce((acc, item) => ({ ...acc, [item._id]: item }), {});
}
