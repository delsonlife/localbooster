"use client";

import { useRef, useState } from "react";

interface EmailSignatureCardProps {
  companyName: string;
  primaryColor: string;
  reviewUrl: string;
}

export default function EmailSignatureCard({
  companyName,
  primaryColor,
  reviewUrl,
}: EmailSignatureCardProps) {
  const signatureRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!signatureRef.current) return;

    try {
      const html = signatureRef.current.innerHTML;
      const blob = new Blob([html], { type: "text/html" });
      const data = [new ClipboardItem({ "text/html": blob })];
      await navigator.clipboard.write(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const range = document.createRange();
      range.selectNode(signatureRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand("copy");
      window.getSelection()?.removeAllRanges();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-900">Signature email</p>
        <p className="mt-1 text-sm text-gray-400">
          À ajouter dans les paramètres de votre messagerie (Gmail, Outlook...).
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div ref={signatureRef}>
          <table cellPadding={0} cellSpacing={0} style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: 480 }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: "top", paddingRight: 16 }}>
                  <table cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            border: "1px dashed #c9c9c9",
                            textAlign: "center",
                            verticalAlign: "middle",
                            fontSize: 9,
                            color: "#b5b5b5",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          PHOTO /<br />LOGO
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ verticalAlign: "top", borderLeft: `2px solid ${primaryColor}`, paddingLeft: 16 }}>
                  <table cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: 15, fontWeight: "bold", color: "#0a0a0a", fontStyle: "italic", paddingBottom: 2 }}>
                          [ Prénom Nom ]
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: 12, color: "#6b6b6b", fontStyle: "italic", paddingBottom: 8 }}>
                          [ Fonction ] — {companyName || "[ Nom de l'entreprise ]"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: 12, color: "#3a3a3a", fontStyle: "italic", lineHeight: "18px", paddingBottom: 10 }}>
                          📞 [ +33 0 00 00 00 00 ]<br />
                          ✉️ [ contact@entreprise.fr ]<br />
                          🌐 [ www.entreprise.fr ]
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table cellPadding={0} cellSpacing={0}>
                            <tbody>
                              <tr>
                                <td style={{ backgroundColor: primaryColor, borderRadius: 20, padding: "8px 16px" }}>
                                  <a
                                    href={reviewUrl}
                                    style={{
                                      color: "#ffffff",
                                      fontSize: 12,
                                      fontWeight: "bold",
                                      textDecoration: "none",
                                      fontFamily: "Arial, sans-serif",
                                    }}
                                  >
                                    ⭐ Laissez-nous un avis Google
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        style={{ backgroundColor: primaryColor }}
        className="self-start rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
      >
        {copied ? "Copié !" : "Copier la signature"}
      </button>
    </div>
  );
}
