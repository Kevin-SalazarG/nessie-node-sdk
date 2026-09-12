import assert from "node:assert/strict";
import { test } from "node:test";
import * as v from "valibot";
import { accountCreateSchema } from "../src/models/accounts.js";
import { billCreateSchema } from "../src/models/bills.js";
import { customerSchema, customerUpdateSchema } from "../src/models/customers.js";
import { merchantCreateSchema, merchantSchema } from "../src/models/merchants.js";
import { purchaseCreateSchema } from "../src/models/purchases.js";
import { transferCreateSchema } from "../src/models/transfers.js";
import { withdrawalCreateSchema } from "../src/models/withdrawals.js";
import { customer, merchant, parentId } from "./fixtures.js";

test("rejects numbers that JSON cannot represent", () => {
  for (const amount of [NaN, Infinity, -Infinity]) {
    assert(
      !v.safeParse(billCreateSchema, { status: "pending", payee: "Power", payment_amount: amount })
        .success,
    );
    assert(
      !v.safeParse(purchaseCreateSchema, { merchant_id: parentId, medium: "balance", amount })
        .success,
    );
    assert(
      !v.safeParse(transferCreateSchema, { payee_id: parentId, medium: "balance", amount }).success,
    );
    assert(!v.safeParse(withdrawalCreateSchema, { medium: "balance", amount }).success);
  }
});

test("validates enums, integer fields, nested objects and partial updates", () => {
  assert(
    !v.safeParse(accountCreateSchema, { type: "Wallet", nickname: "x", rewards: 0, balance: 1 })
      .success,
  );
  assert(
    !v.safeParse(accountCreateSchema, { type: "Checking", nickname: "x", rewards: 0, balance: 1.2 })
      .success,
  );
  assert(!v.safeParse(customerSchema, { ...customer, address: { city: "Arlington" } }).success);
  assert.deepEqual(v.parse(customerUpdateSchema, { first_name: "Updated" }), {
    first_name: "Updated",
  });
  assert(!v.safeParse(customerUpdateSchema, { first_name: null }).success);
});

test("accepts documented merchant category variants only on responses", () => {
  assert.deepEqual(v.parse(merchantSchema, { ...merchant, category: ["food"] }).category, ["food"]);
  assert(!v.safeParse(merchantCreateSchema, { name: "Store", category: ["food"] }).success);
});

test("allows additional response fields without exposing unvalidated values", () => {
  const result = v.parse(customerSchema, { ...customer, future_field: true });
  assert.deepEqual(result, customer);
  assert(!("future_field" in result));
});
