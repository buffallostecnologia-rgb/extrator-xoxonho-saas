// Webhook do Asaas para confirmação automática de pagamentos
const WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const token = event.headers['asaas-access-token'] || event.headers['access-token'];
    const body = JSON.parse(event.body || '{}');
    const { event: eventType, payment } = body;

    console.log(`[ASAAS WEBHOOK] Evento recebido: ${eventType}`, payment ? payment.id : '');

    if (eventType === 'PAYMENT_RECEIVED' || eventType === 'PAYMENT_CONFIRMED') {
      console.log(`✅ Pagamento confirmado no Asaas! Valor: R$ ${payment.value} | Cliente: ${payment.customer}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
