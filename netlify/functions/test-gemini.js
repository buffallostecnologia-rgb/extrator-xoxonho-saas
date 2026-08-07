export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { apiKey } = JSON.parse(event.body || '{}');

    if (!apiKey || !apiKey.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Chave API não fornecida.' })
      };
    }

    const cleanKey = apiKey.trim();

    // Testa a chave diretamente na API do Google (servidor para servidor, sem bloqueio de CORS)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Responda apenas com a palavra OK." }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Captura o erro real do Google para mostrar ao usuário
      const errMsg = data?.error?.message || 'Chave inválida ou sem cota.';
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: false, message: `Erro Google API: ${errMsg}` })
      };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: '✅ API Validada com sucesso! O Consultor IA está pronto.' })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: false, message: 'Chave válida mas sem resposta esperada.' })
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: `Erro interno: ${err.message}` })
    };
  }
}
