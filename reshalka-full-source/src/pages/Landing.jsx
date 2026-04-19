import { useState, useEffect, useRef } from "react";

function Ic({name,size=24,color="#1d1d1f",fill="none"}){
  const d={
    film:<><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></>,
    fork:<><line x1="12" y1="2" x2="12" y2="14"/><path d="M5 2v6a3 3 0 006 0V2"/><line x1="12" y1="14" x2="12" y2="22"/></>,
    compass:<><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></>,
    gift:<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></>,
    sparkle:<><path d="M12 2L13.5 8.5 20 10 13.5 11.5 12 18 10.5 11.5 4 10 10.5 8.5z"/></>,
    users:<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    vote:<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    zap:<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    star:<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    arrowR:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowUp:<><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    map:<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    download:<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">{d[name]}</svg>;
}

function Reveal({children,delay=0,style={}}){
  const r=useRef(null);
  const [v,setV]=useState(false);
  useEffect(()=>{
    if(!r.current)return;
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:.12});
    o.observe(r.current);return()=>o.disconnect();
  },[]);
  return <div ref={r} style={{...style,opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:"opacity .65s cubic-bezier(.32,.72,0,1) "+delay+"ms, transform .65s cubic-bezier(.32,.72,0,1) "+delay+"ms"}}>{children}</div>;
}

const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});};
const NAV=[{l:"Возможности",id:"features"},{l:"Как работает",id:"how"},{l:"Отзывы",id:"reviews"}];

