import fetch from 'node-fetch';

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const apiKey = (process.env.ASAAS_API_KEY || '').trim();
  const apiUrl = (process.env.ASAAS_API_URL || 'https://www.asaas.com/api/v3').trim();

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

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Chave ASAAS_API_KEY não configurada no servidor.' })
      };
    }

    // 1. Criar ou Buscar Cliente no Asaas
    const customerRes = await fetch(`${apiUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
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

    if (customerData.errors && customerData.errors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Asaas: ' + customerData.errors[0].description })
      };
    }

    const customerId = customerData.id;

    // 2. Criar Assinatura Mensal de R$ 59,00 no Asaas
    const subRes = await fetch(`${apiUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED',
        value: 59.00,
        nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        cycle: 'MONTHLY',
        description: 'Assinatura Mensal Extrator Xoxonho SP Pro - R$ 59/mês'
      })
    });

    const subData = await subRes.json();

    if (subData.errors && subData.errors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Asaas Assinatura: ' + subData.errors[0].description })
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
}
