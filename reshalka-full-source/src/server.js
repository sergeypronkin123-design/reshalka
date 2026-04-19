const http = require('http');

const PORT = process.env.PORT || 3001;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const CATEGORIES = {
  movie: { label: 'Фильмы и сериалы', questions: [
    { question: 'Какое настроение?', options: ['Расслабленное','Энергичное','Романтичное','Задумчивое'] },
    { question: 'С кем смотришь?', options: ['Один/одна','С партнёром','С друзьями','С семьёй'] },
    { question: 'Формат?', options: ['Фильм до 2ч','Длинное кино','Сериал','Документалка'] },
  ]},
  food: { label: 'Рестораны и еда', questions: [
    { question: 'Какая кухня?', options: ['Итальянская','Азиатская','Грузинская','Удиви меня'] },
    { question: 'Бюджет?', options: ['Недорого','Средний','Не жалко','Без ограничений'] },
    { question: 'Формат?', options: ['Быстро перекусить','Посидеть уютно','Свидание','Большая компания'] },
  ]},
  fun: { label: 'Досуг и развлечения', questions: [
    { question: 'Где?', options: ['Дома','На улице','В городе','За городом'] },
    { question: 'С кем?', options: ['Один/одна','Вдвоём','С друзьями','С детьми'] },
    { question: 'Энергия?', options: ['Отдохнуть','Немного активно','Заряд энергии','Экстрим'] },
  ]},
  gift: { label: 'Подарки и покупки', questions: [
    { question: 'Кому?', options: ['Партнёру','Другу','Родителям','Коллеге'] },
    { question: 'Бюджет?', options: ['До 1000','1000-3000','3000-10000','Не важно'] },
    { question: 'Стиль?', options: ['Практичное','Эмоции','Оригинальное','Классика'] },
  ]},
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

function sendJSON(res, status, data) {
  res.writeHead(status, corsHeaders());
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

async function askClaude(category, answers, rejected) {
  const catLabel = CATEGORIES[category]?.label || category;
  const answersText = answers.map(a => `${a.question}: ${a.answer}`).join('\n');
  const rejectedText = rejected?.length ? `\n\nНЕ предлагай: ${rejected.join(', ')}` : '';

  const systemPrompt = `Ты — AI-консьерж приложения «Решалка». Категория: ${catLabel}.
Дай ОДНУ конкретную рекомендацию. Будь конкретным: реальные названия.
Объяснение — 2-3 предложения. 2 альтернативы. Тон: дружелюбный.${rejectedText}

Ответь СТРОГО в JSON без markdown:
{"name":"Название","desc":"Описание","reason":"Почему это","tags":["тег1","тег2","тег3"],"alts":[{"name":"Альт 1","desc":"Описание"},{"name":"Альт 2","desc":"Описание"}]}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: answersText }],
    }),
  });

  const data = await response.json();
  const text = (data.content || []).map(b => b.type === 'text' ? b.text : '').join('');
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // Health check
    if (path === '/health' && req.method === 'GET') {
      return sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    // Get categories
    if (path === '/api/categories' && req.method === 'GET') {
      const cats = Object.entries(CATEGORIES).map(([id, c]) => ({
        id, label: c.label, questions: c.questions,
      }));
      return sendJSON(res, 200, { categories: cats });
    }

    // Get questions for category
    if (path.startsWith('/api/questions/') && req.method === 'GET') {
      const catId = path.split('/').pop();
      const cat = CATEGORIES[catId];
      if (!cat) return sendJSON(res, 400, { error: 'Unknown category' });
      return sendJSON(res, 200, { questions: cat.questions });
    }

    // Get recommendation
    if (path === '/api/decide' && req.method === 'POST') {
      const body = await parseBody(req);
      const { category, answers, rejected } = body;

      if (!category || !CATEGORIES[category]) {
        return sendJSON(res, 400, { error: 'Invalid category' });
      }
      if (!answers || !Array.isArray(answers)) {
        return sendJSON(res, 400, { error: 'Answers required' });
      }

      if (!ANTHROPIC_KEY) {
        return sendJSON(res, 200, {
          decisionId: Date.now().toString(),
          recommendation: {
            name: 'Настройте API-ключ',
            desc: 'Добавьте ANTHROPIC_API_KEY в переменные окружения Render',
            reason: 'Без ключа Claude AI не может генерировать рекомендации',
            tags: ['настройка'], alts: [],
          },
        });
      }

      const recommendation = await askClaude(category, answers, rejected);
      return sendJSON(res, 200, {
        decisionId: Date.now().toString(),
        recommendation,
      });
    }

    // 404
    sendJSON(res, 404, { error: 'Not found' });

  } catch (err) {
    console.error('Error:', err.message);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Reshalka API running on port ${PORT}`);
});
