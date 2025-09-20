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
      return NextResponse.json(
        { success: false, error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const result = await response.json();
    // console.log("Clerk raw result:", result);

    // Handle both cases: Clerk returns { data, total_count } OR just an array
    const users = Array.isArray(result) ? result : result?.data ?? [];

    // Use Clerk's built-in total_count if available, otherwise fallback to length
    const allCustomers =
      typeof result?.total_count === "number" ? result.total_count : users.length;

    // Calculate new customers (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newCustomers = users.filter(
      (u: any) => u.created_at && new Date(u.created_at).getTime() >= sevenDaysAgo
    ).length;

    return NextResponse.json({
      success: true,
      allCustomers,
      newCustomers,
    });
  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