export default function Landing(){
  const [email,setEmail]=useState("");
  const [ok,setOk]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [showTop,setShowTop]=useState(false);
  const [modal,setModal]=useState(null);
  useEffect(()=>{const h=()=>{setScrolled(window.scrollY>40);setShowTop(window.scrollY>600);};window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  const submit=()=>{if(email.includes("@"))setOk(true);};

  return(
    <div style={{fontFamily:"'DM Sans',-apple-system,sans-serif",color:"#1d1d1f",overflowX:"hidden"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes flB{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(1deg)}}@keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}.hu:hover{transform:translateY(-3px)!important}.hu:active{transform:scale(.98)!important}.na:hover{color:#E8593C!important}.fc:hover{transform:translateY(-4px)!important;border-color:#d1d1d6!important}"}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:scrolled?"rgba(255,255,255,.92)":"rgba(255,255,255,.6)",backdropFilter:"blur(16px)",borderBottom:scrolled?"0.5px solid #e5e5ea":"0.5px solid transparent",transition:"all .3s"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#E8593C,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="sparkle" size={16} color="#fff"/></div>
            <span style={{fontFamily:"'Outfit'",fontSize:20,fontWeight:800,letterSpacing:-.5}}>Решалка</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:28}}>
            {NAV.map(n=><button key={n.id} className="na" onClick={()=>scrollTo(n.id)} style={{background:"none",border:"none",fontSize:14,fontWeight:500,color:"#636366",cursor:"pointer",fontFamily:"inherit",transition:"color .2s"}}>{n.l}</button>)}
            <button className="hu" onClick={()=>window.location.href="/app"} style={{padding:"9px 20px",background:"#1d1d1f",color:"#fff",borderRadius:24,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",display:"flex",alignItems:"center",gap:6}}><Ic name="download" size={14} color="#fff"/>Скачать</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{maxWidth:1100,margin:"0 auto",padding:"72px 24px 48px",display:"flex",alignItems:"center",gap:48,flexWrap:"wrap",minHeight:"80vh"}}>
        <div style={{flex:1,minWidth:300}}>
          <div style={{animation:"fu .6s ease both"}}><span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:24,background:"#FAECE7",color:"#E8593C",fontSize:13,fontWeight:600,marginBottom:20}}><Ic name="zap" size={14} color="#E8593C"/>Новый способ выбирать</span></div>
          <h1 style={{fontFamily:"'Outfit'",fontSize:"clamp(36px,5vw,56px)",fontWeight:900,lineHeight:1.05,letterSpacing:-2,marginBottom:20,animation:"fu .6s ease .1s both"}}>Перестань<br/><span style={{color:"#E8593C"}}>мучить себя</span><br/>выбором</h1>
          <p style={{fontSize:17,color:"#636366",lineHeight:1.6,maxWidth:440,marginBottom:28,animation:"fu .6s ease .2s both"}}>AI-приложение, которое помогает определиться за 30 секунд. Фильмы, рестораны, досуг, подарки — три вопроса и готово.</p>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32,flexWrap:"wrap",animation:"fu .6s ease .3s both"}}>
            <button className="hu" onClick={()=>window.location.href="/app"} style={{display:"flex",alignItems:"center",gap:8,padding:"15px 28px",background:"#E8593C",color:"#fff",borderRadius:28,border:"none",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 24px rgba(232,89,60,.25)",transition:"all .2s"}}>Попробовать бесплатно <Ic name="arrowR" size={18} color="#fff"/></button>
            <button className="na" onClick={()=>scrollTo("how")} style={{background:"none",border:"none",fontSize:15,fontWeight:600,color:"#1d1d1f",cursor:"pointer",fontFamily:"inherit",borderBottom:"1.5px solid #1d1d1f",paddingBottom:2}}>Как это работает</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14,animation:"fu .6s ease .4s both"}}>
            <div style={{display:"flex"}}>{["#E8593C","#1D9E75","#378ADD","#D4537E"].map((c,i)=><div key={i} style={{width:32,height:32,borderRadius:16,background:c,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:i?-10:0,zIndex:4-i}}><span style={{color:"#fff",fontSize:10,fontWeight:700}}>{["АМ","КЛ","ДВ","НР"][i]}</span></div>)}</div>
            <div>
              <p style={{fontSize:14,fontWeight:600}}>2 400+ пользователей</p>
              <div style={{display:"flex",alignItems:"center",gap:2}}>{[1,2,3,4,5].map(i=><Ic key={i} name="star" size={12} color="#BA7517" fill="#BA7517"/>)}<span style={{fontSize:12,color:"#8a8a8e",marginLeft:4}}>4.9 в App Store</span></div>
            </div>
          </div>
        </div>
        <div style={{flex:1,minWidth:280,position:"relative",display:"flex",justifyContent:"center",alignItems:"center",minHeight:460}}>
          {[{t:30,l:-10,i:"film",la:"Что посмотреть",c:"#E8593C",bg:"#FAECE7",a:"fl 4s ease-in-out infinite"},{t:140,r:-5,i:"fork",la:"Где поесть",c:"#1D9E75",bg:"#E1F5EE",a:"flB 5s ease-in-out .5s infinite"},{b:130,l:-10,i:"compass",la:"Чем заняться",c:"#378ADD",bg:"#E6F1FB",a:"flB 4.5s ease-in-out 1s infinite"},{b:40,r:0,i:"gift",la:"Что подарить",c:"#D4537E",bg:"#FBEAF0",a:"fl 5s ease-in-out 1.5s infinite"}].map((f,i)=><div key={i} style={{position:"absolute",top:f.t,bottom:f.b,left:f.l,right:f.r,display:"flex",alignItems:"center",gap:10,padding:"10px 16px 10px 10px",background:"rgba(255,255,255,.95)",borderRadius:14,boxShadow:"0 4px 20px rgba(0,0,0,.06)",border:"0.5px solid #e5e5ea",zIndex:10,animation:f.a,backdropFilter:"blur(8px)"}}><div style={{width:36,height:36,borderRadius:10,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name={f.i} size={16} color={f.c}/></div><span style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>{f.la}</span></div>)}
          <div style={{width:220,height:420,background:"#fff",borderRadius:32,boxShadow:"0 20px 60px rgba(0,0,0,.1),inset 0 0 0 .5px rgba(0,0,0,.08)",overflow:"hidden",zIndex:5}}>
            <div style={{padding:"40px 16px 16px"}}>
              <p style={{fontSize:11,color:"#8a8a8e",marginBottom:2}}>Добрый вечер</p>
              <p style={{fontSize:18,fontWeight:800,fontFamily:"'Outfit'",marginBottom:16}}>Что решаем?</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{[{i:"film",l:"Посмотреть",c:"#E8593C",bg:"#FAECE7"},{i:"fork",l:"Поесть",c:"#1D9E75",bg:"#E1F5EE"},{i:"compass",l:"Заняться",c:"#378ADD",bg:"#E6F1FB"},{i:"gift",l:"Подарить",c:"#D4537E",bg:"#FBEAF0"}].map((c,j)=><div key={j} style={{background:"#fafafa",border:"0.5px solid #e5e5ea",borderRadius:12,padding:"12px 8px",textAlign:"center"}}><div style={{width:28,height:28,borderRadius:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px"}}><Ic name={c.i} size={14} color={c.c}/></div><p style={{fontSize:10,fontWeight:600}}>{c.l}</p></div>)}</div>
              <div style={{marginTop:12,padding:"10px 12px",background:"#fafafa",border:"0.5px solid #e5e5ea",borderRadius:12,display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:8,background:"#FAECE7",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="sparkle" size={12} color="#E8593C"/></div><div><p style={{fontSize:10,fontWeight:600}}>Быстрый выбор</p><p style={{fontSize:8,color:"#8a8a8e"}}>AI подберёт за тебя</p></div></div>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section style={{padding:"80px 0"}} id="problem"><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <Reveal><p style={S.ey}>Знакомо?</p></Reveal>
        <Reveal delay={80}><h2 style={S.h2}>45 минут на выбор фильма.<br/>Час в чате «ну давайте куда-нибудь».</h2></Reveal>
        <Reveal delay={160}><p style={S.sub}>Decision fatigue — усталость от решений. Мы тратим энергию на мелочи и не замечаем этого.</p></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginTop:40}}>{[{n:"34%",t:"времени при выборе тратится на прокрастинацию"},{n:"72%",t:"людей испытывают стресс от обилия вариантов"},{n:"15 мин",t:"среднее время на выбор, что посмотреть вечером"}].map((p,i)=><Reveal key={i} delay={240+i*80}><div className="fc" style={{padding:"28px 24px",background:"#fafafa",borderRadius:18,border:"0.5px solid transparent",transition:"all .3s",cursor:"default"}}><p style={{fontFamily:"'Outfit'",fontSize:36,fontWeight:800,color:"#E8593C",marginBottom:8}}>{p.n}</p><p style={{fontSize:14,color:"#636366",lineHeight:1.5}}>{p.t}</p></div></Reveal>)}</div>
      </div></section>

      {/* HOW */}
      <section style={{padding:"80px 0",background:"#fafafa"}} id="how"><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <Reveal><p style={S.ey}>Как это работает</p></Reveal>
        <Reveal delay={80}><h2 style={S.h2}>Три шага. Тридцать секунд.</h2></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginTop:40}}>{[{n:"01",ti:"Выбери категорию",de:"Фильмы, рестораны, досуг или подарки — тапни одну карточку",i:"sparkle",c:"#E8593C",bg:"#FAECE7"},{n:"02",ti:"Ответь на 3 вопроса",de:"Настроение, компания, бюджет — большие кнопки, легко одной рукой",i:"zap",c:"#378ADD",bg:"#E6F1FB"},{n:"03",ti:"Получи рекомендацию",de:"Claude AI подберёт вариант и объяснит, почему именно это подходит",i:"check",c:"#1D9E75",bg:"#E1F5EE"}].map((s,i)=><Reveal key={i} delay={160+i*100}><div className="fc" style={{padding:"28px 24px",background:"#fff",borderRadius:18,border:"0.5px solid transparent",transition:"all .3s",position:"relative",cursor:"default"}}><div style={{width:48,height:48,borderRadius:14,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Ic name={s.i} size={22} color={s.c}/></div><span style={{fontFamily:"'Outfit'",fontSize:48,fontWeight:900,color:"#f2f2f7",position:"absolute",top:20,right:24}}>{s.n}</span><h3 style={{fontFamily:"'Outfit'",fontSize:18,fontWeight:700,marginBottom:8}}>{s.ti}</h3><p style={{fontSize:14,color:"#636366",lineHeight:1.5}}>{s.de}</p></div></Reveal>)}</div>
      </div></section>

      {/* APP SHOWCASE */}
      <section style={{padding:"80px 0"}} id="showcase"><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <Reveal><p style={S.ey}>Приложение в действии</p></Reveal>
        <Reveal delay={80}><h2 style={S.h2}>Посмотрите, как это выглядит</h2></Reveal>
        <Reveal delay={160}><p style={S.sub}>Три экрана — весь путь от вопроса до решения</p></Reveal>

        <div style={{display:"flex",gap:24,marginTop:48,overflowX:"auto",paddingBottom:16,justifyContent:"center",flexWrap:"wrap"}}>

          {/* Screen 1: Decision flow */}
          <Reveal delay={200}>
            <div style={{textAlign:"center"}}>
              <div style={{width:240,height:480,background:"#fff",borderRadius:36,boxShadow:"0 20px 60px rgba(0,0,0,.1),inset 0 0 0 .5px rgba(0,0,0,.08)",overflow:"hidden",margin:"0 auto"}}>
                <div style={{padding:"40px 16px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
                    <div style={{width:8,height:8,borderRadius:4,background:"#E8593C"}}/>
                    <div style={{width:8,height:8,borderRadius:4,background:"#E8593C",opacity:.5}}/>
                    <div style={{width:8,height:8,borderRadius:4,background:"#e5e5ea"}}/>
                  </div>
                  <div style={{width:44,height:44,borderRadius:13,background:"#FAECE7",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Ic name="film" size={20} color="#E8593C"/></div>
                  <p style={{fontFamily:"'Outfit'",fontSize:16,fontWeight:700,textAlign:"center",marginBottom:20}}>Что посмотреть</p>
                  <p style={{fontFamily:"'Outfit'",fontSize:20,fontWeight:700,marginBottom:16}}>Какое настроение?</p>
                  {["Расслабленное","Энергичное","Романтичное","Задумчивое"].map((o,i)=>(
                    <div key={i} style={{padding:"12px 14px",background:i===2?"linear-gradient(135deg,#E8593C,#D85A30)":"#fafafa",border:i===2?"none":"0.5px solid #e5e5ea",borderRadius:12,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:13,fontWeight:500,color:i===2?"#fff":"#1d1d1f"}}>{o}</span>
                      {i===2&&<Ic name="check" size={14} color="#fff"/>}
                    </div>
                  ))}
                </div>
              </div>
              <p style={{fontFamily:"'Outfit'",fontSize:15,fontWeight:600,marginTop:16,color:"#1d1d1f"}}>Отвечай на вопросы</p>
              <p style={{fontSize:13,color:"#8a8a8e",marginTop:4}}>Большие кнопки, одна рука</p>
            </div>
          </Reveal>

          {/* Screen 2: AI Result */}
          <Reveal delay={350}>
            <div style={{textAlign:"center"}}>
              <div style={{width:240,height:480,background:"#fff",borderRadius:36,boxShadow:"0 20px 60px rgba(0,0,0,.1),inset 0 0 0 .5px rgba(0,0,0,.08)",overflow:"hidden",margin:"0 auto"}}>
                <div style={{height:120,background:"linear-gradient(135deg,#FAECE7,#E8593C18)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.88)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="film" size={22} color="#E8593C"/></div>
                  <div style={{position:"absolute",top:10,right:12,display:"flex",alignItems:"center",gap:3,padding:"3px 8px",background:"rgba(255,255,255,.9)",borderRadius:16}}><Ic name="sparkle" size={10} color="#E8593C"/><span style={{fontSize:8,fontWeight:700,color:"#E8593C"}}>Claude AI</span></div>
                </div>
                <div style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",gap:4,marginBottom:6}}>
                    <span style={{fontSize:9,fontWeight:600,padding:"2px 8px",borderRadius:16,background:"#FAECE7",color:"#E8593C"}}>Фильмы</span>
                    <span style={{fontSize:9,fontWeight:600,padding:"2px 8px",borderRadius:16,background:"#f2f2f7",color:"#636366"}}>драма</span>
                  </div>
                  <p style={{fontFamily:"'Outfit'",fontSize:18,fontWeight:800,marginBottom:4}}>Бриджит Джонс</p>
                  <p style={{fontSize:11,color:"#636366",lineHeight:1.5,marginBottom:10}}>Культовая романтическая комедия о поиске любви в Лондоне</p>
                  <div style={{background:"#fafafa",border:"0.5px solid #e5e5ea",borderRadius:10,padding:"8px 10px",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}><Ic name="sparkle" size={10} color="#E8593C"/><span style={{fontSize:9,fontWeight:600,color:"#E8593C"}}>Claude AI объясняет</span></div>
                    <p style={{fontSize:10,color:"#636366",lineHeight:1.5}}>Идеально для романтичного настроения вдвоём — смешно, тепло и со счастливым финалом.</p>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{width:36,height:36,borderRadius:18,background:"#f2f2f7",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="heart" size={16} color="#E8593C" fill="#E8593C"/></div>
                    <div style={{flex:1,padding:"10px",background:"#E8593C",borderRadius:18,textAlign:"center"}}><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Поделиться</span></div>
                    <div style={{width:36,height:36,borderRadius:18,background:"#f2f2f7",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="refresh" size={16} color="#8a8a8e"/></div>
                  </div>
                </div>
              </div>
              <p style={{fontFamily:"'Outfit'",fontSize:15,fontWeight:600,marginTop:16,color:"#1d1d1f"}}>AI подбирает вариант</p>
              <p style={{fontSize:13,color:"#8a8a8e",marginTop:4}}>С объяснением «Почему это»</p>
            </div>
          </Reveal>

          {/* Screen 3: Voting */}
          <Reveal delay={500}>
            <div style={{textAlign:"center"}}>
              <div style={{width:240,height:480,background:"#fff",borderRadius:36,boxShadow:"0 20px 60px rgba(0,0,0,.1),inset 0 0 0 .5px rgba(0,0,0,.08)",overflow:"hidden",margin:"0 auto"}}>
                <div style={{padding:"40px 16px 16px"}}>
                  <p style={{fontFamily:"'Outfit'",fontSize:18,fontWeight:800,marginBottom:4}}>Вместе</p>
                  <p style={{fontSize:11,color:"#8a8a8e",marginBottom:16}}>Голосуйте за варианты</p>
                  <div style={{padding:"10px 12px",background:"#fafafa",border:"0.5px solid #e5e5ea",borderRadius:12,marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:24,height:24,borderRadius:7,background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="fork" size={12} color="#1D9E75"/></div><span style={{fontSize:11,fontWeight:600}}>Где поесть</span></div>
                      <span style={{fontSize:9,fontWeight:600,color:"#1D9E75",background:"#E1F5EE",padding:"2px 6px",borderRadius:10}}>3/5</span>
                    </div>
                    <div style={{display:"flex",gap:4,marginBottom:10}}>
                      {[{n:"В",c:"#FAECE7",t:"#E8593C",d:true},{n:"А",c:"#E1F5EE",t:"#1D9E75",d:true},{n:"М",c:"#E6F1FB",t:"#378ADD",d:true},{n:"Л",c:"#FBEAF0",t:"#D4537E",d:false},{n:"Д",c:"#f2f2f7",t:"#8a8a8e",d:false}].map((p,i)=>(
                        <div key={i} style={{position:"relative"}}>
                          <div style={{width:28,height:28,borderRadius:14,background:p.c,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,fontWeight:600,color:p.t}}>{p.n}</span></div>
                          {p.d&&<div style={{position:"absolute",bottom:-2,right:-2,width:12,height:12,borderRadius:6,background:"#1D9E75",border:"1.5px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="check" size={7} color="#fff" sw={3}/></div>}
                        </div>
                      ))}
                    </div>
                    {[{n:"Саперави",p:67},{n:"Хачапурная",p:50},{n:"Рамен",p:33}].map((v,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{flex:1}}><p style={{fontSize:10,fontWeight:600,marginBottom:3}}>{v.n}</p><div style={{height:5,borderRadius:3,background:"#f2f2f7"}}><div style={{height:5,borderRadius:3,background:"#1D9E75",width:v.p+"%"}}/></div></div>
                        <span style={{fontSize:11,fontWeight:700,color:"#1D9E75",minWidth:28,textAlign:"right"}}>{v.p}%</span>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:10,fontWeight:600,color:"#8a8a8e",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Завершённые</p>
                  {[{t:"Что смотреть",w:"Интерстеллар",ic:"film",c:"#E8593C",bg:"#FAECE7"},{t:"Подарок Лере",w:"Мастер-класс",ic:"gift",c:"#D4537E",bg:"#FBEAF0"}].map((v,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#fafafa",borderRadius:10,marginBottom:6}}>
                      <div style={{width:28,height:28,borderRadius:8,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name={v.ic} size={12} color={v.c}/></div>
                      <div style={{flex:1}}><p style={{fontSize:10,fontWeight:600}}>{v.t}</p><p style={{fontSize:9,color:"#8a8a8e"}}>{v.w}</p></div>
                      <Ic name="check" size={14} color="#1D9E75"/>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{fontFamily:"'Outfit'",fontSize:15,fontWeight:600,marginTop:16,color:"#1d1d1f"}}>Решайте вместе</p>
              <p style={{fontSize:13,color:"#8a8a8e",marginTop:4}}>Свайп-голосование с друзьями</p>
            </div>
          </Reveal>

        </div>
      </div></section>

      {/* FEATURES */}
      <section style={{padding:"80px 0"}} id="features"><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <Reveal><p style={S.ey}>Возможности</p></Reveal>
        <Reveal delay={80}><h2 style={S.h2}>Больше, чем генератор случайных ответов</h2></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14,marginTop:40}}>{[{i:"sparkle",ti:"AI-персонализация",de:"Claude запоминает вкусы и с каждым разом рекомендует точнее",c:"#E8593C"},{i:"map",ti:"Геолокация",de:"Рестораны и развлечения рядом — расстояние, часы, рейтинг",c:"#1D9E75"},{i:"vote",ti:"Совместный выбор",de:"Создайте голосование, отправьте ссылку — друзья свайпают",c:"#378ADD"},{i:"users",ti:"Отзывы сообщества",de:"Реальные оценки и советы от пользователей",c:"#D4537E"},{i:"clock",ti:"Быстрый выбор",de:"Одна кнопка — AI сам определит категорию по контексту",c:"#BA7517"},{i:"shield",ti:"Приватность",de:"Ваши предпочтения только ваши. Без рекламы и сбора данных",c:"#636366"}].map((f,i)=><Reveal key={i} delay={160+i*60}><div className="fc" style={{padding:"24px 22px",background:"#fafafa",borderRadius:18,border:"0.5px solid transparent",transition:"all .3s",cursor:"default"}}><div style={{width:44,height:44,borderRadius:12,background:f.c+"12",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}><Ic name={f.i} size={22} color={f.c}/></div><h3 style={{fontFamily:"'Outfit'",fontSize:16,fontWeight:700,marginBottom:6}}>{f.ti}</h3><p style={{fontSize:14,color:"#636366",lineHeight:1.5}}>{f.de}</p></div></Reveal>)}</div>
      </div></section>

      {/* REVIEWS */}
      <section style={{padding:"80px 0",background:"#fafafa"}} id="reviews"><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <Reveal><p style={S.ey}>Отзывы</p></Reveal>
        <Reveal delay={80}><h2 style={S.h2}>Что говорят пользователи</h2></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:40}}>{[{n:"Алина М.",ro:"Дизайнер, 26",t:"Наконец-то мы с мужем не спорим полчаса, что смотреть. Тапнули, ответили — смотрим. Магия.",c:["#FAECE7","#E8593C"]},{n:"Кирилл В.",ro:"Разработчик, 29",t:"Функция «Вместе» — находка. Скинул ссылку друзьям, все проголосовали за 2 минуты. Пошли в квест.",c:["#E6F1FB","#378ADD"]},{n:"Марина Д.",ro:"Мама, 32",t:"Подарки — моя боль. Решалка предложила мастер-класс гончарства для подруги. Она была в восторге!",c:["#FBEAF0","#D4537E"]}].map((r,i)=><Reveal key={i} delay={160+i*100}><div className="fc" style={{padding:"24px",background:"#fff",borderRadius:18,border:"0.5px solid transparent",transition:"all .3s",cursor:"default"}}><div style={{display:"flex",gap:2,marginBottom:12}}>{[1,2,3,4,5].map(j=><Ic key={j} name="star" size={14} color="#BA7517" fill="#BA7517"/>)}</div><p style={{fontSize:15,lineHeight:1.6,fontStyle:"italic",marginBottom:16}}>"{r.t}"</p><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:40,height:40,borderRadius:20,background:r.c[0],display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:14,fontWeight:600,color:r.c[1]}}>{r.n[0]}</span></div><div><p style={{fontSize:14,fontWeight:600}}>{r.n}</p><p style={{fontSize:12,color:"#8a8a8e"}}>{r.ro}</p></div></div></div></Reveal>)}</div>
      </div></section>

      {/* CTA */}
      <section style={{padding:"80px 0"}} id="cta"><div style={{maxWidth:540,margin:"0 auto",padding:"0 24px",textAlign:"center"}}>
        <Reveal><div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#E8593C,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 8px 32px rgba(232,89,60,.3)"}}><Ic name="sparkle" size={28} color="#fff"/></div></Reveal>
        <Reveal delay={80}><h2 style={S.h2}>Готовы перестать мучиться?</h2></Reveal>
        <Reveal delay={160}><p style={{fontSize:17,color:"#636366",lineHeight:1.6,maxWidth:420,margin:"0 auto 28px"}}>Попробуйте бесплатно — 5 AI-рекомендаций без регистрации карты.</p></Reveal>
        <Reveal delay={240}>
          <button className="hu" onClick={()=>window.location.href="/app"} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",background:"#E8593C",color:"#fff",borderRadius:28,border:"none",fontSize:17,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 24px rgba(232,89,60,.3)",transition:"all .2s",marginBottom:12}}>Попробовать бесплатно <Ic name="arrowR" size={18} color="#fff"/></button>
          <p style={{fontSize:12,color:"#8a8a8e",marginTop:12}}>Без карты. Без рекламы. 30 секунд до первого решения.</p>
        </Reveal>
      </div></section>

      {/* FOOTER */}
      <footer style={{padding:"32px 0",borderTop:"0.5px solid #e5e5ea"}}><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#E8593C,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="sparkle" size={13} color="#fff"/></div><span style={{fontFamily:"'Outfit'",fontSize:15,fontWeight:700}}>Решалка</span></div>
          <div style={{display:"flex",gap:20}}>{NAV.map(n=><button key={n.id} className="na" onClick={()=>scrollTo(n.id)} style={{background:"none",border:"none",fontSize:13,color:"#8a8a8e",cursor:"pointer",fontFamily:"inherit"}}>{n.l}</button>)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,paddingTop:16,borderTop:"0.5px solid #f2f2f7"}}>
          <p style={{fontSize:12,color:"#8a8a8e"}}>2026 Решалка. Все муки выбора остались позади.</p>
          <div style={{display:"flex",gap:16}}>{["Конфиденциальность","Условия","Поддержка"].map(l=><button key={l} className="na" onClick={()=>setModal(l)} style={{background:"none",border:"none",fontSize:12,color:"#8a8a8e",cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}</div>
        </div>
      </div></footer>

      {/* MODAL */}
      {modal&&<div onClick={()=>setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,maxWidth:520,width:"100%",maxHeight:"80vh",overflow:"auto",padding:"32px 28px",position:"relative"}}>
          <button onClick={()=>setModal(null)} aria-label="Закрыть" style={{position:"absolute",top:16,right:16,background:"#f2f2f7",border:"none",width:32,height:32,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Ic name="x" size={16} color="#636366"/></button>
          <h2 style={{fontFamily:"'Outfit'",fontSize:22,fontWeight:700,marginBottom:16}}>{modal}</h2>
          {modal==="Конфиденциальность"&&<div style={{fontSize:14,color:"#636366",lineHeight:1.7}}>
            <p style={{marginBottom:12}}>Решалка уважает вашу приватность. Мы собираем минимум данных, необходимых для работы приложения.</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Какие данные мы храним:</p>
            <p style={{marginBottom:12}}>Имя и email (для авторизации), историю ваших решений (для улучшения рекомендаций), геолокацию (только с вашего разрешения, для поиска мест рядом).</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Чего мы не делаем:</p>
            <p style={{marginBottom:12}}>Не продаём ваши данные третьим лицам, не показываем рекламу, не отслеживаем активность за пределами приложения.</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Удаление данных</p>
            <p>Вы можете удалить свой аккаунт и все данные в любой момент через настройки профиля. Данные удаляются в течение 30 дней.</p>
          </div>}
          {modal==="Условия"&&<div style={{fontSize:14,color:"#636366",lineHeight:1.7}}>
            <p style={{marginBottom:12}}>Используя приложение Решалка, вы соглашаетесь с настоящими условиями.</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Сервис</p>
            <p style={{marginBottom:12}}>Решалка предоставляет AI-рекомендации на основе ваших ответов. Рекомендации носят информационный характер и не являются профессиональной консультацией.</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Аккаунт</p>
            <p style={{marginBottom:12}}>Вы несёте ответственность за безопасность своего аккаунта. Один аккаунт на человека.</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Контент пользователей</p>
            <p style={{marginBottom:12}}>Публикуя отзывы, вы предоставляете Решалке право их отображать в приложении. Запрещён оскорбительный и ложный контент.</p>
            <p style={{fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Бесплатный план</p>
            <p>Первые 100 решений с полным AI бесплатно. После этого доступен базовый режим без ограничений.</p>
          </div>}
          {modal==="Поддержка"&&<div style={{fontSize:14,color:"#636366",lineHeight:1.7}}>
            <p style={{marginBottom:16}}>Мы всегда рады помочь! Выберите удобный способ связи.</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{padding:"16px 18px",background:"#fafafa",borderRadius:14,border:"0.5px solid #e5e5ea",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:"#FAECE7",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="mail" size={18} color="#E8593C"/></div>
                <div><p style={{fontSize:14,fontWeight:600,color:"#1d1d1f"}}>Email</p><p style={{fontSize:13,color:"#8a8a8e"}}>help@reshalka.app</p></div>
              </div>
              <div style={{padding:"16px 18px",background:"#fafafa",borderRadius:14,border:"0.5px solid #e5e5ea",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="globe" size={18} color="#378ADD"/></div>
                <div><p style={{fontSize:14,fontWeight:600,color:"#1d1d1f"}}>Telegram</p><p style={{fontSize:13,color:"#8a8a8e"}}>@reshalka_support</p></div>
              </div>
              <div style={{padding:"16px 18px",background:"#fafafa",borderRadius:14,border:"0.5px solid #e5e5ea",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic name="clock" size={18} color="#1D9E75"/></div>
                <div><p style={{fontSize:14,fontWeight:600,color:"#1d1d1f"}}>Время ответа</p><p style={{fontSize:13,color:"#8a8a8e"}}>Обычно в течение 2 часов</p></div>
              </div>
            </div>
            <p style={{marginTop:16,fontSize:13,color:"#8a8a8e"}}>FAQ и база знаний скоро появятся в приложении.</p>
          </div>}
        </div>
      </div>}

      {/* BACK TO TOP */}
      {showTop&&<button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Наверх" style={{position:"fixed",bottom:24,right:24,width:44,height:44,borderRadius:22,background:"#1d1d1f",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.2)",zIndex:99}}><Ic name="arrowUp" size={18} color="#fff"/></button>}
    </div>
  );
}

const S={
  ey:{fontSize:13,fontWeight:700,color:"#E8593C",textTransform:"uppercase",letterSpacing:1.5,marginBottom:12,fontFamily:"'Outfit'"},
  h2:{fontFamily:"'Outfit'",fontSize:"clamp(28px,4vw,40px)",fontWeight:800,lineHeight:1.1,letterSpacing:-1,marginBottom:16},
  sub:{fontSize:17,color:"#636366",lineHeight:1.6,maxWidth:540},
};
