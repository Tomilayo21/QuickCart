// import connectDB from "@/config/db";
// import authSeller from "@/lib/authSeller";
// import Address from "@/models/Address";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";



// export async function GET(request) {
//     try {
        
//         const { userId } = getAuth(request)

//         const isAdmin = await authSeller(userId)

//         if (!isAdmin) {
//             return NextResponse.json({ success : false, message : 'You are not authorized to carry out this function. Kindly login as a Admin' })
//         } 

//         await connectDB()

//         Address.length

//         const orders = await Order.find({}).populate('address items.product')

//         return NextResponse.json({ success : true, orders })
//     } catch (error) {
//         return NextResponse.json({ success : false, message : error.message })
        
//     }
// }








// import connectDB from "@/config/db";
// import authSeller from "@/lib/authSeller";
// import Order from "@/models/Order";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function GET(request) {
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

//     // Populate address and product details for all orders
//     const orders = await Order.find({})
//       .populate("address") // Assuming address ref is to Address collection
//       .populate("items.product"); // Items.product references Product collection

//     return NextResponse.json({ success: true, orders });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message });
//   }
// }





import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Address from "@/models/Address";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();

    const orders = await Order.find({})
      .populate("address")
      .populate("items.product");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
