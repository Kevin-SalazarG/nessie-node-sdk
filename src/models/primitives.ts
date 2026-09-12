import * as v from "valibot";

// The API specifies length, not a hexadecimal format.
export const idSchema = v.pipe(v.string(), v.length(24));
export const finiteNumberSchema = v.pipe(v.number(), v.finite());
export const integerSchema = v.pipe(v.number(), v.integer());
export const nonNegativeIntegerSchema = v.pipe(integerSchema, v.minValue(0));
export const accountNumberSchema = v.pipe(v.string(), v.length(16));
export const dayOfMonthSchema = v.pipe(integerSchema, v.minValue(1), v.maxValue(31));
