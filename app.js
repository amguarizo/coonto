
const scenes = {
  opening: {
    eyebrow: "ATO III · A REVOLTA",
    title: "A cidade contra a Casa Verde",
    image: "assets/images/revolta-casa-verde.jpg",
    body: [
      "A Casa Verde já não é apenas um edifício em Itaguaí. Ela se tornou uma presença na vida de toda a cidade. A cada nova internação, cresce a sensação de que ninguém está completamente seguro dos critérios de Simão Bacamarte.",
      "A indignação deixa de circular apenas em conversas e passa às ruas. O barbeiro Porfírio, conhecido como Canjica, assume a liderança de um movimento contra o poder do alienista. Em pouco tempo, centenas de pessoas marcham em direção à Casa Verde.",
      "Bacamarte sabe que a multidão não está vindo para discutir medicina. Está vindo para interromper aquilo que ele considera uma investigação científica."
    ]
  },
  tension: {
    eyebrow: "ANTES DA DECISÃO",
    title: "A multidão está diante dele",
    image: "assets/images/casa-verde.jpg",
    body: [
      "O movimento cresce do lado de fora. Há gritos, acusações e uma exigência clara: a Casa Verde precisa acabar.",
      "Para a população, Bacamarte ultrapassou o limite entre ciência e poder. Para Bacamarte, porém, abandonar o experimento significaria ceder uma questão científica à pressão das ruas.",
      "Agora a decisão não é apenas sobre os internados. É sobre quem tem autoridade para definir o que é razão, o que é loucura e até onde a ciência pode interferir na vida de uma cidade."
    ]
  }
};

const state = {
  screen: "home",
  choice: null,
  audioEnabled: true
};

const app = document.getElementById("app");

function iconPlay() {
  return `<button class="audio-icon" aria-label="Ouvir trecho" title="Ouvir trecho" onclick="toggleSpeech()">▶</button>`;
}

function stopSpeech() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const btn = document.querySelector(".audio-icon");
  if (btn) btn.textContent = "▶";
}

window.toggleSpeech = function() {
  if (!("speechSynthesis" in window)) return;
  const btn = document.querySelector(".audio-icon");
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    if (btn) btn.textContent = "▶";
    return;
  }
  const text = [...document.querySelectorAll("[data-narration]")].map(x => x.innerText).join(" ");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  u.rate = 0.9;
  u.pitch = 0.95;
  u.onstart = () => { if (btn) btn.textContent = "Ⅱ"; };
  u.onend = () => { if (btn) btn.textContent = "▶"; };
  speechSynthesis.speak(u);
};

function shell(content, progress = 0) {
  app.innerHTML = `
    <main class="phone">
      <header class="topbar">
        <div class="brand">coonto</div>
        <div class="work">O Alienista</div>
        <div class="progress">${progress}%</div>
      </header>
      ${content}
    </main>`;
}

function hero(image, overlay="") {
  return `<div class="hero" style="background-image:url('${image}')">${overlay}</div>`;
}

function home() {
  shell(`
    ${hero("assets/images/entrada-itaguai.jpg",
      `<div class="hero-shade"></div><div class="hero-title"><div class="smallcaps">MACHADO DE ASSIS</div><h1>O Alienista</h1></div>`)}
    <section class="content home-content">
      <p class="lead">Você teria feito as mesmas escolhas que Machado?</p>
      <p class="copy">Entre em Itaguaí. Tome decisões pelos personagens, veja as consequências e tente encontrar o caminho que o autor escreveu.</p>
      <button class="primary" onclick="go('opening')">COMEÇAR <span>→</span></button>
      <div class="meta">≈ 8 min neste Alpha · 1 decisão completa · múltiplos caminhos</div>
    </section>
  `, 0);
}

function scene(name, progress, next) {
  const s = scenes[name];
  shell(`
    ${hero(s.image)}
    <section class="content narrative">
      <div class="section-head">
        <div><div class="eyebrow">${s.eyebrow}</div><h2>${s.title}</h2></div>
        ${iconPlay()}
      </div>
      <div data-narration class="body-copy">
        ${s.body.map(p=>`<p>${p}</p>`).join("")}
      </div>
      <button class="primary" onclick="go('${next}')">Continuar <span>→</span></button>
    </section>
  `, progress);
}

