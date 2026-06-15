import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { license, rating, title, comment } = body as {
    license?: string;
    rating?: number;
    title?: string;
    comment?: string;
  };

  if (
    !license ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !comment ||
    !comment.trim()
  ) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const { data: licenseData, error: licenseError } = await supabase
    .from("licenses")
    .select("company_name, company_email, active")
    .eq("license_key", license)
    .single();

  if (licenseError || !licenseData || !licenseData.active) {
    return NextResponse.json({ error: "Licence invalide" }, { status: 404 });
  }

  const { error: insertError } = await supabase.from("feedbacks").insert({
    license_key: license,
    rating,
    title: title?.trim() || null,
    comment: comment.trim(),
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Échec de l'enregistrement du feedback" },
      { status: 500 }
    );
  }

  // Envoi de l'email à l'entreprise (best-effort : ne fait pas échouer la requête)
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "avis@resend.dev",
      to: licenseData.company_email,
      subject: `Nouveau retour client (${rating}/5) — ${licenseData.company_name}`,
      html: `
        <div style="font-family: sans-serif; color: #111;">
          <h2 style="margin: 0 0 12px;">Nouveau retour client</h2>
          <p><strong>Note :</strong> ${rating} / 5</p>
          ${title ? `<p><strong>Titre :</strong> ${title}</p>` : ""}
          <p><strong>Commentaire :</strong></p>
          <p style="white-space: pre-wrap;">${comment}</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Resend email error:", emailError);
  }

  return NextResponse.json({ success: true });
}
