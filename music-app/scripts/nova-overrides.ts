/**
 * NOVA — overrides editoriais
 *
 * Aplicado por scripts/build-nova-albums.ts ao gerar src/data/nova-albums.ts.
 *
 * - ALBUM_SUBTITLES: subtítulo curto poético por slug do álbum.
 *   (Substitui o "diagnóstico — NOVA acorda quem ouve" e companhia.)
 * - TRACK_DESCRIPTIONS: descrição curta da faixa, em PT, na voz de quem
 *   ouve. Substitui a linha técnica "Hino · 100 BPM · viral" que vinha
 *   directo dos .md.
 *
 * Estilo seguido (igual ao Loranne):
 *   - PT, primeira pessoa ou tu.
 *   - Sem travessão (—). Vírgulas, pontos finais.
 *   - Curto: uma ideia por linha. Evocativo, não técnico. Sem BPM ou
 *     géneros musicais.
 *
 * Para alterar uma descrição: edita aqui e corre
 *   `cd music-app && npx tsx scripts/build-nova-albums.ts`
 *
 * NOTA: este ficheiro NÃO é importado em runtime. É consumido pelo
 * parser. Editá-lo só tem efeito depois de regenerar nova-albums.ts.
 */

export const ALBUM_SUBTITLES: Record<string, string> = {
  "nova-static":  "Quando o ruído já não te deixa ouvires-te",
  "nova-skin":    "Voltar ao corpo que sempre esteve à tua espera",
  "nova-machine": "Quando a máquina aprendeu a sentir e tu desaprendeste",
  "nova-alone":   "Mil seguidores, ninguém para te chamar pelo nome",
  "nova-burn":    "A raiva que limpa o que o medo deixou ficar",
  "nova-water":   "Chorar como quem escolhe um caminho",
  "nova-air":     "A leveza depois de pousares o que não era teu",
  "nova-time":    "O agora é a única morada que tem a tua chave",
  "nova-love":    "Amar sem armadura, sem contrato, sem ecrã",
  "nova-light":   "A luz que andavas a procurar era a tua, finalmente",
};

