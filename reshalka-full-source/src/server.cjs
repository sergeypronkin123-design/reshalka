import { PrismaClient } from '@prisma/client';
import http from 'http';
import crypto from 'crypto';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

/* ── Helpers ── */
function cors() {
  return { 'Access-Control-Allow-Origin': CORS_ORIGIN, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization', 'Content-Type': 'application/json' };
}
function send(res, status, data) { res.writeHead(status, cors()); res.end(JSON.stringify(data)); }
function body(req) { return new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => { try { r(JSON.parse(b)); } catch { r({}); } }); }); }
function jwtSign(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const pay = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 86400000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${pay}`).digest('base64url');
  return `${header}.${pay}.${sig}`;
}
function jwtVerify(token) {
  try {
    const [header, pay, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${pay}`).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(pay, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}
function getUser(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
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
async function askClaude(category, answers, preferences = {}, rejected = []) {
  const cat = CATEGORIES[category]?.label || category;
  const answersText = answers.map(a => `${a.question}: ${a.answer}`).join('\n');
  const prefsText = Object.keys(preferences).length ? `\nПредпочтения: ${JSON.stringify(preferences)}` : '';
  const rejText = rejected.length ? `\nНЕ предлагай: ${rejected.join(', ')}` : '';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1000,
      system: `Ты — AI-консьерж «Решалка». Категория: ${cat}.${prefsText}${rejText}\nДай конкретную рекомендацию с реальным названием. 2-3 предложения причины. 2 альтернативы.\nJSON без markdown: {"name":"","desc":"","reason":"","tags":["","",""],"alts":[{"name":"","desc":""},{"name":"","desc":""}]}`,
      messages: [{ role: 'user', content: answersText }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).map(b => b.type === 'text' ? b.text : '').join('');
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

/* ── Router ── */
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors()); return res.end(); }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  try {
    // ─── Health ───
    if (path === '/health') return send(res, 200, { status: 'ok', time: new Date().toISOString() });

    // ─── Auth: Register ───
    if (path === '/api/auth/register' && method === 'POST') {
      const { email, phone, name } = await body(req);
      if (!email || !name) return send(res, 400, { error: 'Email и имя обязательны' });

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return send(res, 409, { error: 'Пользователь с таким email уже существует' });

      if (phone) {
        const phoneExists = await prisma.user.findUnique({ where: { phone } });
        if (phoneExists) return send(res, 409, { error: 'Этот номер телефона уже зарегистрирован' });
      }

      const otp = genOtp();
      await prisma.otpCode.create({ data: { email, code: otp, expiresAt: new Date(Date.now() + 600000) } });
      console.log(`OTP for ${email}: ${otp}`); // В проде отправлять через SMS/email сервис

      return send(res, 200, { message: 'Код отправлен', email });
    }

    // ─── Auth: Login ───
    if (path === '/api/auth/login' && method === 'POST') {
      const { email } = await body(req);
      if (!email) return send(res, 400, { error: 'Email обязателен' });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return send(res, 404, { error: 'Пользователь не найден' });

      const otp = genOtp();
      await prisma.otpCode.create({ data: { email, code: otp, expiresAt: new Date(Date.now() + 600000) } });
      console.log(`OTP for ${email}: ${otp}`);

      return send(res, 200, { message: 'Код отправлен', email });
    }

    // ─── Auth: Verify OTP ───
    if (path === '/api/auth/verify' && method === 'POST') {
      const { email, code, name, phone } = await body(req);
      if (!email || !code) return send(res, 400, { error: 'Email и код обязательны' });

      const otpRecord = await prisma.otpCode.findFirst({
        where: { email, code, used: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      });
      if (!otpRecord) return send(res, 401, { error: 'Неверный или истекший код' });

      await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({ data: { email, name: name || email.split('@')[0], phone } });
      }
      await prisma.user.update({ where: { id: user.id }, data: { lastActive: new Date() } });

      const token = jwtSign({ userId: user.id, email: user.email });
      return send(res, 200, { token, user: { id: user.id, name: user.name, email: user.email, isPro: user.isPro, freeRequestsLeft: user.freeRequestsLeft } });
    }

    // ─── Categories ───
    if (path === '/api/categories' && method === 'GET') {
      const cats = Object.entries(CATEGORIES).map(([id, c]) => ({ id, label: c.label, icon: c.icon, questionsCount: c.questions.length }));
      return send(res, 200, { categories: cats });
    }

    if (path.startsWith('/api/questions/') && method === 'GET') {
      const catId = path.split('/').pop();
      if (!CATEGORIES[catId]) return send(res, 400, { error: 'Неизвестная категория' });
      return send(res, 200, { questions: CATEGORIES[catId].questions });
    }

    // ─── Decide (AI recommendation) ───
    if (path === '/api/decide' && method === 'POST') {
      const auth = getUser(req);
      const { category, answers, rejected } = await body(req);
      if (!category || !CATEGORIES[category]) return send(res, 400, { error: 'Неверная категория' });

      // Check limits for non-pro users
      if (auth) {
        const user = await prisma.user.findUnique({ where: { id: auth.userId } });
        if (user && !user.isPro && user.freeRequestsLeft <= 0) {
          return send(res, 403, { error: 'Лимит бесплатных запросов исчерпан', code: 'LIMIT_REACHED' });
        }
      }

      if (!ANTHROPIC_KEY) {
        return send(res, 200, { decisionId: crypto.randomUUID(), recommendation: { name: 'API ключ не настроен', desc: 'Добавьте ANTHROPIC_API_KEY', reason: 'Требуется ключ Claude API', tags: ['setup'], alts: [] }, source: 'fallback' });
      }

      const preferences = auth ? (await prisma.user.findUnique({ where: { id: auth.userId } }))?.preferences || {} : {};
      const recommendation = await askClaude(category, answers, preferences, rejected);

      // Save decision + decrement counter
      let decisionId = crypto.randomUUID();
      if (auth) {
        const decision = await prisma.decision.create({
          data: { id: decisionId, userId: auth.userId, category, answers, recommendation },
        });
        decisionId = decision.id;
        await prisma.user.update({ where: { id: auth.userId }, data: { freeRequestsLeft: { decrement: 1 } } });
      }

      return send(res, 200, { decisionId, recommendation, source: 'claude' });
    }

    // ─── Rate decision ───
    if (path.startsWith('/api/decisions/') && path.endsWith('/rate') && method === 'POST') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      const decisionId = path.split('/')[3];
      const { rating } = await body(req);
      if (!rating || rating < 1 || rating > 5) return send(res, 400, { error: 'Рейтинг 1-5' });

      await prisma.decision.update({ where: { id: decisionId, userId: auth.userId }, data: { rating } });
      return send(res, 200, { success: true });
    }

    // ─── History ───
    if (path === '/api/history' && method === 'GET') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });

      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const decisions = await prisma.decision.findMany({
        where: { userId: auth.userId },
        orderBy: { createdAt: 'desc' },
        take: limit, skip: offset,
      });
      const total = await prisma.decision.count({ where: { userId: auth.userId } });
      return send(res, 200, { decisions, total, limit, offset });
    }

    // ─── Profile ───
    if (path === '/api/profile' && method === 'GET') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });

      const user = await prisma.user.findUnique({ where: { id: auth.userId }, include: { _count: { select: { decisions: true, reviews: true } } } });
      if (!user) return send(res, 404, { error: 'Пользователь не найден' });

      return send(res, 200, { user: {
        id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl,
        isPro: user.isPro, proExpiresAt: user.proExpiresAt, freeRequestsLeft: user.freeRequestsLeft,
        preferences: user.preferences, createdAt: user.createdAt,
        stats: { decisions: user._count.decisions, reviews: user._count.reviews },
      }});
    }

    if (path === '/api/profile' && method === 'PUT') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      const { name, preferences } = await body(req);
      const data = {};
      if (name) data.name = name;
      if (preferences) data.preferences = preferences;
      const user = await prisma.user.update({ where: { id: auth.userId }, data });
      return send(res, 200, { user: { id: user.id, name: user.name, preferences: user.preferences } });
    }

    // ─── Voting: Create room ───
    if (path === '/api/voting/create' && method === 'POST') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      const { category, options } = await body(req);
      if (!category || !options?.length) return send(res, 400, { error: 'Категория и варианты обязательны' });

      const room = await prisma.votingRoom.create({
        data: { creatorId: auth.userId, category, options, expiresAt: new Date(Date.now() + 24 * 3600000) },
      });
      return send(res, 200, { room: { id: room.id, inviteCode: room.inviteCode, expiresAt: room.expiresAt } });
    }

    // ─── Voting: Join + Vote ───
    if (path.startsWith('/api/voting/') && path.endsWith('/vote') && method === 'POST') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      const inviteCode = path.split('/')[3];
      const { optionIndex } = await body(req);

      const room = await prisma.votingRoom.findUnique({ where: { inviteCode } });
      if (!room) return send(res, 404, { error: 'Комната не найдена' });
      if (room.status !== 'active') return send(res, 400, { error: 'Голосование завершено' });

      await prisma.vote.upsert({
        where: { roomId_userId: { roomId: room.id, userId: auth.userId } },
        create: { roomId: room.id, userId: auth.userId, optionIndex },
        update: { optionIndex },
      });

      const votes = await prisma.vote.findMany({ where: { roomId: room.id } });
      return send(res, 200, { votes: votes.length, results: votes.map(v => v.optionIndex) });
    }

    // ─── Voting: Get room ───
    if (path.startsWith('/api/voting/') && method === 'GET') {
      const inviteCode = path.split('/').pop();
      const room = await prisma.votingRoom.findUnique({ where: { inviteCode }, include: { votes: true, creator: { select: { name: true } } } });
      if (!room) return send(res, 404, { error: 'Комната не найдена' });
      return send(res, 200, { room });
    }

    // ─── Subscription: Activate PRO ───
    if (path === '/api/subscription/activate' && method === 'POST') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });
      const { plan, provider, providerId } = await body(req);

      const expiresAt = plan === 'year'
        ? new Date(Date.now() + 365 * 86400000)
        : new Date(Date.now() + 30 * 86400000);

      await prisma.user.update({ where: { id: auth.userId }, data: { isPro: true, proExpiresAt: expiresAt, freeRequestsLeft: 999999 } });
      await prisma.subscription.create({ data: { userId: auth.userId, provider: provider || 'manual', providerId: providerId || crypto.randomUUID(), plan: plan || 'month', currentPeriodEnd: expiresAt } });

      return send(res, 200, { success: true, proExpiresAt: expiresAt });
    }

    // ─── Stats (for analytics) ───
    if (path === '/api/stats' && method === 'GET') {
      const auth = getUser(req);
      if (!auth) return send(res, 401, { error: 'Требуется авторизация' });

      const decisions = await prisma.decision.findMany({ where: { userId: auth.userId }, select: { category: true, rating: true, createdAt: true } });
      const byCategory = {};
      decisions.forEach(d => { byCategory[d.category] = (byCategory[d.category] || 0) + 1; });
      const avgRating = decisions.filter(d => d.rating).reduce((sum, d) => sum + d.rating, 0) / (decisions.filter(d => d.rating).length || 1);

      return send(res, 200, {
        total: decisions.length,
        byCategory,
        avgRating: Math.round(avgRating * 10) / 10,
        thisWeek: decisions.filter(d => d.createdAt > new Date(Date.now() - 7 * 86400000)).length,
      });
    }

    // ─── 404 ───
    send(res, 404, { error: 'Endpoint не найден' });

  } catch (err) {
    console.error('Error:', err.message);
    send(res, 500, { error: 'Внутренняя ошибка сервера' });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`Reshalka API v1.0 on port ${PORT}`));
