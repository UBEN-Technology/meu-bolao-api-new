function baseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#0D0F12;font-family:'Inter',Arial,sans-serif;color:#FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" max-width="480" cellspacing="0" cellpadding="0" border="0" style="max-width:480px;width:100%;background-color:#1E2128;border-radius:16px;border:1px solid #2A2E38;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;background:linear-gradient(135deg,#FF6B00,#FF8533);">
              <h1 style="margin:0;font-family:'Bebas Neue',Arial,sans-serif;font-size:28px;letter-spacing:2px;color:#FFFFFF;text-transform:uppercase;">MEU BOLÃO</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;text-align:center;border-top:1px solid #2A2E38;">
              <p style="margin:0;font-size:12px;color:#6B7280;">© ${new Date().getFullYear()} Meu Bolão. Todos os direitos reservados.</p>
              <p style="margin:8px 0 0;font-size:12px;color:#6B7280;">meubolao.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, text: string, color: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px auto;">
    <tr>
      <td style="border-radius:8px;background:${color};text-align:center;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;text-transform:uppercase;letter-spacing:1px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

export function passwordResetTemplate(resetUrl: string): string {
  const content = `
    <h2 style="margin:0 0 16px;font-family:'Bebas Neue',Arial,sans-serif;font-size:24px;color:#FFFFFF;letter-spacing:1px;">REDEFINIR SENHA</h2>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#A0A8B8;">Recebemos uma solicitação para redefinir a senha da sua conta no Meu Bolão. Clique no botão abaixo para criar uma nova senha.</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#A0A8B8;">Este link expira em 1 hora.</p>
    ${button(resetUrl, 'Redefinir Senha', 'linear-gradient(135deg,#FF6B00,#FF8533)')}
    <p style="margin:16px 0 0;font-size:12px;color:#6B7280;text-align:center;">Se você não solicitou esta redefinição, ignore este email.</p>
  `;
  return baseLayout('Redefinição de Senha', content);
}

export function emailConfirmationTemplate(confirmUrl: string): string {
  const content = `
    <h2 style="margin:0 0 16px;font-family:'Bebas Neue',Arial,sans-serif;font-size:24px;color:#FFFFFF;letter-spacing:1px;">CONFIRME SUA CONTA</h2>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#A0A8B8;">Bem-vindo ao Meu Bolão! Clique no botão abaixo para confirmar seu email e começar a jogar.</p>
    ${button(confirmUrl, 'Confirmar Email', '#00D26A')}
    <p style="margin:16px 0 0;font-size:12px;color:#6B7280;text-align:center;">Se você não criou uma conta, ignore este email.</p>
  `;
  return baseLayout('Confirme sua Conta', content);
}

export function depositReceiptTemplate(data: { amount: number; transactionId: string; balance: number; date: Date }): string {
  const content = `
    <h2 style="margin:0 0 16px;font-family:'Bebas Neue',Arial,sans-serif;font-size:24px;color:#00D26A;letter-spacing:1px;">✓ DEPÓSITO CONFIRMADO</h2>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#A0A8B8;">Seu depósito via PIX foi confirmado com sucesso.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#14161B;border-radius:12px;border:1px solid #2A2E38;">
      <tr><td style="padding:16px 20px;border-bottom:1px solid #2A2E38;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Valor</span><p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#FFFFFF;font-family:'JetBrains Mono',monospace;">R$ ${data.amount.toFixed(2)}</p></td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #2A2E38;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">ID da Transação</span><p style="margin:4px 0 0;font-size:14px;color:#A0A8B8;font-family:'JetBrains Mono',monospace;">${data.transactionId}</p></td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #2A2E38;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Data</span><p style="margin:4px 0 0;font-size:14px;color:#A0A8B8;">${data.date.toLocaleString('pt-BR')}</p></td></tr>
      <tr><td style="padding:16px 20px;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Novo Saldo</span><p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#00D26A;font-family:'JetBrains Mono',monospace;">R$ ${data.balance.toFixed(2)}</p></td></tr>
    </table>
    ${button(`${ENVS.FRONTEND_URL}/wallet`, 'Ver Carteira', 'linear-gradient(135deg,#FF6B00,#FF8533)')}
  `;
  return baseLayout('Depósito Confirmado', content);
}

export function withdrawalReceiptTemplate(data: { amount: number; pixKey: string; balance: number; date: Date }): string {
  const content = `
    <h2 style="margin:0 0 16px;font-family:'Bebas Neue',Arial,sans-serif;font-size:24px;color:#FF6B00;letter-spacing:1px;">SAQUE SOLICITADO</h2>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#A0A8B8;">Seu saque foi solicitado e será processado em breve.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#14161B;border-radius:12px;border:1px solid #2A2E38;">
      <tr><td style="padding:16px 20px;border-bottom:1px solid #2A2E38;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Valor</span><p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#FFFFFF;font-family:'JetBrains Mono',monospace;">R$ ${data.amount.toFixed(2)}</p></td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #2A2E38;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Chave PIX</span><p style="margin:4px 0 0;font-size:14px;color:#A0A8B8;font-family:'JetBrains Mono',monospace;">${data.pixKey}</p></td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #2A2E38;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Data</span><p style="margin:4px 0 0;font-size:14px;color:#A0A8B8;">${data.date.toLocaleString('pt-BR')}</p></td></tr>
      <tr><td style="padding:16px 20px;"><span style="font-size:12px;color:#6B7280;text-transform:uppercase;">Saldo Restante</span><p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#A0A8B8;font-family:'JetBrains Mono',monospace;">R$ ${data.balance.toFixed(2)}</p></td></tr>
    </table>
  `;
  return baseLayout('Saque Solicitado', content);
}

// Import necessário para o template usar a env
import { ENVS } from '@/utils';
