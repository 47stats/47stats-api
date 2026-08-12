export type JsonPrimitive = string | number | boolean | null | undefined;
export type JsonArray = JsonPrimitive[] | JsonObject[];
export type JsonObject = {
  [K: string]: JsonPrimitive | JsonObject | JsonArray;
};
export type Json = JsonPrimitive | JsonArray | JsonObject;
