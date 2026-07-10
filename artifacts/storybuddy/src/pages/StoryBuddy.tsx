import { useState, useRef, useEffect } from "react";
import { useGenerateStory } from "@workspace/api-client-react";

const PUB_ID = "ca-pub-3178300656334660";
const SLOTS = { banner: "1850730729", interstitial: "1467587348", rewarded: "1798759833" };

 

const LANGUAGES: Record<string, any> = {
  en: { name: "English", flag: "🇬🇧", dir: "ltr", ui: {
    appName: "StoryBuddy", tagline: "AI Magic Stories for Every Child",
    childName: "Child's name", childAge: "Age", storyType: "Story type", storyLang: "Story language",
    generate: "🎬 Watch Ad & Generate Story", generating: "Weaving magic...",
    newStory: "✨ New Story", adLabel: "ADVERTISEMENT", adSkip: "Skip in", adSkipNow: "Skip ✕",
    watchAd: "A short ad supports this free app", freeInfo: "100% Free — supported by ads",
    saved: "💾 Saved!", save: "💾 Save Story", saved_stories: "My Stories",
    noSaved: "No saved stories yet", listen: "🔊 Listen", stop: "⏹ Stop",
    share: "📤 Share", copied: "✅ Copied!", copy: "📋 Copy",
    types: { adventure:"Adventure", educational:"Educational", custom:"Personalized", fantasy:"Fantasy", bedtime:"Bedtime", funny:"Funny" },
    ages: { "2-4":"2–4 yrs", "5-7":"5–7 yrs", "8-10":"8–10 yrs", "11-13":"11–13 yrs" },
    moods: { happy:"😊 Happy", calm:"😌 Calm", exciting:"🤩 Exciting", mysterious:"🌙 Mysterious" },
    lengths: { short:"📖 Short (2 min)", long:"📚 Long (5 min)" },
    storyLength: "Story length",
    mood: "Story mood", placeholder: "e.g. Emma", close: "✕ Close",
    stats: "stories generated", shareText: "Share via",
    characters: "Add characters (optional)", charsPlaceholder: "e.g. a dragon, a robot...",
    rating: "Rate this story", ratingDone: "Thanks for rating! ⭐",
  }},
  fr: { name: "Français", flag: "🇫🇷", dir: "ltr", ui: {
    appName: "StoryBuddy", tagline: "Histoires magiques IA pour chaque enfant",
    childName: "Prénom", childAge: "Âge", storyType: "Type", storyLang: "Langue",
    generate: "🎬 Voir pub & générer", generating: "Magie en cours...",
    newStory: "✨ Nouvelle histoire", adLabel: "PUBLICITÉ", adSkip: "Passer dans", adSkipNow: "Passer ✕",
    watchAd: "Une courte pub soutient cette app gratuite", freeInfo: "100% gratuit — soutenu par la pub",
    saved: "💾 Sauvegardé!", save: "💾 Sauvegarder", saved_stories: "Mes histoires",
    noSaved: "Aucune histoire sauvegardée", listen: "🔊 Écouter", stop: "⏹ Arrêter",
    share: "📤 Partager", copied: "✅ Copié!", copy: "📋 Copier",
    types: { adventure:"Aventure", educational:"Éducatif", custom:"Personnalisé", fantasy:"Fantaisie", bedtime:"Bonne nuit", funny:"Drôle" },
    ages: { "2-4":"2–4 ans", "5-7":"5–7 ans", "8-10":"8–10 ans", "11-13":"11–13 ans" },
    moods: { happy:"😊 Joyeux", calm:"😌 Calme", exciting:"🤩 Excitant", mysterious:"🌙 Mystérieux" },
    lengths: { short:"📖 Courte (2 min)", long:"📚 Longue (5 min)" },
    storyLength: "Longueur",
    mood: "Ambiance", placeholder: "ex. Emma", close: "✕ Fermer",
    stats: "histoires générées", shareText: "Partager via",
    characters: "Personnages (optionnel)", charsPlaceholder: "ex. un dragon, un robot...",
    rating: "Notez cette histoire", ratingDone: "Merci! ⭐",
  }},
  ar: { name: "العربية", flag: "🇸🇦", dir: "rtl", ui: {
    appName: "StoryBuddy", tagline: "قصص سحرية بالذكاء الاصطناعي لكل طفل",
    childName: "اسم الطفل", childAge: "العمر", storyType: "النوع", storyLang: "اللغة",
    generate: "🎬 شاهد إعلاناً واحصل على قصة", generating: "جارٍ الإبداع...",
    newStory: "✨ قصة جديدة", adLabel: "إعلان", adSkip: "تخطي بعد", adSkipNow: "تخطي ✕",
    watchAd: "إعلان قصير يدعم هذا التطبيق المجاني", freeInfo: "مجاني 100% — مدعوم بالإعلانات",
    saved: "💾 تم الحفظ!", save: "💾 حفظ القصة", saved_stories: "قصصي المحفوظة",
    noSaved: "لا توجد قصص محفوظة بعد", listen: "🔊 استمع", stop: "⏹ إيقاف",
    share: "📤 مشاركة", copied: "✅ تم النسخ!", copy: "📋 نسخ",
    types: { adventure:"مغامرة", educational:"تعليمية", custom:"مخصصة", fantasy:"خيال", bedtime:"وقت النوم", funny:"مضحكة" },
    ages: { "2-4":"2–4 سنوات", "5-7":"5–7 سنوات", "8-10":"8–10 سنوات", "11-13":"11–13 سنة" },
    moods: { happy:"😊 سعيدة", calm:"😌 هادئة", exciting:"🤩 مثيرة", mysterious:"🌙 غامضة" },
    lengths: { short:"📖 قصيرة (دقيقتان)", long:"📚 طويلة (5 دقائق)" },
    storyLength: "طول القصة",
    mood: "مزاج القصة", placeholder: "مثال: سارة", close: "✕ إغلاق",
    stats: "قصة تم إنشاؤها", shareText: "مشاركة عبر",
    characters: "شخصيات إضافية (اختياري)", charsPlaceholder: "مثال: تنين، روبوت...",
    rating: "قيّم هذه القصة", ratingDone: "شكراً على تقييمك! ⭐",
  }}
};

