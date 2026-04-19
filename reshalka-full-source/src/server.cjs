const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3001;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

/* ── Prisma (lazy init) ── */
let prisma = null;
async function db() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

/* ── Helpers ── */
function cors() {
  return { 'Access-Control-Allow-Origin': CORS_ORIGIN, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization', 'Content-Type': 'application/json' };
}
function send(res, status, data) { res.writeHead(status, cors()); res.end(JSON.stringify(data)); }
function body(req) { return new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => { try { r(JSON.parse(b)); } catch { r({}); } }); }); }

function jwtSign(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const pay = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 86400000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + pay).digest('base64url');
  return header + '.' + pay + '.' + sig;
}
function jwtVerify(token) {
  try {
    const parts = token.split('.');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(parts[0] + '.' + parts[1]).digest('base64url');
    if (parts[2] !== expected) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}
function getUser(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return jwtVerify(auth.slice(7));
}
function genOtp() { return String(Math.floor(1000 + Math.random() * 9000)); }

/* ── Categories ── */
const CATEGORIES = {
  movie: { label: 'Что посмотреть', icon: 'film', questions: [
    { question: 'Какое настроение?', options: ['Расслабленное','Энергичное','Романтичное','Задумчивое'] },
    { question: 'С кем смотришь?', options: ['Один/одна','С партнёром','С друзьями','С семьёй'] },
    { question: 'Формат?', options: ['Фильм до 2ч','Длинное кино','Сериал','Документалка'] },
  ]},
  food: { label: 'Где поесть', icon: 'fork', questions: [
    { question: 'Какая кухня?', options: ['Итальянская','Азиатская','Грузинская','Удиви меня'] },
    { question: 'Бюджет?', options: ['Недорого','Средний','Не жалко','Без ограничений'] },
    { question: 'Формат?', options: ['Быстро перекусить','Посидеть уютно','Свидание','Большая компания'] },
  ]},
  fun: { label: 'Чем заняться', icon: 'compass', questions: [
    { question: 'Где?', options: ['Дома','На улице','В городе','За городом'] },
    { question: 'С кем?', options: ['Один/одна','Вдвоём','С друзьями','С детьми'] },
    { question: 'Энергия?', options: ['Отдохнуть','Немного активно','Заряд энергии','Экстрим'] },
  ]},
  gift: { label: 'Что подарить', icon: 'gift', questions: [
    { question: 'Кому?', options: ['Партнёру','Другу','Родителям','Коллеге'] },
    { question: 'Бюджет?', options: ['До 1000','1000-3000','3000-10000','Не важно'] },
    { question: 'Стиль?', options: ['Практичное','Эмоции','Оригинальное','Классика'] },
  ]},
};

/* ── Claude AI ── */
async function askClaude(category, answers, preferences, rejected) {
  const cat = CATEGORIES[category] ? CATEGORIES[category].label : category;
  const answersText = answers.map(function(a) { return a.question + ': ' + a.answer; }).join('\n');
  const prefsText = preferences && Object.keys(preferences).length ? '\nПредпочтения: ' + JSON.stringify(preferences) : '';
  const rejText = rejected && rejected.length ? '\nНЕ предлагай: ' + rejected.join(', ') : '';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1000,
      system: 'Ты — AI-консьерж «Решалка». Категория: ' + cat + '.' + prefsText + rejText + '\nДай конкретную рекомендацию с реальным названием. 2-3 предложения причины. 2 альтернативы.\nJSON без markdown: {"name":"","desc":"","reason":"","tags":["","",""],"alts":[{"name":"","desc":""},{"name":"","desc":""}]}',
      messages: [{ role: 'user', content: answersText }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).map(function(b) { return b.type === 'text' ? b.text : ''; }).join('');
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

/* ── Router ── */
const server = http.createServer(async function(req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors()); return res.end(); }

  const url = new URL(req.url, 'http://' + req.headers.host);
  const path = url.pathname;
  const method = req.method;

  try {
    // Health
    if (path === '/health') return send(res, 200, { status: 'ok', time: new Date().toISOString() });

    // Categories
    if (path === '/api/categories' && method === 'GET') {
      var cats = Object.entries(CATEGORIES).map(function(e) { return { id: e[0], label: e[1].label, icon: e[1].icon, questionsCount: e[1].questions.length }; });
      return send(res, 200, { categories: cats });
    }
    if (path.startsWith('/api/questions/') && method === 'GET') {
      var catId = path.split('/').pop();
      if (!CATEGORIES[catId]) return send(res, 400, { error: 'Неизвестная категория' });
      return send(res, 200, { questions: CATEGORIES[catId].questions });
    }

    // Auth: Register
    if (path === '/api/auth/register' && method === 'POST') {
      var p = await db();
      var d = await body(req);
      if (!d.email || !d.name) return send(res, 400, { error: 'Email и имя обязательны' });
      var existing = await p.user.findUnique({ where: { email: d.email } });
      if (existing) return send(res, 409, { error: 'Пользователь уже существует' });
      if (d.phone) {
        var phoneExists = await p.user.findUnique({ where: { phone: d.phone } });
        if (phoneExists) return send(res, 409, { error: 'Этот номер уже зарегистрирован' });
      }
      var otp = genOtp();
      await p.otpCode.create({ data: { email: d.email, code: otp, expiresAt: new Date(Date.now() + 600000) } });
      console.log('OTP for ' + d.email + ': ' + otp);
      return send(res, 200, { message: 'Код отправлен', email: d.email });
    }

    // Auth: Login
    if (path === '/api/auth/login' && method === 'POST') {
      var p = await db();
      var d = await body(req);
      if (!d.email) return send(res, 400, { error: 'Email обязателен' });
      var user = await p.user.findUnique({ where: { email: d.email } });
      if (!user) return send(res, 404, { error: 'Пользователь не найден' });
      var otp = genOtp();
      await p.otpCode.create({ data: { email: d.email, code: otp, expiresAt: new Date(Date.now() + 600000) } });
      console.log('OTP for ' + d.email + ': ' + otp);
      return send(res, 200, { message: 'Код отправлен', email: d.email });
    }

    // Auth: Verify OTP
    if (path === '/api/auth/verify' && method === 'POST') {
      var p = await db();
      var d = await body(req);
      if (!d.email || !d.code) return send(res, 400, { error: 'Email и код обязательны' });
      var otpRec = await p.otpCode.findFirst({
        where: { email: d.email, code: d.code, used: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      });
      if (!otpRec) return send(res, 401, { error: 'Неверный или истекший код' });
      await p.otpCode.update({ where: { id: otpRec.id }, data: { used: true } });
      var user = await p.user.findUnique({ where: { email: d.email } });
      if (!user) {
        user = await p.user.create({ data: { email: d.email, name: d.name || d.email.split('@')[0], phone: d.phone || null } });
      }
      await p.user.update({ where: { id: user.id }, data: { lastActive: new Date() } });
      var token = jwtSign({ userId: user.id, email: user.email });
      return send(res, 200, { token: token, user: { id: user.id, name: user.name, email: user.email, isPro: user.isPro, freeRequestsLeft: user.freeRequestsLeft } });
    }

    // Decide (AI)
    if (path === '/api/decide' && method === 'POST') {
      var auth = getUser(req);
      var d = await body(req);
      if (!d.category || !CATEGORIES[d.category]) return send(res, 400, { error: 'Неверная категория' });

      if (auth) {
        var p = await db();
        var user = await p.user.findUnique({ where: { id: auth.userId } });
        if (user && !user.isPro && user.freeRequestsLeft <= 0) {
          return send(res, 403, { error: 'Лимит исчерпан', code: 'LIMIT_REACHED' });
        }
      }

      if (!ANTHROPIC_KEY) {
        return send(res, 200, { decisionId: crypto.randomUUID(), recommendation: { name: 'API ключ не настроен', desc: 'Добавьте ANTHROPIC_API_KEY в Render', reason: 'Нужен ключ Claude', tags: ['setup'], alts: [] }, source: 'fallback' });
      }

      var prefs = {};
      if (auth) {
        var p = await db();
        var u = await p.user.findUnique({ where: { id: auth.userId } });
        if (u) prefs = u.preferences || {};
      }
      var recommendation = await askClaude(d.category, d.answers, prefs, d.rejected);

      var decisionId = crypto.randomUUID();
      if (auth) {
        var p = await db();
        var dec = await p.decision.create({ data: { userId: auth.userId, category: d.category, answers: d.answers, recommendation: recommendation } });
        decisionId = dec.id;
        await p.user.update({ where: { id: auth.userId }, data: { freeRequestsLeft: { decrement: 1 } } });
      }
      return send(res, 200, { decisionId: decisionId, recommendation: recommendation, source: 'claude' });
    }

    // Profile
    if (path === '/api/profile' && method === 'GET') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var user = await p.user.findUnique({ where: { id: auth.userId }, include: { _count: { select: { decisions: true, reviews: true } } } });
      if (!user) return send(res, 404, { error: 'Не найден' });
      return send(res, 200, { user: { id: user.id, name: user.name, email: user.email, isPro: user.isPro, proExpiresAt: user.proExpiresAt, freeRequestsLeft: user.freeRequestsLeft, preferences: user.preferences, createdAt: user.createdAt, stats: { decisions: user._count.decisions, reviews: user._count.reviews } } });
    }
    if (path === '/api/profile' && method === 'PUT') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var d = await body(req);
      var data = {};
      if (d.name) data.name = d.name;
      if (d.preferences) data.preferences = d.preferences;
      var user = await p.user.update({ where: { id: auth.userId }, data: data });
      return send(res, 200, { user: { id: user.id, name: user.name, preferences: user.preferences } });
    }

    // History
    if (path === '/api/history' && method === 'GET') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var limit = parseInt(url.searchParams.get('limit') || '20');
      var offset = parseInt(url.searchParams.get('offset') || '0');
      var decisions = await p.decision.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: 'desc' }, take: limit, skip: offset });
      var total = await p.decision.count({ where: { userId: auth.userId } });
      return send(res, 200, { decisions: decisions, total: total });
    }

    // Stats
    if (path === '/api/stats' && method === 'GET') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var decisions = await p.decision.findMany({ where: { userId: auth.userId }, select: { category: true, rating: true, createdAt: true } });
      var byCategory = {};
      decisions.forEach(function(d) { byCategory[d.category] = (byCategory[d.category] || 0) + 1; });
      var rated = decisions.filter(function(d) { return d.rating; });
      var avg = rated.length ? rated.reduce(function(s, d) { return s + d.rating; }, 0) / rated.length : 0;
      return send(res, 200, { total: decisions.length, byCategory: byCategory, avgRating: Math.round(avg * 10) / 10 });
    }

    // Voting: Create
    if (path === '/api/voting/create' && method === 'POST') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var d = await body(req);
      if (!d.category || !d.options || !d.options.length) return send(res, 400, { error: 'Категория и варианты обязательны' });
      var room = await p.votingRoom.create({ data: { creatorId: auth.userId, category: d.category, options: d.options, expiresAt: new Date(Date.now() + 86400000) } });
      return send(res, 200, { room: { id: room.id, inviteCode: room.inviteCode, expiresAt: room.expiresAt } });
    }

    // Voting: Vote
    if (path.match(/^\/api\/voting\/[^/]+\/vote$/) && method === 'POST') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var inviteCode = path.split('/')[3];
      var d = await body(req);
      var room = await p.votingRoom.findUnique({ where: { inviteCode: inviteCode } });
      if (!room) return send(res, 404, { error: 'Комната не найдена' });
      if (room.status !== 'active') return send(res, 400, { error: 'Голосование завершено' });
      await p.vote.upsert({ where: { roomId_userId: { roomId: room.id, userId: auth.userId } }, create: { roomId: room.id, userId: auth.userId, optionIndex: d.optionIndex }, update: { optionIndex: d.optionIndex } });
      var votes = await p.vote.findMany({ where: { roomId: room.id } });
      return send(res, 200, { votes: votes.length, results: votes.map(function(v) { return v.optionIndex; }) });
    }

    // Voting: Get room
    if (path.match(/^\/api\/voting\/[^/]+$/) && method === 'GET') {
      var p = await db();
      var inviteCode = path.split('/').pop();
      var room = await p.votingRoom.findUnique({ where: { inviteCode: inviteCode }, include: { votes: true, creator: { select: { name: true } } } });
      if (!room) return send(res, 404, { error: 'Комната не найдена' });
      return send(res, 200, { room: room });
    }

    // Subscription
    if (path === '/api/subscription/activate' && method === 'POST') {
      var auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      var p = await db();
      var d = await body(req);
      var expiresAt = d.plan === 'year' ? new Date(Date.now() + 365 * 86400000) : new Date(Date.now() + 30 * 86400000);
      await p.user.update({ where: { id: auth.userId }, data: { isPro: true, proExpiresAt: expiresAt, freeRequestsLeft: 999999 } });
      await p.subscription.create({ data: { userId: auth.userId, provider: d.provider || 'manual', providerId: d.providerId || crypto.randomUUID(), plan: d.plan || 'month', currentPeriodEnd: expiresAt } });
      return send(res, 200, { success: true, proExpiresAt: expiresAt });
    }

    send(res, 404, { error: 'Endpoint не найден' });
  } catch (err) {
    console.error('Error:', err.message);
    send(res, 500, { error: 'Внутренняя ошибка сервера' });
  }
});

server.listen(PORT, '0.0.0.0', function() {
  console.log('Reshalka API v1.0 on port ' + PORT);
});
