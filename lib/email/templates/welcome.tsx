import * as React from "react";

const green = "#4AE54A";
const dark = "#0A1A0C";
const gray = "#6B7280";

export function WelcomeEmail({ name }: { name: string }) {
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

                  {/* Header */}
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: dark, padding: "32px 40px", textAlign: "center" as const }}>
                        <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
                          <tbody>
                            <tr>
                              <td style={{ verticalAlign: "middle", paddingRight: "12px" }}>
                                <div style={{ width: "36px", height: "36px", backgroundColor: green, borderRadius: "8px", display: "inline-block" }} />
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <span style={{ color: "#ffffff", fontSize: "20px", fontWeight: "bold", letterSpacing: "-0.3px" }}>
                                  MotorGestor
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Hero */}
                    <tr>
                      <td style={{ padding: "48px 40px 32px" }}>
                        <p style={{ margin: "0 0 8px", fontSize: "14px", color: green, fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>
                          Bem-vindo ao MotorGestor 🚗
                        </p>
                        <h1 style={{ margin: "0 0 16px", fontSize: "28px", fontWeight: "700", color: "#111827", lineHeight: "1.3" }}>
                          Olá, {name}!
                        </h1>
                        <p style={{ margin: "0 0 24px", fontSize: "16px", color: gray, lineHeight: "1.6" }}>
                          Sua conta foi criada com sucesso. Agora você tem acesso à plataforma completa para gerenciar seu estoque, leads e comunicação em um só lugar.
                        </p>
                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={{ borderRadius: "8px", backgroundColor: green }}>
                                <a
                                  href="https://www.motorgestor.com.br/app"
                                  style={{ display: "inline-block", padding: "14px 32px", color: dark, fontWeight: "700", fontSize: "15px", textDecoration: "none", borderRadius: "8px" }}
                                >
                                  Acessar minha conta →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Divider */}
                    <tr>
                      <td style={{ padding: "0 40px" }}>
                        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: 0 }} />
                      </td>
                    </tr>

                    {/* Steps */}
                    <tr>
                      <td style={{ padding: "32px 40px" }}>
                        <h2 style={{ margin: "0 0 24px", fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                          Primeiros passos
                        </h2>
                        {[
                          { n: "1", title: "Cadastre seus veículos", desc: "Adicione o estoque com fotos, preços e detalhes. A IA gera as descrições automaticamente." },
                          { n: "2", title: "Importe seus leads", desc: "Cadastre manualmente ou importe via CSV. Acompanhe o funil de cada cliente." },
                          { n: "3", title: "Configure o WhatsApp", desc: "Conecte seu número Business e ative a IA para responder automaticamente." },
                        ].map(step => (
                          <table key={step.n} cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: "16px" }}>
                            <tbody>
                              <tr>
                                <td style={{ verticalAlign: "top", width: "36px", paddingRight: "16px" }}>
                                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: green, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" as const, lineHeight: "32px", color: dark, fontWeight: "700", fontSize: "14px" }}>
                                    {step.n}
                                  </div>
                                </td>
                                <td style={{ verticalAlign: "top" }}>
                                  <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "15px", color: "#111827" }}>{step.title}</p>
                                  <p style={{ margin: 0, fontSize: "14px", color: gray, lineHeight: "1.5" }}>{step.desc}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        ))}
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ backgroundColor: "#f9fafb", padding: "24px 40px", textAlign: "center" as const, borderTop: "1px solid #e5e7eb" }}>
                        <p style={{ margin: "0 0 8px", fontSize: "13px", color: gray }}>
                          <a href="https://www.motorgestor.com.br" style={{ color: green, textDecoration: "none", fontWeight: "600" }}>motorgestor.com.br</a>
                          {" "}·{" "}
                          <a href="mailto:motorgestor@gmail.com" style={{ color: gray, textDecoration: "none" }}>motorgestor@gmail.com</a>
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                          Você está recebendo este email porque criou uma conta no MotorGestor.
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
