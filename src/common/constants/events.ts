export const HISTORY_WAREHOUSE_EVENTS = {
  ORDER_CREATED: 'history-warehouse.order.created',
  ORDER_PAYMENT_ADDED: 'history-warehouse.order.payment_added',
  ORDER_CONFIRMED: 'history-warehouse.order.confirmed',
  ORDER_UPDATED: 'history-warehouse.order.updated',
  ORDER_DELIVERED: 'history-warehouse.order.delivered',
} as const;

export const CATALOG_EVENTS = {
  INCH_UPDATED: 'catalog.inch.updated',
  ITEM_UPDATED: 'catalog.item.updated',
  QUALITY_UPDATED: 'catalog.quality.updated',
  STYLE_UPDATED: 'catalog.style.updated',
  COLOR_UPDATED: 'catalog.color.updated',
} as const;