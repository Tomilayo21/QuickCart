// import connectDB from "@/config/db";
// import authSeller from "@/lib/authSeller";
// import Order from "@/models/Order";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function PATCH(request) {
//   try {
//     const { userId } = getAuth(request);

//     const isAdmin = await authSeller(userId);
//     if (!isAdmin) {
//       return NextResponse.json({
//         success: false,
//         message: "You are not authorized to carry out this function. Kindly login as an Admin",
//       });
//     }

//     await connectDB();

//     const body = await request.json();
//     const { orderId, status } = body;

//     if (!orderId || !status) {
//       return NextResponse.json({
//         success: false,
//         message: "orderId and status are required",
//       });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return NextResponse.json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     order.status = status;
//     await order.save();

//     return NextResponse.json({ success: true, message: "Order status updated", order });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message });
//   }
// }







// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import { getAuth } from "@clerk/nextjs/server";
// import authSeller from "@/lib/authSeller";
// import { NextResponse } from "next/server";

// export async function PUT(request) {
//   try {
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId);

//     if (!isAdmin) {
//       return NextResponse.json({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }

//     const { orderId, newStatus } = await request.json();

//     await connectDB();

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return NextResponse.json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     order.status = newStatus;
//     await order.save();

//     return NextResponse.json({
//       success: true,
//       message: "Order status updated",
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: error.message,
//     });
//   }
// }


import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();

    const { orderId, status } = await request.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
