
const state = {
  screen: "home",
  selectedObservations: new Set(),
  interpretation: null,
  evidence: null,
  inference: null,
  effect: null
};

const app = document.getElementById("app");

const copy = {
  opening: [
    "A Casa Verde já não é apenas um edifício em Itaguaí. Ela passou a interferir na vida de quase toda a cidade. Quanto mais Simão Bacamarte amplia seus critérios, mais difícil se torna saber quem poderá ser considerado são.",
    "As internações deixaram de atingir apenas aqueles que a população considerava evidentemente loucos. Pessoas respeitadas, generosas, vaidosas ou simplesmente excêntricas também passam a ser examinadas pelo alienista.",
    "O medo cresce ao mesmo tempo que a autoridade da Casa Verde."
  ],
  revolt: [
    "Quando Porfírio, o barbeiro conhecido como Canjica, reúne uma multidão, a tensão deixa as conversas privadas e ocupa as ruas.",
    "A revolta parece, à primeira vista, apenas uma reação contra os excessos de um médico. Mas há algo maior em jogo: quem ganhou o poder de definir a fronteira entre razão e loucura?",
    "A cidade está diante da Casa Verde. Agora, observe antes de interpretar."
  ]
};

function shell(content, progress=0) {
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

function hero(image, cls="") {
  return `<div class="hero live-still ${cls}" style="background-image:url('${image}')">
    <div class="motion-layer"></div>
  </div>`;
}

function audioButton() {
  return `<button class="audio-icon" aria-label="Ouvir trecho" title="Ouvir trecho" onclick="toggleSpeech()">▶</button>`;
}

function narrationText() {
  return [...document.querySelectorAll("[data-narration]")].map(el => el.innerText).join(" ");
}

window.toggleSpeech = function () {
  if (!("speechSynthesis" in window)) return;
  const btn = document.querySelector(".audio-icon");
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    if (btn) btn.textContent = "▶";
    return;
  }
  const utterance = new SpeechSynthesisUtterance(narrationText());
  utterance.lang = "pt-BR";
  utterance.rate = 0.88;
  utterance.pitch = 0.96;
  utterance.onstart = () => { if (btn) btn.textContent = "⏸"; };
  utterance.onend = () => { if (btn) btn.textContent = "▶"; };
  speechSynthesis.speak(utterance);
};

function stopAudio() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

function next(screen) {
  stopAudio();
  state.screen = screen;
  render();
  window.scrollTo({top:0, behavior:"smooth"});
}
window.go = next;

function pageHeader(eyebrow, title, withAudio=true) {
  return `<div class="section-head">
    <div>
      <div class="eyebrow">${eyebrow}</div>
      <h2>${title}</h2>
    </div>
    ${withAudio ? audioButton() : ""}
  </div>`;
}

function home() {
  shell(`
    ${hero("assets/images/entrada-itaguai.jpg", "hero-home")}
    <section class="content home-content">
      <div class="smallcaps">MACHADO DE ASSIS</div>
      <h1>O Alienista</h1>
      <p class="lead">Não apenas leia. Descubra a obra.</p>
      <p class="copy">Entre em Itaguaí. Observe o que muda, interprete as pistas, encontre evidências e construa o mapa de compreensão da história.</p>
      <button class="primary" onclick="go('opening')">COMEÇAR <span>→</span></button>
      <div class="meta">Alpha v0.4 · Discovery Model · ≈ 6 min</div>
    </section>
  `, 0);
}

function opening() {
  shell(`
    ${hero("assets/images/revolta-casa-verde.jpg")}
    <section class="content">
      ${pageHeader("ATO III · A REVOLTA", "A cidade começa a se voltar contra a Casa Verde")}
      <div class="body-copy" data-narration>
        ${copy.opening.map(p=>`<p>${p}</p>`).join("")}
      </div>
      <button class="primary" onclick="go('revolt')">Continuar <span>→</span></button>
    </section>
  `, 10);
}

function revolt() {
  shell(`
    ${hero("assets/images/casa-verde.jpg")}
    <section class="content">
      ${pageHeader("A CENA", "A revolta chega às ruas")}
      <div class="body-copy" data-narration>
        ${copy.revolt.map(p=>`<p>${p}</p>`).join("")}
      </div>
      <button class="primary" onclick="go('observe')">Observar a cena <span>→</span></button>
    </section>
  `, 20);
}

