(function(root){
const DIAC=/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
const SIMPLE={
'يستطيع':'يقدر','استطاع':'قدر','يرغب':'يريد','رغب':'أراد','بالإضافة إلى':'وكمان','علاوة على':'وكمان','نظرا لأن':'لأن','نظراً لأن':'لأن','بيد أن':'لكن','غير أن':'لكن','حيث إن':'لأن','يتوجب':'لازم','يتوجّب':'لازم','يتعين':'لازم','ينبغي':'لازم','لدى':'عند','بغية':'علشان','كي':'علشان','إلا أن':'لكن','مما يؤدي إلى':'وده يخلي','يقوم بـ':'','قام بـ':'','اضطر':'اتحتم','استخدم':'استعمل','يتمكن':'يقدر','يتسنى':'يقدر','آنفا':'قبل كده','آنفاً':'قبل كده','سوف':'هـ','أيضا':'كمان','أيضاً':'كمان','الآن':'دلوقتي','حاليا':'دلوقتي','حالياً':'دلوقتي','هذا':'ده','هذه':'دي','كثيرا':'أوي','كثيراً':'أوي','جدا':'أوي','جداً':'أوي','يجب':'لازم','لكي':'علشان'
};
function norm(s){return s.replace(DIAC,'')}
function sentences(t){return t.split(/(?<=[.!?\u061F\u061B\n])\s*/).map(s=>s.trim()).filter(s=>/[\u0600-\u06FFA-Za-z]/.test(s))}
function words(s){return (norm(s).match(/[\u0621-\u064AA-Za-z]+/g)||[])}
function analyze(text){
  const ss=sentences(text);
  const allW=words(text);
  if(!allW.length)return null;
  const sw=ss.map(s=>({s,n:words(s).length}));
  const avgSent=allW.length/Math.max(1,ss.length);
  const wSent=sw.reduce((a,x)=>a+x.n*x.n,0)/Math.max(1,sw.reduce((a,x)=>a+x.n,0));
  const letters=allW.reduce((a,w)=>a+w.length,0);
  const avgWord=letters/allW.length;
  const long=allW.filter(w=>w.length>=7);
  const longRatio=long.length/allW.length;
  // penalties: sentence length above 12 words, word length above 4.2, long word ratio
  let p=0;
  p+=Math.max(0,Math.min(50,(wSent-10)*1.8));
  p+=Math.max(0,Math.min(30,(avgWord-4.5)*12));
  p+=Math.max(0,Math.min(25,(longRatio-0.12)*110));
  const score=Math.round(Math.max(0,Math.min(100,100-p)));
  let level,lc;
  if(score>=80){level=['سهل جدا','Very easy'];lc='#1f9d6b'}
  else if(score>=65){level=['سهل','Easy'];lc='#4aa84a'}
  else if(score>=50){level=['متوسط','Medium'];lc='#d9a400'}
  else if(score>=35){level=['صعب','Hard'];lc='#e07a1f'}
  else{level=['صعب جدا','Very hard'];lc='#d6403a'}
  const hits=[];
  const nt=norm(text);
  const done=new Set();
  Object.keys(SIMPLE).forEach(k=>{
    const kk=norm(k);if(done.has(kk))return;done.add(kk);
    const re=new RegExp('(^|[^\\u0621-\\u064A])'+kk.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\u0621-\\u064A])','g');
    let m,c=0;while((m=re.exec(nt))&&c<50)c++;
    if(c)hits.push({from:k,to:SIMPLE[k],count:c});
  });
  const longSent=sw.filter(x=>x.n>25).map(x=>x.s);
  const readMin=allW.length/180;
  return{score,level,lc,sentences:ss.length,words:allW.length,avgSent:+avgSent.toFixed(1),avgWord:+avgWord.toFixed(1),longWords:long.length,longRatio:+(longRatio*100).toFixed(0),hits,longSent,sw,readMin};
}
const api={analyze,norm,words,sentences};
if(typeof module!=='undefined')module.exports=api;else root.Wudooh=api;
})(this);
