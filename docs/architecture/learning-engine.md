# Arquitetura: Learning Engine vs Conteúdo

Uma das premissas fundamentais do Coonto é o desacoplamento estrito entre a **Engine** (motor de aprendizagem e execução narrativa) e o **Conteúdo** (as obras literárias).

```text
┌────────────────────────────────────────────────────────┐
│                   Learning Engine                      │
│  - Máquina de estados narrativos                       │
│  - Avaliação de consequências pedagógicas              │
│  - Gestão de inventário / progresso / branches         │
│  - Player de áudio discreto & renderizador de mídia    │
└──────────────────────────┬─────────────────────────────┘
                           │ Consome estruturas declarativas (JSON / MD)
                           ▼
┌────────────────────────────────────────────────────────┐
│               Conteúdo: O Alienista                    │
│  - Árvore de nós narrativos (abertura, escolhas, fim)  │
│  - Camadas "E Machado?" e pedagogia histórica          │
│  - Assets audiovisuais dedicados (áudios, pinturas)    │
└────────────────────────────────────────────────────────┘
```

## Benefícios do Desacoplamento
1. **Escalabilidade de Catálogo**: Novas obras (*Dom Casmurro*, *Memórias Póstumas*, *O Cortiço*) podem ser inseridas como novos pacotes de dados sem necessidade de recodificar a interface ou a lógica de controle.
2. **Manutenibilidade**: Mudanças de design e correções de engine não afetam a escrita das histórias.
3. **Internacionalização e Versões Pedagógicas**: Permite criar versões para níveis de ensino distintos (Ensino Médio, Ensino Fundamental II, Vestibulares) trocando apenas o pacote de conteúdo.

## Próximos Passos de Refatoração (Branch `develop`)
Na fase Alpha v0.3 o código encontra-se reunido em `app.js` e dados locais para facilitar testes rápidos. A evolução planejada em `develop` é migrar gradualmente para:
```text
src/
  ├── engine/         # Lógica pura do motor
  ├── content/
  │   └── o-alienista/# Dados estruturados da obra
  └── ui/             # Componentes de apresentação
```
