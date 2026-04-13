# Briefing Loranne — Distribuição (Claude Code)

## Contexto

Este briefing define o **catálogo de distribuição** da Loranne — o que vai para o Spotify via DistroKid. É distinto do catálogo interno (Espelhos, Nós, Cursos, Espiritualidade) que existe para o ecossistema Sete Ecos mas não entra no pipeline de distribuição.

**Total: 65 álbuns** — 55 existentes com força de distribuição + 10 novos a criar.

---

## PARTE 1 — Dois catálogos, uma app

Adicionar campo `distribution: boolean` a todos os álbuns em `albums.ts`.

**`distribution: true`** — os 65 álbuns deste briefing. Entram no calendário temático e no pipeline DistroKid.

**`distribution: false`** — álbuns internos. Ficam na app, disponíveis para o ecossistema Sete Ecos, mas não entram no calendário de produção para distribuição:
- Todos os `curso-*`
- Todos os `espelho-*`
- Todos os `no-*`
- incenso-correnteza, incenso-travessia, incenso-limiar, incenso-ressonancia, incenso-o-gesto, incenso-folego, incenso-demora, incenso-humus, incenso-corpo-celeste, incenso-o-que-resta, incenso-norte-interno, incenso-nevoeiro, incenso-maos-juntas, incenso-oferenda
- eter, eter-orbita, eter-poeira, eter-porto, eter-olhos-arregalados, eter-oceano
- grao-o-tear, grao-porta-aberta, grao-primeiro-passo, grao-passo-pequeno, grao-toalha-posta, grao-terra-molhada, grao-ecra

A página de produção tem **dois modos de navegação**:

1. **Calendário Temático** (novo) — mostra os 65 álbuns de distribuição organizados por semanas temáticas, reordenáveis. É aqui que se produz para o Spotify.
2. **Colecções** (existente) — continua a mostrar todos os álbuns incluindo os internos (Espelhos, Nós, Cursos, Espiritualidade). Não desaparecem nem são escondidos — só não entram no calendário.

O campo `distribution: boolean` serve para distinguir quais entram no Calendário Temático. Não filtra nem esconde nada na vista de Colecções.

---

## PARTE 2 — 10 álbuns novos a criar

Criar definições completas em `albums.ts` seguindo o padrão `vidaAlbum()` existente. As letras já estão escritas e entregues em `lyrics-novos.ts` — importar directamente, não gerar. A estrutura da chave é `"slug-do-album/numero-da-faixa"`.

### Estrutura de cada faixa
```typescript
{
  number: N,
  title: "Título",
  description: "Descrição de uma linha",
  lang: "PT" | "EN",
  energy: "whisper" | "raw" | "steady" | "pulse" | "anthem",
  flavor: "bossa" | "jazz" | "folk" | "house" | "funk" | "marrabenta" | "afrobeat" | "gospel" | null,
  prompt: vidaPrompt(...),
  durationSeconds: 240 | 260 | 300
}
```

---

### 1. `nua-nao-era-amor`
**Título:** Não Era Amor | **Subtítulo:** O dia em que percebi o nome certo para o que vivi.
**Product:** nua | **Cor:** #5A3A4A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | Sempre Fui Eu | PT | whisper | bossa |
| 2 | Smaller | EN | raw | afrobeat |
| 3 | Explicar o Inexplicável | PT | steady | jazz |
| 4 | The Doubt | EN | whisper | folk |
| 5 | Antes de Ti | PT | steady | marrabenta |
| 6 | Not Love | EN | raw | gospel-africano |
| 7 | O Dia Que Vi | PT | pulse | house |
| 8 | Grieving You | EN | steady | jazz |
| 9 | Reconstrução | PT | steady | marrabenta |
| 10 | Free | EN | anthem | gospel-africano |

---

