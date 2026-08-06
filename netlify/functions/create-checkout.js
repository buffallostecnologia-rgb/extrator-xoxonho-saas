const fetch = require('node-fetch');

// Asaas API Key vem das Variáveis de Ambiente do Netlify (process.env.ASAAS_API_KEY)
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://www.asaas.com/api/v3";

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, cpfCnpj, mobilePhone } = data;

    if (!name || !email || !cpfCnpj) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nome, E-mail e CPF/CNPJ são obrigatórios.' })
      };
    }

    if (!ASAAS_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuração ASAAS_API_KEY não encontrada no servidor.' })
      };
    }

    // 1. Criar ou Buscar Cliente no Asaas
    const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify({
        name,
        email,
        cpfCnpj: cpfCnpj.replace(/\D/g, ''),
        mobilePhone: mobilePhone ? mobilePhone.replace(/\D/g, '') : undefined,
        notificationDisabled: false
      })
    });

    const customerData = await customerRes.json();

    if (customerData.errors) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: customerData.errors[0].description })
      };
    }

    const customerId = customerData.id;

    // 2. Criar Assinatura Mensal de R$ 59,00 no Asaas
    const subRes = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED', // Permite PIX, Cartão de Crédito ou Boleto
        value: 59.00,
        nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        cycle: 'MONTHLY',
        description: 'Assinatura Mensal Extrator Xoxonho SP Pro - R$ 59/mês'
      })
    });

    const subData = await subRes.json();

    if (subData.errors) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: subData.errors[0].description })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        invoiceUrl: subData.invoiceUrl || `https://www.asaas.com/i/${subData.id}`,
        subscriptionId: subData.id,
        customerId: customerId
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno no servidor de pagamento: ' + err.message })
    };
  }
};
