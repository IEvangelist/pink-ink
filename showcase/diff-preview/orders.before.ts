import { Money } from "./money";
import { Customer } from "./customer";

export interface Order {
  id: string;
  customer: Customer;
  items: LineItem[];
  status: "pending" | "shipped";
  total: Money;
}

export interface LineItem {
  sku: string;
  quantity: number;
  unitPrice: Money;
}

export function calculateTotal(items: LineItem[]): Money {
  let total = Money.zero("USD");
  for (const item of items) {
    total = total.add(item.unitPrice.times(item.quantity));
  }
  return total;
}

export function summarize(order: Order): string {
  const count = order.items.length;
  return `Order ${order.id} for ${order.customer.name}: ${count} items`;
}

export function isShippable(order: Order): boolean {
  return order.status === "pending" && order.items.length > 0;
}