### 2. `incenso-cinzento`
**Título:** Cinzento | **Subtítulo:** Quando o dia passa e não sentes nada. Nem dor — ausência.
**Product:** incenso | **Cor:** #5A5A6A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | Terça-Feira | PT | whisper | bossa |
| 2 | Grey | EN | raw | folk |
| 3 | A Cama | PT | whisper | jazz |
| 4 | Nobody Knows | EN | steady | afrobeat |
| 5 | Semanas | PT | raw | marrabenta |
| 6 | Still Here | EN | whisper | bossa |
| 7 | O Duche | PT | steady | amapiano |
| 8 | A Friend Who Sees | EN | steady | folk |
| 9 | Fissura | PT | steady | marrabenta |
| 10 | Light Returns | EN | anthem | gospel-africano |

---

### 3. `nua-so`
**Título:** Só | **Subtítulo:** Esta é a minha vida. É inteira assim.
**Product:** nua | **Cor:** #7A5A8A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | A Cama Toda | PT | steady | bossa |
| 2 | Table for One | EN | steady | jazz |
| 3 | Planos Meus | PT | pulse | house |
| 4 | Not Waiting | EN | anthem | funk |
| 5 | O Domingo | PT | whisper | folk |
| 6 | They Ask | EN | raw | afrobeat |
| 7 | Inteira Assim | PT | steady | marrabenta |
| 8 | Solo Travel | EN | pulse | amapiano |
| 9 | Escolha | PT | steady | bossa |
| 10 | Enough Company | EN | anthem | gospel-africano |

---

### 4. `grao-segunda-vez`
**Título:** Segunda Vez | **Subtítulo:** Reinventar a vida quando já era suposto estar feita.
**Product:** grao | **Cor:** #8A6A3A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | Quarenta e Dois | PT | raw | marrabenta |
| 2 | The Papers | EN | whisper | folk |
| 3 | Vender a Casa | PT | steady | bossa |
| 4 | Starting Over | EN | steady | jazz |
| 5 | O Primeiro Apartamento | PT | pulse | house |
| 6 | Late Bloomer | EN | anthem | funk |
| 7 | Recomeçar o Corpo | PT | steady | afrobeat |
| 8 | New Rules | EN | steady | amapiano |
| 9 | Filhos Crescidos | PT | whisper | bossa |
| 10 | Second Bloom | EN | anthem | gospel-africano |

---

### 5. `nua-traco`
**Título:** Traço | **Subtítulo:** O que fica depois de alguém partir com o que era teu.
**Product:** nua | **Cor:** #6A3A3A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | A Mensagem | PT | raw | marrabenta |
| 2 | Frozen | EN | whisper | folk |
| 3 | Fazer o Jantar | PT | raw | afrobeat |
| 4 | The Questions | EN | steady | jazz |
| 5 | Culpa Que Não É Minha | PT | whisper | bossa |
| 6 | What Was Real | EN | raw | gospel-africano |
| 7 | A Decisão | PT | pulse | house |
| 8 | Trust Again | EN | steady | amapiano |
| 9 | Cicatriz | PT | steady | marrabenta |
| 10 | Whole Again | EN | anthem | gospel-africano |

---

### 6. `grao-fome-boa`
**Título:** Fome Boa | **Subtítulo:** Querer ser grande não precisa de desculpa.
**Product:** grao | **Cor:** #8A5A2A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | Quero Mais | PT | pulse | amapiano |
| 2 | Boardroom | EN | steady | jazz |
| 3 | A Lista | PT | steady | folk |
| 4 | Ambitious | EN | anthem | funk |
| 5 | Noite de Trabalho | PT | steady | house |
| 6 | She Built It | EN | pulse | afrobeat |
| 7 | Sem Pedir Licença | PT | anthem | marrabenta |
| 8 | The Cost | EN | raw | gospel-africano |
| 9 | Ensinei-me | PT | steady | bossa |
| 10 | Legacy | EN | anthem | gospel-africano |

---

