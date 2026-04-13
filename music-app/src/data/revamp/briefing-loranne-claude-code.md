# Briefing Loranne — Claude Code

## Contexto

A app de música da Loranne tem um catálogo de ~144 álbuns com letras e prompts em TypeScript. Este briefing define exactamente o que fazer ao código, por ordem de prioridade.

---

## PARTE 1 — Cortes no catálogo

Remover completamente os seguintes álbuns do catálogo e dos ficheiros de letras. São duplicados confirmados — o tema está coberto por outros álbuns.

| Álbum a remover | Ficheiro | Motivo |
|---|---|---|
| `incenso-lava-quieta` | `lyrics-vida.ts` | Duplicado de `incenso-fogo-engolido` — mesma metáfora (garganta, maxilar, engolir o fogo) |
| `incenso-furia` | `lyrics-expansao.ts` | Começa com "ensinaram-me a engolir o fogo" — mesma frase de abertura de `fogo-engolido` |
| `incenso-agua-parada` | `lyrics-fase2.ts` | Duplicado mais fraco de `incenso-silencio-fertil` — mesma experiência meditativa |

**O que fazer:**
1. Remover as entradas de letras dos ficheiros `.ts` respectivos
2. Remover as definições de álbum em `albums.ts`
3. Verificar que não ficam referências quebradas em `curated-lists.ts` ou noutros ficheiros

---

## PARTE 2 — Reescritas de letras

### 2a. `incenso-oferenda` — substituir faixa 1 (PT)

**Problema:** erros de digitação e ângulo redundante com `incenso-maos-juntas` (ambos tratam gratidão ao presente/corpo).

**Novo ângulo:** gratidão ao futuro — a oferenda como acto de fé, não de inventário. Oferecer sem saber o que vem.

**Letra nova para `incenso-oferenda/1`:**

```
[Verse 1]
Ponho na mesa o que tenho
Não é muito, não é pouco
É o que cabe nesta tarde
Neste gesto, neste foco

[Verse 2]
Não sei o que vem depois
Não sei se o amanhã responde
Mas ofereço na mesma
O que o coração esconde

[Pre-Chorus]
Oferenda não é troca
É soltar sem garantia

[Chorus]
Ofereço o que não tenho ainda
Ofereço o que não sei
A manhã que ainda não veio
O nome que ainda não dei
Ofereço sem contrato
Sem recibo, sem retorno
A oferenda mais honesta
É a que parte sem adorno

[Verse 3]
As mãos abertas não esperam
Só entregam e confiam
Que o que se dá de verdade
É o que o mundo necessita

[Chorus]
Ofereço o que não tenho ainda
Ofereço o que não sei
A manhã que ainda não veio
O nome que ainda não dei

[Bridge]
Não é piedade nem promessa
É só este gesto simples
De acreditar que o amanhã
Merece o melhor de mim

[Outro]
Ofereço
Sem saber
Ofereço
Na mesma
```

---

### 2b. `grao-primeira-luz` — substituir faixa 1 (PT)

**Problema:** começa no mesmo lugar que `grao-luz-crua` (já produzido) — ambas tratam o corpo antes de acordar.

**Distinção:**
- `grao-luz-crua` (produzido) = o segundo antes de existir, sem nome, sem papel
- `grao-primeira-luz` (a produzir) = o momento em que *decides* que o dia vale. A manhã como escolha activa.

**Letra nova para `grao-primeira-luz/1`:**

```
[Verse 1]
Os pés tocam o chão antes de pensar
O frio do soalho diz que é real
Este dia existe — posso recusar
Ou posso abrir a janela e começar

[Verse 2]
Não é obrigação nem heroísmo
É só uma escolha pequena e exacta
Levantar é um acto de optimismo
Que o corpo faz antes de a mente se adapta

[Pre-Chorus]
Nenhum dia começa sozinho
Começa porque alguém decidiu

[Chorus]
Primeira luz — e eu escolho ver
Primeira luz — não me aconteceu
Fui eu que abri os olhos para ela
Fui eu que disse: este dia é meu
Não é grande, não é promessa
É só o gesto de aparecer
Primeira luz — e eu estou cá
E isso já é suficiente para ser

[Verse 3]
A chávena aquece as duas mãos
O vapor sobe como quem respira
Há uma calma nestes primeiros sons
Que a pressa do dia ainda não inspira

[Chorus]
Primeira luz — e eu escolho ver
Primeira luz — não me aconteceu
Fui eu que abri os olhos para ela
Fui eu que disse: este dia é meu

[Bridge]
Não precisa de ser bonito
Não precisa de ser perfeito
Só precisa de ser meu
Este começo imperfeito

[Outro]
Primeira luz
Primeira vez
Este dia
Começa em mim
```

