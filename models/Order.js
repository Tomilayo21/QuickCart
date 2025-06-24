import mongoose from 'mongoose';

function generateOrderId() {
  const prefix = "ORD-";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomString = [...Array(12)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
  return prefix + randomString;
}

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: generateOrderId,
  },
  userId: { type: String, required: true, ref: 'user' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  amount: { type: Number, required: true, min: 0 },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true },
  date: { type: Date, required: true, default: Date.now },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'apple', 'google', 'amazon', 'bank-transfer', 'crypto', 'mpesa', 'paytm', 'cash-on-delivery'],
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  proofOfPaymentUrl: { type: String },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed', 'Refunded'],
  },
  trackingNumber: String,
  shippingCarrier: String,
  shippingLabelUrl: String,
  deliveryStatus: {
    type: String,
    enum: ["Pending", "Shipped", "In Transit", "Delivered", "Cancelled"],
    default: "Pending"
  }

}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
