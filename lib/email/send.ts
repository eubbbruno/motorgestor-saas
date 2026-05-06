import { resend } from "./resend";
import { WelcomeEmail } from "./templates/welcome";
import { TrialExpiringEmail } from "./templates/trial-expiring";
import { PaymentConfirmedEmail } from "./templates/payment-confirmed";
import { PaymentFailedEmail } from "./templates/payment-failed";

const FROM = "MotorGestor <noreply@motorgestor.com.br>";

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Bem-vindo ao MotorGestor! 🚗",
    react: WelcomeEmail({ name }),
  });
}

export async function sendTrialExpiringEmail(to: string, name: string, expiresAt: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Seu período de teste termina em 3 dias ⏰",
    react: TrialExpiringEmail({ name, expiresAt }),
  });
}

export async function sendPaymentConfirmedEmail(
  to: string,
  name: string,
  plan: string,
  amount: number,
  nextBilling: string,
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Pagamento confirmado! ✅",
    react: PaymentConfirmedEmail({ name, plan, amount, nextBilling }),
  });
}

export async function sendPaymentFailedEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Problema com seu pagamento ⚠️",
    react: PaymentFailedEmail({ name }),
  });
}
