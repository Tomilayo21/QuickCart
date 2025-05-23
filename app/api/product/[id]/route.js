// pages/api/product/[id].js

// import connectDB from "@/config/db";
// import Product from "@/models/Product";
// import authSeller from "@/lib/authSeller";

// export default async function handler(req, res) {
//   await connectDB();

//   const { method, query, headers, body } = req;
//   const { id } = query;

//   // Protect DELETE and PATCH routes - only admin sellers allowed
//   if (["DELETE", "PATCH"].includes(method)) {
//     const authHeader = headers.authorization || "";
//     const token = authHeader.split(" ")[1];
//     const userId = headers.userid;

//     // Correct condition to check if token or userId is missing
//     if (!token || !userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: Missing credentials",
//       });
//     }

//     const isAdmin = await authSeller(userId);
//     if (!isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden: Admins only",
//       });
//     }
//   }

//   try {
//     if (method === "GET") {
//       const product = await Product.findById(id);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }
//       return res.status(200).json({ success: true, product });
//     }

//     if (method === "DELETE") {
//       const deleted = await Product.findByIdAndDelete(id);
//       if (!deleted) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }
//       return res.status(200).json({ success: true, message: "Product deleted" });
//     }

//     if (method === "PATCH") {
//       // Toggle visibility if requested
//       if (body.toggleVisibility) {
//         const product = await Product.findById(id);
//         if (!product) {
//           return res.status(404).json({
//             success: false,
//             message: "Product not found",
//           });
//         }
//         product.visible = !product.visible;
//         await product.save();
//         return res.status(200).json({
//           success: true,
//           message: "Product visibility toggled",
//           visible: product.visible,
//         });
//       }

//       // Otherwise, update product normally
//       const updatedProduct = await Product.findByIdAndUpdate(id, body, {
//         new: true,
//       });
//       if (!updatedProduct) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         message: "Product updated",
//         product: updatedProduct,
//       });
//     }

//     // Method Not Allowed
//     res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
//     return res.status(405).json({
//       success: false,
//       message: `Method ${method} Not Allowed`,
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }


















import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import authSeller from '@/lib/authSeller';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  const headers = Object.fromEntries(req.headers.entries());

  const authHeader = headers.authorization || '';
  const token = authHeader.split(' ')[1];
  const userId = headers.userid;

  if (!token || !userId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Missing credentials' },
      { status: 401 }
    );
  }

  const isAdmin = await authSeller(userId);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Admins only' },
      { status: 403 }
    );
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = params;
  const body = await req.json();
  const headers = Object.fromEntries(req.headers.entries());

  const authHeader = headers.authorization || '';
  const token = authHeader.split(' ')[1];
  const userId = headers.userid;

  if (!token || !userId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Missing credentials' },
      { status: 401 }
    );
  }

  const isAdmin = await authSeller(userId);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Admins only' },
      { status: 403 }
    );
  }

  try {
    if (body.toggleVisibility) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      product.visible = !product.visible;
      await product.save();
      return NextResponse.json({
        success: true,
        message: 'Product visibility toggled',
        visible: product.visible,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Product updated',
      product: updatedProduct,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
