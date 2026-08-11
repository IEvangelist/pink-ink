import { Money } from "./money";
import { Customer } from "./customer";
import { Discount } from "./discount";

export interface Order {
  id: string;
  customer: Customer;
  items: LineItem[];
  status: "pending" | "packed" | "shipped" | "cancelled";
  discount?: Discount;
  total: Money;
}

export interface LineItem {
  sku: string;
  quantity: number;
  unitPrice: Money;
  note?: string;
}

export function calculateTotal(items: LineItem[], discount?: Discount): Money {
  let total = Money.zero("USD");
  for (const item of items) {
    total = total.add(item.unitPrice.times(item.quantity));
  }
  return discount ? discount.applyTo(total) : total;
}

export function summarize(order: Order): string {
  const count = order.items.length;
  return `Order ${order.id} for ${order.customer.name} — ${count} line items`;
}

export function isShippable(order: Order): boolean {
  return order.status === "packed" && order.items.length > 0;
}