function decision() {
  shell(`
    ${hero("assets/images/bacamarte-estudo.jpg")}
    <section class="content narrative">
      <div class="section-head">
        <div><div class="eyebrow">SUA DECISÃO</div><h2>O que Bacamarte deve fazer?</h2></div>
        ${iconPlay()}
      </div>
      <div data-narration class="body-copy">
        <p>A multidão está diante da Casa Verde e exige que as internações terminem. O poder de Bacamarte é desafiado publicamente pela primeira vez.</p>
        <p>Você está no lugar dele. Escolha o que fazer agora — sem saber ainda qual foi a decisão escrita por Machado.</p>
      </div>
      <div class="choices">
        <button onclick="choose('retreat')"><b>Recuar</b><span>Suspender as internações para evitar confronto.</span></button>
        <button onclick="choose('negotiate')"><b>Negociar</b><span>Conversar com Porfírio e aceitar limites para a Casa Verde.</span></button>
        <button onclick="choose('confront')" class="choice-accent"><b>Enfrentar a multidão</b><span>Defender o experimento e não abandonar sua posição.</span></button>
      </div>
    </section>
  `, 42);
}

window.choose = function(c) {
  stopSpeech();
  state.choice = c;
  state.screen = "consequence";
  render();
};

function consequence() {
  const data = {
    retreat: {
      label: "◇ VOCÊ CRIOU OUTRA REALIDADE",
      title: "A ciência recua diante da cidade",
      text: "Bacamarte suspende as internações. A multidão comemora, e Porfírio emerge como o homem que conseguiu impor um limite à Casa Verde. Mas a decisão também muda a posição de Bacamarte: pela primeira vez, sua investigação passa a depender da aprovação política e popular."
    },
    negotiate: {
      label: "◇ VOCÊ CRIOU OUTRA REALIDADE",
      title: "Um acordo muda o equilíbrio de poder",
      text: "Bacamarte aceita negociar. A Casa Verde continua existindo, mas seus critérios passam a ser discutidos com os líderes da cidade. A ciência deixa de agir sozinha — e cada nova internação passa a carregar também uma disputa política."
    },
    confront: {
      label: "◆ VOCÊ ENCONTROU MACHADO",
      title: "Bacamarte não recua",
      text: "Mesmo diante da multidão, Bacamarte mantém a serenidade e sustenta sua posição. O confronto revela algo importante: ele não se enxerga como um tirano defendendo poder pessoal, mas como alguém defendendo uma verdade científica acima da pressão da cidade."
    }
  }[state.choice];

  shell(`
    ${hero("assets/images/revolta-casa-verde.jpg")}
    <section class="content narrative">
      <div class="result-label">${data.label}</div>
      <h2>${data.title}</h2>
      <div data-narration class="body-copy"><p>${data.text}</p></div>
      <div class="section-head compact"><span class="muted">Ouvir consequência</span>${iconPlay()}</div>
      <button class="primary" onclick="go('machado')">E Machado? <span>→</span></button>
    </section>
  `, 58);
}

function machado() {
  const found = state.choice === "confront";
  shell(`
    <div class="paper-hero">
      <div class="manuscript"></div>
      <div class="author-mark">M</div>
    </div>
    <section class="content narrative">
      <div class="eyebrow">O CAMINHO DO AUTOR</div>
      <h2>${found ? "Você antecipou a escolha de Machado." : "Machado escolheu não recuar."}</h2>
      <div class="section-head compact"><span class="muted">Ouvir explicação</span>${iconPlay()}</div>
      <div data-narration class="body-copy">
        <p>Na narrativa original, Bacamarte enfrenta a multidão com uma calma que contrasta com o tumulto ao redor. Ele não abandona a Casa Verde nem aceita que a pressão popular determine sua investigação.</p>
        <p>Esse momento reforça uma das tensões centrais de <i>O Alienista</i>: a autoridade de quem afirma falar em nome da razão pode crescer até se tornar tão difícil de contestar quanto a própria loucura que pretende classificar.</p>
      </div>
      <button class="primary" onclick="go('learn')">Entender <span>→</span></button>
    </section>
  `, 72);
}