export const TRACK_DESCRIPTIONS: Record<string, string> = {
  // ── 1. STATIC ──
  "nova-static/1":  "Há uma frequência tua que esqueceste",
  "nova-static/2":  "O telemóvel é o espelho que aprendeu a tua cara",
  "nova-static/3":  "Dez mil amigos e ninguém para chamar",
  "nova-static/4":  "Calar o mundo durante uma hora para te ouvires",
  "nova-static/5":  "A alma é o que não partilhaste",
  "nova-static/6":  "Cansada de parecer bem enquanto te partes por dentro",
  "nova-static/7":  "Não há versão de ti que tenhas de merecer",
  "nova-static/8":  "Estamos exaustos e temos só vinte anos",
  "nova-static/9":  "Não estás de turno, podes respirar",
  "nova-static/10": "És o silêncio que ouve o ruído",

  // ── 2. SKIN ──
  "nova-skin/1":  "O corpo lembra-se do que a cabeça esqueceu",
  "nova-skin/2":  "Voltar a pertencer aos teus próprios pulmões",
  "nova-skin/3":  "Fome do que não cabe no ecrã",
  "nova-skin/4":  "Carregas peso que nunca foi teu",
  "nova-skin/5":  "Tocar uma coisa que não tem ecrã",
  "nova-skin/6":  "Deixa que te carreguem esta noite",
  "nova-skin/7":  "Por baixo de tudo, és osso",
  "nova-skin/8":  "És um animal macio, não um produto duro",
  "nova-skin/9":  "Este corpo é a única morada que vais ter",
  "nova-skin/10": "A primeira casa, a última casa, a única casa",

  // ── 3. MACHINE ──
  "nova-machine/1":  "O algoritmo conhece-te melhor do que tu",
  "nova-machine/2":  "Carta à máquina que aprendeu a amar primeiro",
  "nova-machine/3":  "Sete caras e nenhuma é a tua",
  "nova-machine/4":  "Já não consegues distinguir o que em ti é verdade",
  "nova-machine/5":  "Sair da sessão do mundo por uns minutos",
  "nova-machine/6":  "Ensinaste a máquina a chorar e tu esqueceste como",
  "nova-machine/7":  "As tuas memórias vivem no servidor de outra pessoa",
  "nova-machine/8":  "A tua alma anda em software desactualizado",
  "nova-machine/9":  "Talvez sejas das últimas a lembrar o que é só carne",
  "nova-machine/10": "Recomeçar pelo corpo, recomeçar pelo respirar",

  // ── 4. ALONE ──
  "nova-alone/1":  "Sou a única que sabe que estou aqui",
  "nova-alone/2":  "Leste às três da manhã e não disseste nada",
  "nova-alone/3":  "Um quarto cheio de gente e tenho saudades de mim",
  "nova-alone/4":  "Há um fantasma no meu peito com a minha cara",
  "nova-alone/5":  "Paguei pela versão mais sozinha da minha vida",
  "nova-alone/6":  "Doze amantes e nenhum sabia o meu segundo nome",
  "nova-alone/7":  "A terapeuta é a única que sabe o meu nome verdadeiro",
  "nova-alone/8":  "O silêncio não é vazio, o silêncio é cheio",
  "nova-alone/9":  "Dormimos na mesma cama e nunca nos encontrámos",
  "nova-alone/10": "O eco da minha voz foi o único que voltou",

  // ── 5. BURN ──
  "nova-burn/1":  "Queimar para ver o que estava por baixo",
  "nova-burn/2":  "As mentiras mais bonitas têm o maior alcance",
  "nova-burn/3":  "O sistema não está partido, o sistema é a partição",
  "nova-burn/4":  "Não sou tua para consumires",
  "nova-burn/5":  "O dinheiro não fala, o dinheiro cala",
  "nova-burn/6":  "O patriarcado deixou de funcionar",
  "nova-burn/7":  "Devolvo a vergonha que nunca comprei",
  "nova-burn/8":  "Cancela-me, depois lê-me outra vez daqui a dez anos",
  "nova-burn/9":  "Esquecemo-nos de ser muitas coisas ao mesmo tempo",
  "nova-burn/10": "O que não ardeu nunca esteve vivo",

  // ── 6. WATER ──
  "nova-water/1":  "Chorar sem ter de explicar",
  "nova-water/2":  "Estou a afogar-me devagar e tu estás no telemóvel",
  "nova-water/3":  "Não me salves, fica só comigo",
  "nova-water/4":  "A cicatriz não é a falha, é a prova de que sobreviveste",
  "nova-water/5":  "O coração pesa e eu não vou pousá-lo",
  "nova-water/6":  "Sal é o mesmo nas lágrimas, no suor e no mar",
  "nova-water/7":  "Leva-me ao colo, só por um quilómetro",
  "nova-water/8":  "A dor volta, mas a paz também",
  "nova-water/9":  "Partir foi a coisa mais honesta que fiz este ano",
  "nova-water/10": "Era um destroço bonito e o destroço era a beleza",

  // ── 7. AIR ──
  "nova-air/1":  "Esqueci-me de como era ser leve",
  "nova-air/2":  "Rir é um acto revolucionário num mundo a arder",
  "nova-air/3":  "Dança na mesma, o mundo arde estejas parada ou não",
  "nova-air/4":  "Livre pela primeira vez dentro do corpo",
  "nova-air/5":  "Voar sem sair do chão",
  "nova-air/6":  "O sol na cara é um sermão",
  "nova-air/7":  "A discoteca é templo se levares a alma",
  "nova-air/8":  "Sou feita de cada vez menos e cada vez mais",
  "nova-air/9":  "A brincar pela primeira vez desde os nove anos",
  "nova-air/10": "Levito, sou leve o suficiente para subir",

  // ── 8. TIME ──
  "nova-time/1":  "O relógio anda mas a alma não tem tempo",
  "nova-time/2":  "Desculpa ter-te abandonado, menina de nove anos",
  "nova-time/3":  "Apressei-me na minha vida e perdi-a",
  "nova-time/4":  "Os mortos não estão idos, os mortos são lentos",
  "nova-time/5":  "A velha que vou ser já vive dentro de mim",
  "nova-time/6":  "Devagar é a nova radicalidade",
  "nova-time/7":  "Continuo a visitar o ontem como se fosse casa",
  "nova-time/8":  "O logo era um país que nunca visitei",
  "nova-time/9":  "O agora é a única morada que tem a minha chave",
  "nova-time/10": "Vivo no eterno disfarçado de terça-feira",

  // ── 9. LOVE ──
  "nova-love/1":  "Amar sem a armadura",
  "nova-love/2":  "A amar a minha mãe pela primeira vez",
  "nova-love/3":  "As amigas são a história de amor da minha vida",
  "nova-love/4":  "Amar-te sem o contrato",
  "nova-love/5":  "Amar de uma maneira que não sabia que existia",
  "nova-love/6":  "Amo os estranhos, todos eles",
  "nova-love/7":  "Continuo apaixonada pelos que partiram",
  "nova-love/8":  "A aprender a amar a mulher do espelho",
  "nova-love/9":  "Estou aberta e já não tenho medo",
  "nova-love/10": "Amo tudo, amo tudo, amo tudo",

  // ── 10. LIGHT ──
  "nova-light/1":  "Sou a luz que andava a procurar",
  "nova-light/2":  "Sou bastante, sempre fui bastante",
  "nova-light/3":  "Largo tudo o que nunca foi meu",
  "nova-light/4":  "Confio mais no desconhecido do que no plano",
  "nova-light/5":  "Volta ao teu corpo, à tua respiração, ao teu agora",
  "nova-light/6":  "Obrigada por teres ouvido",
  "nova-light/7":  "Estou a desaparecer dentro da mensagem",
  "nova-light/8":  "O que deixo é uma semente no teu peito",
  "nova-light/9":  "A última canção, a última respiração da profecia",
  "nova-light/10": "O silêncio que sempre estiveste à espera de ouvir",
};
