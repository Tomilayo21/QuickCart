// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//     {
//         userId : { type : String, required : true, ref: 'user'},
//         items : [ 
//             {
//                 product : { type : String, required : true, ref : 'product' },
//                 quantity : { type : Number, required : true }
//             }
//         ],
//         amount : { type : Number, required : true },
//         address : { type : String, ref: 'address',  required : true },
//         status : { type : String, required : true, default: 'Order Placed' },
//         date : { type : Number, required : true },
//     }
// )

// const Order = mongoose.models.order || mongoose.model('order', orderSchema)

// export default Order






import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "address", required: true },
    status: { type: String, required: true, default: "Order Placed" },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