function observe() {
  const opts = [
    ["medical", "A Casa Verde deixou de funcionar apenas como instituição médica."],
    ["fear", "O medo das internações passou a afetar toda a cidade."],
    ["lost", "Bacamarte perdeu completamente sua autoridade."],
    ["social", "Os critérios de Bacamarte passaram a interferir na vida social."]
  ];
  shell(`
    ${hero("assets/images/itaguai-rua.jpg")}
    <section class="content">
      ${pageHeader("OBSERVAR", "O que mudou em Itaguaí?", false)}
      <p class="instruction">Selecione tudo o que a cena permite perceber antes de interpretar.</p>
      <div class="choices multi">
        ${opts.map(([id,t])=>`
          <button class="${state.selectedObservations.has(id) ? "selected" : ""}" onclick="toggleObservation('${id}')">
            <span class="check">${state.selectedObservations.has(id) ? "✓" : ""}</span>
            <b>${t}</b>
          </button>`).join("")}
      </div>
      <button class="primary ${state.selectedObservations.size ? "" : "disabled"}"
        ${state.selectedObservations.size ? `onclick="go('observeFeedback')"` : "disabled"}>
        Conferir observação <span>→</span>
      </button>
    </section>
  `, 30);
}
window.toggleObservation = function(id) {
  state.selectedObservations.has(id) ? state.selectedObservations.delete(id) : state.selectedObservations.add(id);
  observe();
};

function observeFeedback() {
  const useful = ["medical","fear","social"].filter(x=>state.selectedObservations.has(x)).length;
  const selectedWrong = state.selectedObservations.has("lost");
  shell(`
    <section class="content feedback-screen">
      <div class="discovery-mark">◉</div>
      <div class="eyebrow">OBSERVAÇÃO</div>
      <h2>${useful >= 2 && !selectedWrong ? "Você percebeu a mudança de escala." : "Há uma mudança de escala importante aqui."}</h2>
      <p class="copy">A Casa Verde não afeta apenas seus internados. Os critérios de Bacamarte começam a modificar o comportamento de toda a cidade — inclusive de quem nunca entrou nela.</p>
      <div class="mini-connection"><span>CASA VERDE</span><i>→</i><span>VIDA SOCIAL</span></div>
      <button class="primary" onclick="go('interpret')">Interpretar <span>→</span></button>
    </section>
  `, 38);
}

function interpret() {
  shell(`
    ${hero("assets/images/revolta-casa-verde.jpg")}
    <section class="content">
      ${pageHeader("INTERPRETAR", "O conflito é apenas entre ciência e ignorância popular?", false)}
      <div class="choices">
        ${choiceButton("A", "Sim", "A população simplesmente não compreende o trabalho científico.", "interpretation")}
        ${choiceButton("B", "Não", "A questão também envolve quem ganhou poder para definir o que é normal.", "interpretation")}
        ${choiceButton("C", "Não", "A revolta existe somente porque Porfírio deseja enriquecer.", "interpretation")}
      </div>
    </section>
  `, 46);
}

function choiceButton(code, title, desc, field) {
  return `<button onclick="selectSingle('${field}','${code}')">
    <span class="choice-code">${code}</span>
    <span><b>${title}</b><small>${desc}</small></span>
  </button>`;
}
window.selectSingle = function(field, value) {
  state[field] = value;
  if (field === "interpretation") next("interpretFeedback");
  if (field === "evidence") next("evidenceFeedback");
  if (field === "inference") next("inferenceFeedback");
  if (field === "effect") next("map");
};

function interpretFeedback() {
  const good = state.interpretation === "B";
  shell(`
    <section class="content feedback-screen">
      <div class="result-label">${good ? "INTERPRETAÇÃO MAIS SUSTENTADA" : "VOLTE ÀS EVIDÊNCIAS"}</div>
      <h2>${good ? "O problema não é apenas médico." : "A leitura pode ir além dessa explicação."}</h2>
      <p class="copy">Quando uma instituição passa a decidir quem é racional e quem deve ser isolado, sua autoridade ultrapassa a medicina. A revolta também disputa o poder de definir a normalidade.</p>
      <button class="primary" onclick="go('evidence')">Provar com evidências <span>→</span></button>
    </section>
  `, 54);
}

