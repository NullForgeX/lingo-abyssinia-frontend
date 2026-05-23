// Mongo ObjectId as it crosses the wire — always a 24-char hex string.
export type ObjectIdString = string & { readonly __brand: 'ObjectId' };

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export const isObjectIdString = (value: unknown): value is ObjectIdString =>
  typeof value === 'string' && OBJECT_ID_RE.test(value);

export const assertObjectId = (value: string, field = 'id'): ObjectIdString => {
  if (!isObjectIdString(value)) {
    throw new Error(`Expected ${field} to be a 24-char ObjectId, got: ${value}`);
  }
  return value;
};
