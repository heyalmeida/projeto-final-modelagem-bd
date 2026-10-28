/** Configuração global do produto (nome, período letivo, regras de aprovação). */
export const siteConfig = {
  name: "EduGestor",
  tagline: "Gestão acadêmica",
  description:
    "Plataforma acadêmica modular: avaliações, financeiro, presença, agenda e biblioteca conectados pela mesma matrícula.",
  period: "2026/2",
  /** Data de referência da demonstração (usada nas janelas de avaliação e cobranças). */
  today: "2026-10-28T12:00:00",
  /** Recorte usado nos painéis de "próximos compromissos". */
  upcomingFrom: "2026-10-27",
  /** Competência padrão ao lançar uma nova cobrança. */
  currentCompetencia: "2026-10",
  /** Dia padrão sugerido nos formulários com data. */
  todayDate: "2026-10-28",
  approval: {
    minGrade: 6,
    minAttendance: 75,
  },
  storage: {
    dataKey: "edugestor.state.v1",
    sessionKey: "edugestor.session.v1",
  },
} as const;