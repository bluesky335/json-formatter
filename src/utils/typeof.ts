export enum JsonValueType {
    string = 'string',
    boolean = 'boolean',
    number = 'number',
    object = 'object',
    array = 'array',
    null = 'null',
  }

export default function getTypeOf(value:unknown): JsonValueType {
  if (value === null) {
    return JsonValueType.null;
  }
  if (typeof value === 'boolean') {
    return JsonValueType.boolean;
  }
  if (typeof value === 'string') {
    return JsonValueType.string;
  }
  if (typeof value === 'number') {
    return JsonValueType.number;
  }
  if (value instanceof Date) {
    return JsonValueType.string;
  }
  if (value instanceof Array) {
    return JsonValueType.array;
  }
  return JsonValueType.object;
}