function evidence() {
  shell(`
    <section class="content">
      ${pageHeader("PROVAR", "Qual evidência sustenta melhor essa interpretação?", false)}
      <p class="instruction">Escolha o elemento que melhor conecta a Casa Verde ao exercício de poder.</p>
      <div class="evidence-list">
        ${evidenceButton("A", "A Casa Verde passa a receber pessoas cada vez mais diversas.")}
        ${evidenceButton("B", "Bacamarte estudou medicina na Europa.")}
        ${evidenceButton("C", "Porfírio é barbeiro.")}
      </div>
    </section>
  `, 62);
}
function evidenceButton(code, text) {
  return `<button class="evidence-card" onclick="selectSingle('evidence','${code}')"><span>${code}</span><p>${text}</p></button>`;
}

function evidenceFeedback() {
  const good = state.evidence === "A";
  shell(`
    <section class="content feedback-screen">
      <div class="discovery-mark">◆</div>
      <div class="eyebrow">CONEXÃO DESCOBERTA</div>
      <h2>${good ? "CIÊNCIA → AUTORIDADE → PODER" : "A evidência decisiva está no alcance da Casa Verde."}</h2>
      <p class="copy">Quando os critérios de internação se expandem, Bacamarte passa a exercer autoridade sobre um número cada vez maior de habitantes. É essa ampliação — e não sua formação acadêmica ou a profissão de Porfírio — que sustenta a interpretação.</p>
      <div class="concept-chain">
        <span>CIÊNCIA</span><i>→</i><span>AUTORIDADE</span><i>→</i><span>PODER</span>
      </div>
      <button class="primary" onclick="go('contrast')">Continuar <span>→</span></button>
    </section>
  `, 70);
}

function contrast() {
  shell(`
    <section class="content">
      ${pageHeader("CONECTAR", "Observe a transformação", false)}
      <div class="contrast-grid">
        <div class="contrast-card"><div class="eyebrow">ANTES</div><p>A Casa Verde surge como instituição de estudo e tratamento da loucura.</p></div>
        <div class="contrast-arrow">↓</div>
        <div class="contrast-card"><div class="eyebrow">AGORA</div><p>Grande parte da cidade teme ser enquadrada pelos critérios de Bacamarte.</p></div>
      </div>
      <div class="question-box">
        <b>O que essa transformação sugere?</b>
        <div class="choices compact-choices">
          <button onclick="state.effect='A';go('inference')">A experiência científica ampliou seu alcance sobre a sociedade.</button>
          <button onclick="state.effect='B';go('inference')">Bacamarte abandonou completamente a ciência.</button>
          <button onclick="state.effect='C';go('inference')">A população passou a admirar ainda mais a Casa Verde.</button>
        </div>
      </div>
    </section>
  `, 77);
}

function inference() {
  shell(`
    ${hero("assets/images/bacamarte-estudo.jpg")}
    <section class="content">
      ${pageHeader("INFERIR", "O que seria coerente com Bacamarte?", false)}
      <p class="copy">Agora use o que você já descobriu sobre o personagem — não para adivinhar o autor, mas para testar se compreendeu sua lógica.</p>
      <div class="choices">
        ${choiceButton("A", "Recuar", "Suspender imediatamente a experiência diante da multidão.", "inference")}
        ${choiceButton("B", "Defender a investigação", "Manter sua posição apesar da pressão popular.", "inference")}
        ${choiceButton("C", "Abandonar Itaguaí", "Encerrar a experiência e deixar a cidade.", "inference")}
      </div>
    </section>
  `, 84);
}

