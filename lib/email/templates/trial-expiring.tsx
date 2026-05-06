import * as React from "react";

const green = "#4AE54A";
const dark = "#0A1A0C";
const gray = "#6B7280";

export function TrialExpiringEmail({ name, expiresAt }: { name: string; expiresAt: string }) {
  const formattedDate = new Date(expiresAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const plans = [
    { name: "Starter", price: "R$ 97/mês", desc: "50 veículos · 200 leads · 1 usuário" },
    { name: "Pro", price: "R$ 197/mês", desc: "Ilimitado · 5 usuários · IA WhatsApp", highlight: true },
    { name: "Enterprise", price: "R$ 397/mês", desc: "Ilimitado · Usuários ilimitados · API" },
  ];

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

                    {/* Urgency banner */}
                    <tr>
                      <td style={{ backgroundColor: "#FEF3C7", padding: "12px 40px", textAlign: "center" as const, borderBottom: "1px solid #FDE68A" }}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#92400E" }}>
                          ⏰ Seu período de teste expira em {formattedDate}
                        </p>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "40px" }}>
                        <h1 style={{ margin: "0 0 16px", fontSize: "26px", fontWeight: "700", color: "#111827" }}>
                          Olá, {name}!
                        </h1>
                        <p style={{ margin: "0 0 24px", fontSize: "16px", color: gray, lineHeight: "1.6" }}>
                          Seu trial do MotorGestor termina em <strong style={{ color: "#111827" }}>{formattedDate}</strong>.
                          Não perca seu progresso — assine agora e continue de onde parou com todo seu histórico preservado.
                        </p>

                        {/* Plans */}
                        <h2 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: "#111827" }}>Escolha seu plano</h2>
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: "28px" }}>
                          <tbody>
                            {plans.map(plan => (
                              <tr key={plan.name}>
                                <td style={{ padding: "0 0 10px" }}>
                                  <table cellPadding="0" cellSpacing="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td style={{
                                          padding: "16px 20px",
                                          borderRadius: "8px",
                                          border: plan.highlight ? `2px solid ${green}` : "1px solid #e5e7eb",
                                          backgroundColor: plan.highlight ? "#f0fdf4" : "#ffffff",
                                        }}>
                                          <table cellPadding="0" cellSpacing="0" width="100%">
                                            <tbody>
                                              <tr>
                                                <td>
                                                  <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "15px", color: "#111827" }}>
                                                    {plan.highlight && <span style={{ color: green }}>★ </span>}{plan.name}
                                                  </p>
                                                  <p style={{ margin: 0, fontSize: "13px", color: gray }}>{plan.desc}</p>
                                                </td>
                                                <td style={{ textAlign: "right" as const, whiteSpace: "nowrap" as const }}>
                                                  <p style={{ margin: 0, fontWeight: "700", fontSize: "16px", color: plan.highlight ? green : "#111827" }}>
                                                    {plan.price}
                                                  </p>
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
                            ))}
                          </tbody>
                        </table>

                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={{ borderRadius: "8px", backgroundColor: green }}>
                                <a
                                  href="https://www.motorgestor.com.br/app/billing"
                                  style={{ display: "inline-block", padding: "14px 32px", color: dark, fontWeight: "700", fontSize: "15px", textDecoration: "none" }}
                                >
                                  Assinar agora →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style={{ margin: "24px 0 0", fontSize: "13px", color: gray }}>
                          Após o trial, sua conta entra em modo somente leitura. Seus dados ficam preservados por 30 dias.
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
