import { useState, useEffect, useCallback, useRef } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#F2F7F5;
      --white:#FFFFFF;
      --green:#2E7D5E;
      --green2:#3D9A75;
      --green3:#E8F5EF;
      --green4:#C8E8D8;
      --peach:#F4845F;
      --peach2:#FDE8E0;
      --yellow:#F5C842;
      --yellow2:#FEF8E1;
      --sky:#5BA4CF;
      --sky2:#E3F2FA;
      --text:#1A2E26;
      --text2:#4A6558;
      --text3:#8AADA0;
      --line:#C8DDD6;
      --shadow:0 2px 12px rgba(46,125,94,0.10);
      --shadow2:0 4px 20px rgba(46,125,94,0.14);
    }
    html{font-size:16px;scroll-behavior:smooth}
    body{font-family:'Noto Sans KR',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
    button{cursor:pointer;border:none;background:none;font-family:'Noto Sans KR',sans-serif}
    input,textarea,select{font-family:'Noto Sans KR',sans-serif}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pop{0%{transform:scale(0.92)}60%{transform:scale(1.04)}100%{transform:scale(1)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .fadeUp{animation:fadeUp 0.4s ease forwards}

    .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:700;font-size:0.9rem;border-radius:12px;padding:12px 24px;transition:all 0.2s;cursor:pointer;border:none;font-family:'Noto Sans KR',sans-serif}
    .btn-g{background:var(--green);color:#fff;box-shadow:0 3px 10px rgba(46,125,94,0.28)}
    .btn-g:hover{background:#256A50;box-shadow:0 5px 16px rgba(46,125,94,0.35);transform:translateY(-1px)}
    .btn-g:active{transform:translateY(0)}
    .btn-p{background:var(--peach);color:#fff;box-shadow:0 3px 10px rgba(244,132,95,0.28)}
    .btn-p:hover{background:#E06A45;box-shadow:0 5px 16px rgba(244,132,95,0.35);transform:translateY(-1px)}
    .btn-o{background:#fff;color:var(--green);border:2px solid var(--green)}
    .btn-o:hover{background:var(--green3)}
    .btn-ghost{background:transparent;color:var(--green);font-weight:600;font-size:0.85rem;padding:8px 12px;border-radius:8px}
    .btn-ghost:hover{background:var(--green3)}

    .card{background:#fff;border-radius:18px;padding:22px;box-shadow:var(--shadow);border:1.5px solid var(--line)}
    .card-flat{background:#fff;border-radius:18px;padding:22px;border:1.5px solid var(--line)}

    .inp{background:#fff;border:1.5px solid var(--line);border-radius:11px;padding:11px 15px;font-size:0.92rem;color:var(--text);width:100%;transition:all 0.2s;font-family:'Noto Sans KR',sans-serif}
    .inp:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 3px rgba(46,125,94,0.1)}
    .inp::placeholder{color:var(--text3)}

    .lbl{font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px;display:block}

    .pg{min-height:100vh;padding:84px 18px 64px;max-width:640px;margin:0 auto}

    .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:0.68rem;font-weight:700}
    .b-pending{background:#FEF8E1;color:#B08000}
    .b-confirmed{background:#E8F5EF;color:#1A6640}
    .b-change{background:#E3F2FA;color:#1A5080}
    .b-cancel-req{background:#FDE8E0;color:#C04020}
    .b-cancelled{background:#FDECEA;color:#C02020}
    .b-completed{background:#F0F0F0;color:#505050}

    .tag{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:20px;font-size:0.72rem;font-weight:700;background:var(--green3);color:var(--green);border:1.5px solid var(--green4)}

    @media(max-width:768px){.pg{padding:76px 14px 56px}.card,.card-flat{padding:16px;border-radius:14px}}
  `}</style>
);

// ── DEPT ─────────────────────────────────────────────────────────────────────
const DEPTS = [
  {key:"webcash", label:"웹케시부문",    color:"#2E7D5E", nums:[1,2,8,9,...Array.from({length:36},(_,i)=>40+i)]},
  {key:"coocon",  label:"쿠콘부문",      color:"#3D7AB5", nums:[10,11,...Array.from({length:28},(_,i)=>76+i)]},
  {key:"bizplay", label:"비즈플레이부문", color:"#6B4FA0", nums:[12,13,...Array.from({length:28},(_,i)=>104+i)]},
  {key:"growth",  label:"성장비즈부문",   color:"#B07820", nums:Array.from({length:10},(_,i)=>132+i)},
  {key:"support", label:"지원부문",      color:"#C04020", nums:[14,...Array.from({length:9},(_,i)=>142+i)]},
  {key:"common",  label:"그룹 공통",     color:"#507060", nums:[...Array.from({length:5},(_,i)=>3+i),...Array.from({length:25},(_,i)=>15+i)]},
];
const vNum = c => parseInt((c||"").replace(/[^0-9]/g,""),10);
const getDept = c => { const n=vNum(c); return DEPTS.find(d=>d.nums.includes(n))||null; };

// ── DATA ──────────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = d => d.toISOString().split("T")[0];
const addD = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };

const USED_CODES = ["VIP2026011","VIP2026039"];
const initVouchers = DEPTS.flatMap(dept =>
  dept.nums.map(n => ({
    id: `v${n}`,
    code: `VIP2026${String(n).padStart(3,"0")}`,
    dept: dept.key,
    customerName: "",
    phone: "",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    status: USED_CODES.includes(`VIP2026${String(n).padStart(3,"0")}`) ? "used" : "unused",
  }))
).sort((a,b) => parseInt(a.code.replace(/\D/g,""),10) - parseInt(b.code.replace(/\D/g,""),10));
const initRes = [
  {id:"r1",reservationNumber:"GR-20260001",voucherCode:"VIP2026011",customerName:"",phone:"",date:"",time:"",requestMessage:"",status:"completed",createdAt:""},
  {id:"r2",reservationNumber:"GR-20260002",voucherCode:"VIP2026039",customerName:"",phone:"",date:"",time:"",requestMessage:"",status:"completed",createdAt:""},
];
const initSlots = [
  {id:"s1", date:"2026-05-08",time:"09:00",isOpen:true, bookedCount:0},
  {id:"s2", date:"2026-05-08",time:"11:00",isOpen:true, bookedCount:0},
  {id:"s3", date:"2026-05-08",time:"14:00",isOpen:true, bookedCount:1},
  {id:"s4", date:"2026-05-15",time:"09:00",isOpen:true, bookedCount:0},
  {id:"s5", date:"2026-05-15",time:"11:00",isOpen:false,bookedCount:0},
  {id:"s6", date:"2026-05-22",time:"10:00",isOpen:true, bookedCount:0},
  {id:"s7", date:"2026-06-05",time:"09:00",isOpen:true, bookedCount:0},
  {id:"s8", date:"2026-06-05",time:"11:00",isOpen:true, bookedCount:0},
  {id:"s9", date:"2026-06-12",time:"14:00",isOpen:true, bookedCount:0},
  {id:"s10",date:"2026-06-19",time:"09:00",isOpen:true, bookedCount:0},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmtDate = d => { const x=new Date(d+"T00:00:00"); return x.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"short"}); };
const statusLabel = s => ({pending:"예약 접수",confirmed:"예약 확정",change_requested:"변경 요청",cancel_requested:"취소 요청",cancelled:"취소 완료",completed:"이용 완료"}[s]||s);
const statusCls   = s => ({pending:"b-pending",confirmed:"b-confirmed",change_requested:"b-change",cancel_requested:"b-cancel-req",cancelled:"b-cancelled",completed:"b-completed"}[s]||"");
const voucherLabel = s => ({unused:"미사용",reserved:"예약중",used:"사용완료",expired:"만료",disabled:"비활성"}[s]||s);

// ── NAV ───────────────────────────────────────────────────────────────────────
const Nav = ({page, go, isAdmin}) => {
  const [up, setUp] = useState(false);
  useEffect(()=>{ const h=()=>setUp(window.scrollY>20); window.addEventListener("scroll",h); return ()=>window.removeEventListener("scroll",h); },[]);
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:up?"rgba(255,255,255,0.97)":"transparent",backdropFilter:up?"blur(10px)":"none",borderBottom:up?"1.5px solid var(--line)":"none",transition:"all 0.3s",padding:"0 20px"}}>
      <div style={{maxWidth:1240,margin:"0 auto",height:62,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>go(isAdmin?"admin-res":"home")} style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:34,height:34,background:"var(--green)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>⛳</div>
          <div>
            <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",letterSpacing:"0.04em",lineHeight:1}}>VIP GOLF</div>
            <div style={{fontSize:"1rem",fontWeight:800,color:"var(--green)",letterSpacing:"-0.01em",lineHeight:1.2}}>Voucher</div>
          </div>
        </button>
        {!isAdmin ? (
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <button className="btn-ghost" onClick={()=>go("voucher")}>🎟 예약하기</button>
            <button className="btn-ghost" onClick={()=>go("lookup")}>🔍 조회</button>
            <button onClick={()=>go("admin-login")} style={{fontSize:"0.75rem",color:"var(--text3)",padding:"6px 10px",fontWeight:600,background:"transparent",border:"none",cursor:"pointer"}}>관리자</button>
          </div>
        ) : (
          <div style={{display:"flex",gap:2,alignItems:"center",flexWrap:"wrap"}}>
            {[["admin-res","📋 예약"],["admin-vch","🎟 바우처"],["admin-slot","📅 일정"],["admin-settle","💰 정산"],["admin-evd","📎 증빙"]].map(([p,l])=>(
              <button key={p} onClick={()=>go(p)} style={{fontSize:"0.78rem",fontWeight:700,padding:"6px 12px",borderRadius:20,background:page===p?"var(--green)":"transparent",color:page===p?"#fff":"var(--text2)",border:"none",cursor:"pointer",transition:"all 0.18s"}}>{l}</button>
            ))}
            <button onClick={()=>go("home")} style={{fontSize:"0.75rem",color:"var(--text3)",marginLeft:6,padding:"6px 10px",background:"var(--bg)",borderRadius:20,fontWeight:600,border:"none",cursor:"pointer"}}>로그아웃</button>
          </div>
        )}
      </div>
    </nav>
  );
};

// ── HOME ──────────────────────────────────────────────────────────────────────
const Home = ({go}) => (
  <div>
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(150deg,#E6F4EE 0%,#D0EBDD 50%,#E2F1EA 100%)",padding:"80px 20px 40px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(245,200,66,0.18)",filter:"blur(50px)"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(244,132,95,0.14)",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",top:"15%",left:"6%",fontSize:"2rem",animation:"float 3s ease-in-out infinite"}}>🌿</div>
      <div style={{position:"absolute",top:"18%",right:"8%",fontSize:"2.2rem",animation:"float 3s ease-in-out infinite",animationDelay:"0.6s"}}>⛳</div>
      <div style={{position:"absolute",bottom:"22%",right:"6%",fontSize:"1.8rem",animation:"float 3s ease-in-out infinite",animationDelay:"1.2s"}}>🏌️</div>
      <div style={{position:"absolute",bottom:"20%",left:"5%",fontSize:"1.6rem",animation:"float 3s ease-in-out infinite",animationDelay:"0.9s"}}>✨</div>
      <div style={{textAlign:"center",zIndex:1,maxWidth:500}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",borderRadius:50,padding:"7px 18px",marginBottom:24,boxShadow:"0 2px 10px rgba(46,125,94,0.12)",border:"1.5px solid var(--line)"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>
          <span style={{fontSize:"0.76rem",fontWeight:700,color:"var(--green)"}}>VIP 전용 골프 예약 서비스</span>
        </div>
        <h1 style={{fontSize:"clamp(2.2rem,7vw,3.6rem)",fontWeight:800,color:"var(--text)",lineHeight:1.2,marginBottom:14,letterSpacing:"-0.02em"}}>
          VIP Golf<br/>
          <span style={{color:"var(--green)"}}>Voucher</span>
        </h1>
        <p style={{fontSize:"1rem",fontWeight:500,color:"var(--text2)",lineHeight:1.7,marginBottom:36}}>
          바우처 코드 하나로<br/>
          <strong style={{color:"var(--green)"}}>1:1 맞춤 레슨</strong>을 간편하게 예약하세요
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-g" onClick={()=>go("voucher")} style={{fontSize:"0.96rem",padding:"13px 28px"}}>🎟 바우처 예약하기</button>
          <button className="btn btn-g" onClick={()=>go("lookup")} style={{fontSize:"0.96rem",padding:"13px 28px"}}>🔍 예약 조회</button>
        </div>
      </div>
    </div>
    <div style={{background:"#fff",padding:"56px 20px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontSize:"1.5rem",fontWeight:800,color:"var(--text)",marginBottom:6}}>이렇게 이용하세요</h2>
        <p style={{textAlign:"center",color:"var(--text2)",marginBottom:36,fontSize:"0.9rem",fontWeight:500}}>3단계로 간단하게 예약 완료!</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
          {[
            {emoji:"🎟",bg:"var(--green3)",bd:"var(--green4)",title:"바우처 코드 입력",desc:"발급받은 VIP 바우처 코드를 입력해 본인 확인을 해요."},
            {emoji:"📅",bg:"var(--yellow2)",bd:"#F0DC80",title:"날짜 & 시간 선택",desc:"달력에서 레슨 가능한 날짜와 시간대를 선택해요."},
            {emoji:"✅",bg:"var(--peach2)",bd:"#F4C0A8",title:"예약 완료!",desc:"예약 접수 후 관리자 확인을 거쳐 최종 확정 안내를 드려요."},
          ].map((f,i)=>(
            <div key={i} style={{background:f.bg,borderRadius:18,padding:"24px 20px",border:`1.5px solid ${f.bd}`,textAlign:"center"}}>
              <div style={{fontSize:"2.2rem",marginBottom:12}}>{f.emoji}</div>
              <h3 style={{fontSize:"0.96rem",fontWeight:800,color:"var(--text)",marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:"0.84rem",color:"var(--text2)",lineHeight:1.65,fontWeight:500}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{background:"var(--green)",padding:"52px 20px",textAlign:"center"}}>
      <div style={{fontSize:"1.8rem",marginBottom:10}}>⛳</div>
      <h2 style={{fontSize:"1.4rem",fontWeight:800,color:"#fff",marginBottom:10}}>지금 바로 예약해요!</h2>
      <p style={{color:"rgba(255,255,255,0.75)",marginBottom:24,fontSize:"0.88rem",fontWeight:500}}>바우처가 있다면 바로 시작할 수 있어요</p>
      <button className="btn btn-p" onClick={()=>go("voucher")} style={{fontSize:"0.96rem",padding:"13px 30px"}}>🎟 바우처 코드 입력하기</button>
    </div>
  </div>
);

// ── VOUCHER ───────────────────────────────────────────────────────────────────
const VoucherPage = ({go, setBD, vouchers}) => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const verify = () => {
    setErr("");
    if (!code.trim()) { setErr("바우처 코드를 입력해주세요"); return; }
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      const v = vouchers.find(x=>x.code===code.trim().toUpperCase());
      if (!v) { setErr("유효하지 않은 바우처 코드예요"); return; }
      if (["used","expired","disabled"].includes(v.status)) { setErr(`이 바우처는 '${voucherLabel(v.status)}' 상태라 사용할 수 없어요`); return; }
      if (v.status==="reserved") { setErr("이미 예약에 사용된 바우처예요"); return; }
      setBD({voucher:v,step:"date"});
      go("booking");
    },700);
  };
  return (
    <div className="pg fadeUp">
      <div style={{marginBottom:24}}>
        <span className="tag" style={{marginBottom:14,display:"inline-flex"}}>STEP 1 / 4</span>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,color:"var(--text)",marginBottom:6}}>바우처 코드 확인</h1>
        <p style={{fontSize:"0.88rem",fontWeight:500,color:"var(--text2)"}}>발급받으신 VIP 바우처 코드를 입력해주세요</p>
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div><label className="lbl">🎟 바우처 코드</label><input className="inp" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&verify()} placeholder="예: VIP2026001" style={{letterSpacing:"0.06em",fontWeight:700,fontSize:"1rem"}}/></div>
          {err && <div style={{background:"#FDE8E0",border:"1.5px solid #F4A890",borderRadius:11,padding:"10px 14px",fontSize:"0.84rem",color:"#C03010",fontWeight:600}}>{err}</div>}
          <button className="btn btn-g" onClick={verify} disabled={loading} style={{width:"100%",fontSize:"0.92rem"}}>
            {loading ? <><span style={{display:"inline-block",width:14,height:14,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> 확인 중...</> : "확인하기 →"}
          </button>
        </div>
      </div>
      <div style={{padding:"14px 16px",background:"var(--yellow2)",borderRadius:14,border:"1.5px solid #F0DC80"}}>
        <p style={{fontSize:"0.78rem",fontWeight:700,color:"#8A6400",marginBottom:8}}>🧪 테스트용 샘플 코드</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {["VIP2026001","VIP2026002","VIP2026076"].map(c=>(
            <button key={c} onClick={()=>setCode(c)} style={{background:"#fff",border:"1.5px solid #F0DC80",borderRadius:20,padding:"5px 13px",fontSize:"0.78rem",fontWeight:700,color:"#7A5E00",cursor:"pointer"}}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── CALENDAR ──────────────────────────────────────────────────────────────────
const Cal = ({slots, sel, onSel}) => {
  const [yr, setYr] = useState(2026);
  const [mo, setMo] = useState(new Date().getMonth());
  const avail = new Set(slots.filter(s=>s.isOpen&&s.bookedCount===0).map(s=>s.date));
  const first = new Date(yr,mo,1).getDay();
  const days = new Date(yr,mo+1,0).getDate();
  const todayStr = fmt(today);
  const cells = [...Array(first).fill(null), ...Array.from({length:days},(_,i)=>`${yr}-${String(mo+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`)];
  const MN = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const DN = ["일","월","화","수","목","금","토"];
  const prev = () => mo===0?(setYr(y=>y-1),setMo(11)):setMo(m=>m-1);
  const next = () => mo===11?(setYr(y=>y+1),setMo(0)):setMo(m=>m+1);
  return (
    <div style={{userSelect:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={prev} style={{width:34,height:34,border:"1.5px solid var(--line)",borderRadius:10,background:"#fff",fontSize:"1.1rem",color:"var(--text2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <span style={{fontSize:"1rem",fontWeight:800,color:"var(--text)"}}>{yr}년 {MN[mo]}</span>
        <button onClick={next} style={{width:34,height:34,border:"1.5px solid var(--line)",borderRadius:10,background:"#fff",fontSize:"1.1rem",color:"var(--text2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
        {DN.map((d,i)=><div key={d} style={{textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:i===0?"#C04020":i===6?"#3060C0":"var(--text3)",padding:"3px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((ds,i)=>{
          if (!ds) return <div key={i}/>;
          const ok = avail.has(ds);
          const isSel = ds===sel;
          const past = ds<todayStr;
          const dow = new Date(ds+"T00:00:00").getDay();
          return (
            <button key={ds} onClick={()=>ok&&!past&&onSel(ds)} style={{
              aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              borderRadius:10,fontSize:"0.82rem",fontWeight:ok?700:500,
              border:isSel?"2px solid var(--green)":"1.5px solid transparent",
              background:isSel?"var(--green)":ok?"var(--green3)":"transparent",
              color:isSel?"#fff":past?"#C8D8CE":ok?"var(--green)":dow===0?"#E09090":dow===6?"#9090D0":"var(--text3)",
              cursor:ok&&!past?"pointer":"default",transition:"all 0.15s",position:"relative",
            }}
              onMouseEnter={e=>{if(ok&&!past&&!isSel)e.currentTarget.style.background="var(--green4)";}}
              onMouseLeave={e=>{if(ok&&!past&&!isSel)e.currentTarget.style.background="var(--green3)";}}
            >
              {new Date(ds+"T00:00:00").getDate()}
              {ok&&!past&&!isSel&&<span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"var(--peach)"}}/>}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:10,display:"flex",gap:14,fontSize:"0.66rem",color:"var(--text3)",fontWeight:600,alignItems:"center"}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:3,background:"var(--green3)",border:"1.5px solid var(--green4)",display:"inline-block"}}/> 예약 가능</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:"var(--peach)",display:"inline-block"}}/> 선택 가능한 날</span>
      </div>
    </div>
  );
};

// ── BOOKING ───────────────────────────────────────────────────────────────────
const BookingPage = ({go, bd, setBD, slots, setRes, setVch}) => {
  const step = bd?.step||"date";
  const [selDate, setSelDate] = useState(bd?.selDate||"");
  const [selTime, setSelTime] = useState(bd?.selTime||"");
  const [name, setName] = useState(bd?.voucher?.customerName||"");
  const [phone, setPhone] = useState(bd?.voucher?.phone||"");
  const [req, setReq] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [err, setErr] = useState("");
  const times = slots.filter(s=>s.date===selDate&&s.isOpen&&s.bookedCount===0);
  const next = s => setBD(p=>({...p,step:s,selDate,selTime}));
  const confirm = () => {
    const rn = `GR-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${String(Math.floor(Math.random()*900)+100)}`;
    const r = {id:"r"+Date.now(),reservationNumber:rn,voucherCode:bd.voucher.code,customerName:name,phone,date:selDate,time:selTime,requestMessage:req,status:"pending",createdAt:fmt(new Date())};
    setRes(p=>[...p,r]);
    setVch(p=>p.map(v=>v.code===bd.voucher.code?{...v,status:"reserved"}:v));
    setBD(p=>({...p,done:r,step:"done"}));
    go("book-done");
  };

  const StepBadge = ({n,label}) => <span className="tag" style={{marginBottom:14,display:"inline-flex"}}>{label} · STEP {n} / 4</span>;

  if (step==="date") return (
    <div className="pg fadeUp">
      <div style={{marginBottom:20}}><StepBadge n={2} label="📅"/>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,color:"var(--text)",marginBottom:4}}>날짜 · 시간 선택</h1>
        <p style={{fontSize:"0.88rem",fontWeight:500,color:"var(--text2)"}}>원하는 레슨 날짜를 골라주세요</p>
      </div>
      <div style={{marginBottom:12,padding:"10px 14px",background:"var(--sky2)",borderRadius:12,border:"1.5px solid #B0D4EC",fontSize:"0.82rem",color:"#1A4A80",fontWeight:700}}>
        🎟 {bd?.voucher?.code} · 1:1 레슨 예약
      </div>
      <div className="card" style={{marginBottom:14}}><Cal slots={slots} sel={selDate} onSel={d=>{setSelDate(d);setSelTime("");}}/></div>
      {selDate && (
        <div className="card" style={{marginBottom:14}}>
          <p style={{fontSize:"0.8rem",fontWeight:700,color:"var(--text2)",marginBottom:12}}>⏰ {fmtDate(selDate)} · 시간 선택</p>
          {times.length===0
            ? <p style={{fontSize:"0.84rem",color:"var(--text3)",textAlign:"center",padding:"16px 0",fontWeight:500}}>이 날은 예약 가능한 시간이 없어요</p>
            : <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {times.sort((a,b)=>a.time.localeCompare(b.time)).map(s=>(
                  <button key={s.id} onClick={()=>setSelTime(s.time)} style={{
                    padding:"11px 20px",borderRadius:12,fontSize:"0.92rem",fontWeight:700,
                    border:selTime===s.time?"2px solid var(--green)":"1.5px solid var(--line)",
                    background:selTime===s.time?"var(--green)":"#fff",
                    color:selTime===s.time?"#fff":"var(--text)",
                    boxShadow:selTime===s.time?"0 3px 10px rgba(46,125,94,0.25)":"none",
                    transition:"all 0.18s",cursor:"pointer",
                  }}>{s.time}</button>
                ))}
              </div>}
        </div>
      )}
      {selDate&&selTime&&<div style={{padding:"11px 15px",background:"var(--green3)",borderRadius:12,marginBottom:14,border:"1.5px solid var(--green4)",fontSize:"0.86rem",color:"var(--green)",fontWeight:700}}>✅ {fmtDate(selDate)} · {selTime} 선택됨</div>}
      <button className="btn btn-g" onClick={()=>next("info")} disabled={!selDate||!selTime} style={{width:"100%",opacity:(!selDate||!selTime)?0.35:1,fontSize:"0.92rem"}}>다음 단계 →</button>
    </div>
  );

  if (step==="info") return (
    <div className="pg fadeUp">
      <div style={{marginBottom:20}}><StepBadge n={3} label="👤"/>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,color:"var(--text)",marginBottom:4}}>예약자 정보 입력</h1>
        <p style={{fontSize:"0.88rem",fontWeight:500,color:"var(--text2)"}}>정보를 확인하고 입력해주세요</p>
      </div>
      <div className="card">
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div><label className="lbl">👤 예약자 이름</label><input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="이름"/></div>
          <div><label className="lbl">📱 휴대폰 번호</label><input className="inp" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="010-0000-0000"/></div>
          <div><label className="lbl">💬 요청사항 (선택)</label><textarea className="inp" value={req} onChange={e=>setReq(e.target.value)} placeholder="특별히 요청하실 사항이 있으면 남겨주세요" rows={3} style={{resize:"vertical",lineHeight:1.6}}/></div>
          <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:"13px",background:"var(--bg)",borderRadius:12,border:"1.5px solid var(--line)"}}>
            <input type="checkbox" id="agree" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:"var(--green)",width:16,height:16,flexShrink:0,cursor:"pointer"}}/>
            <label htmlFor="agree" style={{fontSize:"0.8rem",color:"var(--text2)",lineHeight:1.65,cursor:"pointer",fontWeight:500}}>예약 서비스 이용을 위한 개인정보 수집·이용에 동의합니다.<br/><span style={{color:"var(--text3)",fontSize:"0.72rem"}}>(수집항목: 이름, 휴대폰번호 / 보유기간: 1년)</span></label>
          </div>
          {err&&<div style={{fontSize:"0.84rem",color:"#C03010",background:"#FDE8E0",padding:"10px",borderRadius:10,fontWeight:600}}>{err}</div>}
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-o" onClick={()=>next("date")} style={{flex:1,fontSize:"0.88rem"}}>← 이전</button>
            <button className="btn btn-g" onClick={()=>{setErr(""); if(!name||!phone||!agreed){setErr("모든 항목을 입력하고 개인정보 동의를 체크해주세요"); return;} next("confirm");}} style={{flex:2,fontSize:"0.88rem"}}>다음 단계 →</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (step==="confirm") return (
    <div className="pg fadeUp">
      <div style={{marginBottom:20}}><StepBadge n={4} label="📋"/>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,color:"var(--text)",marginBottom:4}}>예약 정보 확인</h1>
        <p style={{fontSize:"0.88rem",fontWeight:500,color:"var(--text2)"}}>내용을 확인하고 예약을 완료해주세요</p>
      </div>
      <div className="card" style={{marginBottom:14}}>
        {[["🎟 바우처",bd?.voucher?.code],["📅 날짜",fmtDate(selDate)],["⏰ 시간",selTime],["👤 예약자",name],["📱 연락처",phone],["💬 요청사항",req||"없음"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",padding:"12px 0",borderBottom:"1px solid var(--line)",gap:14,alignItems:"flex-start"}}>
            <span style={{fontSize:"0.8rem",fontWeight:700,color:"var(--text2)",minWidth:96,flexShrink:0}}>{l}</span>
            <span style={{fontSize:"0.88rem",color:"var(--text)",fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{padding:"11px 15px",background:"var(--yellow2)",borderRadius:12,marginBottom:14,border:"1.5px solid #F0DC80",fontSize:"0.82rem",color:"#8A6400",fontWeight:600,lineHeight:1.6}}>
        📌 예약 확정 후 관리자 검토를 통해 최종 확인 안내를 드려요!
      </div>
      <div style={{display:"flex",gap:10}}>
        <button className="btn btn-o" onClick={()=>next("info")} style={{flex:1,fontSize:"0.88rem"}}>← 수정</button>
        <button className="btn btn-g" onClick={confirm} style={{flex:2,fontSize:"0.92rem"}}>🎉 예약 확정하기</button>
      </div>
    </div>
  );
  return null;
};

// ── BOOK DONE ─────────────────────────────────────────────────────────────────
const BookDone = ({go, bd}) => {
  const r = bd?.done;
  if (!r) { go("home"); return null; }
  return (
    <div className="pg fadeUp" style={{textAlign:"center"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:"3.6rem",marginBottom:10,animation:"pop 0.5s ease"}}>🎉</div>
        <h1 style={{fontSize:"1.7rem",fontWeight:800,color:"var(--text)",marginBottom:6}}>예약 완료!</h1>
        <p style={{fontSize:"0.9rem",fontWeight:500,color:"var(--text2)",lineHeight:1.6}}>관리자 확인 후 최종 안내를 드릴게요</p>
      </div>
      <div className="card" style={{textAlign:"left",marginBottom:16}}>
        <div style={{textAlign:"center",marginBottom:16,paddingBottom:14,borderBottom:"1.5px solid var(--line)"}}>
          <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:6}}>📋 예약번호</p>
          <p style={{fontSize:"1.2rem",fontWeight:800,color:"var(--green)",letterSpacing:"0.02em"}}>{r.reservationNumber}</p>
        </div>
        {[["📅 날짜",fmtDate(r.date)],["⏰ 시간",r.time],["👤 예약자",r.customerName],["📊 상태","예약 접수 ⏳"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",padding:"11px 0",borderBottom:"1px solid var(--line)",gap:14}}>
            <span style={{fontSize:"0.8rem",fontWeight:700,color:"var(--text2)",minWidth:80}}>{l}</span>
            <span style={{fontSize:"0.88rem",color:"var(--text)",fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button className="btn btn-g" onClick={()=>go("lookup")} style={{width:"100%",fontSize:"0.92rem"}}>🔍 예약 조회하기</button>
        <button className="btn btn-o" onClick={()=>go("home")} style={{width:"100%",fontSize:"0.92rem"}}>🏠 홈으로</button>
      </div>
    </div>
  );
};

// ── LOOKUP ────────────────────────────────────────────────────────────────────
const Lookup = ({go, reservations, setRes}) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [sel, setSel] = useState(null);
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState("");
  const [done, setDone] = useState("");
  const search = () => {
    const s = q.trim().toUpperCase().replace(/-/g,"");
    setResults(reservations.filter(r=>r.voucherCode.replace(/-/g,"").includes(s)||r.phone.replace(/-/g,"").includes(s)||r.reservationNumber.includes(s)));
    setSel(null); setDone("");
  };
  const request = type => {
    const ns = type==="cancel"?"cancel_requested":"change_requested";
    setRes(p=>p.map(r=>r.id===sel.id?{...r,status:ns}:r));
    setResults(p=>p.map(r=>r.id===sel.id?{...r,status:ns}:r));
    setSel(p=>({...p,status:ns}));
    setMode(""); setDone(type==="cancel"?"✅ 취소 요청이 접수되었습니다.":"✅ 변경 요청이 접수되었습니다.");
  };
  return (
    <div className="pg fadeUp">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,color:"var(--text)",marginBottom:4}}>🔍 예약 조회</h1>
        <p style={{fontSize:"0.88rem",fontWeight:500,color:"var(--text2)"}}>바우처 코드, 예약번호 또는 휴대폰 번호로 조회하세요</p>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="바우처 코드 / 휴대폰 번호 / 예약번호" style={{flex:1}}/>
          <button className="btn btn-g" onClick={search} style={{whiteSpace:"nowrap",fontSize:"0.88rem"}}>조회</button>
        </div>
      </div>
      {results!==null&&(results.length===0
        ? <div style={{textAlign:"center",padding:"40px",color:"var(--text3)"}}>
            <div style={{fontSize:"2.5rem",marginBottom:10}}>🔍</div>
            <p style={{fontWeight:600}}>조회된 예약이 없어요</p>
          </div>
        : <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {results.map(r=>(
              <div key={r.id} className="card" style={{cursor:"pointer",border:`1.5px solid ${sel?.id===r.id?"var(--green)":"var(--line)"}`,boxShadow:sel?.id===r.id?"0 0 0 3px rgba(46,125,94,0.1)":"var(--shadow)",transition:"all 0.18s"}} onClick={()=>{setSel(r);setMode("");setDone("");}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                  <div>
                    <p style={{fontSize:"0.92rem",fontWeight:800,color:"var(--green)",marginBottom:2}}>{r.reservationNumber}</p>
                    <p style={{fontSize:"0.72rem",color:"var(--text3)",fontWeight:600}}>{r.voucherCode}</p>
                  </div>
                  <span className={`badge ${statusCls(r.status)}`}>{statusLabel(r.status)}</span>
                </div>
                <div style={{fontSize:"0.83rem",color:"var(--text2)",display:"flex",gap:16,flexWrap:"wrap",fontWeight:600}}>
                  <span>📅 {fmtDate(r.date)} {r.time}</span>
                  <span>👤 {r.customerName}</span>
                </div>
                {sel?.id===r.id&&(
                  <div style={{marginTop:14,paddingTop:14,borderTop:"1.5px solid var(--line)"}}>
                    {r.requestMessage&&<div style={{marginBottom:10,fontSize:"0.82rem",color:"var(--text2)",background:"var(--bg)",padding:"9px 12px",borderRadius:10,fontWeight:500}}>💬 {r.requestMessage}</div>}
                    {done&&<div style={{padding:"10px 12px",background:"var(--green3)",borderRadius:10,fontSize:"0.82rem",color:"var(--green)",fontWeight:700,marginBottom:10}}>{done}</div>}
                    {["pending","confirmed"].includes(r.status)&&!done&&(
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <button className="btn btn-o" onClick={e=>{e.stopPropagation();setMode(mode==="change"?"":"change");}} style={{fontSize:"0.78rem",padding:"8px 16px"}}>✏️ 변경 요청</button>
                        <button onClick={e=>{e.stopPropagation();setMode(mode==="cancel"?"":"cancel");}} style={{background:"#FDE8E0",color:"#C03010",border:"1.5px solid #F4A890",padding:"8px 16px",borderRadius:12,fontSize:"0.78rem",fontWeight:700,cursor:"pointer"}}>❌ 취소 요청</button>
                      </div>
                    )}
                    {(mode==="change"||mode==="cancel")&&(
                      <div style={{marginTop:12}} onClick={e=>e.stopPropagation()}>
                        <textarea className="inp" value={reason} onChange={e=>setReason(e.target.value)} placeholder={mode==="change"?"변경 희망 날짜/시간 또는 사유를 입력해주세요":"취소 사유를 입력해주세요"} rows={3} style={{marginBottom:8,resize:"vertical"}}/>
                        <p style={{fontSize:"0.73rem",color:"var(--text3)",marginBottom:8,fontWeight:600}}>📌 관리자 확인 후 처리됩니다</p>
                        <button onClick={()=>request(mode)} style={{width:"100%",padding:"11px",background:mode==="cancel"?"#C03010":"var(--green)",color:"#fff",border:"none",borderRadius:12,fontSize:"0.85rem",fontWeight:700,cursor:"pointer"}}>
                          {mode==="cancel"?"❌ 취소 요청 접수":"✏️ 변경 요청 접수"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
const AdminLogin = ({go, setAdmin}) => {
  const [id, setId] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  const login = () => { if(id==="admin"&&pw==="verde2025"){setAdmin(true);go("admin-res");}else setErr("아이디 또는 비밀번호를 확인해주세요"); };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#E6F4EE 0%,#D0EBDD 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,background:"var(--green)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",margin:"0 auto 14px"}}>⛳</div>
          <h1 style={{fontSize:"1.5rem",fontWeight:800,color:"var(--text)",marginBottom:4}}>관리자 로그인</h1>
          <p style={{fontSize:"0.84rem",color:"var(--text2)",fontWeight:500}}>VIP Golf Voucher 관리자 페이지</p>
        </div>
        <div className="card">
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label className="lbl">관리자 ID</label><input className="inp" value={id} onChange={e=>setId(e.target.value)} placeholder="admin" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
            <div><label className="lbl">비밀번호</label><input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
            {err&&<div style={{fontSize:"0.84rem",color:"#C03010",background:"#FDE8E0",padding:"10px",borderRadius:10,fontWeight:600}}>{err}</div>}
            <button className="btn btn-g" onClick={login} style={{width:"100%",fontSize:"0.92rem"}}>🔐 로그인</button>
          </div>
          <p style={{marginTop:12,fontSize:"0.72rem",color:"var(--text3)",textAlign:"center",fontWeight:500}}>admin / verde2025</p>
        </div>
        <button onClick={()=>go("home")} style={{display:"block",margin:"18px auto 0",fontSize:"0.78rem",color:"var(--text2)",fontWeight:700,background:"transparent",border:"none",cursor:"pointer"}}>← 고객 사이트로</button>
      </div>
    </div>
  );
};

// ── ADMIN SHELL ───────────────────────────────────────────────────────────────
const Shell = ({children, page, go}) => (
  <div style={{background:"var(--bg)",minHeight:"100vh",paddingTop:62}}>
    <div style={{background:"#fff",borderBottom:"1.5px solid var(--line)",position:"sticky",top:62,zIndex:50}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 16px",display:"flex",overflowX:"auto"}}>
        {[["admin-res","📋 예약 관리"],["admin-vch","🎟 바우처"],["admin-slot","📅 일정"],["admin-settle","💰 정산"],["admin-evd","📎 증빙"]].map(([p,l])=>(
          <button key={p} onClick={()=>go(p)} style={{padding:"12px 14px",fontSize:"0.78rem",fontWeight:700,whiteSpace:"nowrap",color:page===p?"var(--green)":"var(--text2)",background:"transparent",border:"none",borderBottom:page===p?"3px solid var(--green)":"3px solid transparent",cursor:"pointer",transition:"color 0.18s"}}>{l}</button>
        ))}
      </div>
    </div>
    <div style={{maxWidth:1280,margin:"0 auto",padding:"22px 16px"}}>{children}</div>
  </div>
);

// ── DEPT BADGE ────────────────────────────────────────────────────────────────
const DB = ({code, deptKey}) => {
  const d = deptKey ? DEPTS.find(x=>x.key===deptKey) : getDept(code);
  if (!d) return null;
  return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:"0.66rem",fontWeight:700,background:d.color+"1A",color:d.color,border:`1.5px solid ${d.color}33`}}>{d.label}</span>;
};

// ── ADMIN RESERVATIONS ────────────────────────────────────────────────────────
const AdminRes = ({reservations, setRes, page, go}) => {
  const [fStat, setFStat] = useState("all");
  const [fDept, setFDept] = useState("all");
  const [search, setSearch] = useState("");
  const [exp, setExp] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const filtered = reservations.filter(r=>{
    const ms = fStat==="all"||r.status===fStat;
    const md = fDept==="all"||getDept(r.voucherCode)?.key===fDept;
    const q = search.toLowerCase();
    const mq = !q||r.customerName.includes(q)||r.phone.replace(/-/g,"").includes(q.replace(/-/g,""))||r.reservationNumber.toLowerCase().includes(q)||r.voucherCode.toLowerCase().includes(q);
    return ms&&md&&mq;
  });
  const chStat = (id,s) => setRes(p=>p.map(r=>r.id===id?{...r,status:s}:r));
  const startEdit = r => { setEditId(r.id); setEditData({customerName:r.customerName,phone:r.phone,date:r.date,time:r.time,requestMessage:r.requestMessage,createdAt:r.createdAt}); };
  const saveEdit = id => { setRes(p=>p.map(r=>r.id===id?{...r,...editData}:r)); setEditId(null); };
  return (
    <Shell page={page} go={go}>
      <div style={{marginBottom:16,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <input className="inp" value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름 / 전화번호 / 예약번호" style={{maxWidth:240}}/>
        <select className="inp" value={fDept} onChange={e=>setFDept(e.target.value)} style={{maxWidth:150}}>
          <option value="all">전체 부문</option>
          {DEPTS.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}
        </select>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[["all","전체"],["pending","접수"],["confirmed","확정"],["change_requested","변경"],["cancel_requested","취소요청"],["cancelled","취소"],["completed","완료"]].map(([s,l])=>(
            <button key={s} onClick={()=>setFStat(s)} style={{padding:"7px 12px",borderRadius:20,fontSize:"0.74rem",fontWeight:700,border:"1.5px solid "+(fStat===s?"var(--green)":"var(--line)"),background:fStat===s?"var(--green)":"#fff",color:fStat===s?"#fff":"var(--text2)",cursor:"pointer",transition:"all 0.18s"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:18,border:"1.5px solid var(--line)",overflow:"hidden",boxShadow:"var(--shadow)"}}>
        {filtered.length===0
          ? <div style={{textAlign:"center",padding:"36px",color:"var(--text3)",fontWeight:600}}>조회된 예약이 없습니다</div>
          : filtered.map(r=>{
            const isE = exp===r.id;
            return (
              <div key={r.id} style={{borderBottom:"1.5px solid var(--line)"}}>
                <div onClick={()=>setExp(isE?null:r.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",cursor:"pointer",background:isE?"rgba(46,125,94,0.03)":"#fff",transition:"background 0.15s"}}
                  onMouseEnter={e=>!isE&&(e.currentTarget.style.background="#F8FCF9")} onMouseLeave={e=>!isE&&(e.currentTarget.style.background="#fff")}>
                  <div style={{flex:"0 0 auto"}}>
                    <p style={{fontSize:"0.84rem",fontWeight:800,color:"var(--text)",marginBottom:2}}>{r.customerName}</p>
                    <p style={{fontSize:"0.69rem",color:"var(--text3)",fontWeight:600}}>{r.voucherCode}</p>
                  </div>
                  <DB code={r.voucherCode}/>
                  <div style={{flex:1,fontSize:"0.8rem",color:"var(--text2)",display:"flex",gap:14,flexWrap:"wrap",fontWeight:600}}>
                    <span>{r.date} {r.time}</span>
                    <span style={{color:"var(--text3)"}}>{r.phone}</span>
                  </div>
                  <span className={`badge ${statusCls(r.status)}`}>{statusLabel(r.status)}</span>
                  <span style={{color:"var(--text3)",fontSize:"0.78rem",fontWeight:700}}>{isE?"▲":"▼"}</span>
                </div>
                {isE&&(
                  <div style={{padding:"14px 16px 18px",background:"rgba(46,125,94,0.02)",borderTop:"1px solid var(--line)"}}>
                    {editId===r.id ? (
                      <div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:14}}>
                          <div><label className="lbl">예약자 이름</label><input className="inp" value={editData.customerName} onChange={e=>setEditData(p=>({...p,customerName:e.target.value}))} placeholder="이름" style={{padding:"7px 10px"}}/></div>
                          <div><label className="lbl">휴대폰</label><input className="inp" value={editData.phone} onChange={e=>setEditData(p=>({...p,phone:e.target.value}))} placeholder="010-0000-0000" style={{padding:"7px 10px"}}/></div>
                          <div><label className="lbl">이용 날짜</label><input type="date" className="inp" value={editData.date} onChange={e=>setEditData(p=>({...p,date:e.target.value}))} style={{padding:"7px 10px"}}/></div>
                          <div><label className="lbl">이용 시간</label><input type="time" className="inp" value={editData.time} onChange={e=>setEditData(p=>({...p,time:e.target.value}))} style={{padding:"7px 10px"}}/></div>
                          <div><label className="lbl">접수일</label><input type="date" className="inp" value={editData.createdAt} onChange={e=>setEditData(p=>({...p,createdAt:e.target.value}))} style={{padding:"7px 10px"}}/></div>
                          <div><label className="lbl">요청사항</label><input className="inp" value={editData.requestMessage} onChange={e=>setEditData(p=>({...p,requestMessage:e.target.value}))} placeholder="없음" style={{padding:"7px 10px"}}/></div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>saveEdit(r.id)} className="btn btn-g" style={{fontSize:"0.82rem",padding:"8px 18px"}}>저장</button>
                          <button onClick={()=>setEditId(null)} className="btn btn-o" style={{fontSize:"0.82rem",padding:"8px 18px"}}>취소</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:14}}>
                          {[["예약번호",r.reservationNumber],["바우처",r.voucherCode],["예약자",r.customerName||"—"],["휴대폰",r.phone||"—"],["날짜·시간",r.date?`${r.date} ${r.time}`:"—"],["접수일",r.createdAt||"—"]].map(([l,v])=>(
                            <div key={l}>
                              <span style={{fontSize:"0.65rem",fontWeight:700,color:"var(--text3)",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</span>
                              <span style={{fontSize:"0.82rem",color:v==="—"?"var(--text3)":"var(--text)",fontWeight:700}}>{v}</span>
                            </div>
                          ))}
                        </div>
                        {r.requestMessage&&<div style={{padding:"9px 13px",background:"var(--bg)",borderRadius:10,fontSize:"0.8rem",color:"var(--text2)",marginBottom:14,fontWeight:500}}>💬 요청사항: {r.requestMessage}</div>}
                        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                          <button onClick={()=>startEdit(r)} className="btn btn-o" style={{fontSize:"0.78rem",padding:"7px 16px"}}>✏️ 정보 수정</button>
                          <span style={{fontSize:"0.72rem",color:"var(--text2)",fontWeight:700}}>상태:</span>
                          <select value={r.status} onChange={e=>chStat(r.id,e.target.value)} className="inp" style={{maxWidth:160,padding:"7px 11px",fontSize:"0.8rem"}}>
                            {["pending","confirmed","change_requested","cancel_requested","cancelled","completed"].map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <p style={{marginTop:10,fontSize:"0.74rem",color:"var(--text3)",textAlign:"right",fontWeight:600}}>총 {filtered.length}건</p>
    </Shell>
  );
};

// ── ADMIN VOUCHERS ────────────────────────────────────────────────────────────
const AdminVch = ({vouchers, setVch, page, go}) => {
  const [fD, setFD] = useState("all");
  const [fS, setFS] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [nv, setNv] = useState({code:"",customerName:"",phone:"",validFrom:"",validUntil:""});
  const [addErr, setAddErr] = useState("");
  const filtered = vouchers.filter(v=>{
    const md = fD==="all"||(v.dept||getDept(v.code)?.key)===fD;
    const ms = fS==="all"||v.status===fS;
    return md&&ms;
  });
  const saveEdit = id => { setVch(p=>p.map(v=>v.id===id?{...v,...editData}:v)); setEditId(null); };
  const addV = () => {
    setAddErr("");
    if (!nv.code||!nv.customerName||!nv.validFrom||!nv.validUntil){setAddErr("코드, 이름, 유효기간을 입력해주세요"); return;}
    if (vouchers.find(v=>v.code===nv.code.toUpperCase())){setAddErr("이미 존재하는 코드예요"); return;}
    setVch(p=>[...p,{...nv,code:nv.code.toUpperCase(),id:"v"+Date.now(),status:"unused"}]);
    setShowAdd(false); setNv({code:"",customerName:"",phone:"",validFrom:"",validUntil:""});
  };
  return (
    <Shell page={page} go={go}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select className="inp" value={fD} onChange={e=>setFD(e.target.value)} style={{maxWidth:160}}>
            <option value="all">전체 부문</option>
            {DEPTS.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
          <select className="inp" value={fS} onChange={e=>setFS(e.target.value)} style={{maxWidth:130}}>
            {[["all","전체"],["unused","미사용"],["reserved","예약중"],["used","사용완료"],["expired","만료"],["disabled","비활성"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button className="btn btn-g" onClick={()=>setShowAdd(!showAdd)} style={{fontSize:"0.88rem"}}>+ 바우처 등록</button>
      </div>
      {showAdd&&(
        <div className="card" style={{marginBottom:16,border:"1.5px solid var(--green)"}}>
          <p style={{fontSize:"0.8rem",fontWeight:700,color:"var(--green)",marginBottom:14}}>신규 바우처 등록</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:12}}>
            {[["code","바우처 코드","VIP2026001"],["customerName","고객명",""],["phone","휴대폰","010-0000-0000"]].map(([k,l,ph])=>(
              <div key={k}><label className="lbl">{l}</label><input className="inp" value={nv[k]} onChange={e=>setNv(p=>({...p,[k]:e.target.value}))} placeholder={ph}/></div>
            ))}
            <div><label className="lbl">유효 시작일</label><input type="date" className="inp" value={nv.validFrom} onChange={e=>setNv(p=>({...p,validFrom:e.target.value}))}/></div>
            <div><label className="lbl">유효 종료일</label><input type="date" className="inp" value={nv.validUntil} onChange={e=>setNv(p=>({...p,validUntil:e.target.value}))}/></div>
          </div>
          {addErr&&<p style={{fontSize:"0.8rem",color:"#C03010",marginBottom:10,fontWeight:600}}>{addErr}</p>}
          <div style={{display:"flex",gap:8}}><button className="btn btn-g" onClick={addV} style={{fontSize:"0.88rem"}}>등록</button><button className="btn btn-o" onClick={()=>{setShowAdd(false);setAddErr("");}} style={{fontSize:"0.88rem"}}>취소</button></div>
        </div>
      )}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {DEPTS.map(d=>{
          const cnt=vouchers.filter(v=>(v.dept||getDept(v.code)?.key)===d.key).length;
          const used=vouchers.filter(v=>(v.dept||getDept(v.code)?.key)===d.key&&["used","reserved"].includes(v.status)).length;
          return <button key={d.key} onClick={()=>setFD(fD===d.key?"all":d.key)} style={{padding:"6px 13px",borderRadius:20,fontSize:"0.72rem",fontWeight:700,background:fD===d.key?d.color:"#fff",color:fD===d.key?"#fff":"var(--text2)",border:`1.5px solid ${fD===d.key?d.color:"var(--line)"}`,cursor:"pointer",transition:"all 0.18s"}}>{d.label} <span style={{opacity:0.75}}>{used}/{cnt}</span></button>;
        })}
      </div>
      <div style={{background:"#fff",borderRadius:18,border:"1.5px solid var(--line)",overflow:"auto",boxShadow:"var(--shadow)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"}}>
          <thead>
            <tr style={{background:"var(--bg)",borderBottom:"1.5px solid var(--line)"}}>
              {["바우처코드","부문","고객명","휴대폰","유효기간","상태","관리"].map(h=><th key={h} style={{padding:"11px 13px",textAlign:"left",fontSize:"0.68rem",fontWeight:700,color:"var(--text2)",whiteSpace:"nowrap"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={7} style={{textAlign:"center",padding:"30px",color:"var(--text3)",fontWeight:600}}>해당 바우처가 없습니다</td></tr>
              : filtered.map(v=>{
                const isE=editId===v.id;
                return (
                  <tr key={v.id} style={{borderBottom:"1px solid var(--line)"}}>
                    <td style={{padding:"12px 13px",fontFamily:"monospace",fontSize:"0.8rem",color:"var(--green)",fontWeight:700}}>{v.code}</td>
                    <td style={{padding:"12px 13px"}}><DB code={v.code} deptKey={v.dept}/></td>
                    <td style={{padding:"12px 13px",fontWeight:600}}>{isE?<input className="inp" value={editData.customerName} onChange={e=>setEditData(p=>({...p,customerName:e.target.value}))} style={{padding:"6px 9px"}}/>:v.customerName}</td>
                    <td style={{padding:"12px 13px",color:"var(--text2)",fontWeight:500}}>{isE?<input className="inp" value={editData.phone} onChange={e=>setEditData(p=>({...p,phone:e.target.value}))} style={{padding:"6px 9px"}}/>:v.phone}</td>
                    <td style={{padding:"12px 13px",color:"var(--text2)",fontSize:"0.78rem",whiteSpace:"nowrap",fontWeight:500}}>
                      {isE?<div style={{display:"flex",gap:4}}><input type="date" className="inp" value={editData.validFrom} onChange={e=>setEditData(p=>({...p,validFrom:e.target.value}))} style={{padding:"5px 7px",fontSize:"0.75rem"}}/><input type="date" className="inp" value={editData.validUntil} onChange={e=>setEditData(p=>({...p,validUntil:e.target.value}))} style={{padding:"5px 7px",fontSize:"0.75rem"}}/></div>:`${v.validFrom} ~ ${v.validUntil}`}
                    </td>
                    <td style={{padding:"12px 13px"}}>
                      {isE?<select value={editData.status} onChange={e=>setEditData(p=>({...p,status:e.target.value}))} className="inp" style={{padding:"5px 7px",fontSize:"0.78rem"}}>
                        {["unused","reserved","used","expired","disabled"].map(s=><option key={s} value={s}>{voucherLabel(s)}</option>)}
                      </select>:<span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:"0.68rem",fontWeight:700,background:{unused:"var(--green3)",reserved:"var(--yellow2)",used:"#F0F0F0",expired:"#FDE8E0",disabled:"#F0F0F0"}[v.status],color:{unused:"var(--green)",reserved:"#B07000",used:"#505050",expired:"#C03010",disabled:"#707070"}[v.status]}}>{voucherLabel(v.status)}</span>}
                    </td>
                    <td style={{padding:"12px 13px"}}>
                      <div style={{display:"flex",gap:5}}>
                        {isE?<><button onClick={()=>saveEdit(v.id)} style={{fontSize:"0.72rem",color:"#fff",background:"var(--green)",border:"none",padding:"5px 11px",borderRadius:8,cursor:"pointer",fontWeight:700}}>저장</button><button onClick={()=>setEditId(null)} style={{fontSize:"0.72rem",color:"var(--text2)",background:"var(--bg)",border:"1.5px solid var(--line)",padding:"5px 9px",borderRadius:8,cursor:"pointer",fontWeight:600}}>취소</button></>
                        :<button onClick={()=>{setEditId(v.id);setEditData({customerName:v.customerName,phone:v.phone,validFrom:v.validFrom,validUntil:v.validUntil,status:v.status});}} style={{fontSize:"0.72rem",color:"var(--green)",border:"1.5px solid var(--green)",padding:"5px 11px",borderRadius:8,background:"transparent",cursor:"pointer",fontWeight:700}}>수정</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <p style={{marginTop:8,fontSize:"0.74rem",color:"var(--text3)",textAlign:"right",fontWeight:600}}>총 {filtered.length}건</p>
    </Shell>
  );
};

// ── ADMIN SLOTS ───────────────────────────────────────────────────────────────
const AdminSlot = ({slots, setSlots, page, go}) => {
  const [yr, setYr] = useState(2026);
  const [mo, setMo] = useState(new Date().getMonth());
  const [selD, setSelD] = useState(null);
  const [newTimes, setNewTimes] = useState([""]);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState("");
  const MN = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const DN = ["일","월","화","수","목","금","토"];
  const first = new Date(yr,mo,1).getDay();
  const days = new Date(yr,mo+1,0).getDate();
  const byDate = slots.reduce((a,s)=>{(a[s.date]=a[s.date]||[]).push(s);return a;},{});
  const cells = [...Array(first).fill(null),...Array.from({length:days},(_,i)=>`${yr}-${String(mo+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`)];
  const prev = () => mo===0?(setYr(y=>y-1),setMo(11)):setMo(m=>m-1);
  const next = () => mo===11?(setYr(y=>y+1),setMo(0)):setMo(m=>m+1);
  const addTimes = () => {
    setErr(""); setSaved("");
    const ts = newTimes.map(t=>t.trim()).filter(Boolean);
    if (!selD){setErr("날짜를 먼저 선택하세요"); return;}
    if (!ts.length){setErr("시간을 입력해주세요"); return;}
    const ex = (byDate[selD]||[]).map(s=>s.time);
    const dup = ts.filter(t=>ex.includes(t));
    if (dup.length){setErr(`이미 등록된 시간: ${dup.join(", ")}`); return;}
    setSlots(p=>[...p,...ts.map(t=>({id:"s"+Date.now()+Math.random(),date:selD,time:t,isOpen:true,bookedCount:0}))]);
    setNewTimes([""]); setSaved(`${ts.join(", ")} 등록 완료!`); setTimeout(()=>setSaved(""),3000);
  };
  const PRESETS = [{label:"오전",times:["09:00","10:00","11:00"]},{label:"오후",times:["13:00","14:00","15:00","16:00"]},{label:"종일",times:["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]}];
  const applyPreset = ts => {
    const ex=(byDate[selD]||[]).map(s=>s.time);
    const toAdd=ts.filter(t=>!ex.includes(t));
    if (!toAdd.length){setErr("이미 모두 등록되어 있어요"); return;}
    setSlots(p=>[...p,...toAdd.map(t=>({id:"s"+Date.now()+Math.random(),date:selD,time:t,isOpen:true,bookedCount:0}))]);
    setSaved(`${toAdd.join(", ")} 등록 완료!`); setTimeout(()=>setSaved(""),3000); setErr("");
  };
  const stColor = s => s.isOpen&&s.bookedCount===0?"var(--green)":s.bookedCount>0?"#B07000":"#C03010";
  const stBg   = s => s.isOpen&&s.bookedCount===0?"var(--green3)":s.bookedCount>0?"var(--yellow2)":"#FDE8E0";
  const stText = s => s.bookedCount>0?"예약됨":s.isOpen?"가능":"마감";
  const getDStatus = d => {
    const ss=byDate[d];
    if (!ss||!ss.length) return "none";
    return ss.some(x=>x.isOpen&&x.bookedCount===0)?"ok":"full";
  };
  const slotList = selD?(byDate[selD]||[]).sort((a,b)=>a.time.localeCompare(b.time)):[];
  return (
    <Shell page={page} go={go}>
      <h2 style={{fontSize:"1.2rem",fontWeight:800,color:"var(--text)",marginBottom:18}}>📅 예약 일정 관리</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,alignItems:"start"}}>
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <button onClick={prev} style={{width:32,height:32,border:"1.5px solid var(--line)",borderRadius:10,background:"#fff",fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)"}}>‹</button>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"1rem",fontWeight:800,color:"var(--text)"}}>{yr}년 {MN[mo]}</div>
              <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:5,flexWrap:"wrap"}}>
                {Array.from({length:12},(_,i)=><button key={i} onClick={()=>{setMo(i);setSelD(null);}} style={{fontSize:"0.6rem",padding:"2px 6px",borderRadius:20,background:mo===i?"var(--green)":"transparent",color:mo===i?"#fff":"var(--text3)",border:"none",cursor:"pointer",fontWeight:700}}>{i+1}월</button>)}
              </div>
            </div>
            <button onClick={next} style={{width:32,height:32,border:"1.5px solid var(--line)",borderRadius:10,background:"#fff",fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)"}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
            {DN.map((d,i)=><div key={d} style={{textAlign:"center",fontSize:"0.62rem",fontWeight:700,color:i===0?"#C03010":i===6?"#3060C0":"var(--text3)",padding:"3px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {cells.map((ds,i)=>{
              if (!ds) return <div key={i}/>;
              const st=getDStatus(ds); const isSel=ds===selD;
              const dow=new Date(ds+"T00:00:00").getDay();
              return (
                <button key={ds} onClick={()=>setSelD(isSel?null:ds)} style={{
                  aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
                  borderRadius:9,border:isSel?"2px solid var(--green)":"1.5px solid transparent",
                  background:isSel?"var(--green)":st==="ok"?"var(--green3)":st==="full"?"#FDE8E0":"transparent",
                  color:isSel?"#fff":dow===0?"#D07070":dow===6?"#7070D0":"var(--text)",
                  cursor:"pointer",transition:"all 0.15s",fontSize:"0.8rem",fontWeight:st!=="none"?700:500,
                }}>
                  {new Date(ds+"T00:00:00").getDate()}
                  {st!=="none"&&<span style={{width:4,height:4,borderRadius:"50%",background:isSel?"rgba(255,255,255,0.7)":st==="ok"?"var(--green)":"#C03010",display:"inline-block"}}/>}
                </button>
              );
            })}
          </div>
          <div style={{marginTop:10,display:"flex",gap:12,fontSize:"0.65rem",color:"var(--text3)",fontWeight:600,flexWrap:"wrap"}}>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"var(--green3)",border:"1.5px solid var(--green4)",display:"inline-block"}}/> 예약 가능</span>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"#FDE8E0",border:"1.5px solid #F4B0A0",display:"inline-block"}}/> 전체 예약됨</span>
          </div>
        </div>
        {!selD
          ? <div className="card" style={{textAlign:"center",color:"var(--text3)",padding:"36px 20px"}}><div style={{fontSize:"2rem",marginBottom:10}}>👈</div><p style={{fontWeight:600}}>날짜를 선택하면<br/>시간대를 등록할 수 있어요</p></div>
          : <div className="card">
              <div style={{marginBottom:14,paddingBottom:12,borderBottom:"1.5px solid var(--line)"}}>
                <p style={{fontSize:"0.92rem",fontWeight:800,color:"var(--text)",marginBottom:2}}>{fmtDate(selD)}</p>
                <p style={{fontSize:"0.74rem",color:"var(--text3)",fontWeight:600}}>1:1 레슨 시간대 관리</p>
              </div>
              {slotList.length>0&&(
                <div style={{marginBottom:14}}>
                  <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>등록된 시간대</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {slotList.map(s=>(
                      <div key={s.id} style={{padding:"7px 11px",border:`1.5px solid ${stColor(s)}`,borderRadius:10,background:stBg(s),display:"flex",alignItems:"center",gap:7}}>
                        <span style={{fontSize:"0.86rem",fontWeight:800,color:"var(--text)"}}>{s.time}</span>
                        <span style={{fontSize:"0.64rem",fontWeight:700,color:stColor(s)}}>{stText(s)}</span>
                        {s.bookedCount===0&&<><button onClick={()=>setSlots(p=>p.map(x=>x.id===s.id?{...x,isOpen:!x.isOpen}:x))} style={{fontSize:"0.62rem",color:s.isOpen?"#C03010":"var(--green)",border:`1px solid ${s.isOpen?"#F4A890":"var(--green4)"}`,padding:"2px 7px",borderRadius:8,background:"transparent",cursor:"pointer",fontWeight:700}}>{s.isOpen?"마감":"재개"}</button>
                        <button onClick={()=>setSlots(p=>p.filter(x=>x.id!==s.id))} style={{fontSize:"0.7rem",color:"var(--text3)",border:"none",background:"transparent",cursor:"pointer",padding:"0 2px",lineHeight:1}}>✕</button></>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{marginBottom:14}}>
                <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>빠른 등록</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {PRESETS.map(p=><button key={p.label} onClick={()=>applyPreset(p.times)} style={{padding:"7px 13px",borderRadius:20,fontSize:"0.74rem",fontWeight:700,border:"1.5px solid var(--green)",color:"var(--green)",background:"#fff",cursor:"pointer",transition:"all 0.18s"}} onMouseEnter={e=>{e.target.style.background="var(--green)";e.target.style.color="#fff";}} onMouseLeave={e=>{e.target.style.background="#fff";e.target.style.color="var(--green)";}}>
                    {p.label} <span style={{fontSize:"0.62rem",opacity:0.7}}>{p.times[0]}~</span>
                  </button>)}
                </div>
              </div>
              <div>
                <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>직접 시간 추가</p>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                  {newTimes.map((t,i)=>(
                    <div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
                      <input type="time" className="inp" value={t} onChange={e=>setNewTimes(p=>{const n=[...p];n[i]=e.target.value;return n;})} style={{flex:1,padding:"8px 10px"}}/>
                      {newTimes.length>1&&<button onClick={()=>setNewTimes(p=>p.filter((_,j)=>j!==i))} style={{color:"var(--text3)",fontSize:"0.9rem",cursor:"pointer",border:"none",background:"none"}}>✕</button>}
                    </div>
                  ))}
                </div>
                <button onClick={()=>setNewTimes(p=>[...p,""])} style={{fontSize:"0.74rem",color:"var(--text2)",border:"1.5px dashed var(--line)",padding:"6px 13px",borderRadius:8,background:"transparent",cursor:"pointer",fontWeight:600,marginBottom:10}}>+ 시간 추가</button>
                {err&&<p style={{fontSize:"0.8rem",color:"#C03010",marginBottom:8,fontWeight:600}}>{err}</p>}
                {saved&&<p style={{fontSize:"0.8rem",color:"var(--green)",marginBottom:8,fontWeight:700}}>✅ {saved}</p>}
                <button className="btn btn-g" onClick={addTimes} style={{width:"100%",fontSize:"0.88rem"}}>시간대 등록</button>
              </div>
            </div>
        }
      </div>
      <div style={{marginTop:18,background:"#fff",borderRadius:18,border:"1.5px solid var(--line)",overflow:"hidden",boxShadow:"var(--shadow)"}}>
        <div style={{padding:"12px 16px",background:"var(--bg)",borderBottom:"1.5px solid var(--line)"}}>
          <p style={{fontSize:"0.78rem",fontWeight:800,color:"var(--text)"}}>{yr}년 {MN[mo]} 슬롯 현황</p>
        </div>
        {Object.keys(byDate).filter(d=>d.startsWith(`${yr}-${String(mo+1).padStart(2,"0")}`)).sort().length===0
          ? <div style={{textAlign:"center",padding:"28px",color:"var(--text3)",fontWeight:600}}>이 달 등록된 슬롯이 없습니다</div>
          : Object.keys(byDate).filter(d=>d.startsWith(`${yr}-${String(mo+1).padStart(2,"0")}`)).sort().map(d=>(
            <div key={d} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid var(--line)",flexWrap:"wrap"}}>
              <span style={{fontSize:"0.82rem",fontWeight:700,color:"var(--text)",minWidth:165}}>{fmtDate(d)}</span>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {(byDate[d]||[]).sort((a,b)=>a.time.localeCompare(b.time)).map(s=>(
                  <span key={s.id} style={{fontSize:"0.74rem",padding:"3px 10px",borderRadius:20,fontWeight:700,background:stBg(s),color:stColor(s)}}>{s.time}{s.bookedCount>0?" ·예약됨":!s.isOpen?" ·마감":""}</span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </Shell>
  );
};

// ── ADMIN SETTLEMENT ──────────────────────────────────────────────────────────
const AdminSettle = ({reservations, page, go}) => {
  const UNIT = 250000;
  const done = reservations.filter(r=>r.status==="completed");
  const byM = done.reduce((a,r)=>{const ym=r.date.slice(0,7);(a[ym]=a[ym]||[]).push(r);return a;},{});
  const months = Object.keys(byM).sort().reverse();
  return (
    <Shell page={page} go={go}>
      <h2 style={{fontSize:"1.2rem",fontWeight:800,color:"var(--text)",marginBottom:18}}>💰 정산 현황</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:22}}>
        {[["이용 완료 건수",`${done.length}건`,"var(--green)"],["단가","250,000원","#B07000"],["총 정산금액",`${(done.length*UNIT).toLocaleString()}원`,"#6050C0"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1.5px solid var(--line)",borderRadius:16,padding:"18px",borderTop:`4px solid ${c}`,boxShadow:"var(--shadow)"}}>
            <p style={{fontSize:"0.68rem",fontWeight:700,color:"var(--text2)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</p>
            <p style={{fontSize:"1.7rem",fontWeight:800,color:c,lineHeight:1}}>{v}</p>
          </div>
        ))}
      </div>
      {months.length===0
        ? <div style={{textAlign:"center",padding:"40px",color:"var(--text3)",fontWeight:600}}>이용 완료된 예약이 없습니다</div>
        : months.map(ym=>{
          const rows=byM[ym];
          const depts=DEPTS.map(d=>({...d,items:rows.filter(r=>getDept(r.voucherCode)?.key===d.key)})).filter(d=>d.items.length>0);
          return (
            <div key={ym} style={{background:"#fff",border:"1.5px solid var(--line)",borderRadius:18,marginBottom:14,overflow:"hidden",boxShadow:"var(--shadow)"}}>
              <div style={{padding:"12px 18px",background:"var(--bg)",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1.5px solid var(--line)"}}>
                <span style={{fontSize:"1rem",fontWeight:800,color:"var(--text)"}}>{ym.replace("-","년 ")}월</span>
                <div><span style={{fontSize:"0.82rem",color:"var(--text2)",fontWeight:600,marginRight:12}}>{rows.length}건</span><span style={{fontSize:"0.96rem",fontWeight:800,color:"var(--green)"}}>{(rows.length*UNIT).toLocaleString()}원</span></div>
              </div>
              {depts.map(d=>(
                <div key={d.key} style={{padding:"11px 18px",borderBottom:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:d.color}}/><span style={{fontSize:"0.84rem",fontWeight:700,color:"var(--text)"}}>{d.label}</span><span style={{fontSize:"0.74rem",color:"var(--text3)",fontWeight:600}}>{d.items.length}건</span></div>
                  <span style={{fontSize:"0.9rem",fontWeight:800,color:"var(--text)"}}>{(d.items.length*UNIT).toLocaleString()}원</span>
                </div>
              ))}
              {rows.map(r=>(
                <div key={r.id} style={{padding:"9px 18px 9px 32px",borderBottom:"1px solid #F0F5F2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:14,fontSize:"0.79rem",color:"var(--text2)",fontWeight:600}}><span>{r.date}</span><span>{r.customerName}</span><span style={{color:"var(--text3)"}}>{r.voucherCode}</span></div>
                  <span style={{fontSize:"0.79rem",color:"var(--text2)",fontWeight:700}}>{UNIT.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          );
        })}
    </Shell>
  );
};

// ── ADMIN EVIDENCE ────────────────────────────────────────────────────────────
const AdminEvd = ({reservations, page, go}) => {
  const [evMap, setEvRaw] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("vip_evMap")||"{}"); } catch { return {}; }
  });
  const setEv = fn => setEvRaw(prev => {
    const next = typeof fn==="function" ? fn(prev) : fn;
    try { localStorage.setItem("vip_evMap", JSON.stringify(next)); } catch {}
    return next;
  });
  const [selR, setSelR] = useState(null);
  const [memo, setMemo] = useState("");
  const [search, setSrc] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const fRef = useRef();
  const filtered = reservations.filter(r=>{const q=search.toLowerCase();return !q||r.customerName.includes(q)||r.voucherCode.toLowerCase().includes(q)||r.reservationNumber.toLowerCase().includes(q);});
  const ev = selR?(evMap[selR.id]||{files:[],memo:""}):null;
  const handleFiles = e => {
    const fs=Array.from(e.target.files);
    Promise.all(fs.map(f=>new Promise(res=>{
      if(f.type.startsWith("image/")){const r=new FileReader();r.onload=e2=>res({name:f.name,type:"image",url:e2.target.result});r.readAsDataURL(f);}
      else res({name:f.name,type:"file",url:""});
    }))).then(nf=>{
      setEv(p=>{const c=p[selR.id]||{files:[],memo:""};return {...p,[selR.id]:{...c,files:[...c.files,...nf]}};});
      setSaveMsg("✅ 파일이 저장됐어요!"); setTimeout(()=>setSaveMsg(""),2500);
    });
    e.target.value="";
  };
  const saveMemo = () => {
    setEv(p=>{const c=p[selR.id]||{files:[],memo:""};return {...p,[selR.id]:{...c,memo}};});
    setSaveMsg("✅ 메모가 저장됐어요!"); setTimeout(()=>setSaveMsg(""),2500);
  };
  const rmFile = i => { setEv(p=>{const c=p[selR.id]||{files:[],memo:""};return {...p,[selR.id]:{...c,files:c.files.filter((_,j)=>j!==i)}};}) };
  return (
    <Shell page={page} go={go}>
      <h2 style={{fontSize:"1.2rem",fontWeight:800,color:"var(--text)",marginBottom:18}}>📎 증빙자료 관리</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div>
          <input className="inp" value={search} onChange={e=>setSrc(e.target.value)} placeholder="예약자명 / 바우처코드 검색" style={{marginBottom:10}}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {filtered.map(r=>{
              const has=evMap[r.id]&&(evMap[r.id].files.length>0||evMap[r.id].memo);
              return (
                <div key={r.id} onClick={()=>{setSelR(r);setMemo((evMap[r.id]||{}).memo||"");}} style={{padding:"12px 14px",border:`1.5px solid ${selR?.id===r.id?"var(--green)":"var(--line)"}`,borderRadius:14,background:selR?.id===r.id?"rgba(46,125,94,0.04)":"#fff",cursor:"pointer",transition:"all 0.15s",boxShadow:"var(--shadow)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div><p style={{fontSize:"0.84rem",fontWeight:800,color:"var(--text)",marginBottom:2}}>{r.customerName}</p><p style={{fontSize:"0.7rem",color:"var(--text3)",fontWeight:600}}>{r.voucherCode} · {r.date}</p></div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      {has&&<span style={{fontSize:"0.62rem",padding:"2px 7px",background:"var(--green3)",color:"var(--green)",borderRadius:20,fontWeight:700}}>자료있음</span>}
                      <span className={`badge ${statusCls(r.status)}`}>{statusLabel(r.status)}</span>
                    </div>
                  </div>
                  <DB code={r.voucherCode}/>
                </div>
              );
            })}
            {filtered.length===0&&<p style={{textAlign:"center",padding:"28px",color:"var(--text3)",fontWeight:600}}>예약이 없습니다</p>}
          </div>
        </div>
        <div>
          {!selR
            ? <div className="card" style={{textAlign:"center",color:"var(--text3)",padding:"36px 20px"}}><div style={{fontSize:"2rem",marginBottom:10}}>👆</div><p style={{fontWeight:600}}>왼쪽 목록에서<br/>예약 건을 선택하세요</p></div>
            : <div className="card" style={{position:"sticky",top:130}}>
                <div style={{marginBottom:14,paddingBottom:12,borderBottom:"1.5px solid var(--line)"}}>
                  <p style={{fontSize:"0.9rem",fontWeight:800,color:"var(--text)",marginBottom:2}}>{selR.customerName}</p>
                  <p style={{fontSize:"0.72rem",color:"var(--text3)",fontWeight:600}}>{selR.reservationNumber} · {selR.voucherCode}</p>
                  <p style={{fontSize:"0.72rem",color:"var(--text2)",marginTop:2,fontWeight:600}}>{fmtDate(selR.date)} {selR.time}</p>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>첨부파일 / 사진</p>
                    <button onClick={()=>fRef.current?.click()} style={{fontSize:"0.72rem",color:"var(--green)",border:"1.5px solid var(--green)",padding:"5px 11px",borderRadius:8,background:"transparent",cursor:"pointer",fontWeight:700}}>+ 업로드</button>
                    <input ref={fRef} type="file" multiple accept="image/*,.pdf,.xlsx,.docx" onChange={handleFiles} style={{display:"none"}}/>
                  </div>
                  {ev&&ev.files.length>0
                    ? <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {ev.files.map((f,i)=>(
                          <div key={i} style={{position:"relative"}}>
                            {f.type==="image"
                              ? <div style={{width:76,height:76,borderRadius:10,overflow:"hidden",border:"1.5px solid var(--line)"}}><img src={f.url} alt={f.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                              : <div style={{width:76,height:76,borderRadius:10,border:"1.5px solid var(--line)",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:6}}><span style={{fontSize:"1.2rem"}}>📄</span><span style={{fontSize:"0.56rem",color:"var(--text2)",textAlign:"center",wordBreak:"break-all",lineHeight:1.3,marginTop:3,fontWeight:600}}>{f.name.slice(0,12)}</span></div>}
                            <button onClick={()=>rmFile(i)} style={{position:"absolute",top:-5,right:-5,width:18,height:18,borderRadius:"50%",background:"#C03010",color:"#fff",fontSize:"0.65rem",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"none",fontWeight:800}}>×</button>
                          </div>
                        ))}
                      </div>
                    : <div style={{padding:"18px",background:"var(--bg)",borderRadius:10,textAlign:"center",fontSize:"0.8rem",color:"var(--text3)",fontWeight:600}}>파일을 업로드하세요</div>}
                </div>
                <div>
                  <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:7,textTransform:"uppercase",letterSpacing:"0.06em"}}>메모</p>
                  <textarea className="inp" value={memo} onChange={e=>setMemo(e.target.value)} placeholder="영수증 확인, 특이사항 등 메모를 남겨주세요" rows={4} style={{resize:"vertical",lineHeight:1.6,marginBottom:8}}/>
                  <button className="btn btn-g" onClick={saveMemo} style={{width:"100%",fontSize:"0.88rem"}}>메모 저장</button>
                  {ev&&ev.memo&&<p style={{fontSize:"0.72rem",color:"var(--green)",marginTop:6,textAlign:"center",fontWeight:700}}>✅ 메모 저장됨</p>}
                </div>
              </div>}
        </div>
      </div>
    </Shell>
  );
};

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setAdmin] = useState(false);
  const [vouchers, setVch] = useState(initVouchers);
  const [reservations, setRes] = useState(initRes);
  const [slots, setSlots] = useState(initSlots);
  const [bd, setBD] = useState(null);
  const go = useCallback(p=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"});},[]);
  const adminPages = ["admin-res","admin-vch","admin-slot","admin-settle","admin-evd"];
  const render = () => {
    const ap = {page, go};
    switch(page) {
      case "home":        return <Home go={go}/>;
      case "voucher":     return <VoucherPage go={go} setBD={setBD} vouchers={vouchers}/>;
      case "booking":     return <BookingPage go={go} bd={bd} setBD={setBD} slots={slots} setRes={setRes} setVch={setVch}/>;
      case "book-done":   return <BookDone go={go} bd={bd}/>;
      case "lookup":      return <Lookup go={go} reservations={reservations} setRes={setRes}/>;
      case "admin-login": return <AdminLogin go={go} setAdmin={setAdmin}/>;
      case "admin-res":   return <AdminRes reservations={reservations} setRes={setRes} {...ap}/>;
      case "admin-vch":   return <AdminVch vouchers={vouchers} setVch={setVch} {...ap}/>;
      case "admin-slot":  return <AdminSlot slots={slots} setSlots={setSlots} {...ap}/>;
      case "admin-settle":return <AdminSettle reservations={reservations} {...ap}/>;
      case "admin-evd":   return <AdminEvd reservations={reservations} {...ap}/>;
      default:            return <Home go={go}/>;
    }
  };
  return (
    <>
      <G/>
      {page!=="admin-login"&&<Nav page={page} go={go} isAdmin={isAdmin&&adminPages.includes(page)}/>}
      <div key={page} className="fadeUp">{render()}</div>
    </>
  );
}
