import { DeliveryMethod } from "./deliveryMethod"

export interface Order {
  id: string
  orderDate: string
  buyerEmail: string
  shippingAddress: ShippingAddress
  shippingPrice: number
  deliveryMethod: DeliveryMethod
  paymentSummary: PaymentSummary
  orderItems: OrderItem[]
  subtotal: number
  status: string
  total: number
  paymentIntentId: string
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface PaymentSummary {
  last4: number
  brand: string
  expMonth: number
  expYear: number
}

export interface OrderItem {
  itemOrdered: ItemOrdered
  price: number
  quantity: number
  id: string
  createdDate: string
  updatedDate: string
}

export interface ItemOrdered {
  productId: string
  productName: string
  pictureUrl: string
}

export interface OrderToCreate{
    cartId : string
    shippingAddress: ShippingAddress
    deliveryMethodId: string
    paymentSummary: PaymentSummary
}