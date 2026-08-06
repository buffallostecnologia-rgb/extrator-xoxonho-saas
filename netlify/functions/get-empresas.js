const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://Buffallos_Tecnologia:WpAB2ws1UUPDd0GoC44jDA@saas-xoxonho-db-31345.j77.aws-us-west-2.cockroachlabs.cloud:26257/defaultdb?sslmode=require";

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const queryParams = event.queryStringParameters || {};
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

    // Contagem Total
    const countRes = await client.query(`SELECT COUNT(*) FROM public.empresas ${whereClause}`, values);
    const totalCount = parseInt(countRes.rows[0].count, 10);

    // Busca Paginada
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
    if (client) await client.end().catch(() => {});
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao consultar CockroachDB: ' + err.message })
    };
  }
};
