// Multi-category Pro Quiz (no external libs)
// Data (each question has difficulty: easy|medium|hard)
const DB = {
  html: [
    {q:'What does HTML stand for?', opts:['HyperText Markup Language','HighText Machine Language','Hyperlink Text Management','Hyper Tool Met Language'], a:'HyperText Markup Language', d:'easy'},
    {q:'Which tag creates a link?', opts:['<a>','<link>','<href>','<nav>'], a:'<a>', d:'easy'},
    {q:'Which attribute is used to provide alternate text for an image?', opts:['alt','title','src','caption'], a:'alt', d:'medium'},
    {q:'Which element is used to group inline-elements?', opts:['<span>','<div>','<section>','<group>'], a:'<span>', d:'medium'},
    {q:'The <!DOCTYPE html> declaration is used to specify what?', opts:['HTML version','CSS rules','Browser engine','Charset'], a:'HTML version', d:'hard'},
    {q:'Which tag is used for the largest heading?', opts:['<h1>','<h6>','<header>','<head>'], a:'<h1>', d:'easy'},
    {q:'Which tag is used for inserting an image?', opts:['<img>','<picture>','<src>','<image>'], a:'<img>', d:'easy'},
    {q:'What is the correct HTML element for inserting a line break?', opts:['<br>','<lb>','<break>','<hr>'], a:'<br>', d:'medium'},
    {q:'Which tag is used for defining a table row?', opts:['<tr>','<td>','<table>','<row>'], a:'<tr>', d:'medium'},
    {q:'Which tag defines the footer of a document or section?', opts:['<footer>','<bottom>','<section>','<div>'], a:'<footer>', d:'hard'}
  ],
  css: [
    {q:'Which property changes text color?', opts:['color','font-color','text-color','fg'], a:'color', d:'easy'},
    {q:'How do you select an element with id "main"?', opts:['#main','.main','main','*main'], a:'#main', d:'easy'},
    {q:'What does "flex" in display:flex do?', opts:['Create flexible box layout','Add flexible font','Make element float','None'], a:'Create flexible box layout', d:'medium'},
    {q:'Which unit is relative to the root font-size?', opts:['rem','em','px','vh'], a:'rem', d:'medium'},
    {q:'What is the purpose of z-index?', opts:['Stacking order','Font size','Visibility toggle','Margin collapse'], a:'Stacking order', d:'hard'},
    {q:'Which property controls the space between lines of text?', opts:['line-height','letter-spacing','word-spacing','text-indent'], a:'line-height', d:'medium'},
    {q:'Which pseudo-class applies when a user hovers over an element?', opts:[':hover',':active',':focus',':visited'], a:':hover', d:'easy'},
    {q:'What does "position: absolute" do?', opts:['Positions relative to nearest positioned ancestor','Positions relative to viewport','Fixed position','Static position'], a:'Positions relative to nearest positioned ancestor', d:'hard'},
    {q:'Which property sets the background image?', opts:['background-image','bg-image','image','bg'], a:'background-image', d:'medium'},
    {q:'Which property makes text bold?', opts:['font-weight','text-weight','font-style','font-bold'], a:'font-weight', d:'easy'}
  ],
  js: [
    {q:'Which keyword declares a block-scoped variable?', opts:['let','var','const','bind'], a:'let', d:'easy'},
    {q:'Which method converts JSON string to object?', opts:['JSON.parse','JSON.stringify','parse','toObject'], a:'JSON.parse', d:'easy'},
    {q:'Which array method returns a new array?', opts:['map','push','pop','shift'], a:'map', d:'medium'},
    {q:'What is a closure?', opts:['Function with preserved scope','Loop construct','Object prototype','Async request'], a:'Function with preserved scope', d:'medium'},
    {q:'Which statement stops the loop entirely?', opts:['break','continue','stop','return'], a:'break', d:'hard'},
    {q:'Which operator is used for strict equality?', opts:['===','==','!=','!=='], a:'===', d:'medium'},
    {q:'What does "typeof null" return?', opts:['object','null','undefined','number'], a:'object', d:'hard'},
    {q:'Which method adds an element to the end of an array?', opts:['push','pop','shift','unshift'], a:'push', d:'easy'},
    {q:'Which method removes the last element from an array?', opts:['pop','push','shift','unshift'], a:'pop', d:'easy'},
    {q:'Which function is called after a promise is resolved?', opts:['then','catch','finally','resolve'], a:'then', d:'medium'}
  ]
};

// --- Rest of your quiz logic remains the same ---
let state = {
  cat: null,
  difficulty: 'medium',
  questions: [],
  index: 0,
  score: 0,
  timePerQ: 15,
  timerId: null,
  timeLeft: 0,
  bestKey: ''
};

const screens = {
  category: document.getElementById('category-screen'),
  start: document.getElementById('start-screen'),
  quiz: document.getElementById('quiz-screen'),
  result: document.getElementById('result-screen')
};
const bestScoresEl = document.getElementById('best-scores');
const catBtns = document.querySelectorAll('.cat-btn');
const startBtn = document.getElementById('start-btn');
const backToCats = document.getElementById('back-to-cats');
const catTitle = document.getElementById('cat-title');
const catDesc = document.getElementById('cat-desc');
const difficultySelect = document.getElementById('difficulty');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const progressEl = document.getElementById('progress');
const timerEl = document.getElementById('timer');
const nextBtn = document.getElementById('next-btn');
const resultSummary = document.getElementById('result-summary');
const resultDetails = document.getElementById('result-details');
const retryBtn = document.getElementById('retry-btn');
const homeBtn = document.getElementById('home-btn');