---

## PARTE 3 — Reorganização da página de produção

### Problema actual

A página de produção está organizada por colecções estáticas (Espelhos, Éter, Nua, etc.). Não há noção de ordem de produção nem de estado por álbum.

### O que construir

Uma nova vista na página de produção: **Calendário Temático**.

**Estrutura da vista:**
- Lista de semanas temáticas reordenáveis por drag-and-drop
- A ordem é persistida em Supabase (tabela de preferências) ou localStorage como fallback
- Cada semana mostra: nome do tema, descrição curta, 5 álbuns com estado visual
- Estado por álbum: `por produzir` (cinzento) / `concluído` (cor do álbum)
- Estado por semana: calculado automaticamente — concluída quando todos os seus álbuns estiverem `produced`

**Vista de um álbum (dentro do calendário):**
- Lista das 10 faixas com: título, língua, energy, flavor
- Prompt completo pronto a copiar (botão copy)
- Letra completa pronta a copiar (botão copy)
- Campo `audioUrl` editável por faixa — colar o link depois de gerar no Suno
- Botão **"Álbum concluído"** ao nível do álbum (não por faixa) — marca status `produced` e volta à semana

**Novos campos em `albums.ts`:**
```typescript
status: "draft" | "ready" | "produced" | "published"
```
Álbuns já produzidos recebem `status: "produced"` directamente. Álbuns pendentes ficam com `status: "ready"`.

**Novo ficheiro `production-calendar.ts`:**
```typescript
export type ProductionWeek = {
  id: string
  theme: string
  description: string
  albums: string[]  // slugs, por ordem
}

export const PRODUCTION_CALENDAR: ProductionWeek[] = [
  // ver Parte 4
]
```

A ordem das semanas é reordenável pelo utilizador — o array inicial é a ordem definida na Parte 4 mas pode ser sobreposta pela preferência guardada.

**Importante:** os dados de letras e prompts não mudam de sítio. A nova vista só lê o que já existe — não duplica nada.

---

## PARTE 4 — Calendário temático completo

Codificar em `production-calendar.ts`. Todos os álbuns listados são pendentes (status `ready`). Nenhum álbum aparece em mais do que uma semana.

