import { Pool } from 'pg';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

let pool = null;

function getPool(env) {
  if (!pool) {
    const dbUrl = env.COCKROACH_DB_URL || "postgresql://Buffallos_Tecnologia:WpAB2ws1UUPDd0GoC44jDA@saas-xoxonho-db-31345.j77.aws-us-west-2.cockroachlabs.cloud:26257/defaultdb";
    pool = new Pool({
      connectionString: dbUrl.split('?')[0],
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 8000
    });
  }
  return pool;
}

// ─── Rota: GET /get-empresas ──────────────────────────────────────────────────
async function handleGetEmpresas(request, env) {
  const url = new URL(request.url);
  const q = url.searchParams;

  // Rota de estatísticas (cached)
  if (q.get('stats') === 'true') {
    return Response.json({
      total: 7474256,
      comWhatsapp: 2892296,
      comSite: 2358194,
      meiMe: 5420000
    }, { headers: CORS_HEADERS });
  }

  const db = getPool(env);

  const cidade     = (q.get('cidade') || '').trim();
  const cnae       = (q.get('cnae') || '').trim();
  const comWhatsapp = q.get('comWhatsapp') === 'true';
  const comWebsite  = q.get('comWebsite') === 'true';
  const porte       = (q.get('porte') || '').trim();
  const bairro      = (q.get('bairro') || '').trim();
  const minCapital  = parseFloat(q.get('minCapital') || '0');
  const page        = parseInt(q.get('page') || '1', 10);
  const limit       = parseInt(q.get('limit') || '10', 10);
  const offset      = (page - 1) * limit;

  let where = ['ativa = TRUE'];
  let vals  = [];
  let idx   = 1;

  if (cidade)     { where.push(`LOWER(cidade) LIKE LOWER($${idx})`);                                                     vals.push(`%${cidade}%`);  idx++; }
  if (cnae)       { where.push(`(cnae LIKE $${idx} OR LOWER(segmento) LIKE LOWER($${idx}))`);                            vals.push(`%${cnae}%`);    idx++; }
  if (comWhatsapp){ where.push(`whatsapp IS NOT NULL AND whatsapp != '' AND LOWER(whatsapp) NOT IN ('nan','null')`); }
  if (comWebsite) { where.push(`site IS NOT NULL AND site != '' AND LOWER(site) NOT IN ('nan','null','none')`); }
  if (porte)      { where.push(`porte = $${idx}`);                                                                       vals.push(porte);          idx++; }
  if (bairro)     { where.push(`LOWER(bairro) LIKE LOWER($${idx})`);                                                     vals.push(`%${bairro}%`);  idx++; }
  if (minCapital > 0) { where.push(`capital_social >= $${idx}`);                                                         vals.push(minCapital);     idx++; }

  const whereClause = `WHERE ${where.join(' AND ')}`;

  try {
    const [countRes, dataRes] = await Promise.all([
      db.query(`SELECT count(1) as count FROM (SELECT 1 FROM public.empresas ${whereClause} LIMIT 10000) AS c`, vals),
      db.query(
        `SELECT cnpj, razao_social, nome_fantasia, proprietario, cidade, bairro,
                telefone, whatsapp, site, email, cnae, segmento, porte, capital_social
         FROM public.empresas ${whereClause}
         ORDER BY id DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...vals, limit, offset]
      )
    ]);

    return Response.json({
      total: parseInt(countRes.rows[0].count, 10),
      page, limit,
      data: dataRes.rows
    }, { headers: CORS_HEADERS });

  } catch (err) {
    return Response.json({ total: 0, page: 1, limit, data: [], error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

// ─── Rota: POST /test-gemini ──────────────────────────────────────────────────
async function handleTestGemini(request) {
  const { apiKey } = await request.json();
  if (!apiKey?.trim()) {
    return Response.json({ success: false, message: 'Chave não fornecida.' }, { headers: CORS_HEADERS });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Responda apenas OK.' }] }] })
    }
  );

  const data = await res.json();
  if (!res.ok) {
    return Response.json({ success: false, message: `Erro Google API: ${data?.error?.message || 'Chave inválida.'}` }, { headers: CORS_HEADERS });
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) {
    return Response.json({ success: true, message: '✅ API Validada com sucesso! O Consultor IA está pronto.' }, { headers: CORS_HEADERS });
  }
  return Response.json({ success: false, message: 'Sem resposta do Google.' }, { headers: CORS_HEADERS });
}

// ─── Rota: POST /create-checkout ─────────────────────────────────────────────
async function handleCreateCheckout(request, env) {
  const { name, email, cpfCnpj, mobilePhone } = await request.json();
  const apiKey = (env.ASAAS_API_KEY || '').trim();
  const apiUrl = (env.ASAAS_API_URL || 'https://www.asaas.com/api/v3').trim();

  if (!name || !email || !cpfCnpj) {
    return Response.json({ error: 'Nome, E-mail e CPF/CNPJ são obrigatórios.' }, { status: 400, headers: CORS_HEADERS });
  }
  if (!apiKey) {
    return Response.json({ error: 'ASAAS_API_KEY não configurada.' }, { status: 500, headers: CORS_HEADERS });
  }

  try {
    const custRes = await fetch(`${apiUrl}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'access_token': apiKey },
      body: JSON.stringify({ name, email, cpfCnpj: cpfCnpj.replace(/\D/g, ''), mobilePhone: mobilePhone?.replace(/\D/g, '') })
    });
    const custData = await custRes.json();
    if (custData.errors?.length) return Response.json({ error: custData.errors[0].description }, { status: 400, headers: CORS_HEADERS });

    const subRes = await fetch(`${apiUrl}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'access_token': apiKey },
      body: JSON.stringify({
        customer: custData.id, billingType: 'UNDEFINED', value: 59.00,
        nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        cycle: 'MONTHLY', description: 'Assinatura Mensal Extrator Xoxonho SP Pro - R$ 59/mês'
      })
    });
    const subData = await subRes.json();
    if (subData.errors?.length) return Response.json({ error: subData.errors[0].description }, { status: 400, headers: CORS_HEADERS });

    return Response.json({
      success: true,
      invoiceUrl: subData.invoiceUrl || `https://www.asaas.com/i/${subData.id}`,
      subscriptionId: subData.id,
      customerId: custData.id
    }, { headers: CORS_HEADERS });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

// ─── Rota: POST /asaas-webhook ────────────────────────────────────────────────
async function handleAsaasWebhook(request) {
  const body = await request.json();
  const { event: eventType, payment } = body;
  console.log(`[ASAAS WEBHOOK] ${eventType}`, payment?.id || '');
  return Response.json({ received: true }, { headers: CORS_HEADERS });
}

// ─── Router Principal ─────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response('', { status: 200, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');

    try {
      if (path === '/get-empresas')      return handleGetEmpresas(request, env);
      if (path === '/test-gemini')       return handleTestGemini(request);
      if (path === '/create-checkout')   return handleCreateCheckout(request, env);
      if (path === '/asaas-webhook')     return handleAsaasWebhook(request);

      return Response.json({ error: 'Rota não encontrada', path }, { status: 404, headers: CORS_HEADERS });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
    }
  }
};
