import * as React from "react";

const green = "#4AE54A";
const dark = "#0A1A0C";
const gray = "#6B7280";

export function ResetPasswordTemplate({ resetUrl }: { resetUrl: string }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f4f4f5", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: "#f4f4f5", padding: "40px 16px" }}>
          <tbody>
            <tr>
              <td align="center">
                <table width="600" cellPadding="0" cellSpacing="0" style={{ backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td style={{ backgroundColor: dark, padding: "32px 40px", textAlign: "center" as const }}>
                        <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
                          <tbody>
                            <tr>
                              <td style={{ verticalAlign: "middle", paddingRight: "12px" }}>
                                <div style={{ width: "36px", height: "36px", backgroundColor: green, borderRadius: "8px", display: "inline-block" }} />
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <span style={{ color: "#ffffff", fontSize: "20px", fontWeight: "bold" }}>MotorGestor</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "48px 40px 40px", textAlign: "center" as const }}>
                        <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔐</div>
                        <h1 style={{ margin: "0 0 12px", fontSize: "26px", fontWeight: "700", color: "#111827" }}>
                          Redefinir senha
                        </h1>
                        <p style={{ margin: "0 0 32px", fontSize: "16px", color: gray, lineHeight: "1.6", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>
                          Recebemos uma solicitação para redefinir a senha da sua conta no MotorGestor. Clique no botão abaixo para criar uma nova senha.
                        </p>

                        {/* CTA Button */}
                        <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto 32px" }}>
                          <tbody>
                            <tr>
                              <td style={{ borderRadius: "10px", backgroundColor: green }}>
                                <a
                                  href={resetUrl}
                                  style={{ display: "inline-block", padding: "16px 40px", color: dark, fontWeight: "700", fontSize: "16px", textDecoration: "none", borderRadius: "10px" }}
                                >
                                  Redefinir senha →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Expiry + security notice */}
                        <div style={{ display: "inline-block", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "12px 20px", marginBottom: "24px" }}>
                          <p style={{ margin: 0, fontSize: "13px", color: gray }}>
                            ⏳ Este link expira em <strong style={{ color: "#111827" }}>1 hora</strong>
                          </p>
                        </div>

                        {/* Security message */}
                        <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FDE68A", padding: "14px 20px" }}>
                          <p style={{ margin: 0, fontSize: "13px", color: "#92400E" }}>
                            🔒 Se você não solicitou a redefinição de senha, ignore este email. Sua conta permanece segura.
                          </p>
                        </div>

                        {/* Fallback link */}
                        <p style={{ margin: "28px 0 0", fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>
                          Se o botão não funcionar, copie e cole este link no navegador:
                          <br />
                          <a href={resetUrl} style={{ color: green, textDecoration: "none", wordBreak: "break-all" as const, fontSize: "11px" }}>
                            {resetUrl}
                          </a>
                        </p>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ backgroundColor: "#f9fafb", padding: "20px 40px", textAlign: "center" as const, borderTop: "1px solid #e5e7eb" }}>
                        <p style={{ margin: "0 0 6px", fontSize: "12px", color: gray }}>
                          <a href="https://www.motorgestor.com.br" style={{ color: green, textDecoration: "none", fontWeight: "600" }}>motorgestor.com.br</a>
                          {" "}·{" "}
                          <a href="mailto:motorgestor@gmail.com" style={{ color: gray, textDecoration: "none" }}>motorgestor@gmail.com</a>
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
                          Se você não solicitou redefinição de senha, ignore este email.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