const EMOJIS: Record<string, string> = { adventure:"🏔️", educational:"🔬", custom:"⭐", fantasy:"🧚", bedtime:"🌙", funny:"😂" };
const ADS = [
  { brand:"KidLearn", color:"#f59e0b", bg:"#fffbeb", emoji:"🎓", text:"Make learning fun!", cta:"Try Free" },
  { brand:"DreamToys", color:"#ec4899", bg:"#fdf2f8", emoji:"🧸", text:"Toys that spark imagination", cta:"Shop Now" },
  { brand:"NutriKids", color:"#10b981", bg:"#f0fdf4", emoji:"🥦", text:"Healthy snacks kids love", cta:"Learn More" },
];

function AdModal({ t, onFinished }: { t: any; onFinished: () => void }) {
  const [sec, setSec] = useState(5);
  const [skip, setSkip] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch {}
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setSec(s => { if(s<=1){clearInterval(iv);setSkip(true);return 0;} return s-1; }), 1000);
    return () => clearInterval(iv);
  }, []);

  if (done) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"linear-gradient(135deg,#2d1b69,#1a0533)",borderRadius:24,padding:32,maxWidth:320,width:"90%",textAlign:"center",border:"1px solid rgba(167,139,250,0.4)"}}>
        <div style={{fontSize:48,marginBottom:12}}>🎉</div>
        <p style={{color:"#86efac",fontSize:16,fontWeight:700}}>Story ready! Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,maxWidth:360,width:"100%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
        <div style={{background:"#302b63",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:700,letterSpacing:1}}>{t.adLabel}</span>
          {skip
            ? <button onClick={()=>{setDone(true);setTimeout(onFinished,600);}} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>{t.adSkipNow}</button>
            : <span style={{color:"rgba(255,255,255,0.8)",fontSize:12,fontWeight:600}}>{t.adSkip} {sec}s</span>}
        </div>
        <div style={{padding:"16px",minHeight:200,display:"flex",alignItems:"center",justifyContent:"center",background:"#f9f9f9"}}>
          <ins className="adsbygoogle"
            style={{display:"block",width:"100%",minHeight:200}}
            data-ad-client={PUB_ID}
            data-ad-slot={SLOTS.interstitial}
            data-ad-format="auto"
            data-full-width-responsive="true"/>
        </div>
        <div style={{height:4,background:"#e5e7eb"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#c44dff,#4d79ff)",width:skip?"100%":`${((5-sec)/5)*100}%`,transition:"width 1s linear"}}/>
        </div>
      </div>
    </div>
  );
}

