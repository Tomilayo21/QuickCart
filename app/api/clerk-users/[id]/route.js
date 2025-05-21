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










// import { NextRequest, NextResponse } from 'next/server';

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = params;
//   const { role } = await req.json();

//   try {
//     const response = await fetch(`https://api.clerk.com/v1/users/${id}/metadata`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ public_metadata: { role } }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Clerk PATCH error:', errorText);
//       return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = params;

//   try {
//     const response = await fetch(`https://api.clerk.com/v1/users/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Clerk DELETE error:', errorText);
//       return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }








// import { NextRequest, NextResponse } from 'next/server'

// export async function PATCH(
//   req: NextRequest,
//   context: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = context.params
//   const { role } = await req.json()

//   try {
//     const response = await fetch(`https://api.clerk.com/v1/users/${id}/metadata`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ public_metadata: { role } }),
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk PATCH error:', errorText)
//       return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = context.params

//   try {
//     const response = await fetch(`https://api.clerk.com/v1/users/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//       },
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk DELETE error:', errorText)
//       return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }



















// import { NextRequest, NextResponse } from 'next/server'

// const CLERK_API_BASE = 'https://api.clerk.com/v1/users'

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = params

//   try {
//     const body = await req.json()
//     const { role } = body

//     if (!role) {
//       return NextResponse.json({ error: 'Role is required' }, { status: 400 })
//     }

//     const response = await fetch(`${CLERK_API_BASE}/${id}/metadata`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         public_metadata: { role },
//       }),
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk PATCH error:', errorText)
//       return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('PATCH Error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = params

//   try {
//     const response = await fetch(`${CLERK_API_BASE}/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//       },
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk DELETE error:', errorText)
//       return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('DELETE Error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }

















// import { NextRequest, NextResponse } from 'next/server'

// const CLERK_API_BASE = 'https://api.clerk.com/v1/users'

// // Define a type for route context params to fix ParamCheck type error
// type RouteContext = {
//   params: {
//     id: string
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   context: RouteContext
// ): Promise<NextResponse> {
//   const { id } = context.params

//   try {
//     const { role } = await req.json()

//     if (!role) {
//       return NextResponse.json({ error: 'Role is required' }, { status: 400 })
//     }

//     const response = await fetch(`${CLERK_API_BASE}/${id}/metadata`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ public_metadata: { role } }),
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk PATCH error:', errorText)
//       return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('PATCH error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: RouteContext
// ): Promise<NextResponse> {
//   const { id } = context.params

//   try {
//     const response = await fetch(`${CLERK_API_BASE}/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//       },
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk DELETE error:', errorText)
//       return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('DELETE error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }










// import { NextRequest, NextResponse } from 'next/server'

// const CLERK_API_BASE = 'https://api.clerk.com/v1/users'

// export async function PATCH(
//   req: NextRequest,
//   context: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = context.params

//   try {
//     const { role } = await req.json()

//     if (!role) {
//       return NextResponse.json({ error: 'Role is required' }, { status: 400 })
//     }

//     const response = await fetch(`${CLERK_API_BASE}/${id}/metadata`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ public_metadata: { role } }),
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk PATCH error:', errorText)
//       return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('PATCH error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = context.params

//   try {
//     const response = await fetch(`${CLERK_API_BASE}/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//       },
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk DELETE error:', errorText)
//       return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('DELETE error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }














// import { NextRequest, NextResponse } from 'next/server'

// const CLERK_API_BASE = 'https://api.clerk.com/v1/users'

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = params

//   try {
//     const { role } = await req.json()

//     if (!role) {
//       return NextResponse.json({ error: 'Role is required' }, { status: 400 })
//     }

//     const response = await fetch(`${CLERK_API_BASE}/${id}/metadata`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ public_metadata: { role } }),
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk PATCH error:', errorText)
//       return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('PATCH error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = params

//   try {
//     const response = await fetch(`${CLERK_API_BASE}/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}`,
//       },
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Clerk DELETE error:', errorText)
//       return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error: any) {
//     console.error('DELETE error:', error)
//     return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
//   }
// }








// const CLERK_API_BASE = 'https://api.clerk.com/v1/users';

// export default async function handler(req, res) {
//   const { id } = req.query;

//   if (!id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   try {
//     if (req.method === 'PATCH') {
//       const { role } = req.body;

//       if (!role) {
//         return res.status(400).json({ error: 'Role is required' });
//       }

//       const response = await fetch(`${CLERK_API_BASE}/${id}/metadata`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${process.env.CLERK_SECRET_KEY || ''}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ public_metadata: { role } }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Clerk PATCH error:', errorText);
//         return res.status(500).json({ error: 'Failed to update user role' });
//       }

//       return res.status(200).json({ success: true });
//     } else if (req.method === 'DELETE') {
//       const response = await fetch(`${CLERK_API_BASE}/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${process.env.CLERK_SECRET_KEY || ''}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Clerk DELETE error:', errorText);
//         return res.status(500).json({ error: 'Failed to delete user' });
//       }

//       return res.status(200).json({ success: true });
//     } else {
//       res.setHeader('Allow', ['PATCH', 'DELETE']);
//       return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//     }
//   } catch (error) {
//     console.error('API handler error:', error);
//     return res.status(500).json({ error: error.message || 'Server error' });
//   }
// }




import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to environment variables");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const { role } = body;
    if (!role || !["admin", "user"].includes(role)) {
      return new Response("Invalid role", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_db_name"); // Replace with your DB name
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "public_metadata.role": role } }
    );

    if (result.matchedCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Role updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Failed to update role: " + error.message, {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const client = await clientPromise;
    const db = client.db("your_db_name"); // Replace with your DB name
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Failed to delete user: " + error.message, {
      status: 500,
    });
  }
}
