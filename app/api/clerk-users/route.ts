// app/api/clerk-users/route.ts

// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const response = await fetch("https://api.clerk.com/v1/users", {
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Clerk error:", errorText);
//       return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
//     }

//     const users = await response.json();
//     return NextResponse.json(users);
//   } catch (error: any) {
//     console.error("Server error:", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }







// // /pages/api/clerk-users/[id].ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { clerkClient } from "@clerk/nextjs/server"; // or wherever you initialize Clerk

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "PATCH") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { id } = req.query;
//   const { role } = req.body;

//   if (!id || (role !== "admin" && role !== "user")) {
//     return res.status(400).json({ error: "Invalid input" });
//   }

//   try {
//     await clerkClient.users.updateUserMetadata(String(id), {
//       publicMetadata: { role },
//     });

//     return res.status(200).json({ message: "Role updated successfully" });
//   } catch (err) {
//     console.error("Update error:", err);
//     return res.status(500).json({ error: "Failed to update user role" });
//   }
// }
















import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.clerk.com/v1/users", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clerk error:", errorText);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const users = await response.json();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
