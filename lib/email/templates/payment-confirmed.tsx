import * as React from "react";

const green = "#4AE54A";
const dark = "#0A1A0C";
const gray = "#6B7280";

interface PaymentConfirmedEmailProps {
  name: string;
  plan: string;
  amount: number;
  nextBilling: string;
}

export function PaymentConfirmedEmail({ name, plan, amount, nextBilling }: PaymentConfirmedEmailProps) {
  const formattedAmount = amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formattedDate = new Date(nextBilling).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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

                    {/* Success banner */}
                    <tr>
                      <td style={{ backgroundColor: "#f0fdf4", padding: "20px 40px", textAlign: "center" as const, borderBottom: "1px solid #bbf7d0" }}>
                        <p style={{ margin: 0, fontSize: "28px" }}>✅</p>
                        <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "700", color: "#15803d" }}>
                          Pagamento confirmado!
                        </p>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "40px" }}>
                        <h1 style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "700", color: "#111827" }}>
                          Olá, {name}!
                        </h1>
                        <p style={{ margin: "0 0 28px", fontSize: "16px", color: gray, lineHeight: "1.6" }}>
                          Seu plano <strong style={{ color: "#111827" }}>{plan}</strong> foi ativado com sucesso.
                          Obrigado por escolher o MotorGestor!
                        </p>

                        {/* Details card */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: "28px" }}>
                          <tbody>
                            <tr>
                              <td style={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px" }}>
                                {[
                                  { label: "Plano", value: plan },
                                  { label: "Valor pago", value: formattedAmount },
                                  { label: "Próxima cobrança", value: formattedDate },
                                  { label: "Status", value: "Ativo ✅" },
                                ].map(row => (
                                  <table key={row.label} cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: "12px" }}>
                                    <tbody>
                                      <tr>
                                        <td style={{ fontSize: "14px", color: gray }}>{row.label}</td>
                                        <td style={{ fontSize: "14px", fontWeight: "600", color: "#111827", textAlign: "right" as const }}>{row.value}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={{ borderRadius: "8px", backgroundColor: green }}>
                                <a
                                  href="https://www.motorgestor.com.br/app"
                                  style={{ display: "inline-block", padding: "14px 32px", color: dark, fontWeight: "700", fontSize: "15px", textDecoration: "none" }}
                                >
                                  Acessar dashboard →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
