/**
 * Calendário de Distribuição — Loranne
 *
 * 13 semanas temáticas, apenas álbuns com distribution: true.
 * A ordem das semanas é reordenável pelo utilizador (persistida em localStorage/Supabase).
 * Marcação de estado ao nível do álbum inteiro (não por faixa).
 */

export type ProductionWeek = {
  id: string;
  theme: string;
  description: string;
  albums: string[]; // slugs, por ordem
};

export const PRODUCTION_CALENDAR: ProductionWeek[] = [
  {
    id: "semana-1",
    theme: "Mulher Inteira",
    description: "ser mulher sem pedir desculpa — o que ninguém vê, o que se permite",
    albums: ["nua-inteira", "nua-por-dentro", "nua-boa", "nua-pele", "nua-so"],
  },
  {
    id: "semana-2",
    theme: "Amor Que Dói",
    description: "traição, erosão, o amor que ficou pequeno, o que não era amor",
    albums: ["nua-traco", "nua-nao-era-amor", "nua-pequeno-demais", "nua-romance", "nua-carta"],
  },
  {
    id: "semana-3",
    theme: "Maternidade",
    description: "o corpo que gera, o luto sem funeral, os pais que ficam",
    albums: ["sangue-mae", "sangue-o-que-nao-nasceu", "sangue-sombra-do-pai", "sangue-ventre", "eter-olhos-de-crianca"],
  },
  {
    id: "semana-4",
    theme: "Raiva & Sombra",
    description: "fogo engolido, cinzento, o espelho partido",
    albums: ["incenso-fogo-engolido", "incenso-cinzento", "incenso-pele-exposta", "incenso-espelho-partido", "incenso-ancora"],
  },
  {
    id: "semana-5",
    theme: "Saudade & Perda",
    description: "fotografia velha, luto, longe mas bem",
    albums: ["eter-fotografia-velha", "incenso-luto", "nua-longe-e-bem", "eter-sala-vazia", "eter-amanha-inventado"],
  },
  {
    id: "semana-6",
    theme: "Diáspora & Raiz",
    description: "sangue antigo, herança, o que corre nas veias",
    albums: ["sangue-raiz", "eter-raiz-vermelha", "eter-sangue-antigo", "sangue-linhagem", "sangue-mesmo-sangue"],
  },
  {
    id: "semana-7",
    theme: "Recomeço & Crescimento",
    description: "segunda vez, fissuras, o primeiro passo",
    albums: ["grao-segunda-vez", "incenso-raiz-muda", "incenso-teimosa", "incenso-rescaldo", "incenso-maos-abertas"],
  },
  {
    id: "semana-8",
    theme: "Ambição & Trabalho",
    description: "fome boa, moeda, o tear, insónia de quem constrói",
    albums: ["grao-fome-boa", "grao-moeda", "grao-insonia", "grao-o-tear", "grao-deriva"],
  },
  {
    id: "semana-9",
    theme: "Laços Femininos",
    description: "irmãs de sangue e de escolha, o amor entre mulheres",
    albums: ["sangue-irmas", "nua-duas-vozes", "sangue-mae", "incenso-diluvio-manso", "incenso-salto-bonito"],
  },
  {
    id: "semana-10",
    theme: "Corpo & Tempo",
    description: "corpo que envelhece, autocuidado, o prazer que é só teu",
    albums: ["nua-tempo-no-corpo", "nua-meu", "nua-corpo-a-corpo", "nua-beijo-na-testa", "nua-fogo-lento"],
  },
  {
    id: "semana-11",
    theme: "Alegria & Leveza",
    description: "férias, combustão, alegria que não pede licença",
    albums: ["grao-ferias", "grao-combustao", "grao-sem-motivo", "mare-viva", "incenso-salto-bonito"],
  },
  {
    id: "semana-12",
    theme: "Casa & Ritmo",
    description: "manhã, praia, abrigo, o sal na pele",
    albums: ["grao-primeira-luz", "grao-sal-na-pele", "grao-abrigo", "grao-pao-sal", "mare-lua-acordada"],
  },
  {
    id: "semana-13",
    theme: "Quietude & Maré",
    description: "silêncio fértil, companhia própria, a maré que não se controla",
    albums: ["incenso-silencio-fertil", "mare-companhia-propria", "mare-penumbra", "mare-tardes-vazias", "mare-brasa-lenta"],
  },
];
