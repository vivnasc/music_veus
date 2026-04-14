/**
 * Calendário de Distribuição — Loranne
 *
 * 13 semanas temáticas, 3 álbuns por semana (Seg/Qua/Sex).
 * Começa semana de 13 de abril de 2026.
 * Apenas álbuns com distribution: true.
 */

export type ProductionWeek = {
  id: string;
  theme: string;
  description: string;
  albums: {
    segunda: string;
    quarta: string;
    sexta: string;
  };
};

export const PRODUCTION_CALENDAR: ProductionWeek[] = [
  {
    id: "semana-1",
    theme: "Diáspora & Raiz",
    description: "de onde vim, o que corre nas veias, o orgulho da origem",
    albums: { segunda: "eter-raiz-vermelha", quarta: "sangue-raiz", sexta: "sangue-origem" },
  },
  {
    id: "semana-2",
    theme: "Mulher Inteira",
    description: "ser mulher sem pedir desculpa — o que ninguém vê, o que se permite",
    albums: { segunda: "nua-inteira", quarta: "nua-por-dentro", sexta: "nua-boa" },
  },
  {
    id: "semana-3",
    theme: "Mulher Inteira II",
    description: "solteira como estado completo, pele como história, o corpo que é só teu",
    albums: { segunda: "nua-pele", quarta: "nua-so", sexta: "nua-meu" },
  },
  {
    id: "semana-4",
    theme: "Amor Que Dói",
    description: "traição, erosão, o amor que ficou pequeno",
    albums: { segunda: "nua-traco", quarta: "nua-nao-era-amor", sexta: "nua-pequeno-demais" },
  },
  {
    id: "semana-5",
    theme: "Amor Que Dói II",
    description: "o que não era amor, cartas não enviadas, romance que murcha",
    albums: { segunda: "nua-romance", quarta: "nua-carta", sexta: "nua-longe-e-bem" },
  },
  {
    id: "semana-6",
    theme: "Maternidade",
    description: "o corpo que gera, o luto sem funeral, os pais que ficam",
    albums: { segunda: "sangue-mae", quarta: "sangue-o-que-nao-nasceu", sexta: "sangue-ventre" },
  },
  {
    id: "semana-7",
    theme: "Raiva & Sombra",
    description: "fogo engolido, cinzento, o espelho partido",
    albums: { segunda: "incenso-fogo-engolido", quarta: "incenso-cinzento", sexta: "incenso-pele-exposta" },
  },
  {
    id: "semana-8",
    theme: "Saudade & Perda",
    description: "fotografia velha, luto, sala vazia",
    albums: { segunda: "eter-fotografia-velha", quarta: "incenso-luto", sexta: "eter-sala-vazia" },
  },
  {
    id: "semana-9",
    theme: "Recomeço",
    description: "segunda vez, fissuras, o primeiro passo depois do fim",
    albums: { segunda: "grao-segunda-vez", quarta: "incenso-raiz-muda", sexta: "incenso-teimosa" },
  },
  {
    id: "semana-10",
    theme: "Ambição",
    description: "fome boa, moeda, o tear, insónia de quem constrói",
    albums: { segunda: "grao-fome-boa", quarta: "grao-moeda", sexta: "grao-insonia" },
  },
  {
    id: "semana-11",
    theme: "Corpo & Tempo",
    description: "corpo que envelhece, autocuidado, o prazer que é só teu",
    albums: { segunda: "nua-tempo-no-corpo", quarta: "nua-corpo-a-corpo", sexta: "nua-fogo-lento" },
  },
  {
    id: "semana-12",
    theme: "Alegria & Leveza",
    description: "férias, combustão, alegria que não pede licença",
    albums: { segunda: "grao-ferias", quarta: "grao-combustao", sexta: "mare-viva" },
  },
  {
    id: "semana-13",
    theme: "Quietude & Maré",
    description: "silêncio fértil, companhia própria, a maré que não se controla",
    albums: { segunda: "incenso-silencio-fertil", quarta: "mare-companhia-propria", sexta: "mare-brasa-lenta" },
  },
];
