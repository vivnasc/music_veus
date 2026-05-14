/**
 * ALVA — 31 paisagens sonoras matinais.
 *
 * Cada som é um lugar com nome próprio numa hora exacta do amanhecer
 * (05:12 → 08:30). Combinações de elementos que não coexistem na
 * natureza real — a originalidade está na edição.
 *
 * Fonte canónica: /ALVA-Project/01-SONS-MATINAIS.md
 * Destino: posts matinais diários + página /alva no app.
 *
 * Áudio é gerado em Suno a partir de `sunoPrompt`. Enquanto não houver
 * áudio publicado, `audioUrl` fica null e a UI mostra "ainda por gerar".
 */

export type AlvaSound = {
  day: number; // 1..31
  slug: string;
  name: string;
  hour: string; // "HH:MM"
  place: string; // one-liner do lugar imaginado
  layers: string[]; // 5 camadas sonoras
  sunoPrompt: string;
  sensacao: string;
  caption: string;
  color: string; // hex, gradiente do amanhecer
  audioUrl: string | null;
};

// Gradiente de cor: noite profunda (05:12) → dourado de pátio (08:30).
// 31 paragens da mesma curva, para haver coerência visual entre os dias.
export const ALVA_SOUNDS: AlvaSound[] = [
  {
    day: 1, slug: "orvalho-lume", name: "Orvalho-Lume", hour: "05:12",
    place: "Pântano de luzes pequenas onde os vagalumes apagam ao primeiro raio.",
    layers: [
      "Água parada com pequenas ondulações",
      "Vagalume em pulsos eléctricos ténues",
      "Sopro morno de vento baixo",
      "Cristal a estalar muito ao longe",
      "Drone grave subterrâneo (60 Hz)",
    ],
    sunoPrompt: "Ambient field recording soundscape, still wetland water at dawn, faint pulsing electric whispers like fireflies dimming, low warm wind breath, distant crystal cracking, deep 60Hz drone underneath, no vocals, instrumental, 3 minutes, meditative, cinematic, lo-fi nature",
    sensacao: "Estás a chegar antes do mundo.",
    caption: "Acordar antes da luz não é virtude. É só estar onde ela vai chegar.",
    color: "#1F2347", audioUrl: null,
  },
  {
    day: 2, slug: "vidraca-mar", name: "Vidraça-Mar", hour: "05:34",
    place: "Praia onde o mar congelou durante a noite e começa a partir.",
    layers: [
      "Ondas em câmara muito lenta (8s cada)",
      "Vidro a partir-se devagar",
      "Sino abafado embaixo de água",
      "Vento horizontal sobre superfície dura",
      "Pássaro marinho único, longe",
    ],
    sunoPrompt: "Slow-motion frozen ocean soundscape, 8-second waves, slow glass cracking layered with submerged muffled bell, horizontal wind over hard surface, single distant seabird call, ambient cinematic, no vocals, instrumental, 3 minutes, glacial, contemplative",
    sensacao: "O mundo está rígido mas a abrir.",
    caption: "Hoje o mar partiu-se. Isso também é começar.",
    color: "#23295A", audioUrl: null,
  },
  {
    day: 3, slug: "casa-de-passaros", name: "Casa-de-Pássaros", hour: "05:48",
    place: "Sala vazia de uma casa antiga onde a floresta entrou.",
    layers: [
      "Coro de passarada longe, filtrado como por janela",
      "Chão de madeira a estalar lento",
      "Cortina ao vento em ritmo irregular",
      "Relógio de parede muito longe",
      "Pó a assentar (white noise ténue)",
    ],
    sunoPrompt: "Empty old wooden room with distant filtered birdsong as if heard through a closed window, slow creaking wooden floor, fabric curtain in irregular wind, faint distant wall clock ticking, gentle dust hiss, ambient soundscape, no vocals, instrumental, 3 minutes, intimate, domestic, nostalgic",
    sensacao: "Estás dentro mas a floresta sabe.",
    caption: "A casa amanhece antes de ti. Deixa-a.",
    color: "#2A2F6A", audioUrl: null,
  },
  {
    day: 4, slug: "areia-quente", name: "Areia-Quente", hour: "06:01",
    place: "Deserto que respira ao primeiro calor.",
    layers: [
      "Vento baixo constante sobre areia",
      "Areia a deslizar em pequenas avalanches",
      "Tambor de madeira (uma batida cada 60s)",
      "Insecto único do deserto",
      "Sopro grave de duna",
    ],
    sunoPrompt: "Desert soundscape at first light, low constant wind over sand, occasional small sand avalanches, single wooden frame drum hit once per minute, single distant desert insect, deep dune breath drone, no vocals, instrumental, 3 minutes, expansive, dry, slow",
    sensacao: "O tempo não tem pressa.",
    caption: "O deserto não acorda. Lembra-se.",
    color: "#33347A", audioUrl: null,
  },
  {
    day: 5, slug: "lago-sino", name: "Lago-Sino", hour: "06:09",
    place: "Lago alpino com sinos esquecidos no fundo.",
    layers: [
      "Gota grande em água profunda (a cada 12s)",
      "Sino submerso ressonante (cauda longa)",
      "Hálito frio em ar mais frio",
      "Eco de montanha contida",
      "Drone azul (synth pad muito ténue)",
    ],
    sunoPrompt: "Alpine lake at dawn, large water drop into deep water every 12 seconds, submerged bell with long resonance tail, cold breath in colder air, contained mountain echo, faint blue synth pad drone, ambient soundscape, no vocals, instrumental, 3 minutes, cold, sacred, still",
    sensacao: "O frio é uma forma de presença.",
    caption: "O sino tocou. Ninguém o ouviu. Tu ouviste.",
    color: "#3A3A85", audioUrl: null,
  },
  {
    day: 6, slug: "musgo-verde", name: "Musgo-Verde", hour: "06:14",
    place: "Bosque depois da chuva, antes do primeiro pássaro acordar a sério.",
    layers: [
      "Gotas em folhas largas (irregulares)",
      "Terra húmida (drone orgânico baixo)",
      "Pássaro único, hesitante",
      "Galho a estalar de vez em quando",
      "Vento médio no alto",
    ],
    sunoPrompt: "Wet forest soundscape after rain, irregular drops falling on broad leaves, low organic earth drone, single hesitant bird call, occasional branch crack, mid-level canopy wind, ambient field recording, no vocals, instrumental, 3 minutes, green, humid, alive",
    sensacao: "Algo respira contigo.",
    caption: "A floresta também acabou de acordar. Vão devagar juntas.",
    color: "#43428E", audioUrl: null,
  },
  {
    day: 7, slug: "vento-vidro", name: "Vento-Vidro", hour: "06:22",
    place: "Encosta onde alguém pendurou centenas de pequenos vidros.",
    layers: [
      "Vidros pequenos a tocar-se ao vento",
      "Vento médio direccional",
      "Sopro nasal humano longe (mmm sem palavra)",
      "Eco de vale aberto",
      "Drone agudo cristalino",
    ],
    sunoPrompt: "Hillside with hundreds of small glass chimes in the wind, gentle high-frequency clinking, directional medium wind, distant human nasal hum (no words), open valley echo, faint crystalline high drone, ambient soundscape, no vocals beyond hum, instrumental, 3 minutes, fragile, luminous",
    sensacao: "O ar tem coisas que tu não vês.",
    caption: "Não é vento. É o vento a tocar coisas.",
    color: "#4D4A98", audioUrl: null,
  },
  {
    day: 8, slug: "po-de-estrelas", name: "Pó-de-Estrelas", hour: "06:28",
    place: "O céu antes de escolher azul.",
    layers: [
      "Sintetizador granular (textura de pó)",
      "Último grilo da noite",
      "Brisa muito leve",
      "Eco vasto sem fonte",
      "Sub-grave quase inaudível",
    ],
    sunoPrompt: "Pre-dawn sky soundscape, granular synthesizer dust texture, last cricket of the night, very light breeze, vast formless reverb, almost inaudible sub-bass, ambient meditation, no vocals, instrumental, 3 minutes, cosmic, fading dark, fragile",
    sensacao: "Estás entre dois mundos.",
    caption: "Ainda não é dia. Já não é noite. Aqui.",
    color: "#5750A0", audioUrl: null,
  },
  {
    day: 9, slug: "pedra-que-canta", name: "Pedra-Que-Canta", hour: "06:33",
    place: "Vale de pedra que ressoa quando o sol bate.",
    layers: [
      "Nota grave de pedra (tom de singing bowl baixo)",
      "Insectos a despertar (crescendo lentíssimo)",
      "Eco amplo",
      "Pássaro com chamada metálica",
      "Vento mineral",
    ],
    sunoPrompt: "Stone valley resonating at sunrise, low rock-like singing bowl note, insects very slowly waking in crescendo, wide canyon echo, metallic-sounding bird call, mineral wind, ambient soundscape, no vocals, instrumental, 3 minutes, ancient, geological, warm rising",
    sensacao: "A pedra reconhece-te.",
    caption: "Há sítios que cantam só quando os deixas.",
    color: "#6158A8", audioUrl: null,
  },
  {
    day: 10, slug: "pinheiral", name: "Pinheiral", hour: "06:39",
    place: "Floresta densa de pinheiros, manhã ainda fria.",
    layers: [
      "Vento alto nas copas (textura quase oceânica)",
      "Agulhas de pinheiro a cair",
      "Corvo único, longe",
      "Tronco a ranger",
      "Chão de agulhas a abafar tudo",
    ],
    sunoPrompt: "Dense pine forest in cold morning, high wind in pine canopy like distant ocean, soft falling pine needles, single distant raven, creaking pine trunk, muffled needle-covered ground, ambient field recording, no vocals, instrumental, 3 minutes, resin, quiet, vertical",
    sensacao: "O frio é alto.",
    caption: "Os pinheiros pensam diferente. Mais devagar.",
    color: "#6B60AE", audioUrl: null,
  },
  {
    day: 11, slug: "ondas-lentas", name: "Ondas-Lentas", hour: "06:45",
    place: "Praia em hora morta, ninguém ainda.",
    layers: [
      "Ondas de 15s (longas, espumadas)",
      "Espuma a recolher na areia",
      "Sino de barco muito longe",
      "Gaivota a passar uma vez",
      "Sub-grave do oceano",
    ],
    sunoPrompt: "Empty beach at dead morning hour, 15-second long foaming waves, foam receding into sand, very distant boat bell, single seagull passing once, deep ocean sub-bass, ambient soundscape, no vocals, instrumental, 3 minutes, vast, salt, patient",
    sensacao: "O mar não te conhece. Tudo bem.",
    caption: "Hoje o mar tem-te à hora errada. A melhor.",
    color: "#7568B4", audioUrl: null,
  },
  {
    day: 12, slug: "salgueiro", name: "Salgueiro", hour: "06:51",
    place: "Rio lento com salgueiros que tocam a água.",
    layers: [
      "Corrente baixa contínua",
      "Folhas a roçar a superfície da água",
      "Flauta de bambu solta (notas dispersas)",
      "Pássaro de margem",
      "Madeira molhada a estalar",
    ],
    sunoPrompt: "Slow river with willow trees touching the water, continuous low current, leaves brushing water surface, scattered bamboo flute notes not forming melody, riverbank bird, occasional wet wood creak, ambient soundscape, no vocals, instrumental, 3 minutes, flowing, soft, eastern hint",
    sensacao: "As coisas passam e ficam.",
    caption: "O salgueiro vergou. Não partiu.",
    color: "#7F70B9", audioUrl: null,
  },
  {
    day: 13, slug: "bicarbonato", name: "Bicarbonato", hour: "06:57",
    place: "Um copo gigante com geleira a derreter dentro.",
    layers: [
      "Estalos de gelo (frequências altas, secos)",
      "Bolhas a libertarem-se (texturizadas)",
      "Água a deslocar-se em massa grande",
      "Eco metálico de recipiente",
      "Drone agudo \"frio\"",
    ],
    sunoPrompt: "Giant glass container holding melting glacier, sharp dry high-frequency ice cracks, textured bubble releases, large mass of water shifting, metallic container echo, cold high drone, ambient soundscape, no vocals, instrumental, 3 minutes, crystalline, weird, cold and fizzy",
    sensacao: "Estranho. E acorda-te.",
    caption: "Nem todos os sons servem para adormecer.",
    color: "#8978BD", audioUrl: null,
  },
  {
    day: 14, slug: "trigo-alto", name: "Trigo-Alto", hour: "07:03",
    place: "Campo de trigo onde só se vê o céu.",
    layers: [
      "Trigo a roçar trigo (vento direccional)",
      "Cotovia (chamada solta, alta)",
      "Vento que muda direcção a meio",
      "Insecto único próximo",
      "Sub-grave morno da terra a aquecer",
    ],
    sunoPrompt: "Tall wheat field where only sky is visible, wheat brushing wheat in directional wind, single skylark call high above, wind shifting direction mid-piece, single nearby insect, warm sub-bass of dry earth warming, ambient soundscape, no vocals, instrumental, 3 minutes, golden, horizontal, wide",
    sensacao: "O céu fica mais alto.",
    caption: "O trigo sabe quando o vento muda. Tu também.",
    color: "#937FC0", audioUrl: null,
  },
  {
    day: 15, slug: "manha-cinza", name: "Manhã-Cinza", hour: "07:08",
    place: "Rua de cidade ainda sem carros, antes do primeiro autocarro.",
    layers: [
      "Chuva fininha numa rua paralela (longe)",
      "Pombo a arrulhar perto",
      "Sino de igreja muito longe (uma vez)",
      "Janela a abrir três andares acima",
      "Drone urbano baixíssimo",
    ],
    sunoPrompt: "City street before first bus, faint rain in a parallel street far away, close cooing pigeon, single distant church bell once, window opening three floors above, very low urban drone, ambient soundscape, no vocals, instrumental, 3 minutes, grey, intimate city, before-traffic",
    sensacao: "A cidade ainda é tua.",
    caption: "Antes do primeiro autocarro a cidade é outra cidade.",
    color: "#9D87C2", audioUrl: null,
  },
  {
    day: 16, slug: "catedral-floresta", name: "Catedral-Floresta", hour: "07:14",
    place: "Floresta antiga com eco de nave.",
    layers: [
      "Eco alto (reverb grande)",
      "Gota pesada a cada 20s",
      "Três aves longe a sobreporem-se (coro sem palavra)",
      "Folha a cair contra folha",
      "Drone órgão muito ténue, filtrado",
    ],
    sunoPrompt: "Ancient forest with cathedral-like high reverb, heavy water drop every 20 seconds, three distant overlapping bird calls like wordless choir, leaf falling against leaf, very faint filtered church organ drone as if rising from roots, ambient soundscape, no vocals, instrumental, 3 minutes, sacred, towering, slow",
    sensacao: "Algo é maior do que tu, e está bem.",
    caption: "Há florestas que rezam sozinhas.",
    color: "#A78FC3", audioUrl: null,
  },
  {
    day: 17, slug: "vulcao-frio", name: "Vulcão-Frio", hour: "07:19",
    place: "Cratera apagada cheia de musgo, vapor a sair.",
    layers: [
      "Vapor a sair de fissuras (white noise quente)",
      "Gota lenta em rocha porosa",
      "Drone subterrâneo (textura viva)",
      "Pássaro raro de altitude",
      "Pedra a deslocar-se uma vez",
    ],
    sunoPrompt: "Dormant moss-filled volcanic crater with steam venting, warm white-noise steam from fissures, slow drops on porous rock, living subterranean drone, rare high-altitude bird, single stone shifting once, ambient soundscape, no vocals, instrumental, 3 minutes, geothermal, patient, slightly uneasy",
    sensacao: "Dorme calor por baixo.",
    caption: "O que parece apagado pode só estar a respirar fundo.",
    color: "#B197C3", audioUrl: null,
  },
  {
    day: 18, slug: "areia-branca", name: "Areia-Branca", hour: "07:24",
    place: "Duna num planeta paralelo, ar muito limpo.",
    layers: [
      "Vento muito limpo (sem partículas)",
      "Cristal a aquecer em pulsos lentos",
      "Respiração humana muito leve",
      "Eco amplo de espaço aberto",
      "Drone agudo metálico",
    ],
    sunoPrompt: "White dune on a parallel planet, very clean particle-free wind, faint high-frequency crystal warming in slow pulses, very light human breathing hum, wide open-space echo, metallic high drone, ambient soundscape, minimal vocals just breath, instrumental, 3 minutes, otherworldly, white, ascending",
    sensacao: "Estás em sítio nenhum, é leve.",
    caption: "Há manhãs que parecem de outro planeta. Vai a fundo.",
    color: "#BC9FC2", audioUrl: null,
  },
  {
    day: 19, slug: "bambu", name: "Bambu", hour: "07:30",
    place: "Floresta de bambu na neblina.",
    layers: [
      "Bambu a estalar com humidade",
      "Bambu oco a tocar bambu (percussão natural)",
      "Pássaro escondido, chamada curta",
      "Gota grossa em folha de bambu",
      "Drone neblina (mid-low)",
    ],
    sunoPrompt: "Bamboo forest in mist, irregular bamboo cracks from humidity, hollow bamboo striking bamboo as natural percussion, hidden short bird call, thick drop on bamboo leaf, mid-low mist drone texture, ambient field recording, no vocals, instrumental, 3 minutes, green, vertical, eastern, foggy",
    sensacao: "Estás dentro de algo verde e oco.",
    caption: "O bambu canta sozinho. Tu só ouves.",
    color: "#C6A7C0", audioUrl: null,
  },
  {
    day: 20, slug: "mar-de-cima", name: "Mar-de-Cima", hour: "07:35",
    place: "Penhasco alto, o mar visto de longe.",
    layers: [
      "Ondas sem grave (ouvidas de cima)",
      "Gaivota única, alta",
      "Vento de altura (constante, firme)",
      "Eco de penhasco",
      "Drone de espaço aberto",
    ],
    sunoPrompt: "High cliff overlooking distant sea, waves heard from above without bass, single high seagull call, constant firm high-altitude wind, cliff face echo, open-space drone, ambient soundscape, no vocals, instrumental, 3 minutes, vertiginous, salt-wind, expansive",
    sensacao: "Estás acima.",
    caption: "Há manhãs em que se olha de cima. Sem julgar.",
    color: "#CFAFBC", audioUrl: null,
  },
  {
    day: 21, slug: "telhado", name: "Telhado", hour: "07:40",
    place: "Quarto debaixo de telhado de zinco, chuva fininha lá fora.",
    layers: [
      "Pingos irregulares em zinco",
      "Chaleira a aquecer muito longe (assobio ténue)",
      "Cobertor a deslizar (textura curta)",
      "Pássaro de cidade na caleira",
      "Drone interior (quarto fechado)",
    ],
    sunoPrompt: "Bedroom under zinc roof with fine rain outside, irregular drops on metal, faint distant kettle warming whistle, short fabric blanket shift, city bird in gutter, interior closed-room drone, ambient soundscape, no vocals, instrumental, 3 minutes, domestic, warm, slow morning",
    sensacao: "Estás dentro e dentro está bem.",
    caption: "Ficar não é fugir. Hoje, é estar.",
    color: "#D7B7B6", audioUrl: null,
  },
  {
    day: 22, slug: "caverna-coral", name: "Caverna-Coral", hour: "07:45",
    place: "Caverna submarina ao amanhecer (luz a filtrar de cima).",
    layers: [
      "Água profunda abafada",
      "Corais a estalar (alta frequência subaquática)",
      "Baleia muito muito longe (uma chamada)",
      "Eco oco subaquático",
      "Drone azul-escuro profundo",
    ],
    sunoPrompt: "Underwater cave at dawn with light filtering from above, muffled deep water, high-frequency underwater coral crackles, single very distant whale call, hollow underwater echo, deep dark-blue drone, ambient soundscape, no vocals, instrumental, 3 minutes, submerged, cathedral-deep, alien",
    sensacao: "Tudo é mais lento debaixo.",
    caption: "Lá em baixo o tempo é outro. Vai lá um bocado.",
    color: "#DEC0AF", audioUrl: null,
  },
  {
    day: 23, slug: "loica", name: "Loiça", hour: "07:50",
    place: "Cozinha de casa de avó, manhã sem pressa.",
    layers: [
      "Chaleira a aquecer (assobio crescente muito lento)",
      "Colher a roçar caneca",
      "Pássaro fora à janela",
      "Voz humana sem palavras (mmm)",
      "Rádio muito longe, quarto fechado",
    ],
    sunoPrompt: "Grandmother's kitchen on unhurried morning, slowly rising kettle whistle, spoon brushing mug, bird outside window, wordless human humming doing something, very distant radio in a closed room, ambient soundscape, minimal hummed vocals, instrumental, 3 minutes, domestic, warm, tender",
    sensacao: "Estás cuidada por alguém invisível.",
    caption: "A casa cuida antes de quem cuida acordar.",
    color: "#E3C7A6", audioUrl: null,
  },
  {
    day: 24, slug: "campainhas-de-vento", name: "Campainhas-de-Vento", hour: "07:55",
    place: "Varanda com trinta campainhas diferentes.",
    layers: [
      "Campainhas de três tamanhos em afinação livre",
      "Brisa morna",
      "Cigarra a começar (uma, hesitante)",
      "Cortina interior a roçar",
      "Drone quente do dia a aquecer",
    ],
    sunoPrompt: "Balcony with thirty different wind chimes of three sizes in free tuning, warm breeze, single hesitant cicada beginning, interior curtain brush, warm drone of day heating up, ambient soundscape, no vocals, instrumental, 3 minutes, summery, bright, multi-pitched",
    sensacao: "O dia já é dia.",
    caption: "Hoje não preciso de melodia. Só de coisas a tocarem-se.",
    color: "#E7CE9D", audioUrl: null,
  },
  {
    day: 25, slug: "vinha", name: "Vinha", hour: "08:00",
    place: "Vinha em Outubro, manhã seca.",
    layers: [
      "Folhas secas a roçarem-se",
      "Pé em chão pedregoso (passo distante)",
      "Abelha próxima",
      "Vento médio constante",
      "Sino de aldeia muito longe (uma vez)",
    ],
    sunoPrompt: "October vineyard on dry morning, dry leaves brushing each other, distant footstep on stony ground, close bee, constant medium wind, single very distant village bell, ambient field recording, no vocals, instrumental, 3 minutes, golden-brown, harvest, dry",
    sensacao: "O ano está a fechar e estás bem.",
    caption: "Outubro também é uma forma de começar.",
    color: "#EAD494", audioUrl: null,
  },
  {
    day: 26, slug: "limoeiros", name: "Limoeiros", hour: "08:05",
    place: "Pomar de limoeiros, manhã morna.",
    layers: [
      "Abelhas a trabalhar (zumbido espacial, não denso)",
      "Fruto a cair no chão (raro, um por minuto)",
      "Vento médio",
      "Cão muito longe a ladrar uma vez",
      "Drone cítrico (textura quente)",
    ],
    sunoPrompt: "Lemon orchard on warm morning, bees working in spatial not dense buzz, fruit falling once per minute, medium wind, single very distant dog bark, warm citrus-textured drone, ambient soundscape, no vocals, instrumental, 3 minutes, sun-warmed, mediterranean, sweet",
    sensacao: "O sol tem cheiro.",
    caption: "Há sons que sabem a fruta.",
    color: "#EDDA8B", audioUrl: null,
  },
  {
    day: 27, slug: "caracol", name: "Caracol", hour: "08:10",
    place: "Jardim depois de chuva, ao nível do chão.",
    layers: [
      "Gota grande em poça pequena",
      "Folha a desdobrar (quase inaudível)",
      "Terra a beber água (drone orgânico baixo)",
      "Insecto a passar perto do microfone",
      "Pássaro um andar acima",
    ],
    sunoPrompt: "Garden after rain at ground level, large drop falling in small puddle, leaf unfurling almost inaudibly, earth drinking water as low organic drone, insect passing very close to microphone, bird one level above, ambient field recording, no vocals, instrumental, 3 minutes, microscopic, intimate, green",
    sensacao: "O pequeno também conta.",
    caption: "Hoje, sê pequena. Está tudo lá.",
    color: "#EFE082", audioUrl: null,
  },
  {
    day: 28, slug: "ferro-quente", name: "Ferro-Quente", hour: "08:15",
    place: "Forja antiga a acordar antes do ferreiro chegar.",
    layers: [
      "Metal a aquecer (drone vibrante, ténue)",
      "Brasa a estalar",
      "Sopro de fole muito devagar (5s por sopro)",
      "Gota de água em ferro quente",
      "Eco de oficina grande",
    ],
    sunoPrompt: "Old forge waking before the blacksmith arrives, faint vibrating drone of metal heating, crackling ember, very slow bellows breath every 5 seconds, water drop hitting hot iron, large workshop echo, ambient soundscape, no vocals, instrumental, 3 minutes, industrial-organic, hot, patient",
    sensacao: "Algo está a ganhar calor para ti.",
    caption: "Antes de fazer, aquece.",
    color: "#F1E579", audioUrl: null,
  },
  {
    day: 29, slug: "tear", name: "Tear", hour: "08:20",
    place: "Atelier com tear de madeira a começar o dia.",
    layers: [
      "Madeira a bater madeira (ritmo lento, irregular)",
      "Lã a roçar lã",
      "Pássaro de cidade na janela",
      "Sopro humano (a soprar o pó de algo)",
      "Rádio muito longe noutra divisão",
    ],
    sunoPrompt: "Workshop with wooden loom beginning the day, slow irregular wood-on-wood beats, wool brushing wool, city bird at window, single human breath blowing dust, very distant radio in another room, ambient soundscape, minimal breath vocals, instrumental, 3 minutes, artisanal, rhythmic-quiet, focused",
    sensacao: "Trabalho como meditação.",
    caption: "Há manhãs que se tecem.",
    color: "#F3EB70", audioUrl: null,
  },
  {
    day: 30, slug: "pao-quente", name: "Pão-Quente", hour: "08:25",
    place: "Padaria pequena antes de abrir ao público.",
    layers: [
      "Lenha a estalar dentro do forno (constante, suave)",
      "Faca a partir crosta dura (3 cortes ao todo)",
      "Conversa abafada na sala ao lado",
      "Saca de farinha a pousar",
      "Drone interior morno",
    ],
    sunoPrompt: "Small bakery before opening, constant gentle wood crackle inside oven, three hard crust knife cuts total, muffled wordless conversation in adjacent room, flour sack settling, warm interior drone, ambient soundscape, indistinct distant murmur only no real vocals, instrumental, 3 minutes, yeasty, warm, human",
    sensacao: "Outras pessoas já estão a tratar do dia.",
    caption: "Alguém já fez o pão. Recebe.",
    color: "#F5F067", audioUrl: null,
  },
  {
    day: 31, slug: "sol-cheio", name: "Sol-Cheio", hour: "08:30",
    place: "Pátio antigo com sol a bater por inteiro.",
    layers: [
      "Cigarras em coro (mediterrânico, denso mas espacial)",
      "Lagarto a passar em pedra (textura curta, seca)",
      "Vento parado (silêncio activo)",
      "Sino de aldeia a tocar uma vez (longe)",
      "Drone dourado quente",
    ],
    sunoPrompt: "Old courtyard in full sun, dense but spatial mediterranean cicada chorus, short dry lizard passing on stone, still wind active silence, single distant village bell once, warm golden drone, ambient soundscape, no vocals, instrumental, 3 minutes, sun-saturated, peak-morning, complete",
    sensacao: "Chegaste.",
    caption: "Trinta e um dias. Chegaste à manhã inteira.",
    color: "#F7F55E", audioUrl: null,
  },
];

export function getAlvaSound(slugOrDay: string): AlvaSound | undefined {
  const asNumber = Number(slugOrDay);
  if (Number.isFinite(asNumber)) {
    return ALVA_SOUNDS.find((s) => s.day === asNumber);
  }
  return ALVA_SOUNDS.find((s) => s.slug === slugOrDay);
}

export const ALVA_META = {
  title: "ALVA",
  tagline: "31 paisagens sonoras matinais",
  description:
    "Cada som é um lugar com nome próprio numa hora exacta do amanhecer (05:12 → 08:30). Combinações de elementos que não coexistem na natureza real.",
  accent: "#C9A96E",
  durationLabel: "2-3 min",
  totalDays: 31,
};
