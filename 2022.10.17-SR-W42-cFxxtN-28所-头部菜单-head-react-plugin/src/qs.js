import qs from 'querystringify';

export const cleanObject = obj =>
  Object.entries(obj).reduce(
    (prev, [key, value]) =>
      value === undefined ? prev : { ...prev, [key]: value },
    {}
  );
export const stringify = (query, suffix) =>
  qs.stringify(cleanObject(query), suffix);
