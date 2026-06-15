import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");
  const format = searchParams.get("format") === "png" ? "png" : "svg";
  const download = searchParams.get("download") === "1";

  if (!key) {
    return NextResponse.json(
      { error: "Paramètre 'key' manquant" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("licenses")
    .select("license_key, active")
    .eq("license_key", key)
    .single();

  if (error || !data || !data.active) {
    return NextResponse.json(
      { error: "Licence introuvable ou inactive" },
      { status: 404 }
    );
  }

  const reviewUrl = `${request.nextUrl.origin}/r/${key}`;

  if (format === "png") {
    const buffer = await QRCode.toBuffer(reviewUrl, {
      type: "png",
      width: 512,
      margin: 1,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        ...(download
          ? { "Content-Disposition": `attachment; filename="qr-${key}.png"` }
          : {}),
      },
    });
  }

  const svg = await QRCode.toString(reviewUrl, {
    type: "svg",
    width: 512,
    margin: 1,
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
      ...(download
        ? { "Content-Disposition": `attachment; filename="qr-${key}.svg"` }
        : {}),
    },
  });
}