// Helpers
function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}
function plural(n){ return n>1? 's':'' }
function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5); }

function refreshBestScores(){
  const cats = Object.keys(DB);
  bestScoresEl.innerHTML = '<strong>Best scores:</strong><br>';
  cats.forEach(c=>{
    const key = `best_${c}`;
    const v = localStorage.getItem(key);
    bestScoresEl.innerHTML += `<div>${c.toUpperCase()}: ${v? v + '%' : '—'}</div>`;
  });
}
refreshBestScores();

// Category selection
catBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const cat = btn.dataset.cat;
    state.cat = cat;
    catTitle.textContent = cat.toUpperCase() + ' Quiz';
    catDesc.textContent = `Questions about ${cat.toUpperCase()} — difficulty: choose below.`;
    showScreen('start');
  });
});
backToCats.addEventListener('click', ()=>{ showScreen('category'); });

startBtn.addEventListener('click', ()=>{
  state.difficulty = difficultySelect.value;
  prepareQuestions();
  state.index = 0;
  state.score = 0;
  state.timePerQ = 15;
  state.bestKey = `best_${state.cat}`;
  showScreen('quiz');
  renderQuestion();
});

function prepareQuestions(){
  const pool = DB[state.cat] || [];
  const order = {easy:0, medium:1, hard:2};
  const thresh = order[state.difficulty];
  const filtered = pool.filter(q=> order[q.d] <= thresh );
  state.questions = shuffle(filtered);
  if(state.questions.length > 5) state.questions = state.questions.slice(0,5);
}

function renderQuestion(){
  clearTimer();
  const qObj = state.questions[state.index];
  questionEl.textContent = qObj.q;
  optionsEl.innerHTML = '';
  const shuffled = shuffle(qObj.opts);
  shuffled.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = ()=> handleAnswer(btn, qObj.a);
    optionsEl.appendChild(btn);
  });
  progressEl.textContent = `Question ${state.index+1}/${state.questions.length}`;
  state.timeLeft = state.timePerQ;
  updateTimerVisual();
  state.timerId = setInterval(tickTimer,1000);
  nextBtn.classList.add('hidden');
}

function tickTimer(){
  state.timeLeft--;
  updateTimerVisual();
  if(state.timeLeft <= 0){
    clearTimer();
    lockOptions();
    nextBtn.classList.remove('hidden');
  }
}

function updateTimerVisual(){
  timerEl.textContent = state.timeLeft + 's';
  const pct = state.timeLeft / state.timePerQ;
  timerEl.classList.remove('timer-good','timer-warn','timer-bad');
  if(pct > 0.6) timerEl.classList.add('timer-good');
  else if(pct > 0.3) timerEl.classList.add('timer-warn');
  else timerEl.classList.add('timer-bad');
}

function handleAnswer(btn, correct){
  clearTimer();
  const opts = document.querySelectorAll('.option');
  opts.forEach(o=> o.classList.add('disabled'), o=> o.disabled=true);
  opts.forEach(o=>{
    if(o.textContent === correct) o.classList.add('correct');
    if(o === btn && o.textContent !== correct) o.classList.add('wrong');
    o.disabled = true;
  });
  if(btn.textContent === correct) state.score++;
  nextBtn.classList.remove('hidden');
}

function lockOptions(){
  const opts = document.querySelectorAll('.option');
  opts.forEach(o=>{ o.disabled=true; o.classList.add('disabled'); });
}

function clearTimer(){ if(state.timerId) clearInterval(state.timerId); state.timerId = null; }

nextBtn.addEventListener('click', ()=>{
  state.index++;
  if(state.index < state.questions.length){
    renderQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz(){
  clearTimer();
  showScreen('result');
  const total = state.questions.length;
  const pct = Math.round((state.score/total)*100);
  const label = rankLabel(pct);
  resultSummary.innerHTML = `<strong>${state.cat.toUpperCase()}</strong> — ${state.score}/${total} correct (${pct}%) — <span class="result-label">${label}</span>`;
  let html = '<ul>';
  state.questions.forEach((q,i)=>{
    html += `<li><strong>Q:</strong> ${q.q} <br><strong>A:</strong> ${q.a}</li>`;
  });
  html += '</ul>';
  resultDetails.innerHTML = html;
  const prev = parseInt(localStorage.getItem(state.bestKey) || '0',10);
  if(pct > prev) localStorage.setItem(state.bestKey, pct);
  refreshBestScores();
}

function rankLabel(pct){
  if(pct >= 80) return 'Excellent';
  if(pct >= 60) return 'Good';
  if(pct >= 40) return 'Fair';
  return 'Try Again';
}

retryBtn.addEventListener('click', ()=>{
  state.index = 0; state.score = 0;
  showScreen('quiz'); renderQuestion();
});
homeBtn.addEventListener('click', ()=>{ showScreen('category'); });

document.addEventListener('keydown', (e)=>{
  if(e.code === 'Space' && !nextBtn.classList.contains('hidden')){
    e.preventDefault();
    nextBtn.click();
  }
});


