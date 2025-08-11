import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Settings from "@/models/Settings";

// POST: Update or create site metadata
export async function POST(req) {
  try {
    const {
      siteTitle,
      siteDescription,
      footerDescription,
      footerPhone,
      footerEmail,
      footerName,
      supportEmail,
      socialLinks, // <-- added
    } = await req.json();

    if (!siteTitle || !siteDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const updated = await Settings.findOneAndUpdate(
      {},
      {
        siteTitle,
        siteDescription,
        footerDescription,
        footerPhone,
        footerEmail,
        footerName,
        supportEmail,
        socialLinks, // <-- added
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, settings: updated }, { status: 200 });
  } catch (err) {
    console.error("Metadata Update Error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// GET: Fetch current site metadata
export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne();

    return NextResponse.json(
      {
        siteTitle: settings?.siteTitle || "",
        siteDescription: settings?.siteDescription || "",
        footerDescription: settings?.footerDescription || "",
        footerPhone: settings?.footerPhone || "",
        footerEmail: settings?.footerEmail || "",
        footerName: settings?.footerName || "",
        supportEmail: settings?.supportEmail || "",
        socialLinks: settings?.socialLinks || [], // <-- added
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /metadata error:", err);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