function StarRating({ t, onRate }: { t: any; onRate: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  const [rated, setRated] = useState(0);
  return rated > 0
    ? <div style={{textAlign:"center",color:"#fbbf24",fontSize:13,padding:"8px 0"}}>{t.ratingDone}</div>
    : <div style={{textAlign:"center",padding:"8px 0"}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:6}}>{t.rating}</div>
        <div style={{display:"flex",justifyContent:"center",gap:4}}>
          {[1,2,3,4,5].map(s => (
            <span key={s} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
              onClick={()=>{setRated(s);onRate(s);}}
              style={{fontSize:24,cursor:"pointer",color:s<=(hover||rated)?"#fbbf24":"rgba(255,255,255,0.2)",transition:"color 0.15s"}}>★</span>
          ))}
        </div>
      </div>;
}

export default function StoryBuddy() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const [name, setName] = useState("");
  const [age, setAge] = useState("5-7");
  const [type, setType] = useState("adventure");
  const [mood, setMood] = useState("happy");
  const [storyLang, setStoryLang] = useState("en");
  const [chars, setChars] = useState("");
  const [storyLength, setStoryLength] = useState<"short" | "long">("short");
  const [story, setStory] = useState<string | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [saved, setSaved] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showShare, setShowShare] = useState(false);