function learn() {
  shell(`
    ${hero("assets/images/itaguai-rua.jpg")}
    <section class="content narrative">
      <div class="eyebrow">VOCÊ PERCEBEU?</div>
      <h2>Ciência e poder começam a se confundir</h2>
      <div class="learning-card">
        <div class="concept">CONCEITO DESCOBERTO · PODER</div>
        <p>Machado não apresenta a Casa Verde apenas como um lugar médico. À medida que Bacamarte amplia seus critérios, a instituição passa a reorganizar relações sociais, políticas e até pessoais em Itaguaí.</p>
        <p>É justamente por isso que a revolta é mais do que uma reação aos internamentos: ela é uma disputa sobre <b>quem pode definir a normalidade</b>.</p>
      </div>
      <button class="primary" onclick="go('map')">Ver meu caminho <span>→</span></button>
    </section>
  `, 84);
}

function mapScreen() {
  const c = state.choice || "confront";
  shell(`
    <section class="content map-screen">
      <div class="eyebrow">SEU CAMINHO EM ITAGUAÍ</div>
      <h2>O mapa ganhou uma nova ramificação</h2>
      <p class="copy">O eixo dourado mostra o caminho escrito por Machado. Sua escolha permanece registrada, mesmo quando a narrativa volta a se encontrar mais adiante.</p>

      <div class="tree-wrap">
        <svg viewBox="0 0 360 480" class="tree" aria-label="Mapa narrativo">
          <path class="main-path" d="M180 35 L180 145 L180 255 L180 425"/>
          <path class="alt-path ${c==='retreat'?'chosen':''}" d="M180 145 C135 175 85 190 65 245 C55 300 105 340 180 365"/>
          <path class="alt-path ${c==='negotiate'?'chosen':''}" d="M180 145 C225 175 275 190 295 245 C305 300 255 340 180 365"/>

          <circle class="node on" cx="180" cy="35" r="13"/><text x="205" y="41">Casa Verde</text>
          <circle class="node on" cx="180" cy="145" r="13"/><text x="205" y="151">A Revolta</text>

          <circle class="node ${c==='retreat'?'user':''}" cx="65" cy="245" r="13"/>
          <text x="18" y="280" class="small-label">Recuar</text>

          <circle class="node ${c==='negotiate'?'user':''}" cx="295" cy="245" r="13"/>
          <text x="256" y="280" class="small-label">Negociar</text>

          <circle class="node ${c==='confront'?'user machado':''}" cx="180" cy="255" r="15"/>
          <text x="205" y="261">Enfrentar</text>

          <circle class="node locked" cx="180" cy="365" r="13"/>
          <text x="205" y="371">Reconvergência</text>

          <circle class="node locked" cx="180" cy="425" r="13"/>
          <text x="205" y="431">?</text>
        </svg>
      </div>

      <div class="legend">
        <span><i class="dot machado-dot"></i> Caminho de Machado</span>
        <span><i class="dot user-dot"></i> Sua realidade</span>
        <span><i class="dot locked-dot"></i> Ainda não descoberto</span>
      </div>

      <button class="primary" onclick="go('summary')">Continuar <span>→</span></button>
    </section>
  `, 92);
}

function summary() {
  shell(`
    ${hero("assets/images/resultado-itaguai.jpg")}
    <section class="content narrative center">
      <div class="eyebrow">ALPHA v0.3 · VERTICAL SLICE</div>
      <h2>Sua Itaguaí começou a ganhar forma.</h2>
      <div class="score-ring"><strong>${state.choice === "confront" ? "1/1" : "0/1"}</strong><span>caminhos de Machado<br>neste trecho</span></div>
      <p class="copy">Este Alpha testa o ciclo completo: narrativa → decisão → consequência → caminho de Machado → entendimento → mapa.</p>
      <button class="primary" onclick="restart()">Jogar novamente <span>↻</span></button>
    </section>
  `, 100);
}

window.go = function(s) {
  stopSpeech();
  state.screen = s;
  render();
  window.scrollTo(0,0);
};
window.restart = function() {
  stopSpeech();
  state.screen = "home";
  state.choice = null;
  render();
  window.scrollTo(0,0);
};

function render() {
  ({
    home,
    opening:()=>scene("opening", 12, "tension"),
    tension:()=>scene("tension", 28, "decision"),
    decision,
    consequence,
    machado,
    learn,
    map:mapScreen,
    summary
  }[state.screen] || home)();
}
render();
