import pg from 'pg';
const { Client } = pg;

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const rawDbUrl = process.env.COCKROACH_DB_URL || process.env.DATABASE_URL || "postgresql://Buffallos_Tecnologia:WpAB2ws1UUPDd0GoC44jDA@saas-xoxonho-db-31345.j77.aws-us-west-2.cockroachlabs.cloud:26257/defaultdb";
  
  let hostName = "saas-xoxonho-db-31345.j77.aws-us-west-2.cockroachlabs.cloud";
  try {
    const parsed = new URL(rawDbUrl);
    hostName = parsed.hostname;
  } catch (e) {}

  const connString = rawDbUrl.split('?')[0];

  const client = new Client({
    connectionString: connString,
    ssl: { 
      rejectUnauthorized: false,
      servername: hostName
    },
    connectionTimeoutMillis: 8000
  });

  try {
    await client.connect();

    const queryParams = event.queryStringParameters || {};

    # Rota Específica de Estatísticas Dinâmicas Reais
    if (queryParams.stats === 'true') {
      const [totRes, waRes, siteRes, meiRes] = await Promise.all([
        client.query("SELECT COUNT(*) FROM public.empresas WHERE ativa = TRUE"),
        client.query("SELECT COUNT(*) FROM public.empresas WHERE ativa = TRUE AND whatsapp IS NOT NULL AND whatsapp != ''"),
        client.query("SELECT COUNT(*) FROM public.empresas WHERE ativa = TRUE AND site IS NOT NULL AND site != ''"),
        client.query("SELECT COUNT(*) FROM public.empresas WHERE ativa = TRUE AND (porte LIKE '%MEI%' OR porte LIKE '%ME%')")
      ]);

      await client.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          total: parseInt(totRes.rows[0].count, 10),
          comWhatsapp: parseInt(waRes.rows[0].count, 10),
          comSite: parseInt(siteRes.rows[0].count, 10),
          meiMe: parseInt(meiRes.rows[0].count, 10)
        })
      };
    }

    const cidade = (queryParams.cidade || '').trim();
    const cnae = (queryParams.cnae || '').trim();
    const comWhatsapp = queryParams.comWhatsapp === 'true';
    const comWebsite = queryParams.comWebsite === 'true';
    const porte = (queryParams.porte || '').trim();
    const bairro = (queryParams.bairro || '').trim();
    const minCapital = parseFloat(queryParams.minCapital || '0');
    const page = parseInt(queryParams.page || '1', 10);
    const limit = parseInt(queryParams.limit || '500', 10);
    const offset = (page - 1) * limit;

    let whereConditions = ["ativa = TRUE"];
    let values = [];
    let paramIndex = 1;

    if (cidade) {
      whereConditions.push(`LOWER(cidade) LIKE LOWER($${paramIndex})`);
      values.push(`%${cidade}%`);
      paramIndex++;
    }

    if (cnae) {
      whereConditions.push(`(cnae LIKE $${paramIndex} OR LOWER(segmento) LIKE LOWER($${paramIndex}))`);
      values.push(`%${cnae}%`);
      paramIndex++;
    }

    if (comWhatsapp) {
      whereConditions.push(`whatsapp IS NOT NULL AND whatsapp != ''`);
    }

    if (comWebsite) {
      whereConditions.push(`site IS NOT NULL AND site != ''`);
    }

    if (porte) {
      whereConditions.push(`porte = $${paramIndex}`);
      values.push(porte);
      paramIndex++;
    }

    if (bairro) {
      whereConditions.push(`LOWER(bairro) LIKE LOWER($${paramIndex})`);
      values.push(`%${bairro}%`);
      paramIndex++;
    }

    if (minCapital > 0) {
      whereConditions.push(`capital_social >= $${paramIndex}`);
      values.push(minCapital);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query de Contagem e Dados
    const countRes = await client.query(`SELECT COUNT(*) FROM public.empresas ${whereClause}`, values);
    const totalCount = parseInt(countRes.rows[0].count, 10);

    const dataRes = await client.query(
      `SELECT cnpj, razao_social, nome_fantasia, proprietario, cidade, bairro, telefone, whatsapp, site, email, cnae, segmento, porte, capital_social 
       FROM public.empresas 
       ${whereClause} 
       ORDER BY id DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total: totalCount,
        page: page,
        limit: limit,
        data: dataRes.rows
      })
    };

  } catch (err) {
    if (client) {
      try { await client.end(); } catch (e) {}
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total: 0,
        page: 1,
        limit: 500,
        data: [],
        error: 'CockroachDB: ' + err.message
      })
    };
  }
}
