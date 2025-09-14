import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET(request) {
    try {
        
        const { userId } = getAuth(request)

        await connectDB()

        Address.length
        Product.length

        const orders = await Order.find({ userId }).populate('address items.product')

        return NextResponse.json({ success : true, orders })
    } catch (error) {
        return NextResponse.json({ success : true, message : error.message })
        
    }
}




























// import connectDB from "@/config/db";
// import Address from "@/models/Address";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     await connectDB();

//     const { userId } = getAuth(request);
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // ✅ Fetch orders and populate both address + product
//     const orders = await Order.find({ userId })
//       .populate({
//         path: "address",
//         model: Address,
//       })
//       .populate({
//         path: "items.product",
//         model: Product,
//         select: "name offerPrice image", // only return what’s needed
//       })
//       .sort({ date: -1 }); // latest orders first

//     return NextResponse.json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("[ORDER_LIST_ERROR]", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }
