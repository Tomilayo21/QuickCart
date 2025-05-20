// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   const userId = params.id;
//   const { role } = await req.json();

//   try {
//     const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         public_metadata: { role },
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Clerk error:", errorText);
//       return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const response = await fetch(`https://api.clerk.com/v1/users/${params.id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Delete error:", errorText);
//       return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }








import { NextRequest, NextResponse } from "next/server";

// PATCH: Update user role in Clerk
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const { role } = await req.json();

  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: { role },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clerk PATCH error:", errorText);
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove user from Clerk
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clerk DELETE error:", errorText);
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
