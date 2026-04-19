import { useState, useEffect, useRef } from "react";

/* ─── Design Tokens (Task 2: taste-skill) ─── */
const C = {
  n950:"#1d1d1f",n600:"#636366",n400:"#8a8a8e",n200:"#e5e5ea",n100:"#f2f2f7",n50:"#fafafa",white:"#fff",
  coral:"#E8593C",coralL:"#FAECE7",emerald:"#1D9E75",emeraldL:"#E1F5EE",
  azure:"#378ADD",azureL:"#E6F1FB",rose:"#D4537E",roseL:"#FBEAF0",amber:"#BA7517",amberL:"#FFF8EB",
};
const CAT_COLORS = { movie:{m:C.coral,l:C.coralL},food:{m:C.emerald,l:C.emeraldL},fun:{m:C.azure,l:C.azureL},gift:{m:C.rose,l:C.roseL} };

/* ─── Icon System (Phosphor-style, strokeWidth 1.5) ─── */
function I({name,size=20,color="currentColor",sw=1.5,fill="none"}){
  const p={
    film:<><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></>,
    fork:<><line x1="12" y1="2" x2="12" y2="14"/><path d="M5 2v6a3 3 0 006 0V2"/><line x1="12" y1="14" x2="12" y2="22"/></>,
    compass:<><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></>,
    gift:<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></>,
    star:<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></>,
    heart:<><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
    users:<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    arrowR:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL:<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    map:<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    refresh:<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
    home:<><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    user:<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    sparkle:<><path d="M12 2L13.5 8.5 20 10 13.5 11.5 12 18 10.5 11.5 4 10 10.5 8.5z"/></>,
    vote:<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    send:<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell:<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    thumbsUp:<><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    share:<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    mail:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
    shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
}

/* ─── Data (Task 4: categories service) ─── */
const CATS=[
  {id:"movie",icon:"film",label:"Что посмотреть",sub:"Фильмы и сериалы"},
  {id:"food",icon:"fork",label:"Где поесть",sub:"Рестораны рядом"},
  {id:"fun",icon:"compass",label:"Чем заняться",sub:"Досуг и события"},
  {id:"gift",icon:"gift",label:"Что подарить",sub:"Идеи подарков"},
];
const QUESTIONS={
  movie:[
    {q:"Какое настроение?",opts:["Расслабленное","Энергичное","Романтичное","Задумчивое"]},
    {q:"С кем смотришь?",opts:["Один/одна","С партнёром","С друзьями","С семьёй"]},
    {q:"Формат?",opts:["Фильм до 2ч","Длинное кино","Сериал","Документалка"]},
  ],
  food:[
    {q:"Какая кухня?",opts:["Итальянская","Азиатская","Грузинская","Удиви меня"]},
    {q:"Бюджет?",opts:["Недорого","Средний","Не жалко","Без ограничений"]},
    {q:"Формат?",opts:["Быстро перекусить","Посидеть уютно","Свидание","Большая компания"]},
  ],
  fun:[
    {q:"Где?",opts:["Дома","На улице","В городе","За городом"]},
    {q:"С кем?",opts:["Один/одна","Вдвоём","С друзьями","С детьми"]},
    {q:"Энергия?",opts:["Отдохнуть","Немного активно","Заряд энергии","Экстрим"]},
  ],
  gift:[
    {q:"Кому?",opts:["Партнёру","Другу","Родителям","Коллеге"]},
    {q:"Бюджет?",opts:["До 1 000","1 000 — 3 000","3 000 — 10 000","Не важно"]},
    {q:"Стиль?",opts:["Практичное","Эмоции","Оригинальное","Классика"]},
  ],
};

/* ─── AI Recommendations (Task 5: Claude simulation) ─── */
const AI_DB={
  movie:{
    "Расслабленное":{name:"Шеф Адам Джонс",desc:"Кулинарная драма с Брэдли Купером о шефе, который ищет вторую звезду Мишлен",reason:"Красивая атмосферная история для спокойного вечера. Минимум напряжения, приятная картинка и вдохновляющий финал.",tags:["драма","кулинария","2015"],alts:[{name:"Паттерсон",desc:"Тихая поэзия повседневности"},{name:"Полночь в Париже",desc:"Магия ночного Парижа Вуди Аллена"}]},
    "Энергичное":{name:"Всё везде и сразу",desc:"Мультивселенная, боевые сцены с бубликами и неожиданно глубокая история о семье",reason:"Бешеный темп не даст заскучать. Смешно, трогательно и визуально безумно — заряжает энергией.",tags:["экшн","комедия","2022"],alts:[{name:"Безумный Макс: Дорога ярости",desc:"Два часа чистого адреналина"},{name:"Джон Уик",desc:"Стильный экшн без компромиссов"}]},
    "Романтичное":{name:"Бриджит Джонс",desc:"Культовая романтическая комедия о поиске любви в Лондоне",reason:"Идеально для романтичного настроения вдвоём — смешно, тепло и со счастливым финалом.",tags:["ромком","классика","2001"],alts:[{name:"Ла-Ла Ленд",desc:"Мечты и любовь в Лос-Анджелесе"},{name:"Один день",desc:"Пронзительная история длиною в жизнь"}]},
    "Задумчивое":{name:"Интерстеллар",desc:"Космическая одиссея Нолана о времени, гравитации и отцовской любви",reason:"Для задумчивого вечера — фильм, который заставит думать ещё несколько дней после просмотра.",tags:["sci-fi","драма","2014"],alts:[{name:"Прибытие",desc:"Лингвистика как ключ к контакту"},{name:"Вечное сияние чистого разума",desc:"Память, любовь и потеря"}]},
  },
  food:{
    "Итальянская":{name:"Пицца 22 см",desc:"Неаполитанская пицца на дровах с импортной мукой и томатами Сан-Марцано",reason:"Настоящая неаполитанская пицца в центре города. Тесто ферментируется 72 часа — чувствуется разница.",tags:["пицца","дровяная печь","Покровка"],alts:[{name:"Марчеллис",desc:"Домашняя паста и тирамису"},{name:"Сыроварня",desc:"Авторские сыры и итальянские блюда"}]},
    "Азиатская":{name:"Рамен изакая",desc:"Аутентичный японский рамен с бульоном тонкоцу, который варится 18 часов",reason:"Лучший рамен в радиусе 3 км. Густой бульон, идеальное яйцо, порция честная.",tags:["рамен","японская","Чистые пруды"],alts:[{name:"Бао",desc:"Тайваньские булочки бао и димсамы"},{name:"Кимчи",desc:"Корейское барбекю с дымком"}]},
    "Грузинская":{name:"Саперави",desc:"Грузинская кухня с домашней атмосферой — хинкали ручной лепки и вино из погреба",reason:"Уютная атмосфера без шума, идеально для тёплого вечера. Хинкали лепят при вас, вино подберут к блюду.",tags:["грузинская","уютно","Покровка, 16"],alts:[{name:"Хачапурная №1",desc:"Хачапури по-аджарски за 15 минут"},{name:"Казбек",desc:"Панорамный вид и авторская кухня"}]},
    "Удиви меня":{name:"Кебаб-бар МТЦР",desc:"Ливанская кухня нового формата — фалафель, хумус и кебабы на углях",reason:"Неожиданный выбор, который точно запомнится. Свежие лепёшки, яркие соусы, честные порции.",tags:["ливанская","стритфуд","Патриаршие"],alts:[{name:"Тарас Бульба",desc:"Украинский борщ и вареники"},{name:"Тако Бэнд",desc:"Мексиканские тако и буррито"}]},
  },
  fun:{
    "Дома":{name:"Марафон настольных игр",desc:"Вечер с «Кодовые имена», «Диксит» или «Пандемия» — зависит от компании",reason:"Не нужно никуда ехать, а эмоций будет больше, чем от любого кино. Классный повод собраться.",tags:["настолки","дома","2-6 чел"],alts:[{name:"Кулинарный баттл",desc:"Готовите из одних продуктов на скорость"},{name:"Кино-квиз",desc:"Своя игра по фильмам дома"}]},
    "На улице":{name:"Велопрогулка по набережной",desc:"Маршрут 12 км вдоль Москвы-реки с остановками у парков и кафе",reason:"Сочетание движения и красивых видов. Не слишком нагружает, но после чувствуешь приятную усталость.",tags:["велосипед","набережная","2-3 часа"],alts:[{name:"Пикник в Парке Горького",desc:"Пледы, еда, закат"},{name:"Фотопрогулка",desc:"Охота за городскими деталями"}]},
    "В городе":{name:"Квест «Тайная комната»",desc:"Командный квест на 60 минут — загадки, механизмы и адреналин",reason:"Лучший способ провести вечер в компании. Проверите, кто из друзей самый сообразительный.",tags:["квест","команда","60 минут"],alts:[{name:"Выставка в Artplay",desc:"Иммерсивное искусство"},{name:"Стендап в баре",desc:"Живой юмор и напитки"}]},
    "За городом":{name:"Тропа здоровья в Лосином острове",desc:"Маршрут 8 км по лесу с деревянными настилами и смотровыми площадками",reason:"Природа в 30 минутах от города. Тишина, свежий воздух и ощущение, что ты далеко от Москвы.",tags:["лес","тропа","полдня"],alts:[{name:"Усадьба Архангельское",desc:"Парк, дворец, история"},{name:"Сплав по Истре",desc:"Каяки на полдня"}]},
  },
  gift:{
    "Партнёру":{name:"Сертификат на ужин вдвоём",desc:"Романтический ужин в ресторане с дегустационным сетом и виноводом",reason:"Эмоции ценнее вещей. Совместный опыт сближает, а вкусная еда — лучший язык любви.",tags:["впечатления","ужин","романтика"],alts:[{name:"Парный массаж",desc:"Расслабление на двоих"},{name:"Мастер-класс гончарства",desc:"Создаёте что-то вместе"}]},
    "Другу":{name:"Настольная игра «Кодовые имена»",desc:"Командная словесная игра для 4-8 человек — хит всех вечеринок",reason:"Подарок, который объединяет. Каждая партия — новые ассоциации и смех до слёз.",tags:["настолка","компания","универсально"],alts:[{name:"Подписка на Кинопоиск",desc:"Год фильмов и сериалов"},{name:"Набор крафтового пива",desc:"8 сортов для дегустации"}]},
    "Родителям":{name:"Фотоальбом с историей семьи",desc:"Персональный альбом из 60 страниц с вашими фото и подписями",reason:"Ничто не трогает родителей сильнее, чем память о семейных моментах. Готовьтесь к слезам радости.",tags:["персональный","фото","трогательно"],alts:[{name:"Умная колонка",desc:"Музыка, рецепты и таймеры голосом"},{name:"Путёвка в санаторий",desc:"Здоровье и отдых на выходные"}]},
    "Коллеге":{name:"Набор specialty-кофе",desc:"3 сорта зерна из Эфиопии, Колумбии и Гватемалы с карточками вкусов",reason:"Универсально, со вкусом и точно пригодится. Кофе любят почти все, а specialty — это уже подарок со смыслом.",tags:["кофе","стильно","1 500 — 2 500"],alts:[{name:"Кожаный ежедневник",desc:"Минимализм и практичность"},{name:"Подарочный сертификат",desc:"Пусть выберет сам"}]},
  },
};

function getAIRec(cat,answers){
  const firstAnswer=answers[0]?.answer||Object.keys(AI_DB[cat]||{})[0];
  const data=AI_DB[cat]?.[firstAnswer]||Object.values(AI_DB[cat]||{})[0];
  if(!data) return {name:"Попробуй что-то новое",desc:"AI подберёт в следующий раз",reason:"Недостаточно данных",tags:[],alts:[]};
  return data;
}

/* ─── Backend API Integration (Production) ─── */
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://reshalka-api.onrender.com';

function getToken() { try { return localStorage.getItem('reshalka_token'); } catch { return null; } }
function setToken(t) { try { localStorage.setItem('reshalka_token', t); } catch {} }
function clearToken() { try { localStorage.removeItem('reshalka_token'); } catch {} }

async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

async function askClaudeAI(catId, answers, rejected=[]){
  try {
    const data = await api('/api/decide', {
      method: 'POST',
      body: JSON.stringify({ category: catId, answers, rejected }),
    });
    return data.recommendation;
  } catch (err) {
    console.log("API fallback:", err.message);
    return getAIRec(catId, answers);
  }
}

/* ─── Recent decisions (mock history) ─── */
const HISTORY=[
  {id:"1",cat:"fun",name:"Квест «Тайная комната»",when:"Вчера",with:"с друзьями",rating:4.8},
  {id:"2",cat:"movie",name:"Интерстеллар",when:"3 дня назад",with:"один",rating:5.0},
  {id:"3",cat:"food",name:"Рамен изакая",when:"Неделю назад",with:"с партнёром",rating:4.5},
];

/* ─── Loading messages ─── */
const LOAD_MSGS=["Анализирую ваши ответы...","Ищу лучший вариант...","Генерирую рекомендацию...","Почти готово..."];
const FREE_LIMIT=5;
const PRICES={month:{amount:"299",period:"мес",full:"299 ₽/месяц",save:""},year:{amount:"199",period:"мес",full:"2 388 ₽/год",save:"Экономия 33%"}};

/* ─── Main App ─── */
export default function Reshalka(){
  const [screen,setScreen]=useState("welcome");
  const [cat,setCat]=useState(null);
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [rec,setRec]=useState(null);
  const [loading,setLoading]=useState(false);
  const [liked,setLiked]=useState(false);
  const [tab,setTab]=useState("home");
  const [anim,setAnim]=useState(true);
  const [history,setHistory]=useState(HISTORY);
  const [toast,setToast]=useState(null);
  const [rejected,setRejected]=useState([]);
  const [loadMsg,setLoadMsg]=useState(0);
  const [aiSource,setAiSource]=useState("");
  const [isPro,setIsPro]=useState(false);
  const [usedReqs,setUsedReqs]=useState(3);
  const [showPaywall,setShowPaywall]=useState(false);
  const [billingPeriod,setBillingPeriod]=useState("year");
  /* Auth state */
  const [authStep,setAuthStep]=useState("welcome");
  const [authEmail,setAuthEmail]=useState("");
  const [authPhone,setAuthPhone]=useState("");
  const [authName,setAuthName]=useState("");
  const [authOtp,setAuthOtp]=useState(["","","",""]);
  const [authError,setAuthError]=useState("");
  const [authLoading,setAuthLoading]=useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [isLogin,setIsLogin]=useState(false);
  const contentRef=useRef(null);

  useEffect(()=>{setAnim(false);requestAnimationFrame(()=>setAnim(true));},[screen,qIdx,authStep]);
  useEffect(()=>{if(contentRef.current)contentRef.current.scrollTop=0;},[screen,authStep]);
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),2500);return()=>clearTimeout(t);}},[toast]);

  /* Auto-login from saved token */
  useEffect(()=>{
    const token = getToken();
    if (token) {
      api('/api/profile').then(data => {
        if (data.user) {
          setIsLoggedIn(true); setScreen("home"); setAuthName(data.user.name);
          setIsPro(data.user.isPro); setUsedReqs(5 - (data.user.freeRequestsLeft || 0));
        }
      }).catch(() => { clearToken(); });
    }
  }, []);

  const go=(s)=>{setScreen(s);};
  const pickCat=(c)=>{
    if(!isPro&&usedReqs>=FREE_LIMIT){setShowPaywall(true);return;}
    setCat(c);setQIdx(0);setAnswers([]);setRec(null);setLiked(false);setRejected([]);setAiSource("");go("decision");
  };

  /* Auth helpers */
  const validateEmail=(e)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const formatPhone=(v)=>{
    const d=v.replace(/\D/g,"");
    if(d.length===0) return "";
    let f="+7";
    if(d.length>1) f+=" ("+d.substring(1,Math.min(4,d.length));
    if(d.length>=4) f+=") "+d.substring(4,Math.min(7,d.length));
    if(d.length>=7) f+="-"+d.substring(7,Math.min(9,d.length));
    if(d.length>=9) f+="-"+d.substring(9,Math.min(11,d.length));
    return f;
  };
  const handlePhoneChange=(v)=>{
    let d=v.replace(/\D/g,"");
    if(!d.startsWith("7"))d="7"+d;
    if(d.length>11)d=d.slice(0,11);
    setAuthPhone(d);
  };
  const handleOtpChange=(idx,val)=>{
    if(val.length>1)val=val.slice(-1);
    if(val&&!/\d/.test(val))return;
    const newOtp=[...authOtp];
    newOtp[idx]=val;
    setAuthOtp(newOtp);
    if(val&&idx<3){
      const next=document.getElementById("otp-"+(idx+1));
      if(next)next.focus();
    }
  };
  const handleOtpKeyDown=(idx,e)=>{
    if(e.key==="Backspace"&&!authOtp[idx]&&idx>0){
      const prev=document.getElementById("otp-"+(idx-1));
      if(prev)prev.focus();
    }
  };
  const submitRegister=async()=>{
    setAuthError("");
    if(!authName.trim()){setAuthError("Введите имя");return;}
    if(!validateEmail(authEmail)){setAuthError("Некорректный email");return;}
    if(authPhone.replace(/\D/g,"").length<11){setAuthError("Введите номер полностью");return;}
    setAuthLoading(true);
    try {
      await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ email: authEmail, phone: formatPhone(authPhone), name: authName }) });
      setAuthStep("otp"); setAuthOtp(["","","",""]);
    } catch (err) { setAuthError(err.message); }
    setAuthLoading(false);
  };
  const submitLogin=async()=>{
    setAuthError("");
    if(!validateEmail(authEmail)){setAuthError("Некорректный email");return;}
    setAuthLoading(true);
    try {
      await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: authEmail }) });
      setAuthStep("otp"); setAuthOtp(["","","",""]);
    } catch (err) { setAuthError(err.message); }
    setAuthLoading(false);
  };
  const verifyOtp=async()=>{
    const code=authOtp.join("");
    if(code.length<4){setAuthError("Введите 4 цифры");return;}
    setAuthLoading(true);
    try {
      const data = await api('/api/auth/verify', { method: 'POST', body: JSON.stringify({ email: authEmail, code, name: authName, phone: authPhone ? formatPhone(authPhone) : undefined }) });
      setToken(data.token);
      setIsLoggedIn(true); setScreen("home"); setToast("Добро пожаловать, " + (data.user?.name || "") + "!");
      if (data.user) { setIsPro(data.user.isPro); setUsedReqs(5 - (data.user.freeRequestsLeft || 0)); }
    } catch (err) { setAuthError(err.message); }
    setAuthLoading(false);
  };

  const intervalRef=useRef(null);
  useEffect(()=>()=>{if(intervalRef.current)clearInterval(intervalRef.current);},[]);

  const answer=(opt)=>{
    if(loading)return;
    const qs=QUESTIONS[cat.id];
    const newA=[...answers,{question:qs[qIdx].q,answer:opt}];
    setAnswers(newA);
    if(qIdx<qs.length-1){setQIdx(qIdx+1);}
    else{
      setLoading(true);setLoadMsg(0);go("result");
      intervalRef.current=setInterval(()=>setLoadMsg(p=>Math.min(p+1,LOAD_MSGS.length-1)),1200);
      askClaudeAI(cat.id,newA).then(result=>{
        clearInterval(intervalRef.current);
        setRec(result);
        setAiSource("claude");
        setLoading(false);
        if(!isPro)setUsedReqs(p=>p+1);
      }).catch(()=>{
        clearInterval(intervalRef.current);
        setRec(getAIRec(cat.id,newA));
        setAiSource("fallback");
        setLoading(false);
        if(!isPro)setUsedReqs(p=>p+1);
      });
    }
  };

  const regenerate=()=>{
    if(loading)return;
    const prevName=rec?.name;
    if(prevName)setRejected(prev=>[...prev,prevName]);
    setLoading(true);setLoadMsg(0);
    const newRejected=prevName?[...rejected,prevName]:rejected;
    intervalRef.current=setInterval(()=>setLoadMsg(p=>Math.min(p+1,LOAD_MSGS.length-1)),1000);
    askClaudeAI(cat.id,answers,newRejected).then(result=>{
      clearInterval(intervalRef.current);
      setRec(result);
      setAiSource("claude");
      setLoading(false);setLiked(false);
    }).catch(()=>{
      clearInterval(intervalRef.current);
      const keys=Object.keys(AI_DB[cat.id]||{});
      const available=keys.filter(k=>!newRejected.includes(AI_DB[cat.id][k]?.name));
      const rk=available.length?available[Math.floor(Math.random()*available.length)]:keys[Math.floor(Math.random()*keys.length)];
      setRec(AI_DB[cat.id][rk]);setAiSource("fallback");setLoading(false);setLiked(false);
    });
  };
  const saveDecision=()=>{
    if(!rec)return;
    setHistory(prev=>[{id:Date.now()+"",cat:cat.id,name:rec.name,when:"Сейчас",with:"",rating:0},...prev]);
    setToast("Сохранено в историю");
  };
  const goHome=()=>{setCat(null);setTab("home");go("home");};
  const logout=()=>{clearToken();setIsLoggedIn(false);setScreen("welcome");setAuthStep("welcome");setAuthEmail("");setAuthPhone("");setAuthName("");setToast("Вы вышли из аккаунта");};

  const accent=cat?CAT_COLORS[cat.id]?.m:C.coral;
  const accentL=cat?CAT_COLORS[cat.id]?.l:C.coralL;
  const hour=new Date().getHours();
  const greeting=hour<6?"Доброй ночи":hour<12?"Доброе утро":hour<18?"Добрый день":"Добрый вечер";

  return(
    <div style={$.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        @keyframes si{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes toast{0%{opacity:0;transform:translateY(20px)}10%{opacity:1;transform:translateY(0)}90%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .opt-btn:active{transform:scale(.97)!important;background:${C.n100}!important}
      `}</style>

      <div style={$.phone}>
        {/* Status bar */}
        <div style={$.statusBar}>
          <span style={$.statusTime}>
            {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:false})}
          </span>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <svg width="16" height="11" viewBox="0 0 16 11"><rect x="0" y="3" width="3" height="8" rx="1" fill="#1d1d1f"/><rect x="4.5" y="1.5" width="3" height="9.5" rx="1" fill="#1d1d1f"/><rect x="9" y="0" width="3" height="11" rx="1" fill="#1d1d1f"/><rect x="13" y="0.5" width="3" height="10" rx="1" fill="none" stroke="#1d1d1f" strokeWidth=".8"/><rect x="14" y="1.5" width="1" height="8" rx=".5" fill="#1d1d1f"/></svg>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} style={$.content}>

          {/* ═══ AUTH: WELCOME ═══ */}
          {!isLoggedIn&&authStep==="welcome"&&(
            <div style={{...$.pad,display:"flex",flexDirection:"column",justifyContent:"center",minHeight:"100%",animation:anim?"fi .5s ease":"none"}}>
              <div style={{textAlign:"center",marginBottom:48}}>
                <div style={{width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#E8593C,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 8px 32px rgba(232,89,60,.3)"}}><I name="sparkle" size={36} color="#fff"/></div>
                <h1 style={{fontFamily:"'Outfit'",fontSize:32,fontWeight:900,color:C.n950,letterSpacing:-1,marginBottom:8}}>Решалка</h1>
                <p style={{fontSize:15,color:C.n400,lineHeight:1.5}}>AI-помощник повседневного выбора</p>
              </div>
              <button onClick={()=>{setIsLogin(false);setAuthStep("register");setAuthError("");}} style={{width:"100%",padding:"16px",background:C.coral,color:"#fff",borderRadius:16,border:"none",fontSize:16,fontWeight:700,fontFamily:"inherit",cursor:"pointer",marginBottom:10,boxShadow:"0 4px 20px rgba(232,89,60,.25)"}}>
                Создать аккаунт
              </button>
              <button onClick={()=>{setIsLogin(true);setAuthStep("register");setAuthError("");}} style={{width:"100%",padding:"16px",background:C.n50,color:C.n950,borderRadius:16,border:`0.5px solid ${C.n200}`,fontSize:16,fontWeight:600,fontFamily:"inherit",cursor:"pointer"}}>
                Уже есть аккаунт
              </button>
              <p style={{textAlign:"center",fontSize:12,color:C.n400,marginTop:20,lineHeight:1.5}}>Регистрируясь, вы соглашаетесь с условиями использования и политикой конфиденциальности</p>
            </div>
          )}

          {/* ═══ AUTH: REGISTER / LOGIN ═══ */}
          {!isLoggedIn&&authStep==="register"&&(
            <div style={{...$.pad,animation:anim?"fi .4s ease":"none"}}>
              <button onClick={()=>{setAuthStep("welcome");setAuthError("");}} aria-label="Назад" style={$.backBtn}><I name="arrowL" size={20} color={C.n950}/></button>
              <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:C.n950,letterSpacing:-.5,marginBottom:4}}>{isLogin?"Вход":"Регистрация"}</h2>
              <p style={{fontSize:14,color:C.n400,marginBottom:28}}>{isLogin?"Введите email для входа":"Создайте аккаунт за 30 секунд"}</p>

              {!isLogin&&(
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:13,fontWeight:600,color:C.n600,display:"block",marginBottom:6}}>Имя</label>
                  <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Как вас зовут" style={{width:"100%",padding:"14px 16px",borderRadius:14,border:`0.5px solid ${C.n200}`,fontSize:15,fontFamily:"inherit",outline:"none",background:C.n50}}/>
                </div>
              )}

              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,color:C.n600,display:"block",marginBottom:6}}>Email</label>
                <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com" style={{width:"100%",padding:"14px 16px",borderRadius:14,border:`0.5px solid ${C.n200}`,fontSize:15,fontFamily:"inherit",outline:"none",background:C.n50}}/>
              </div>

              {!isLogin&&(
                <div style={{marginBottom:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:C.n600,display:"block",marginBottom:6}}>Телефон</label>
                  <input type="tel" value={formatPhone(authPhone)} onChange={e=>handlePhoneChange(e.target.value)} placeholder="+7 (___) ___-__-__" style={{width:"100%",padding:"14px 16px",borderRadius:14,border:`0.5px solid ${C.n200}`,fontSize:15,fontFamily:"inherit",outline:"none",background:C.n50,letterSpacing:.5}}/>
                  <p style={{fontSize:11,color:C.n400,marginTop:6,display:"flex",alignItems:"center",gap:4}}><I name="shield" size={12} color={C.n400}/>Нужен для защиты от злоупотреблений. Не будет виден другим.</p>
                </div>
              )}

              {authError&&<p style={{fontSize:13,color:"#E24B4A",marginTop:8,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><I name="x" size={14} color="#E24B4A"/>{authError}</p>}

              <button onClick={isLogin?submitLogin:submitRegister} disabled={authLoading} style={{width:"100%",padding:"16px",background:authLoading?C.n200:C.coral,color:"#fff",borderRadius:16,border:"none",fontSize:16,fontWeight:700,fontFamily:"inherit",cursor:authLoading?"wait":"pointer",marginTop:16,boxShadow:authLoading?"none":"0 4px 20px rgba(232,89,60,.25)",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {authLoading&&<div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:9,animation:"spin .6s linear infinite"}}/>}
                {isLogin?"Получить код":"Создать аккаунт"}
              </button>

              <p style={{textAlign:"center",marginTop:16,fontSize:13,color:C.n400}}>
                {isLogin?"Нет аккаунта? ":"Уже есть аккаунт? "}
                <button onClick={()=>{setIsLogin(!isLogin);setAuthError("");}} style={{background:"none",border:"none",color:C.coral,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>{isLogin?"Регистрация":"Войти"}</button>
              </p>
            </div>
          )}

          {/* ═══ AUTH: OTP ═══ */}
          {!isLoggedIn&&authStep==="otp"&&(
            <div style={{...$.pad,animation:anim?"fi .4s ease":"none"}}>
              <button onClick={()=>{setAuthStep("register");setAuthError("");}} aria-label="Назад" style={$.backBtn}><I name="arrowL" size={20} color={C.n950}/></button>
              <div style={{textAlign:"center",marginBottom:32}}>
                <div style={{width:56,height:56,borderRadius:16,background:C.coralL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I name="mail" size={24} color={C.coral}/></div>
                <h2 style={{fontFamily:"'Outfit'",fontSize:24,fontWeight:800,color:C.n950,letterSpacing:-.5,marginBottom:6}}>Введите код</h2>
                <p style={{fontSize:14,color:C.n400}}>Отправили 4-значный код на</p>
                <p style={{fontSize:14,fontWeight:600,color:C.n950}}>{authEmail}</p>
              </div>

              <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:24}}>
                {authOtp.map((d,i)=>(
                  <input key={i} id={"otp-"+i} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e=>handleOtpChange(i,e.target.value)} onKeyDown={e=>handleOtpKeyDown(i,e)} style={{width:56,height:64,textAlign:"center",fontSize:28,fontWeight:700,fontFamily:"'Outfit'",borderRadius:14,border:`1.5px solid ${d?C.coral:C.n200}`,outline:"none",background:d?C.coralL+"60":C.n50,color:C.n950,transition:"all .2s"}}/>
                ))}
              </div>

              {authError&&<p style={{fontSize:13,color:"#E24B4A",textAlign:"center",marginBottom:12}}>{authError}</p>}

              <button onClick={verifyOtp} disabled={authLoading} style={{width:"100%",padding:"16px",background:authLoading?C.n200:C.coral,color:"#fff",borderRadius:16,border:"none",fontSize:16,fontWeight:700,fontFamily:"inherit",cursor:authLoading?"wait":"pointer",boxShadow:authLoading?"none":"0 4px 20px rgba(232,89,60,.25)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {authLoading&&<div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:9,animation:"spin .6s linear infinite"}}/>}
                Подтвердить
              </button>

              <div style={{textAlign:"center",marginTop:20}}>
                <p style={{fontSize:13,color:C.n400,marginBottom:6}}>Не получили код?</p>
                <button onClick={()=>setToast("Код отправлен повторно")} style={{background:"none",border:"none",color:C.coral,fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Отправить ещё раз</button>
              </div>
            </div>
          )}

          {/* ═══ HOME ═══ */}
          {isLoggedIn&&screen==="home"&&(
            <div style={{...$.pad,animation:anim?"fi .4s ease":"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <div>
                  <p style={{fontSize:14,color:C.n400,fontWeight:500}}>{greeting}</p>
                  <h1 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:C.n950,letterSpacing:-.8}}>Что решаем?</h1>
                </div>
                <div style={$.avatar} onClick={()=>{setTab("user");go("profile");}}>
                  <span style={{color:"#fff",fontSize:15,fontWeight:700,fontFamily:"'Outfit'"}}>ДК</span>
                </div>
              </div>

              {/* Quick AI */}
              <button style={$.quickBtn} onClick={()=>pickCat(CATS[Math.floor(Math.random()*4)])}>
                <div style={{...$.iconWrap,width:40,height:40,background:C.coralL}}><I name="sparkle" size={18} color={C.coral}/></div>
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{fontSize:15,fontWeight:600,color:C.n950}}>Быстрый выбор</p>
                  <p style={{fontSize:12,color:C.n400,marginTop:1}}>AI подберёт за тебя</p>
                </div>
                <I name="arrowR" size={16} color={C.n400}/>
              </button>

              {/* Subscription status */}
              {isPro?(
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"linear-gradient(135deg,#FAECE7,#FBEAF0)",borderRadius:12,marginBottom:20}}>
                  <I name="sparkle" size={16} color={C.coral}/>
                  <span style={{fontSize:13,fontWeight:600,color:C.coral,flex:1}}>PRO — безлимитный AI</span>
                  <span style={{fontSize:11,fontWeight:600,color:C.rose,background:"rgba(255,255,255,.7)",padding:"3px 10px",borderRadius:20}}>Активна</span>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:12,marginBottom:20,cursor:"pointer"}} onClick={()=>setShowPaywall(true)}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.n950}}>Осталось {Math.max(0,FREE_LIMIT-usedReqs)} из {FREE_LIMIT} бесплатных</p>
                    <div style={{height:4,borderRadius:2,background:C.n200,marginTop:6}}>
                      <div style={{height:4,borderRadius:2,background:usedReqs>=FREE_LIMIT-1?C.coral:C.emerald,width:`${Math.min(100,(usedReqs/FREE_LIMIT)*100)}%`,transition:"width .4s ease"}}/>
                    </div>
                  </div>
                  <span style={{fontSize:12,fontWeight:600,color:C.coral}}>PRO</span>
                  <I name="arrowR" size={14} color={C.coral}/>
                </div>
              )}

              {/* Categories */}
              <p style={$.secLabel}>Категории</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
                {CATS.map((c,i)=>{
                  const cc=CAT_COLORS[c.id];
                  return(
                    <button key={c.id} style={{...$.catCard,animation:anim?`su .45s ease ${i*60}ms both`:"none"}} onClick={()=>pickCat(c)}>
                      <div style={{...$.iconWrap,background:cc.l,marginBottom:10}}><I name={c.icon} size={22} color={cc.m} sw={1.8}/></div>
                      <p style={{fontSize:15,fontWeight:700,fontFamily:"'Outfit'",color:C.n950}}>{c.label}</p>
                      <p style={{fontSize:12,color:C.n400,marginTop:2}}>{c.sub}</p>
                    </button>
                  );
                })}
              </div>

              {/* History */}
              <p style={$.secLabel}>Последние решения</p>
              {history.slice(0,3).map((h,i)=>{
                const cc=CAT_COLORS[h.cat]||CAT_COLORS.movie;
                const icon={movie:"film",food:"fork",fun:"compass",gift:"gift"}[h.cat];
                return(
                  <div key={h.id} style={{...$.histCard,animation:anim?`su .4s ease ${(i+4)*60}ms both`:"none"}}>
                    <div style={{...$.iconWrap,width:36,height:36,background:cc.l}}><I name={icon} size={16} color={cc.m}/></div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:14,fontWeight:600,color:C.n950}}>{h.name}</p>
                      <p style={{fontSize:12,color:C.n400,marginTop:1}}>{h.when}{h.with?", "+h.with:""}</p>
                    </div>
                    {h.rating>0&&(
                      <div style={{display:"flex",alignItems:"center",gap:3,padding:"4px 8px",background:C.amberL,borderRadius:8}}>
                        <I name="star" size={12} color={C.amber}/><span style={{color:C.amber,fontSize:12,fontWeight:600}}>{h.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ DECISION ═══ */}
          {isLoggedIn&&screen==="decision"&&cat&&(
            <div style={{...$.pad,animation:anim?"fi .35s ease":"none"}}>
              <button onClick={goHome} aria-label="Назад" style={$.backBtn}><I name="arrowL" size={20} color={C.n950}/></button>
              <div style={{textAlign:"center",marginBottom:28}}>
                <div style={{...$.iconWrap,width:56,height:56,margin:"0 auto 12px",background:accentL}}><I name={cat.icon} size={26} color={accent} sw={1.8}/></div>
                <h2 style={{fontFamily:"'Outfit'",fontSize:24,fontWeight:700,color:C.n950,letterSpacing:-.5}}>{cat.label}</h2>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:32}}>
                {QUESTIONS[cat.id].map((_,i)=>(
                  <div key={i} style={{width:8,height:8,borderRadius:4,background:i<=qIdx?accent:C.n200,transform:i===qIdx?"scale(1.4)":"scale(1)",transition:"all .3s cubic-bezier(.32,.72,0,1)"}}/>
                ))}
              </div>
              <div key={qIdx} style={{animation:"su .35s ease"}}>
                <h3 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:700,color:C.n950,marginBottom:20,letterSpacing:-.5,lineHeight:1.2}}>{QUESTIONS[cat.id][qIdx].q}</h3>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {QUESTIONS[cat.id][qIdx].opts.map((opt,i)=>(
                    <button key={opt} className="opt-btn" style={{...$.optBtn,animation:`su .35s ease ${i*50}ms both`,borderColor:accent+"25"}} onClick={()=>answer(opt)}>
                      <span style={{fontSize:16,fontWeight:500,color:C.n950}}>{opt}</span>
                      <I name="arrowR" size={16} color={C.n200}/>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ RESULT ═══ */}
          {isLoggedIn&&screen==="result"&&cat&&(
            <div style={{...$.pad,animation:anim?"si .45s ease":"none"}}>
              <button onClick={goHome} aria-label="Назад" style={$.backBtn}><I name="arrowL" size={20} color={C.n950}/></button>

              {loading?(
                <div style={{textAlign:"center",paddingTop:60}}>
                  <div style={{position:"relative",width:64,height:64,margin:"0 auto 24px"}}>
                    <div style={{position:"absolute",inset:0,border:`3px solid ${C.n200}`,borderTopColor:accent,borderRadius:32,animation:"spin .8s linear infinite"}}/>
                    <div style={{position:"absolute",inset:8,border:`2px solid ${C.n100}`,borderBottomColor:accent+"60",borderRadius:24,animation:"spin 1.4s linear infinite reverse"}}/>
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><I name="sparkle" size={20} color={accent}/></div>
                  </div>
                  <p style={{fontFamily:"'Outfit'",fontSize:20,fontWeight:700,color:C.n950}}>Claude думает</p>
                  <p key={loadMsg} style={{fontSize:14,color:C.n400,marginTop:6,animation:"fi .4s ease"}}>{LOAD_MSGS[loadMsg]}</p>
                  <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:20}}>
                    {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:3,background:accent,animation:`pulse 1.2s ease ${i*200}ms infinite`}}/>)}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20,flexWrap:"wrap"}}>
                    {answers.map((a,i)=><span key={i} style={{...$.tag,borderColor:accent+"40",color:accent}}>{a.answer}</span>)}
                  </div>
                </div>
              ):rec?(
                <>
                  <div style={$.resultCard}>
                    <div style={{height:140,background:`linear-gradient(135deg, ${accentL} 0%, ${accent}18 100%)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                      <div style={{...$.iconWrap,width:64,height:64,background:"rgba(255,255,255,.88)",backdropFilter:"blur(8px)"}}><I name={cat.icon} size={30} color={accent} sw={1.6}/></div>
                      {aiSource==="claude"&&<div style={{position:"absolute",top:12,right:12,display:"flex",alignItems:"center",gap:4,padding:"4px 10px",background:"rgba(255,255,255,.9)",borderRadius:20,backdropFilter:"blur(8px)"}}><I name="sparkle" size={12} color={accent}/><span style={{fontSize:10,fontWeight:700,color:accent}}>Claude AI</span></div>}
                    </div>
                    <div style={{padding:"16px 18px 20px"}}>
                      <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{...$.tag,background:accentL,color:accent}}>{cat.label}</span>
                        {rec.tags?.slice(0,2).map((t,i)=><span key={i} style={$.tag}>{t}</span>)}
                      </div>
                      <h2 style={{fontFamily:"'Outfit'",fontSize:24,fontWeight:800,color:C.n950,letterSpacing:-.5,marginBottom:6}}>{rec.name}</h2>
                      <p style={{fontSize:14,color:C.n600,lineHeight:1.55,marginBottom:14}}>{rec.desc}</p>

                      {/* AI reason */}
                      <div style={{background:C.white,border:`0.5px solid ${C.n200}`,borderRadius:12,padding:"12px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                          <I name="sparkle" size={14} color={accent}/><span style={{fontSize:12,fontWeight:600,color:accent}}>{aiSource==="claude"?"Claude AI объясняет":"Почему это"}</span>
                        </div>
                        <p style={{fontSize:13,color:C.n600,lineHeight:1.55}}>{rec.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}} role="group" aria-label="Действия с рекомендацией">
                    <button aria-label={liked?"Убрать из избранного":"В избранное"} style={{...$.circleBtn,background:liked?C.coral:C.n100}} onClick={()=>{setLiked(!liked);if(!liked)saveDecision();}}>
                      <I name="heart" size={20} color={liked?"#fff":C.n400} fill={liked?"#fff":"none"} sw={liked?0:1.5}/>
                    </button>
                    <button style={{...$.primaryBtn,background:accent,flex:1}} onClick={()=>{setToast("Ссылка скопирована");}}> 
                      <I name="share" size={17} color="#fff"/><span>Поделиться</span>
                    </button>
                    <button aria-label="Другой вариант" style={$.circleBtn} onClick={regenerate}>
                      <I name="refresh" size={20} color={C.n400}/>
                    </button>
                  </div>

                  {/* Alternatives */}
                  {rec.alts?.length>0&&(
                    <>
                      <p style={{...$.secLabel,marginTop:0}}>Ещё варианты</p>
                      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
                        {rec.alts.map((a,i)=>(
                          <div key={i} style={$.altCard}>
                            <div style={{width:44,height:44,borderRadius:12,background:accent+"12",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
                              <I name={cat.icon} size={18} color={accent}/>
                            </div>
                            <p style={{fontSize:13,fontWeight:600,color:C.n950,marginBottom:2}}>{a.name}</p>
                            <p style={{fontSize:11,color:C.n400,lineHeight:1.4}}>{a.desc}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Your answers */}
                  <p style={{...$.secLabel,marginTop:16}}>Ваши ответы</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {answers.map((a,i)=><span key={i} style={{...$.tag,borderColor:accent+"30",color:accent}}>{a.answer}</span>)}
                  </div>
                </>
              ):null}
            </div>
          )}

          {/* ═══ PROFILE ═══ */}
          {isLoggedIn&&screen==="profile"&&(
            <div style={{...$.pad,animation:anim?"fi .4s ease":"none"}}>
              <button onClick={goHome} aria-label="Назад" style={$.backBtn}><I name="arrowL" size={20} color={C.n950}/></button>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{position:"relative",width:72,height:72,margin:"0 auto 12px"}}>
                  <div style={{...$.avatar,width:72,height:72}}><span style={{color:"#fff",fontSize:22,fontWeight:700,fontFamily:"'Outfit'"}}>ДК</span></div>
                  {isPro&&<div style={{position:"absolute",bottom:-2,right:-2,width:24,height:24,borderRadius:12,background:"linear-gradient(135deg,#E8593C,#D4537E)",border:"2.5px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}><I name="sparkle" size={11} color="#fff"/></div>}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <h2 style={{fontFamily:"'Outfit'",fontSize:22,fontWeight:700,color:C.n950}}>Дмитрий К.</h2>
                  {isPro&&<span style={{fontSize:10,fontWeight:700,color:"#fff",background:"linear-gradient(135deg,#E8593C,#D4537E)",padding:"2px 8px",borderRadius:10}}>PRO</span>}
                </div>
                <p style={{fontSize:13,color:C.n400,marginTop:2}}>Пользуется с марта 2026</p>
              </div>

              {/* Subscription card */}
              {isPro?(
                <div style={{padding:"16px 18px",background:"linear-gradient(135deg,#FAECE7,#FBEAF0)",borderRadius:16,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><I name="sparkle" size={16} color={C.coral}/><span style={{fontSize:15,fontWeight:700,fontFamily:"'Outfit'",color:C.coral}}>Решалка PRO</span></div>
                    <span style={{fontSize:12,fontWeight:600,color:C.emerald,background:C.emeraldL,padding:"3px 10px",borderRadius:20}}>Активна</span>
                  </div>
                  <p style={{fontSize:12,color:C.n600}}>Безлимитный AI, приоритет, персональный профиль, аналитика, без рекламы</p>
                  <button onClick={()=>{setIsPro(false);setToast("Подписка отменена");}} style={{marginTop:10,background:"none",border:"none",fontSize:12,color:C.n400,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>Управление подпиской</button>
                </div>
              ):(
                <button onClick={()=>setShowPaywall(true)} style={{width:"100%",padding:"16px 18px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:16,marginBottom:20,cursor:"pointer",outline:"none",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#E8593C,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I name="sparkle" size={20} color="#fff"/></div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:15,fontWeight:600,color:C.n950}}>Перейти на PRO</p>
                    <p style={{fontSize:12,color:C.n400,marginTop:1}}>от {PRICES.year.amount} ₽/мес · безлимитный AI</p>
                  </div>
                  <I name="arrowR" size={16} color={C.n400}/>
                </button>
              )}

              <div style={{display:"flex",gap:10,marginBottom:24}}>
                {[{n:history.length,l:"Решений"},{n:"12",l:"Обзоров"},{n:"8",l:"Друзей"}].map((s,i)=>(
                  <div key={i} style={$.statCard}>
                    <p style={{fontSize:22,fontWeight:700,fontFamily:"'Outfit'",color:C.n950}}>{s.n}</p>
                    <p style={{fontSize:11,color:C.n400,fontWeight:500,marginTop:2}}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Analytics (PRO only) */}
              {isPro&&<>
                <p style={$.secLabel}>Аналитика вкусов</p>
                <div style={{padding:"16px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:16,marginBottom:20}}>
                  {[{label:"Фильмы",pct:38,c:C.coral},{label:"Еда",pct:28,c:C.emerald},{label:"Досуг",pct:22,c:C.azure},{label:"Подарки",pct:12,c:C.rose}].map((a,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<3?10:0}}>
                      <span style={{fontSize:12,fontWeight:600,color:C.n950,minWidth:56}}>{a.label}</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:C.n100}}>
                        <div style={{height:8,borderRadius:4,background:a.c,width:`${a.pct}%`,transition:"width .6s ease"}}/>
                      </div>
                      <span style={{fontSize:12,fontWeight:600,color:C.n400,minWidth:28,textAlign:"right"}}>{a.pct}%</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                  <div style={$.statCard}>
                    <p style={{fontSize:11,color:C.n400,fontWeight:500,marginBottom:4}}>Точность AI</p>
                    <p style={{fontSize:22,fontWeight:700,fontFamily:"'Outfit'",color:C.emerald}}>87%</p>
                  </div>
                  <div style={$.statCard}>
                    <p style={{fontSize:11,color:C.n400,fontWeight:500,marginBottom:4}}>Время экономии</p>
                    <p style={{fontSize:22,fontWeight:700,fontFamily:"'Outfit'",color:C.azure}}>4.2ч</p>
                  </div>
                </div>
              </>}

              <p style={$.secLabel}>Предпочтения</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
                {["Грузинская кухня","Триллеры","Квесты","На двоих","Средний бюджет"].map((t,i)=><span key={i} style={$.tag}>{t}</span>)}
              </div>
              <p style={$.secLabel}>История</p>
              {history.map((h,i)=>{
                const cc=CAT_COLORS[h.cat]||CAT_COLORS.movie;
                const icon={movie:"film",food:"fork",fun:"compass",gift:"gift"}[h.cat];
                return(
                  <div key={h.id} style={{...$.histCard,animation:anim?`su .4s ease ${i*50}ms both`:"none"}}>
                    <div style={{...$.iconWrap,width:36,height:36,background:cc.l}}><I name={icon} size={16} color={cc.m}/></div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:14,fontWeight:600,color:C.n950}}>{h.name}</p>
                      <p style={{fontSize:12,color:C.n400,marginTop:1}}>{h.when}</p>
                    </div>
                    {h.rating>0&&<div style={{display:"flex",alignItems:"center",gap:3,padding:"4px 8px",background:C.amberL,borderRadius:8}}><I name="star" size={12} color={C.amber}/><span style={{color:C.amber,fontSize:12,fontWeight:600}}>{h.rating.toFixed(1)}</span></div>}
                  </div>
                );
              })}
              <button onClick={logout} style={{width:"100%",padding:"14px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:14,marginTop:20,fontSize:14,fontWeight:500,color:"#E24B4A",cursor:"pointer",fontFamily:"inherit"}}>Выйти из аккаунта</button>
            </div>
          )}

          {/* ═══ EXPLORE ═══ */}}
          {isLoggedIn&&screen==="explore"&&(
            <div style={{...$.pad,animation:anim?"fi .4s ease":"none"}}>
              <h1 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:C.n950,letterSpacing:-.8,marginBottom:20}}>Обзор</h1>

              {/* Search */}
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:14,marginBottom:24}}>
                <I name="search" size={18} color={C.n400}/>
                <span style={{fontSize:15,color:C.n400}}>Поиск мест, фильмов, идей...</span>
              </div>

              {/* Trending */}
              <p style={$.secLabel}>Популярное сейчас</p>
              {[
                {cat:"food",name:"Саперави",desc:"Грузинская кухня",rating:4.7,reviews:128},
                {cat:"fun",name:"Квест «Тайная комната»",desc:"Командный квест 60 мин",rating:4.8,reviews:94},
                {cat:"movie",name:"Интерстеллар",desc:"Космическая драма",rating:5.0,reviews:312},
              ].map((item,i)=>{
                const cc=CAT_COLORS[item.cat];
                const icon={movie:"film",food:"fork",fun:"compass",gift:"gift"}[item.cat];
                return(
                  <div key={i} style={{...$.histCard,animation:anim?`su .4s ease ${i*60}ms both`:"none",cursor:"pointer"}} onClick={()=>{
                    const c=CATS.find(x=>x.id===item.cat);
                    if(c)pickCat(c);
                  }}>
                    <div style={{...$.iconWrap,width:48,height:48,background:cc.l,borderRadius:14}}><I name={icon} size={20} color={cc.m}/></div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:15,fontWeight:600,color:C.n950}}>{item.name}</p>
                      <p style={{fontSize:12,color:C.n400,marginTop:2}}>{item.desc}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end"}}>
                        <I name="star" size={12} color={C.amber}/><span style={{fontSize:13,fontWeight:600,color:C.amber}}>{item.rating}</span>
                      </div>
                      <p style={{fontSize:11,color:C.n400,marginTop:2}}>{item.reviews} отзывов</p>
                    </div>
                  </div>
                );
              })}

              {/* By category */}
              <p style={{...$.secLabel,marginTop:20}}>По категориям</p>
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
                {CATS.map((c,i)=>{
                  const cc=CAT_COLORS[c.id];
                  return(
                    <button key={c.id} style={{...$.altCard,minWidth:120,textAlign:"center",cursor:"pointer",animation:anim?`su .4s ease ${(i+3)*60}ms both`:"none"}} onClick={()=>pickCat(c)}>
                      <div style={{...$.iconWrap,width:44,height:44,background:cc.l,margin:"0 auto 8px"}}><I name={c.icon} size={20} color={cc.m} sw={1.8}/></div>
                      <p style={{fontSize:13,fontWeight:600,color:C.n950}}>{c.label}</p>
                    </button>
                  );
                })}
              </div>

              {/* Recent reviews */}
              <p style={{...$.secLabel,marginTop:20}}>Свежие отзывы</p>
              {[
                {user:"Аня М.",text:"Потрясающие хинкали! Обязательно берите с бараниной.",place:"Саперави",rating:5},
                {user:"Макс К.",text:"Квест реально сложный, но мы справились за 58 минут!",place:"Тайная комната",rating:4},
                {user:"Лера В.",text:"Лучший рамен в Москве, бульон невероятный.",place:"Рамен изакая",rating:5},
              ].map((r,i)=>(
                <div key={i} style={{padding:"14px 16px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:14,marginBottom:8,animation:anim?`su .4s ease ${(i+6)*60}ms both`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:14,background:C.n100,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:11,fontWeight:600,color:C.n600}}>{r.user[0]}</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:600,color:C.n950}}>{r.user}</span>
                    </div>
                    <div style={{display:"flex",gap:2}}>{Array.from({length:r.rating}).map((_,j)=><I key={j} name="star" size={11} color={C.amber} fill={C.amber} sw={0}/>)}</div>
                  </div>
                  <p style={{fontSize:13,color:C.n600,lineHeight:1.5}}>{r.text}</p>
                  <p style={{fontSize:11,color:C.n400,marginTop:6}}>о «{r.place}»</p>
                </div>
              ))}
            </div>
          )}

          {/* ═══ VOTING ═══ */}
          {isLoggedIn&&screen==="voting"&&(
            <div style={{...$.pad,animation:anim?"fi .4s ease":"none"}}>
              <h1 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:C.n950,letterSpacing:-.8,marginBottom:20}}>Вместе</h1>

              {/* Create new */}
              <button style={{...$.quickBtn,marginBottom:20}} onClick={()=>{const c=CATS[Math.floor(Math.random()*4)];pickCat(c);setToast("Создаём голосование...");}}>
                <div style={{...$.iconWrap,width:44,height:44,background:C.roseL,borderRadius:14}}><I name="vote" size={20} color={C.rose} sw={1.8}/></div>
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{fontSize:15,fontWeight:600,color:C.n950}}>Новое голосование</p>
                  <p style={{fontSize:12,color:C.n400,marginTop:1}}>Решайте вместе с друзьями</p>
                </div>
                <I name="arrowR" size={16} color={C.n400}/>
              </button>

              {/* Active voting */}
              <p style={$.secLabel}>Активные</p>
              <div style={{...$.resultCard,marginBottom:14,animation:anim?"su .4s ease":"none"}}>
                <div style={{padding:"16px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{...$.iconWrap,width:36,height:36,background:C.emeraldL}}><I name="fork" size={16} color={C.emerald}/></div>
                      <div>
                        <p style={{fontSize:15,fontWeight:600,color:C.n950}}>Где поесть в пятницу</p>
                        <p style={{fontSize:12,color:C.n400}}>Осталось 2ч 15мин</p>
                      </div>
                    </div>
                    <span style={{...$.tag,background:C.emeraldL,color:C.emerald}}>3/5</span>
                  </div>

                  {/* Participants */}
                  <div style={{display:"flex",gap:6,marginBottom:14}}>
                    {[{n:"Вы",c:C.coralL,t:C.coral,done:true},{n:"Аня",c:C.emeraldL,t:C.emerald,done:true},{n:"Макс",c:C.azureL,t:C.azure,done:true},{n:"Лера",c:C.roseL,t:C.rose,done:false},{n:"Дима",c:C.n100,t:C.n400,done:false}].map((p,i)=>(
                      <div key={i} style={{textAlign:"center"}}>
                        <div style={{width:36,height:36,borderRadius:18,background:p.c,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                          <span style={{fontSize:12,fontWeight:600,color:p.t}}>{p.n[0]}</span>
                          {p.done&&<div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:7,background:C.emerald,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}><I name="check" size={8} color="#fff" sw={3}/></div>}
                        </div>
                        <p style={{fontSize:10,color:C.n400,marginTop:3}}>{p.n}</p>
                      </div>
                    ))}
                  </div>

                  {/* Vote bars */}
                  {[{name:"Саперави",pct:67},{name:"Хачапурная №1",pct:50},{name:"Рамен изакая",pct:33}].map((v,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{flex:1}}>
                        <p style={{fontSize:13,fontWeight:600,color:C.n950,marginBottom:4}}>{v.name}</p>
                        <div style={{height:6,borderRadius:3,background:C.n100}}>
                          <div style={{height:6,borderRadius:3,background:C.emerald,width:`${v.pct}%`,transition:"width .6s cubic-bezier(.32,.72,0,1)"}}/>
                        </div>
                      </div>
                      <span style={{fontSize:14,fontWeight:700,color:C.emerald,minWidth:36,textAlign:"right"}}>{v.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past votings */}
              <p style={$.secLabel}>Завершённые</p>
              {[
                {title:"Что посмотреть в субботу",cat:"movie",winner:"Интерстеллар",when:"2 дня назад",people:4},
                {title:"Подарок Лере",cat:"gift",winner:"Мастер-класс гончарства",when:"Неделю назад",people:3},
              ].map((v,i)=>{
                const cc=CAT_COLORS[v.cat];
                const icon={movie:"film",food:"fork",fun:"compass",gift:"gift"}[v.cat];
                return(
                  <div key={i} style={{...$.histCard,animation:anim?`su .4s ease ${(i+2)*60}ms both`:"none"}}>
                    <div style={{...$.iconWrap,width:40,height:40,background:cc.l,borderRadius:12}}><I name={icon} size={18} color={cc.m}/></div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:14,fontWeight:600,color:C.n950}}>{v.title}</p>
                      <p style={{fontSize:12,color:C.n400,marginTop:1}}>Победил: {v.winner}</p>
                      <p style={{fontSize:11,color:C.n400,marginTop:1}}>{v.when} · {v.people} чел.</p>
                    </div>
                    <I name="check" size={18} color={C.emerald}/>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {isLoggedIn&&<><div style={$.tabBar} role="navigation" aria-label="Основная навигация">
          {[
            {id:"home",icon:"home",label:"Главная",action:goHome},
            {id:"search",icon:"search",label:"Обзор",action:()=>{setTab("search");go("explore");}},
            {id:"vote",icon:"vote",label:"Вместе",action:()=>{setTab("vote");go("voting");}},
            {id:"user",icon:"user",label:"Профиль",action:()=>{setTab("user");go("profile");}},
          ].map(t=>{
            const active=
              (t.id==="home"&&screen==="home")||
              (t.id==="user"&&screen==="profile")||
              (t.id==="search"&&screen==="explore")||
              (t.id==="vote"&&screen==="voting")||
              tab===t.id;
            return(
              <button key={t.id} style={$.tabItem} onClick={t.action} aria-current={active?"page":undefined} aria-label={t.label}>
                <I name={t.icon} size={22} color={active?C.coral:C.n400} sw={1.6}/>
                <span style={{fontSize:10,fontWeight:500,color:active?C.coral:C.n400,marginTop:2}}>{t.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{width:134,height:5,borderRadius:3,background:C.n950,margin:"6px auto 8px",flexShrink:0}}/></>}

        {/* Toast */}
        <div aria-live="polite" aria-atomic="true">{toast&&<div style={$.toast}>{toast}</div>}</div>

        {/* Paywall modal */}
        {showPaywall&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowPaywall(false)}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"#fff",borderRadius:"24px 24px 0 0",padding:"28px 20px 40px",animation:"su .4s ease"}}>
            <div style={{width:40,height:4,borderRadius:2,background:C.n200,margin:"0 auto 20px"}}/>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#E8593C,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 6px 24px rgba(232,89,60,.3)"}}><I name="sparkle" size={24} color="#fff"/></div>
              <h3 style={{fontFamily:"'Outfit'",fontSize:22,fontWeight:800,color:C.n950,marginBottom:6}}>Бесплатные запросы закончились</h3>
              <p style={{fontSize:14,color:C.n400}}>Вы использовали {usedReqs} из {FREE_LIMIT}. Перейдите на PRO для безлимитного AI.</p>
            </div>

            {/* Billing toggle */}
            <div style={{display:"flex",background:C.n100,borderRadius:12,padding:3,marginBottom:16}}>
              {[{id:"month",label:"Месяц"},{id:"year",label:"Год"}].map(b=>(
                <button key={b.id} onClick={()=>setBillingPeriod(b.id)} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",fontSize:14,fontWeight:600,fontFamily:"inherit",cursor:"pointer",background:billingPeriod===b.id?"#fff":"transparent",color:billingPeriod===b.id?C.n950:C.n400,boxShadow:billingPeriod===b.id?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .2s"}}>{b.label}</button>
              ))}
            </div>

            {/* Price */}
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:4}}>
                <span style={{fontFamily:"'Outfit'",fontSize:40,fontWeight:800,color:C.n950}}>{PRICES[billingPeriod].amount} ₽</span>
                <span style={{fontSize:14,color:C.n400}}>/ {PRICES[billingPeriod].period}</span>
              </div>
              {PRICES[billingPeriod].save&&<span style={{fontSize:12,fontWeight:600,color:C.emerald,background:C.emeraldL,padding:"3px 10px",borderRadius:20,marginTop:6,display:"inline-block"}}>{PRICES[billingPeriod].save}</span>}
            </div>

            {/* Features */}
            <div style={{marginBottom:20}}>
              {["Безлимитные AI-рекомендации","Приоритетный Claude AI","Персональный профиль вкусов","Аналитика ваших решений","Без рекламы навсегда"].map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0"}}>
                  <div style={{width:20,height:20,borderRadius:10,background:C.emeraldL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I name="check" size={12} color={C.emerald} sw={2.5}/></div>
                  <span style={{fontSize:14,color:C.n950}}>{f}</span>
                </div>
              ))}
            </div>

            <button onClick={()=>{setIsPro(true);setShowPaywall(false);setToast("Добро пожаловать в PRO!");}} style={{width:"100%",padding:"16px",background:C.coral,color:"#fff",borderRadius:16,border:"none",fontSize:16,fontWeight:700,fontFamily:"inherit",cursor:"pointer",boxShadow:"0 4px 20px rgba(232,89,60,.3)",transition:"all .2s",marginBottom:8}}>
              Оформить подписку
            </button>
            <button onClick={()=>setShowPaywall(false)} style={{width:"100%",padding:"12px",background:"none",border:"none",fontSize:14,color:C.n400,cursor:"pointer",fontFamily:"inherit"}}>
              Не сейчас
            </button>
          </div>
        </div>}
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const $={
  root:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px",fontFamily:"'DM Sans',-apple-system,sans-serif",background:"linear-gradient(145deg,#f5f4f1 0%,#e8e6e1 100%)"},
  phone:{width:375,height:812,background:"#fff",borderRadius:44,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.12),0 2px 6px rgba(0,0,0,.06),inset 0 0 0 .5px rgba(0,0,0,.08)",position:"relative",display:"flex",flexDirection:"column"},
  statusBar:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 28px 6px",flexShrink:0},
  statusTime:{fontSize:15,fontWeight:600,color:C.n950,fontFamily:"'Outfit'"},
  content:{flex:1,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch"},
  pad:{padding:"4px 20px 20px"},
  avatar:{width:44,height:44,borderRadius:22,background:`linear-gradient(135deg,${C.coral},${C.rose})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 12px ${C.coral}40`,flexShrink:0},
  quickBtn:{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:16,marginBottom:28,cursor:"pointer",outline:"none",textAlign:"left",transition:"all .2s ease"},
  iconWrap:{width:44,height:44,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  secLabel:{fontSize:12,fontWeight:700,color:C.n400,textTransform:"uppercase",letterSpacing:.8,marginBottom:12,fontFamily:"'Outfit'"},
  catCard:{background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:18,padding:"20px 14px 16px",cursor:"pointer",outline:"none",textAlign:"left",transition:"all .25s cubic-bezier(.32,.72,0,1)"},
  histCard:{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:14,marginBottom:8},
  backBtn:{background:"none",border:"none",cursor:"pointer",padding:"4px 0",marginBottom:12,outline:"none"},
  optBtn:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",background:C.n50,border:"0.5px solid",borderRadius:14,cursor:"pointer",outline:"none",transition:"all .2s cubic-bezier(.32,.72,0,1)",textAlign:"left"},
  resultCard:{background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:22,overflow:"hidden",marginBottom:16},
  tag:{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:C.n100,color:C.n600,display:"inline-block"},
  circleBtn:{width:48,height:48,borderRadius:24,background:C.n100,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",outline:"none",flexShrink:0,transition:"all .25s ease"},
  primaryBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 20px",borderRadius:24,border:"none",color:"#fff",fontSize:15,fontWeight:600,fontFamily:"'DM Sans'",cursor:"pointer",outline:"none",transition:"all .2s ease",boxShadow:`0 4px 16px ${C.coral}30`},
  altCard:{minWidth:140,padding:14,background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:16,flexShrink:0},
  statCard:{flex:1,textAlign:"center",padding:"16px 8px",background:C.n50,border:`0.5px solid ${C.n200}`,borderRadius:14},
  tabBar:{display:"flex",justifyContent:"space-around",alignItems:"flex-start",padding:"8px 8px 0",borderTop:`0.5px solid ${C.n200}`,background:"rgba(255,255,255,.94)",backdropFilter:"blur(16px)",flexShrink:0},
  tabItem:{display:"flex",flexDirection:"column",alignItems:"center",gap:0,background:"none",border:"none",cursor:"pointer",outline:"none",padding:"4px 12px"},
  toast:{position:"absolute",bottom:100,left:"50%",transform:"translateX(-50%)",background:C.n950,color:"#fff",fontSize:13,fontWeight:600,padding:"10px 20px",borderRadius:24,animation:"toast 2.5s ease forwards",pointerEvents:"none",whiteSpace:"nowrap"},
};