### 7. `sangue-o-que-nao-nasceu`
**Título:** O Que Não Nasceu | **Subtítulo:** O luto sem funeral. A perda que ninguém sabe nomear.
**Product:** sangue | **Cor:** #6A4A5A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | A Data | PT | whisper | bossa |
| 2 | Nobody Knew | EN | raw | folk |
| 3 | O Corpo | PT | raw | marrabenta |
| 4 | Due Date | EN | whisper | jazz |
| 5 | O Nome | PT | whisper | bossa |
| 6 | Still a Mother | EN | steady | afrobeat |
| 7 | Às Outras | PT | steady | marrabenta |
| 8 | The Room | EN | steady | folk |
| 9 | Continuar | PT | steady | amapiano |
| 10 | You Were Here | EN | anthem | gospel-africano |

---

### 8. `nua-pequeno-demais`
**Título:** Pequeno Demais | **Subtítulo:** O amor que ficou pequeno e ninguém teve coragem de dizer.
**Product:** nua | **Cor:** #5A5A8A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | O Sofá | PT | raw | marrabenta |
| 2 | Roommates | EN | steady | jazz |
| 3 | A Última Vez | PT | whisper | folk |
| 4 | Staying for What | EN | raw | afrobeat |
| 5 | Ainda Te Conheço | PT | whisper | bossa |
| 6 | The Silence Between | EN | steady | jazz |
| 7 | A Conversa | PT | pulse | house |
| 8 | Different People | EN | steady | amapiano |
| 9 | O Que Fica | PT | steady | marrabenta |
| 10 | Honest Ending | EN | anthem | gospel-africano |

---

### 9. `nua-tempo-no-corpo`
**Título:** Tempo no Corpo | **Subtítulo:** Este corpo tem história. É isso que o faz belo.
**Product:** nua | **Cor:** #8A6A5A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | O Espelho dos Quarenta | PT | raw | marrabenta |
| 2 | Silver | EN | steady | bossa |
| 3 | Maré Quente | PT | steady | afrobeat |
| 4 | Lines | EN | steady | jazz |
| 5 | O Corpo da Minha Mãe | PT | whisper | folk |
| 6 | Desire Doesn't Age | EN | pulse | funk |
| 7 | Cinquenta | PT | anthem | marrabenta |
| 8 | Unlearning | EN | steady | amapiano |
| 9 | Deixa Ver | PT | steady | bossa |
| 10 | This Body Lived | EN | anthem | gospel-africano |

---

### 10. `grao-ferias`
**Título:** Férias | **Subtítulo:** Parar de ser útil. O corpo no sol sem agenda.
**Product:** grao | **Cor:** #8A7A3A | **distribution: true**

| # | Título | Língua | Energy | Flavor |
|---|---|---|---|---|
| 1 | Desligar | PT | steady | bossa |
| 2 | Window Seat | EN | whisper | folk |
| 3 | A Praia de Terça | PT | steady | afrobeat |
| 4 | No Plans | EN | pulse | amapiano |
| 5 | Bronzeado | PT | pulse | funk |
| 6 | Slow Morning | EN | whisper | jazz |
| 7 | Perder-me | PT | steady | marrabenta |
| 8 | The Book | EN | steady | bossa |
| 9 | Voltar | PT | steady | folk |
| 10 | Permission | EN | anthem | gospel-africano |

---

## PARTE 3 — Calendário de distribuição (13 semanas)

Ficheiro `production-calendar.ts` — apenas álbuns com `distribution: true`.
Semanas reordenáveis por drag-and-drop. Marcação por álbum inteiro (não por faixa).

