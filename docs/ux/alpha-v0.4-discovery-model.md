# Coonto Alpha v0.4 — Discovery Model

## Objetivo
Substituir o loop antigo de decisões narrativas pelo novo **Discovery Model**:

**Observar → Interpretar → Provar → Conectar → Lembrar**

## Arquivos Principais Atualizados
- `index.html`
- `app.js`
- `styles.css`

Reutiliza os assets de imagens em `assets/images/`.

## Mudanças Principais
- Remove "Você faria as mesmas escolhas que Machado?" da abertura.
- Remove a criação de realidades alternativas como mecânica principal.
- Introduz observação com múltipla seleção.
- Introduz interpretação sustentada por hipóteses.
- Introduz seleção de evidência.
- Introduz conexão conceitual (antes/depois).
- Mantém inferência de personagem como teste de compreensão da lógica interna.
- Introduz recuperação ativa em campo aberto (Lembrar / Recall).
- Converte o mapa narrativo em mapa de compreensão / grafo de conceitos.
- Áudio permanece como controle minimalista `▶/⏸` acionando SpeechSynthesis.
- Adiciona efeito `live-still`: zoom/movimento inicial sutil de ~3s e depois repouso suave.
- Mantém identidade visual dark premium oitocentista.

## Próximas Etapas Pós-Validação
- Substituir SpeechSynthesis por arquivos MP3/OGG profissionais;
- Implementar áudio por cena;
- Gerar assets individuais com movimento/cinemagraph;
- Separar conteúdo da engine (data/schema);
- Instrumentar analytics dos pontos de interpretação/evidência.
