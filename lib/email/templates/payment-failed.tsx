import * as React from "react";

const green = "#4AE54A";
const dark = "#0A1A0C";
const gray = "#6B7280";

export function PaymentFailedEmail({ name }: { name: string }) {
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

                    {/* Warning banner */}
                    <tr>
                      <td style={{ backgroundColor: "#FEF2F2", padding: "20px 40px", textAlign: "center" as const, borderBottom: "1px solid #FECACA" }}>
                        <p style={{ margin: 0, fontSize: "28px" }}>⚠️</p>
                        <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "700", color: "#DC2626" }}>
                          Problema com seu pagamento
                        </p>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "40px" }}>
                        <h1 style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "700", color: "#111827" }}>
                          Olá, {name}!
                        </h1>
                        <p style={{ margin: "0 0 16px", fontSize: "16px", color: gray, lineHeight: "1.6" }}>
                          Não conseguimos processar seu pagamento. Isso pode acontecer por alguns motivos:
                        </p>
                        <ul style={{ margin: "0 0 24px", paddingLeft: "20px", color: gray, fontSize: "15px", lineHeight: "1.8" }}>
                          <li>Saldo insuficiente no cartão</li>
                          <li>Cartão expirado ou dados incorretos</li>
                          <li>Limite de crédito atingido</li>
                          <li>Transação bloqueada pelo banco</li>
                        </ul>
                        <p style={{ margin: "0 0 28px", fontSize: "15px", color: gray, lineHeight: "1.6" }}>
                          Atualize sua forma de pagamento para manter acesso ao MotorGestor sem interrupções.
                        </p>

                        <table cellPadding="0" cellSpacing="0" style={{ marginBottom: "24px" }}>
                          <tbody>
                            <tr>
                              <td style={{ borderRadius: "8px", backgroundColor: green }}>
                                <a
                                  href="https://www.motorgestor.com.br/app/billing"
                                  style={{ display: "inline-block", padding: "14px 32px", color: dark, fontWeight: "700", fontSize: "15px", textDecoration: "none" }}
                                >
                                  Atualizar forma de pagamento →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style={{ margin: 0, fontSize: "14px", color: gray }}>
                          Precisa de ajuda?{" "}
                          <a href="mailto:suporte@motorgestor.com.br" style={{ color: green, textDecoration: "none", fontWeight: "600" }}>
                            suporte@motorgestor.com.br
                          </a>
                        </p>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ backgroundColor: "#f9fafb", padding: "24px 40px", textAlign: "center" as const, borderTop: "1px solid #e5e7eb" }}>
                        <p style={{ margin: "0 0 8px", fontSize: "13px", color: gray }}>
                          <a href="https://www.motorgestor.com.br" style={{ color: green, textDecoration: "none", fontWeight: "600" }}>motorgestor.com.br</a>
                          {" "}·{" "}
                          <a href="mailto:suporte@motorgestor.com.br" style={{ color: gray, textDecoration: "none" }}>suporte@motorgestor.com.br</a>
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