const [imgUrl, setImgUrl] = useState<string | null>(null);
  const t = LANGUAGES[lang].ui;
  const dir = LANGUAGES[lang].dir as "ltr" | "rtl";
  
  const generateStoryMutation = useGenerateStory();

  const handleGenerate = () => { if(!name.trim()) return; setShowAd(true); };
  const onAdDone = () => { setShowAd(false); generateStory(); };

  const buildImagePrompt = () => {
      const typeDesc: Record<string, string> = {
        adventure: "an exciting adventure scene",
        educational: "a curious educational scene",
        custom: "a magical personalized scene",
        fantasy: "a fantasy scene with magical creatures",
        bedtime: "a cozy bedtime scene",
        funny: "a funny playful scene",
      };
      const moodDesc: Record<string, string> = {
        happy: "cheerful and bright",
        calm: "calm and peaceful",
        exciting: "exciting and dynamic",
        mysterious: "mysterious and magical",
      };
      const charsPart = chars ? `featuring ${chars}` : "";
      return `Children's book illustration, ${typeDesc[type] || "a magical scene"}, ${moodDesc[mood] || ""} ${charsPart}, colorful, whimsical, digital art, no text`;
    };

    const generateStory = () => {
      setStory(null);
      setIsSaved(false);
      setImgUrl(null);

      generateStoryMutation.mutate({
        data: {
          childName: name,
          age: age,
          storyType: type,
          mood: mood,
          language: storyLang,
          characters: chars || undefined,
          length: storyLength,
        }
      }, {
        onSuccess: (data) => {
          setStory(data.story);
          setTotalCount(p => p + 1);
          const prompt = buildImagePrompt();
        const seed = Math.floor(Math.random() * 1000000);
          setImgUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&model=flux&seed=${seed}`);
        }
      });
    };

  const handleSave = () => {
    if (!story || isSaved) return;
    setSaved(p => [{ id: Date.now(), name, type, lang: storyLang, text: story, date: new Date().toLocaleDateString() }, ...p]);
    setIsSaved(true);
  };

  const handleSpeak = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(story || "");
    u.lang = storyLang === "ar" ? "ar-SA" : storyLang === "fr" ? "fr-FR" : "en-US";
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(story || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent("📖 " + story)}`);
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("✨ AI story from StoryBuddy: " + story?.slice(0,200) + "...")}`);

  const isLoading = generateStoryMutation.isPending;
  const error = generateStoryMutation.error ? "Something went wrong. Please try again." : null;

  return (
    <div dir={dir} style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",fontFamily:"var(--app-font-sans)",color:"#fff",position:"relative",overflow:"hidden", paddingBottom: "40px"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        {[...Array(30)].map((_,i)=>(
          <div key={i} style={{position:"absolute",width:i%4===0?"3px":"2px",height:i%4===0?"3px":"2px",background:"#fff",borderRadius:"50%",top:`${(i*31+7)%100}%`,left:`${(i*47+13)%100}%`,opacity:(i%5+2)/8}}/>
        ))}
      </div>

      {showAd && <AdModal t={t} onFinished={onAdDone}/>}

      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 14px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:6}}>
            {Object.entries(LANGUAGES).map(([c,l])=>(
              <button key={c} className={`lbtn ${lang===c?"on":""}`} onClick={()=>setLang(c)}>{l.flag}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className={`tab ${tab==="home"?"on":"off"}`} onClick={()=>setTab("home")}>📖 Home</button>
            <button className={`tab ${tab==="saved"?"on":"off"}`} onClick={()=>setTab("saved")}>
              💾 {t.saved_stories} {saved.length>0&&<span style={{background:"#7c3aed",borderRadius:10,padding:"0 6px",fontSize:11,marginLeft:4}}>{saved.length}</span>}
            </button>
          </div>
        </div>

        {tab==="home" && <>
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{fontSize:52,animation:"float 3s ease-in-out infinite",marginBottom:6}}>📖</div>
            <h1 style={{fontSize:28,fontWeight:900,margin:0,background:"linear-gradient(90deg,#c4b5fd,#818cf8,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.appName}</h1>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,marginTop:5}}>{t.tagline}</p>
            <div style={{marginTop:8,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(134,239,172,0.1)",border:"1px solid rgba(134,239,172,0.25)",borderRadius:20,padding:"4px 12px"}}>
              <span style={{fontSize:12,color:"#86efac"}}>🎉 {t.freeInfo}</span>
            </div>
            {totalCount>0&&<div style={{marginTop:6,fontSize:11,color:"rgba(255,255,255,0.3)"}}>📚 {totalCount} {t.stats}</div>}
          </div>


          <div className="glass-card">
            <div style={{marginBottom:12}}>
              <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.childName}</label>
              <input className="inp" placeholder={t.placeholder} value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.childAge}</label>
                <select className="inp" value={age} onChange={e=>setAge(e.target.value)}>
                  {Object.entries(t.ages).map(([k,v])=><option key={k} value={k}>{v as string}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.storyType}</label>
                <select className="inp" value={type} onChange={e=>setType(e.target.value)}>
                  {Object.entries(t.types).map(([k,v])=><option key={k} value={k}>{EMOJIS[k]} {v as string}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.mood}</label>
                <select className="inp" value={mood} onChange={e=>setMood(e.target.value)}>
                  {Object.entries(t.moods).map(([k,v])=><option key={k} value={k}>{v as string}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.storyLang}</label>
                <select className="inp" value={storyLang} onChange={e=>setStoryLang(e.target.value)}>
                  {Object.entries(LANGUAGES).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.storyLength}</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {(["short","long"] as const).map(l => (
                  <button key={l} onClick={()=>setStoryLength(l)} type="button"
                    style={{padding:"10px 8px",borderRadius:10,border:`2px solid ${storyLength===l?"#7c3aed":"rgba(255,255,255,0.12)"}`,
                      background:storyLength===l?"rgba(124,58,237,0.2)":"rgba(255,255,255,0.04)",
                      color:storyLength===l?"#c4b5fd":"rgba(255,255,255,0.55)",
                      cursor:"pointer",fontSize:12,fontWeight:storyLength===l?700:400,transition:"all 0.2s"}}>
                    {(t.lengths as any)[l]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5}}>{t.characters}</label>
              <input className="inp" placeholder={t.charsPlaceholder} value={chars} onChange={e=>setChars(e.target.value)}/>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"7px 11px",marginBottom:12,display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:14}}>🎬</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{t.watchAd}</span>
            </div>
            <button className="gbtn" onClick={handleGenerate} disabled={isLoading||!name.trim()}>
              {isLoading
                ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{width:15,height:15,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>
                    {t.generating}
                  </span>
                : t.generate}
            </button>
          </div>

          {error && <div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,padding:12,marginBottom:12,color:"#fca5a5",fontSize:13,textAlign:"center"}}>{error}</div>}

          {story && (
            <div style={{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",borderRadius:20,padding:22,border:"1px solid rgba(167,139,250,0.3)",animation:"fadeIn 0.4s ease",marginBottom:14}}>
             {imgUrl && (
                <img src={imgUrl} alt="Story illustration"
                  style={{width:"100%",borderRadius:14,marginBottom:16,display:"block"}}
                  onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}}/>
              )}
              <div style={{whiteSpace:"pre-wrap",lineHeight:1.85,fontSize:14,color:"rgba(255,255,255,0.88)"}}>{story}</div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:16,paddingTop:14}}>
                <StarRating t={t} onRate={r=>console.log("rated",r)}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
                <button className="ibtn" onClick={handleSpeak}>{speaking ? t.stop : t.listen}</button>
                <button className="ibtn" onClick={handleCopy}>{copied ? t.copied : t.copy}</button>
                <button className="ibtn" onClick={handleSave} style={isSaved?{color:"#86efac",borderColor:"#86efac"}:{}}>{isSaved ? t.saved : t.save}</button>
                <button className="ibtn" onClick={()=>setShowShare(s=>!s)}>{t.share}</button>
              </div>
              {showShare && (
                <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap",animation:"fadeIn 0.2s ease"}}>
                  <button onClick={shareWhatsApp} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#25d366",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>💬 WhatsApp</button>
                  <button onClick={shareTwitter} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#1da1f2",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>🐦 Twitter</button>
                </div>
              )}
              <div style={{marginTop:16,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"9px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:1,marginBottom:2}}>{t.adLabel}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>🧸 <strong>DreamToys</strong> — Toys that spark imagination</div>
                </div>
                <button style={{background:"#ec4899",border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:700}}>Shop</button>
              </div>
              <button onClick={()=>{setStory(null);setName("");setChars("");setSpeaking(false);window.speechSynthesis?.cancel();}}
                style={{marginTop:14,width:"100%",padding:"11px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,color:"#c4b5fd",cursor:"pointer",fontSize:13,fontWeight:600}}>
                {t.newStory}
              </button>
            </div>
          )}
        </>}

        {tab==="saved" && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,textAlign:"center"}}>💾 {t.saved_stories}</h2>
            {saved.length===0
              ? <div style={{textAlign:"center",color:"rgba(255,255,255,0.35)",fontSize:14,padding:"40px 0"}}>
                  <div style={{fontSize:40,marginBottom:10}}>📭</div>
                  {t.noSaved}
                </div>
              : saved.map(s=>(
                <div key={s.id} className="glass-card" style={{animation:"fadeIn 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:15}}>{EMOJIS[s.type]} {s.name}'s story</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2}}>{s.date} · {LANGUAGES[s.lang]?.flag}</div>
                    </div>
                    <button onClick={()=>setSaved(p=>p.filter(x=>x.id!==s.id))} style={{background:"rgba(239,68,68,0.15)",border:"none",color:"#fca5a5",borderRadius:8,padding:"4px 9px",cursor:"pointer",fontSize:12}}>{t.close}</button>
                  </div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:12,lineHeight:1.6}}>{s.text.slice(0,100)}...</div>
                  <button onClick={()=>{setStory(s.text);setTab("home");}} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer"}}>📖 Read full</button>
                </div>
              ))
            }
          </div>
        )}

        <div style={{textAlign:"center",marginTop:24,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:16,justifyContent:"center"}}>
          <a href="https://sites.google.com/view/storybuddyprivacypolicy/accueil"
            target="_blank" rel="noopener noreferrer"
            style={{color:"rgba(255,255,255,0.35)",fontSize:11,textDecoration:"none"}}>
            🔒 Privacy Policy
          </a>
          <a href="https://sites.google.com/view/storybuddyprivacypolicy/terms-of-service"
            target="_blank" rel="noopener noreferrer"
            style={{color:"rgba(255,255,255,0.35)",fontSize:11,textDecoration:"none"}}>
            📜 Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
         }