```
Semana 1 — Amor & Cartas
"o amor que se vive, o que se escreve, o que arde"
nua-romance, nua-carta, nua-fogo-lento, nua-ninho, nua-beijo-na-testa

Semana 2 — Maternidade
"o corpo que gera, os pais que ficam, o ventre que sabe"
sangue-mae, curso-mulher-mae, sangue-sombra-do-pai, sangue-ventre, eter-olhos-de-crianca

Semana 3 — Raiva Feminina
"o fogo que se engole, a lama que fica, a pele exposta"
incenso-fogo-engolido, incenso-espelho-partido, incenso-pele-exposta, incenso-diluvio-manso, incenso-luto

Semana 4 — Quietude & Interior
"silêncio fértil, água parada, o norte interno"
incenso-silencio-fertil, incenso-norte-interno, incenso-demora, incenso-folego, incenso-o-gesto

Semana 5 — Saudade & Ausência
"o que ficou, o que partiu, a fotografia velha"
eter-fotografia-velha, eter-sala-vazia, nua-longe-e-bem, eter-amanha-inventado, incenso-o-que-resta

Semana 6 — Herança & Sangue
"o que corre nas veias, os que vieram antes"
sangue-mesmo-sangue, sangue-linhagem, eter-sangue-antigo, sangue-irmas, mare-brasa-lenta

Semana 7 — Alegria Pura
"combustão, o palco, a euforia que não pede licença"
grao-combustao, grao-sem-motivo, incenso-salto-bonito, mare-viva, grao-no-de-ouro

Semana 8 — Espiritualidade Viva
"corrente, travessia, o gesto que é também oração"
incenso-correnteza, incenso-travessia, incenso-limiar, incenso-ressonancia, incenso-maos-juntas

Semana 9 — Ansiedade & Sombra
"âncora, insónia, o espelho que mente"
incenso-ancora, grao-insonia, incenso-nevoeiro, incenso-espelho-verde, mare-penumbra

Semana 10 — Crescimento Invisível
"raiz que muda, teimosa, o primeiro passo"
incenso-raiz-muda, incenso-teimosa, grao-passo-pequeno, grao-primeiro-passo, incenso-maos-abertas

Semana 11 — Cosmos & Éter
"órbita, poeira, o porto e o espanto"
eter, eter-orbita, eter-poeira, eter-porto, eter-olhos-arregalados

Semana 12 — Casa & Manhã
"primeira luz, pão e sal, o tear, o abrigo"
grao-primeira-luz, grao-pao-sal, grao-o-tear, grao-toalha-posta, grao-abrigo

Semana 13 — Natureza & Terra
"terra molhada, húmus, oceano, a luz mansa"
grao-terra-molhada, incenso-humus, eter-oceano, mare-luz-mansa, mare-tardes-vazias

Semana 14 — Autocuidado & Corpo Meu
"solidão boa, porcelana, o sal na pele"
mare-companhia-propria, nua-meu, grao-porcelana, incenso-oferenda, grao-sal-na-pele

Semana 15 — Movimento & Dança
"pés descalços, lama e céu, lua acordada"
incenso-pes-descalcos, grao-descalca, fibra-lama-e-ceu, fibra-corpo-aberto, mare-lua-acordada

Semana 16 — Intimidade
"corpo a corpo, rescaldo, o corpo celeste"
nua-corpo-a-corpo, incenso-rescaldo, incenso-corpo-celeste, grao-espelho-agua

Semana 17 — Vida Prática
"ecrã, moeda, deriva, porta aberta"
grao-ecra, grao-moeda, grao-deriva, grao-porta-aberta
```

**Cursos (18 álbuns) — batch separado, fora do calendário semanal:**
```
curso-arte-inteireza, curso-chama, curso-coroa, curso-depois-fogo, curso-espelho-outro,
curso-fio-invisivel, curso-flores-escuro, curso-fome, curso-limite-sagrado,
curso-oficio-ser, curso-olhos-abertos, curso-pele-nua, curso-peso-chao, curso-relogio,
curso-sangue-seda, curso-silencio-grita, curso-teia, curso-voz-dentro
```
Nota: `curso-mulher-mae` está na Semana 2 — não duplicar aqui.

---

## PARTE 5 — Regras de letras

Aplicar sempre que o Claude Code criar ou editar letras da Loranne:

- Português pós-acordo ortográfico (PT pós-AO90): `direção`, `projeto`, `exato`, `fração`, `ação`, `ótimo` — formas do acordo de 1990
- Sem nomes próprios pessoais nas letras
- Sem repetição do título como única palavra do refrão
- Letras cantam vivências concretas, não conceitos abstractos
- Loranne é canal universal — qualquer pessoa deve poder reconhecer-se
- Mesmo temas tristes têm luz ou abertura — nunca fecho total
- Sem referências a "álbum", "faixa", "canção" dentro da letra
- Sem "corpo" como palavra central fora da colecção Fibra

---

## Ordem de execução

1. **Cortes** (Parte 1) — remover 3 álbuns
2. **Reescritas** (Parte 2) — substituir 2 faixas
3. **`production-calendar.ts`** — criar ficheiro com o calendário completo (Parte 4)
4. **Campo `status`** em `albums.ts` — adicionar a todos os álbuns pendentes (`ready`) e produzidos (`produced`)
5. **Vista Calendário Temático** (Parte 3) — nova vista na página de produção