```
Semana 1 — Mulher Inteira
"ser mulher sem pedir desculpa — o que ninguém vê, o que se permite"
nua-inteira*, nua-por-dentro*, nua-boa*, nua-pele*, nua-so [NOVO]

Semana 2 — Amor Que Dói
"traição, erosão, o amor que ficou pequeno, o que não era amor"
nua-traco [NOVO], nua-nao-era-amor [NOVO], nua-pequeno-demais [NOVO], nua-romance, nua-carta

Semana 3 — Maternidade
"o corpo que gera, o luto sem funeral, os pais que ficam"
sangue-mae, sangue-o-que-nao-nasceu [NOVO], sangue-sombra-do-pai, sangue-ventre, eter-olhos-de-crianca

Semana 4 — Raiva & Sombra
"fogo engolido, cinzento, o espelho partido"
incenso-fogo-engolido, incenso-cinzento [NOVO], incenso-pele-exposta, incenso-espelho-partido, incenso-ancora

Semana 5 — Saudade & Perda
"fotografia velha, luto, longe mas bem"
eter-fotografia-velha, incenso-luto, nua-longe-e-bem, eter-sala-vazia, eter-amanha-inventado

Semana 6 — Diáspora & Raiz
"sangue antigo, herança, o que corre nas veias"
sangue-raiz*, eter-raiz-vermelha*, eter-sangue-antigo, sangue-linhagem, sangue-mesmo-sangue

Semana 7 — Recomeço & Crescimento
"segunda vez, fissuras, o primeiro passo"
grao-segunda-vez [NOVO], incenso-raiz-muda, incenso-teimosa, incenso-rescaldo, incenso-maos-abertas

Semana 8 — Ambição & Trabalho
"fome boa, moeda, o tear, insónia de quem constrói"
grao-fome-boa [NOVO], grao-moeda, grao-insonia, grao-o-tear*, grao-deriva

Semana 9 — Laços Femininos
"irmãs de sangue e de escolha, o amor entre mulheres"
sangue-irmas, nua-duas-vozes*, sangue-mae*, incenso-diluvio-manso, incenso-salto-bonito

Semana 10 — Corpo & Tempo
"corpo que envelhece, autocuidado, o prazer que é só teu"
nua-tempo-no-corpo [NOVO], nua-meu, nua-corpo-a-corpo, nua-beijo-na-testa, nua-fogo-lento

Semana 11 — Alegria & Leveza
"férias, combustão, alegria que não pede licença"
grao-ferias [NOVO], grao-combustao, grao-sem-motivo, mare-viva, incenso-salto-bonito*

Semana 12 — Casa & Ritmo
"manhã, praia, abrigo, o sal na pele"
grao-primeira-luz, grao-sal-na-pele, grao-abrigo, grao-pao-sal, mare-lua-acordada

Semana 13 — Quietude & Maré
"silêncio fértil, companhia própria, a maré que não se controla"
incenso-silencio-fertil, mare-companhia-propria, mare-penumbra, mare-tardes-vazias, mare-brasa-lenta
```

*Álbuns já produzidos — marcados automaticamente como `produced`.

**Álbuns produzidos fora do calendário** (já no Spotify, não precisam de ser produzidos):
sangue-raiz, eter-raiz-vermelha, nua-inteira, nua-por-dentro, nua-boa, nua-pele, nua-duas-vozes, sangue-mae

---

## PARTE 4 — Regras técnicas

- As letras em `lyrics-novos.ts` são importadas como estão — não modificar, não regenerar
- Chave de cada letra: `"slug-do-album/numero-da-faixa"` (ex: `"nua-nao-era-amor/1"`)
- Exportar como `NOVOS_LYRICS: Record<string, string>` e adicionar ao `ALL_LYRICS` em `albums.ts`
- Português pós-AO90 — já aplicado nas letras, manter ao criar títulos e descrições

---

## Ordem de execução

1. Adicionar campo `distribution: boolean` a todos os álbuns em `albums.ts`
2. Criar os 10 novos álbuns em `albums.ts` (definições) + `lyrics-novos.ts` (letras completas)
3. Actualizar `production-calendar.ts` com as 13 semanas de distribuição
4. Vista de produção mostra apenas `distribution: true`
5. Álbuns já produzidos (listados acima) recebem `status: "produced"` automaticamente
