import { customType } from 'drizzle-orm/sqlite-core';

export const vector = customType<{
  data: ArrayBuffer;
  config: { length: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    const length = config?.length ?? 1;
    return `F32_BLOB(${length})`;
  },
  fromDriver(value) {
    const arrayBuffer = value.buffer as ArrayBuffer;
    return arrayBuffer;
  },
  toDriver(value) {
    const buffer = Buffer.from(value);
    return buffer;
  },
});