function inferenceFeedback() {
  const good = state.inference === "B";
  shell(`
    ${hero("assets/images/casa-verde.jpg")}
    <section class="content">
      <div class="result-label">${good ? "VOCÊ COMPREENDEU A LÓGICA DE BACAMARTE" : "OBSERVE O PERSONAGEM"}</div>
      <h2>Bacamarte não recua.</h2>
      <div class="body-copy" data-narration>
        <p>Diante da multidão, ele preserva uma serenidade quase desconcertante e sustenta sua posição. Para Bacamarte, ceder à pressão das ruas seria submeter uma questão que considera científica à vontade popular.</p>
        <p>O efeito da cena não é apenas mostrar coragem ou obstinação. Ela aumenta a distância entre o alienista e a cidade — e reforça a tensão entre razão declarada e poder exercido.</p>
      </div>
      ${audioButton()}
      <button class="primary" onclick="go('recall')">Lembrar <span>→</span></button>
    </section>
  `, 90);
}

function recall() {
  shell(`
    <section class="content recall-screen">
      <div class="eyebrow">LEMBRAR</div>
      <h2>Sem voltar ao texto:</h2>
      <p class="lead">Por que a Revolta dos Canjicas é mais do que uma revolta contra um médico?</p>
      <textarea id="recallAnswer" placeholder="Escreva em uma ou duas frases..."></textarea>
      <button class="primary" onclick="finishRecall()">Registrar minha leitura <span>→</span></button>
      <button class="secondary" onclick="go('map')">Prefiro continuar sem escrever</button>
    </section>
  `, 95);
}
window.finishRecall = function() {
  const el = document.getElementById("recallAnswer");
  state.recall = el ? el.value.trim() : "";
  next("map");
};

function map() {
  shell(`
    <section class="content map-screen">
      <div class="eyebrow">MAPA DE COMPREENSÃO</div>
      <h2>Você descobriu uma nova estrutura da obra.</h2>
      <p class="copy">O mapa não mostra finais alternativos. Ele revela como personagens, ideias e acontecimentos se conectam.</p>
      <div class="knowledge-map">
        <div class="km-node root">BACAMARTE</div>
        <div class="km-line"></div>
        <div class="km-node">CIÊNCIA</div>
        <div class="km-line"></div>
        <div class="km-node">CLASSIFICAÇÃO</div>
        <div class="km-line"></div>
        <div class="km-node discovered">NORMALIDADE</div>
        <div class="km-line"></div>
        <div class="km-node discovered">AUTORIDADE</div>
        <div class="km-line"></div>
        <div class="km-node discovered strong">PODER</div>
        <div class="km-branch">
          <span class="km-node small">CASA VERDE</span>
          <span class="km-node small discovered">REVOLTA</span>
        </div>
        <div class="km-mystery">?</div>
      </div>
      <div class="progress-grid">
        <div><strong>1</strong><span>conexão descoberta</span></div>
        <div><strong>1</strong><span>evidência reconhecida</span></div>
        <div><strong>1</strong><span>conceito consolidado</span></div>
      </div>
      <button class="primary" onclick="go('summary')">Concluir trecho <span>→</span></button>
    </section>
  `, 98);
}

function summary() {
  shell(`
    ${hero("assets/images/resultado-itaguai.jpg")}
    <section class="content center">
      <div class="eyebrow">ALPHA v0.4 · DISCOVERY MODEL</div>
      <h2>Você não apenas acompanhou a revolta. Começou a entender como ela funciona.</h2>
      <p class="copy">Nesta sequência você observou uma mudança, interpretou o conflito, encontrou uma evidência, conectou conceitos e recuperou a ideia sem voltar ao texto.</p>
      <div class="concept-chain final-chain"><span>OBSERVAR</span><i>→</i><span>INTERPRETAR</span><i>→</i><span>PROVAR</span><i>→</i><span>CONECTAR</span><i>→</i><span>LEMBRAR</span></div>
      <button class="primary" onclick="restart()">Jogar novamente <span>↻</span></button>
    </section>
  `, 100);
}

window.restart = function() {
  stopAudio();
  state.screen = "home";
  state.selectedObservations = new Set();
  state.interpretation = null;
  state.evidence = null;
  state.inference = null;
  state.effect = null;
  state.recall = "";
  render();
};

function render() {
  const screens = {
    home, opening, revolt, observe, observeFeedback, interpret,
    interpretFeedback, evidence, evidenceFeedback, contrast,
    inference, inferenceFeedback, recall, map, summary
  };
  (screens[state.screen] || home)();
}

render();
