"""Gera as páginas Draw.io do EduGestor (ER e Classes) por módulo."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "diagramas" / "drawio"
XML_OUT = ROOT / "docs" / "diagramas" / "xml"

PALETTE = {
    "acesso": ("#dae8fc", "#6c8ebf"),
    "academico": ("#d5e8d4", "#82b366"),
    "avaliacoes": ("#e1d5e7", "#9673a6"),
    "financeiro": ("#fff2cc", "#d6b656"),
    "presenca": ("#ffe6cc", "#d79b00"),
    "agenda": ("#b1ddf0", "#10739e"),
    "biblioteca": ("#f5f5f5", "#666666"),
}

# (nome, tipo, marcação) — marcação: PK, FK, UK, PK,FK
ENTITIES: dict[str, dict] = {
    # Núcleo de acesso
    "papel": {
        "table": "PAPEL",
        "module": "acesso",
        "attrs": [("id_papel", "int", "PK"), ("nome", "string", "UK"), ("descricao", "string", "")],
        "methods": ["+possuiPermissao(permissao): bool"],
    },
    "grupo": {
        "table": "GRUPO",
        "module": "acesso",
        "attrs": [
            ("id_grupo", "int", "PK"),
            ("nome", "string", "UK"),
            ("descricao", "string", ""),
            ("ativo", "boolean", ""),
        ],
        "methods": ["+adicionarUsuario(usuario)", "+habilitarModulo(modulo)"],
    },
    "usuario": {
        "table": "USUARIO",
        "module": "acesso",
        "attrs": [
            ("id_usuario", "int", "PK"),
            ("id_grupo", "int", "FK"),
            ("id_papel", "int", "FK"),
            ("nome", "string", ""),
            ("email", "string", "UK"),
            ("senha_hash", "string", ""),
            ("ativo", "boolean", ""),
            ("criado_em", "datetime", ""),
        ],
        "methods": ["+autenticar(email, senha): bool", "+possuiModulo(codigo): bool"],
    },
    "modulo": {
        "table": "MODULO",
        "module": "acesso",
        "attrs": [
            ("id_modulo", "int", "PK"),
            ("codigo", "string", "UK"),
            ("nome", "string", ""),
            ("descricao", "string", ""),
            ("ativo", "boolean", ""),
        ],
        "methods": ["+habilitarPara(grupo, responsavel)", "+desabilitarPara(grupo)"],
    },
    "grupo_modulo": {
        "table": "GRUPO_MODULO",
        "module": "acesso",
        "attrs": [
            ("id_grupo", "int", "PK,FK"),
            ("id_modulo", "int", "PK,FK"),
            ("habilitado_em", "datetime", ""),
            ("id_usuario_habilitou", "int", "FK"),
        ],
        "methods": ["+registrarHabilitacao()"],
    },
    # Base acadêmica
    "curso": {
        "table": "CURSO",
        "module": "academico",
        "attrs": [
            ("id_curso", "int", "PK"),
            ("id_professor_coordenador", "int", "FK"),
            ("nome", "string", ""),
            ("codigo", "string", "UK"),
            ("carga_horaria", "int", ""),
            ("modalidade", "string", ""),
            ("ativo", "boolean", ""),
        ],
        "methods": ["+adicionarTurma(turma)", "+possuiAluno(aluno): bool"],
    },
    "aluno": {
        "table": "ALUNO",
        "module": "academico",
        "attrs": [
            ("id_aluno", "int", "PK"),
            ("id_usuario", "int", "FK,UK"),
            ("id_curso", "int", "FK"),
            ("ra", "string", "UK"),
            ("data_ingresso", "date", ""),
            ("situacao", "string", ""),
        ],
        "methods": ["+matricular(turma): Matricula", "+consultarHistorico()"],
    },
    "professor": {
        "table": "PROFESSOR",
        "module": "academico",
        "attrs": [
            ("id_professor", "int", "PK"),
            ("id_usuario", "int", "FK,UK"),
            ("siape", "string", "UK"),
            ("titulacao", "string", ""),
            ("area_atuacao", "string", ""),
        ],
        "methods": ["+ministrarSessao(sessao)", "+lancarNota(tentativa, valor)"],
    },
    "turma": {
        "table": "TURMA",
        "module": "academico",
        "attrs": [
            ("id_turma", "int", "PK"),
            ("id_curso", "int", "FK"),
            ("id_professor", "int", "FK"),
            ("codigo", "string", ""),
            ("periodo_letivo", "string", ""),
            ("turno", "string", ""),
            ("vagas", "int", ""),
            ("status", "string", ""),
        ],
        "methods": ["+possuiVaga(): bool", "+abrirMatricula()"],
    },
    "matricula": {
        "table": "MATRICULA",
        "module": "academico",
        "attrs": [
            ("id_matricula", "int", "PK"),
            ("id_aluno", "int", "FK"),
            ("id_turma", "int", "FK"),
            ("data_matricula", "datetime", ""),
            ("status", "string", ""),
            ("nota_final", "decimal", ""),
            ("frequencia", "decimal", ""),
        ],
        "methods": ["+trancar()", "+cancelar()", "+calcularFrequencia(): decimal"],
    },
    # Avaliações
    "avaliacao": {
        "table": "AVALIACAO",
        "module": "avaliacoes",
        "attrs": [
            ("id_avaliacao", "int", "PK"),
            ("id_turma", "int", "FK"),
            ("id_professor", "int", "FK"),
            ("titulo", "string", ""),
            ("tipo", "string", ""),
            ("peso", "decimal", ""),
            ("data_inicio", "datetime", ""),
            ("data_fim", "datetime", ""),
            ("status", "string", ""),
        ],
        "methods": ["+estaAberta(): bool", "+calcularMedia(): decimal"],
    },
    "gestao_avaliacao": {
        "table": "GESTAO_AVALIACAO",
        "module": "avaliacoes",
        "attrs": [
            ("id_gestao", "int", "PK"),
            ("id_avaliacao", "int", "FK,UK"),
            ("id_professor", "int", "FK"),
            ("max_tentativas", "int", ""),
            ("permite_recuperacao", "boolean", ""),
            ("peso_recuperacao", "decimal", ""),
            ("divulgada_em", "datetime", ""),
            ("status", "string", ""),
        ],
        "methods": ["+configurar(prazo, tentativas)", "+divulgarNotas()"],
    },
    "questao": {
        "table": "QUESTAO",
        "module": "avaliacoes",
        "attrs": [
            ("id_questao", "int", "PK"),
            ("id_avaliacao", "int", "FK"),
            ("enunciado", "string", ""),
            ("tipo", "string", ""),
            ("pontuacao", "decimal", ""),
            ("ordem", "int", ""),
        ],
        "methods": ["+validarResposta(resposta): bool"],
    },
    "alternativa": {
        "table": "ALTERNATIVA",
        "module": "avaliacoes",
        "attrs": [
            ("id_alternativa", "int", "PK"),
            ("id_questao", "int", "FK"),
            ("texto", "string", ""),
            ("correta", "boolean", ""),
            ("ordem", "int", ""),
        ],
        "methods": ["+marcarCorreta()"],
    },
    "tentativa": {
        "table": "TENTATIVA",
        "module": "avaliacoes",
        "attrs": [
            ("id_tentativa", "int", "PK"),
            ("id_avaliacao", "int", "FK"),
            ("id_matricula", "int", "FK"),
            ("numero", "int", ""),
            ("inicio", "datetime", ""),
            ("fim", "datetime", ""),
            ("status", "string", ""),
            ("pontuacao", "decimal", ""),
        ],
        "methods": ["+iniciar()", "+finalizar()", "+calcularPontuacao(): decimal"],
    },
    "resposta_aluno": {
        "table": "RESPOSTA_ALUNO",
        "module": "avaliacoes",
        "attrs": [
            ("id_resposta", "int", "PK"),
            ("id_tentativa", "int", "FK"),
            ("id_questao", "int", "FK"),
            ("id_alternativa", "int", "FK"),
            ("texto_dissertativo", "string", ""),
            ("correta", "boolean", ""),
        ],
        "methods": ["+avaliar(): bool"],
    },
    # Financeiro
    "mensalidade": {
        "table": "MENSALIDADE",
        "module": "financeiro",
        "attrs": [
            ("id_mensalidade", "int", "PK"),
            ("id_matricula", "int", "FK"),
            ("competencia", "string", ""),
            ("valor", "decimal", ""),
            ("desconto", "decimal", ""),
            ("data_vencimento", "date", ""),
            ("status", "string", ""),
        ],
        "methods": ["+calcularSaldo(): decimal", "+estaVencida(): bool"],
    },
    "metodo_pagamento": {
        "table": "METODO_PAGAMENTO",
        "module": "financeiro",
        "attrs": [
            ("id_metodo", "int", "PK"),
            ("nome", "string", ""),
            ("tipo", "string", ""),
            ("taxa", "decimal", ""),
            ("ativo", "boolean", ""),
        ],
        "methods": ["+estaAtivo(): bool"],
    },
    "pagamento": {
        "table": "PAGAMENTO",
        "module": "financeiro",
        "attrs": [
            ("id_pagamento", "int", "PK"),
            ("id_mensalidade", "int", "FK"),
            ("id_metodo", "int", "FK"),
            ("id_usuario_registro", "int", "FK"),
            ("valor_pago", "decimal", ""),
            ("data_pagamento", "datetime", ""),
            ("status", "string", ""),
            ("comprovante", "string", ""),
        ],
        "methods": ["+registrar()", "+estornar(motivo)"],
    },
    # Presença
    "sessao": {
        "table": "SESSAO",
        "module": "presenca",
        "attrs": [
            ("id_sessao", "int", "PK"),
            ("id_turma", "int", "FK"),
            ("id_professor", "int", "FK"),
            ("data_sessao", "date", ""),
            ("hora_inicio", "time", ""),
            ("hora_fim", "time", ""),
            ("tema", "string", ""),
            ("status", "string", ""),
        ],
        "methods": ["+abrir()", "+encerrar()"],
    },
    "registro_presenca": {
        "table": "REGISTRO_PRESENCA",
        "module": "presenca",
        "attrs": [
            ("id_registro", "int", "PK"),
            ("id_sessao", "int", "FK"),
            ("id_matricula", "int", "FK"),
            ("id_usuario_registro", "int", "FK"),
            ("status", "string", ""),
            ("justificativa", "string", ""),
            ("registrado_em", "datetime", ""),
        ],
        "methods": ["+justificar(motivo)", "+alterarStatus(status)"],
    },
    # Agenda
    "evento": {
        "table": "EVENTO",
        "module": "agenda",
        "attrs": [
            ("id_evento", "int", "PK"),
            ("id_turma", "int", "FK"),
            ("id_professor_responsavel", "int", "FK"),
            ("titulo", "string", ""),
            ("tipo", "string", ""),
            ("data_inicio", "datetime", ""),
            ("data_fim", "datetime", ""),
            ("local", "string", ""),
            ("publico_alvo", "string", ""),
            ("status", "string", ""),
        ],
        "methods": ["+publicar()", "+cancelar(motivo)"],
    },
    "grade_horaria": {
        "table": "GRADE_HORARIA",
        "module": "agenda",
        "attrs": [
            ("id_grade", "int", "PK"),
            ("id_turma", "int", "FK"),
            ("id_professor", "int", "FK"),
            ("dia_semana", "string", ""),
            ("hora_inicio", "time", ""),
            ("hora_fim", "time", ""),
            ("componente", "string", ""),
            ("sala", "string", ""),
            ("vigencia_inicio", "date", ""),
            ("vigencia_fim", "date", ""),
            ("status", "string", ""),
        ],
        "methods": ["+possuiConflito(horario): bool", "+alterarHorario(horario)"],
    },
    "solicitacao_alteracao": {
        "table": "SOLICITACAO_ALTERACAO",
        "module": "agenda",
        "attrs": [
            ("id_solicitacao", "int", "PK"),
            ("id_grade", "int", "FK"),
            ("id_solicitante", "int", "FK"),
            ("id_aprovador", "int", "FK"),
            ("tipo", "string", ""),
            ("justificativa", "string", ""),
            ("data_solicitacao", "datetime", ""),
            ("data_aprovacao", "datetime", ""),
            ("status", "string", ""),
        ],
        "methods": ["+aprovar(aprovador)", "+rejeitar(motivo)"],
    },
    # Biblioteca
    "acervo": {
        "table": "ACERVO",
        "module": "biblioteca",
        "attrs": [
            ("id_acervo", "int", "PK"),
            ("id_responsavel", "int", "FK"),
            ("nome", "string", ""),
            ("descricao", "string", ""),
            ("area", "string", ""),
            ("ativo", "boolean", ""),
        ],
        "methods": ["+adicionarLivro(livro)", "+totalExemplares(): int"],
    },
    "livro": {
        "table": "LIVRO",
        "module": "biblioteca",
        "attrs": [
            ("id_livro", "int", "PK"),
            ("id_acervo", "int", "FK"),
            ("titulo", "string", ""),
            ("autor", "string", ""),
            ("isbn", "string", "UK"),
            ("editora", "string", ""),
            ("ano", "int", ""),
            ("area", "string", ""),
        ],
        "methods": ["+disponibilidade(): int"],
    },
    "exemplar": {
        "table": "EXEMPLAR",
        "module": "biblioteca",
        "attrs": [
            ("id_exemplar", "int", "PK"),
            ("id_livro", "int", "FK"),
            ("tombo", "string", "UK"),
            ("status", "string", ""),
            ("localizacao", "string", ""),
            ("data_aquisicao", "date", ""),
        ],
        "methods": ["+estaDisponivel(): bool", "+baixar(motivo)"],
    },
    "historico_busca": {
        "table": "HISTORICO_BUSCA",
        "module": "biblioteca",
        "attrs": [
            ("id_busca", "int", "PK"),
            ("id_usuario", "int", "FK"),
            ("termo", "string", ""),
            ("filtros", "string", ""),
            ("data_busca", "datetime", ""),
            ("qtd_resultados", "int", ""),
        ],
        "methods": ["+registrar()", "+listarPorUsuario(): list"],
    },
}

# Relações ER: (origem, linha_origem, destino, linha_destino, cardinalidade_origem, cardinalidade_destino)
ER_RELATIONS = {
    "acesso": [
        ("papel", "pk", "usuario", "fk_papel", "ERone", "ERmany"),
        ("grupo", "pk", "usuario", "fk_grupo", "ERone", "ERmany"),
        ("grupo", "pk", "grupo_modulo", "pk_grupo", "ERone", "ERmany"),
        ("modulo", "pk", "grupo_modulo", "pk_modulo", "ERone", "ERmany"),
        ("usuario", "pk", "grupo_modulo", "fk_usuario_habilitou", "ERone", "ERmany"),
    ],
    "academico": [
        ("usuario", "pk", "aluno", "fk_usuario", "ERone", "ERzeroToOne"),
        ("usuario", "pk", "professor", "fk_usuario", "ERone", "ERzeroToOne"),
        ("curso", "pk", "aluno", "fk_curso", "ERone", "ERmany"),
        ("curso", "pk", "turma", "fk_curso", "ERone", "ERmany"),
        ("professor", "pk", "turma", "fk_professor", "ERone", "ERmany"),
        ("professor", "pk", "curso", "fk_professor_coordenador", "ERzeroToOne", "ERmany"),
        ("aluno", "pk", "matricula", "fk_aluno", "ERone", "ERmany"),
        ("turma", "pk", "matricula", "fk_turma", "ERone", "ERmany"),
    ],
    "avaliacoes": [
        ("turma", "pk", "avaliacao", "fk_turma", "ERone", "ERmany"),
        ("professor", "pk", "avaliacao", "fk_professor", "ERone", "ERmany"),
        ("avaliacao", "pk", "gestao_avaliacao", "fk_avaliacao", "ERone", "ERone"),
        ("professor", "pk", "gestao_avaliacao", "fk_professor", "ERone", "ERmany"),
        ("avaliacao", "pk", "questao", "fk_avaliacao", "ERone", "ERmany"),
        ("questao", "pk", "alternativa", "fk_questao", "ERone", "ERmany"),
        ("avaliacao", "pk", "tentativa", "fk_avaliacao", "ERone", "ERmany"),
        ("matricula", "pk", "tentativa", "fk_matricula", "ERone", "ERmany"),
        ("tentativa", "pk", "resposta_aluno", "fk_tentativa", "ERone", "ERmany"),
        ("questao", "pk", "resposta_aluno", "fk_questao", "ERone", "ERmany"),
        ("alternativa", "pk", "resposta_aluno", "fk_alternativa", "ERzeroToOne", "ERmany"),
        ("turma", "pk", "matricula", "fk_turma", "ERone", "ERmany"),
    ],
    "financeiro": [
        ("matricula", "pk", "mensalidade", "fk_matricula", "ERone", "ERmany"),
        ("mensalidade", "pk", "pagamento", "fk_mensalidade", "ERone", "ERmany"),
        ("metodo_pagamento", "pk", "pagamento", "fk_metodo", "ERone", "ERmany"),
        ("aluno", "pk", "matricula", "fk_aluno", "ERone", "ERmany"),
        ("usuario", "pk", "pagamento", "fk_usuario_registro", "ERone", "ERmany"),
    ],
    "presenca": [
        ("turma", "pk", "sessao", "fk_turma", "ERone", "ERmany"),
        ("professor", "pk", "sessao", "fk_professor", "ERone", "ERmany"),
        ("sessao", "pk", "registro_presenca", "fk_sessao", "ERone", "ERmany"),
        ("matricula", "pk", "registro_presenca", "fk_matricula", "ERone", "ERmany"),
        ("turma", "pk", "matricula", "fk_turma", "ERone", "ERmany"),
        ("aluno", "pk", "matricula", "fk_aluno", "ERone", "ERmany"),
        ("professor", "pk", "turma", "fk_professor", "ERone", "ERmany"),
        ("usuario", "pk", "registro_presenca", "fk_usuario_registro", "ERone", "ERmany"),
    ],
    "agenda": [
        ("turma", "pk", "grade_horaria", "fk_turma", "ERone", "ERmany"),
        ("professor", "pk", "grade_horaria", "fk_professor", "ERone", "ERmany"),
        ("grade_horaria", "pk", "solicitacao_alteracao", "fk_grade", "ERone", "ERmany"),
        ("usuario", "pk", "solicitacao_alteracao", "fk_solicitante", "ERone", "ERmany"),
        ("usuario", "pk", "solicitacao_alteracao", "fk_aprovador", "ERzeroToOne", "ERmany"),
        ("turma", "pk", "evento", "fk_turma", "ERzeroToOne", "ERmany"),
        ("professor", "pk", "evento", "fk_professor_responsavel", "ERone", "ERmany"),
    ],
    "biblioteca": [
        ("acervo", "pk", "livro", "fk_acervo", "ERone", "ERmany"),
        ("livro", "pk", "exemplar", "fk_livro", "ERone", "ERmany"),
        ("usuario", "pk", "historico_busca", "fk_usuario", "ERone", "ERmany"),
        ("usuario", "pk", "acervo", "fk_responsavel", "ERone", "ERmany"),
    ],
}

# Relações de classe: (origem, destino, multiplicidade_origem, multiplicidade_destino, rótulo, tipo)
CLASS_RELATIONS = {
    "acesso": [
        ("papel", "usuario", "1", "0..*", "define", "association"),
        ("grupo", "usuario", "1", "0..*", "reúne", "association"),
        ("grupo", "grupo_modulo", "1", "0..*", "habilita", "association"),
        ("modulo", "grupo_modulo", "1", "0..*", "liberado", "association"),
        ("usuario", "grupo_modulo", "1", "0..*", "registra", "association"),
    ],
    "academico": [
        ("usuario", "aluno", "1", "0..1", "", "inheritance"),
        ("usuario", "professor", "1", "0..1", "", "inheritance"),
        ("curso", "aluno", "1", "0..*", "vincula", "association"),
        ("curso", "turma", "1", "0..*", "oferta", "association"),
        ("professor", "turma", "1", "0..*", "leciona", "association"),
        ("professor", "curso", "0..1", "0..*", "coordena", "association"),
        ("aluno", "matricula", "1", "0..*", "realiza", "association"),
        ("turma", "matricula", "1", "0..*", "recebe", "association"),
    ],
    "avaliacoes": [
        ("turma", "avaliacao", "1", "0..*", "possui", "association"),
        ("professor", "avaliacao", "1", "0..*", "cria", "association"),
        ("avaliacao", "gestao_avaliacao", "1", "1", "configura", "composition"),
        ("professor", "gestao_avaliacao", "1", "0..*", "gerencia", "association"),
        ("avaliacao", "questao", "1", "1..*", "compõe", "composition"),
        ("questao", "alternativa", "1", "0..*", "possui", "association"),
        ("avaliacao", "tentativa", "1", "0..*", "gera", "association"),
        ("matricula", "tentativa", "1", "0..*", "executa", "association"),
        ("tentativa", "resposta_aluno", "1", "0..*", "registra", "composition"),
        ("questao", "resposta_aluno", "1", "0..*", "recebe", "association"),
        ("alternativa", "resposta_aluno", "0..1", "0..*", "escolhida", "association"),
        ("turma", "matricula", "1", "0..*", "recebe", "association"),
    ],
    "financeiro": [
        ("matricula", "mensalidade", "1", "0..*", "gera", "association"),
        ("mensalidade", "pagamento", "1", "0..*", "recebe", "association"),
        ("metodo_pagamento", "pagamento", "1", "0..*", "classifica", "association"),
        ("aluno", "matricula", "1", "0..*", "realiza", "association"),
        ("usuario", "pagamento", "1", "0..*", "registra", "association"),
    ],
    "presenca": [
        ("turma", "sessao", "1", "0..*", "agenda", "association"),
        ("professor", "sessao", "1", "0..*", "conduz", "association"),
        ("sessao", "registro_presenca", "1", "0..*", "gera", "composition"),
        ("matricula", "registro_presenca", "1", "0..*", "recebe", "association"),
        ("turma", "matricula", "1", "0..*", "recebe", "association"),
        ("aluno", "matricula", "1", "0..*", "realiza", "association"),
        ("professor", "turma", "1", "0..*", "leciona", "association"),
        ("usuario", "registro_presenca", "1", "0..*", "registra", "association"),
    ],
    "agenda": [
        ("turma", "grade_horaria", "1", "0..*", "possui", "association"),
        ("professor", "grade_horaria", "1", "0..*", "ministra", "association"),
        ("grade_horaria", "solicitacao_alteracao", "1", "0..*", "recebe", "association"),
        ("usuario", "solicitacao_alteracao", "1", "0..*", "solicita", "association"),
        ("usuario", "solicitacao_alteracao", "0..1", "0..*", "aprova", "association"),
        ("turma", "evento", "0..1", "0..*", "participa", "association"),
        ("professor", "evento", "1", "0..*", "responde", "association"),
    ],
    "biblioteca": [
        ("acervo", "livro", "1", "1..*", "reúne", "composition"),
        ("livro", "exemplar", "1", "1..*", "possui", "composition"),
        ("usuario", "historico_busca", "1", "0..*", "realiza", "association"),
        ("usuario", "acervo", "1", "0..*", "responde", "association"),
    ],
}

# Layouts: página -> {entidade: (x, y)}
ER_LAYOUTS = {
    "acesso": {
        "papel": (40, 110),
        "usuario": (400, 110),
        "grupo": (760, 110),
        "modulo": (40, 430),
        "grupo_modulo": (400, 430),
    },
    "academico": {
        "usuario": (40, 110),
        "curso": (400, 110),
        "aluno": (760, 110),
        "professor": (400, 450),
        "turma": (760, 450),
        "matricula": (40, 450),
    },
    "avaliacoes": {
        "avaliacao": (40, 110),
        "gestao_avaliacao": (400, 110),
        "questao": (760, 110),
        "alternativa": (40, 440),
        "tentativa": (400, 440),
        "resposta_aluno": (760, 440),
        "turma": (40, 760),
        "matricula": (400, 760),
        "professor": (760, 760),
    },
    "financeiro": {
        "metodo_pagamento": (40, 110),
        "mensalidade": (400, 110),
        "pagamento": (760, 110),
        "matricula": (400, 450),
        "aluno": (760, 450),
        "usuario": (40, 450),
    },
    "presenca": {
        "sessao": (40, 110),
        "registro_presenca": (400, 110),
        "turma": (760, 110),
        "professor": (40, 450),
        "matricula": (400, 450),
        "aluno": (760, 450),
        "usuario": (400, 760),
    },
    "agenda": {
        "grade_horaria": (40, 110),
        "solicitacao_alteracao": (400, 110),
        "evento": (760, 110),
        "professor": (40, 450),
        "turma": (400, 450),
        "usuario": (760, 450),
    },
    "biblioteca": {
        "acervo": (40, 110),
        "livro": (400, 110),
        "exemplar": (760, 110),
        "historico_busca": (40, 450),
        "usuario": (400, 450),
    },
}

CLASS_LAYOUTS = {
    "acesso": {
        "papel": (40, 110),
        "grupo_modulo": (430, 110),
        "modulo": (820, 110),
        "usuario": (40, 440),
        "grupo": (430, 440),
    },
    "academico": {
        "usuario": (40, 110),
        "aluno": (430, 110),
        "matricula": (820, 110),
        "professor": (40, 460),
        "curso": (430, 460),
        "turma": (820, 460),
    },
    "avaliacoes": {
        "tentativa": (430, 110),
        "resposta_aluno": (820, 110),
        "matricula": (40, 110),
        "avaliacao": (430, 460),
        "turma": (40, 460),
        "questao": (820, 460),
        "gestao_avaliacao": (40, 810),
        "alternativa": (820, 810),
        "professor": (430, 810),
    },
    "financeiro": {
        "metodo_pagamento": (40, 110),
        "mensalidade": (430, 110),
        "matricula": (820, 110),
        "pagamento": (40, 470),
        "usuario": (430, 470),
        "aluno": (820, 470),
    },
    "presenca": {
        "registro_presenca": (40, 110),
        "sessao": (430, 110),
        "professor": (820, 110),
        "aluno": (40, 480),
        "matricula": (430, 480),
        "turma": (820, 480),
        "usuario": (40, 780),
    },
    "agenda": {
        "solicitacao_alteracao": (40, 110),
        "grade_horaria": (430, 110),
        "professor": (820, 110),
        "usuario": (40, 480),
        "turma": (430, 480),
        "evento": (820, 480),
    },
    "biblioteca": {
        "acervo": (40, 110),
        "livro": (430, 110),
        "exemplar": (820, 110),
        "historico_busca": (40, 480),
        "usuario": (430, 480),
    },
}

TITLES = {
    "acesso": "Núcleo de Acesso",
    "academico": "Base Acadêmica",
    "avaliacoes": "Módulo Avaliações",
    "financeiro": "Módulo Financeiro",
    "presenca": "Módulo Presença",
    "agenda": "Módulo Agenda",
    "biblioteca": "Módulo Biblioteca",
}

ER_COL_X = (40, 400, 760)
CL_COL_X = (40, 430, 820)
BOX_W = {"er": 220, "cl": 300}
PAGE_W = {"er": 1100, "cl": 1160}
GAP_LANE_MARGIN = 24  # folga nas laterais do vão entre colunas ao alocar pistas
CORRIDOR_PAD = 12     # folga vertical dentro do corredor entre faixas
PAGE_BOTTOM_PAD = 58  # espaço para a legenda abaixo da última tabela

ATTR_ROW_H = 24
TABLE_W = 220


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def camel(name: str) -> str:
    parts = name.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


def java_type(t: str) -> str:
    return {
        "int": "int",
        "string": "String",
        "boolean": "boolean",
        "date": "LocalDate",
        "datetime": "LocalDateTime",
        "time": "LocalTime",
        "decimal": "BigDecimal",
    }[t]


def er_table_height(entity: dict) -> int:
    return 26 + len(entity["attrs"]) * ATTR_ROW_H + 6


def row_attr(entity_key: str, row_key: str) -> str:
    """Converte 'pk', 'fk_turma' e 'pk_grupo' no nome real da coluna."""
    attrs = [a[0] for a in ENTITIES[entity_key]["attrs"]]
    if row_key in attrs:
        return row_key
    if row_key == "pk":
        for name, _typ, flags in ENTITIES[entity_key]["attrs"]:
            if "PK" in flags:
                return name
    if row_key.startswith("fk_"):
        candidate = "id_" + row_key[3:]
        if candidate in attrs:
            return candidate
        for name in attrs:
            if row_key[3:] in name:
                return name
    if row_key.startswith("pk_"):
        candidate = "id_" + row_key[3:]
        if candidate in attrs:
            return candidate
    raise KeyError(f"{entity_key}: coluna {row_key}")


def class_height(entity: dict) -> int:
    return 30 + len(entity["attrs"]) * 24 + 8 + len(entity["methods"]) * 24 + 8


def er_table(entity_key: str, x: int, y: int, module: str) -> list[str]:
    entity = ENTITIES[entity_key]
    fill, stroke = PALETTE[module]
    height = er_table_height(entity)
    eid = f"tbl_{entity_key}"
    cells = [
        f'<mxCell id="{eid}" value="{esc(entity["table"])}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontalStack=0;resizeParent=1;resizeParentMax=0;horizontal=1;startSize=26;collapsible=0;html=1;fontSize=13;fillColor={fill};strokeColor={stroke};fontColor=#1f2937;" vertex="1" parent="1">'
        f'<mxGeometry x="{x}" y="{y}" width="{TABLE_W}" height="{height}" as="geometry"/></mxCell>'
    ]
    for index, (name, _typ, flags) in enumerate(entity["attrs"]):
        prefix = ""
        if flags:
            prefix = f"{flags.replace(',', ', ')} "
        row_id = f"{eid}__{name}"
        cells.append(
            f'<mxCell id="{row_id}" value="{esc(prefix + name)}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=5;html=1;fontSize=12;fontColor=#111827;portConstraint=eastwest;" vertex="1" parent="{eid}">'
            f'<mxGeometry x="0" y="{26 + index * ATTR_ROW_H}" width="{TABLE_W}" height="{ATTR_ROW_H}" as="geometry"/></mxCell>'
        )
    return cells


def class_table(entity_key: str, x: int, y: int, module: str) -> list[str]:
    entity = ENTITIES[entity_key]
    fill, stroke = PALETTE[module]
    height = class_height(entity)
    cid = f"cls_{entity_key}"
    title = "".join(part.title() for part in entity_key.split("_"))
    cells = [
        f'<mxCell id="{cid}" value="{esc(title)}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontalStack=0;resizeParent=1;resizeParentMax=0;horizontal=1;startSize=30;collapsible=0;html=1;fontSize=14;fillColor={fill};strokeColor={stroke};fontColor=#1f2937;" vertex="1" parent="1">'
        f'<mxGeometry x="{x}" y="{y}" width="300" height="{height}" as="geometry"/></mxCell>'
    ]
    row_y = 30
    for name, typ, _flags in entity["attrs"]:
        cells.append(
            f'<mxCell id="{cid}__a_{name}" value="{esc("- " + camel(name) + ": " + java_type(typ))}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;html=1;fontSize=11;fontColor=#111827;" vertex="1" parent="{cid}">'
            f'<mxGeometry x="0" y="{row_y}" width="300" height="24" as="geometry"/></mxCell>'
        )
        row_y += 24
    cells.append(
        f'<mxCell id="{cid}__sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;html=1;" vertex="1" parent="{cid}">'
        f'<mxGeometry x="0" y="{row_y}" width="300" height="8" as="geometry"/></mxCell>'
    )
    row_y += 8
    for index, method in enumerate(entity["methods"]):
        cells.append(
            f'<mxCell id="{cid}__m_{index}" value="{esc(method)}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;html=1;fontSize=11;fontColor=#111827;" vertex="1" parent="{cid}">'
            f'<mxGeometry x="0" y="{row_y}" width="300" height="24" as="geometry"/></mxCell>'
        )
        row_y += 24
    return cells


# --------------------------------------------------------------- geometria

def page_geometry(kind: str, module: str):
    """Caixas absolutas, faixas (linhas de layout) e corredores livres da página."""
    layout = (ER_LAYOUTS if kind == "er" else CLASS_LAYOUTS)[module]
    xs = ER_COL_X if kind == "er" else CL_COL_X
    w = BOX_W[kind]
    boxes: dict[str, tuple] = {}
    for key, (x, y) in layout.items():
        h = er_table_height(ENTITIES[key]) if kind == "er" else class_height(ENTITIES[key])
        boxes[key] = (x, y, x + w, y + h)

    def col_of(x0: float) -> int:
        return min(range(3), key=lambda i: abs(xs[i] - x0))

    band_ys = sorted({b[1] for b in boxes.values()})
    band_of = {k: band_ys.index(b[1]) for k, b in boxes.items()}
    corridors: list[tuple[int, int]] = []
    for i in range(len(band_ys) - 1):
        bottom = max(b[3] for k, b in boxes.items() if band_of[k] == i)
        top = min(b[1] for k, b in boxes.items() if band_of[k] == i + 1)
        corridors.append((bottom, top))
    gap_x = [(xs[i] + w, xs[i + 1]) for i in range(2)]
    return boxes, corridors, gap_x, col_of


def er_anchor_y(entity_key: str, attr_name: str, y0: int) -> float:
    attrs = [a[0] for a in ENTITIES[entity_key]["attrs"]]
    index = attrs.index(attr_name)
    return y0 + 26 + index * ATTR_ROW_H + ATTR_ROW_H / 2


def build_routes(kind: str, module: str, boxes: dict, col_of) -> list[dict]:
    routes: list[dict] = []
    if kind == "er":
        for source, srow, target, trow, card_s, card_t in ER_RELATIONS[module]:
            s_attr = row_attr(source, srow)
            t_attr = row_attr(target, trow)
            sb, tb = boxes[source], boxes[target]
            routes.append({
                "id": f"rel_{source}_{srow}_{target}_{trow}",
                "source": f"tbl_{source}__{s_attr}",
                "target": f"tbl_{target}__{t_attr}",
                "value": "",
                "labels": [],
                "style": (
                    "edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;"
                    f"startArrow={card_s};startFill=0;endArrow={card_t};endFill=0;"
                    "strokeColor=#475569;strokeWidth=1.5;"
                ),
                "cls_kind": None,
                "sy": er_anchor_y(source, s_attr, sb[1]),
                "ty": er_anchor_y(target, t_attr, tb[1]),
                "sbox": sb, "tbox": tb,
                "scol": col_of(sb[0]), "tcol": col_of(tb[0]),
            })
    else:
        for index, (source, target, mult_s, mult_t, label, cls_kind) in enumerate(CLASS_RELATIONS[module]):
            sb, tb = boxes[source], boxes[target]
            if cls_kind == "inheritance":
                base = "edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;endArrow=block;endFill=0;strokeColor=#475569;strokeWidth=1.5;"
            elif cls_kind == "composition":
                base = "edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;startArrow=diamondThin;startFill=1;startSize=14;endArrow=none;strokeColor=#475569;strokeWidth=1.5;"
            else:
                base = "edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;endArrow=open;endFill=0;strokeColor=#475569;strokeWidth=1.5;"
            routes.append({
                "id": f"crel_{source}_{target}_{index}",
                "source": f"cls_{source}",
                "target": f"cls_{target}",
                "value": label,
                "labels": [] if cls_kind == "inheritance" else [
                    ("_src", mult_s, "left"),
                    ("_dst", mult_t, "right"),
                ],
                "style": base,
                "cls_kind": cls_kind,
                "sy": (sb[1] + sb[3]) / 2,
                "ty": (tb[1] + tb[3]) / 2,
                "sbox": sb, "tbox": tb,
                "scol": col_of(sb[0]), "tcol": col_of(tb[0]),
            })
    return routes


def _side(col: int, gap_index: int) -> str:
    """Lado da caixa que olha para o vão (gap i fica à direita da coluna i)."""
    return "R" if gap_index >= col else "L"


def _v_clear(boxes: dict, col_of, route: dict) -> bool:
    """Coluna vertical livre entre as duas caixas (para ligação reta cima/baixo)."""
    sb, tb = route["sbox"], route["tbox"]
    if route["scol"] != route["tcol"]:
        return False
    col = route["scol"]
    lo, hi = sorted((sb[3], tb[1]))
    for key, b in boxes.items():
        if col_of(b[0]) != col or b == sb or b == tb:
            continue
        if b[0] < sb[2] and b[2] > sb[0] and b[1] < hi and b[3] > lo:
            return False
    return True


def _pick_corridor(corridors: list, sy: float, ty: float) -> int:
    if not corridors:
        raise RuntimeError("rota em duas colunas sem corredor livre entre faixas")
    mid = (sy + ty) / 2
    return min(range(len(corridors)), key=lambda i: abs((corridors[i][0] + corridors[i][1]) / 2 - mid))


def plan_routes(routes: list[dict], boxes: dict, corridors: list, col_of) -> None:
    """Define forma da rota, âncoras e quais vãos/corredores cada ligação usa."""
    for r in routes:
        dcol = r["tcol"] - r["scol"]
        if r["cls_kind"] and dcol == 0 and _v_clear(boxes, col_of, r):
            target_below = r["tbox"][1] > r["sbox"][3]
            r["shape"] = "vstraight"
            r["sanchor"], r["tanchor"] = ("B", "T") if target_below else ("T", "B")
            continue
        if dcol == 0:
            gap = {0: 0, 1: 1, 2: 1}[r["scol"]]
            r["shape"] = "s"
            r["gaps"] = [gap]
            r["sanchor"] = _side(r["scol"], gap)
            r["tanchor"] = _side(r["tcol"], gap)
        elif abs(dcol) == 1:
            gap = min(r["scol"], r["tcol"])
            r["shape"] = "s"
            r["gaps"] = [gap]
            r["sanchor"] = _side(r["scol"], gap)
            r["tanchor"] = _side(r["tcol"], gap)
        else:
            gap_s = r["scol"] - 1 if dcol < 0 else r["scol"]
            gap_t = r["tcol"] if dcol < 0 else r["tcol"] - 1
            r["shape"] = "corridor"
            r["gaps"] = [gap_s, gap_t]
            r["corridor"] = _pick_corridor(corridors, r["sy"], r["ty"])
            r["sanchor"] = _side(r["scol"], gap_s)
            r["tanchor"] = _side(r["tcol"], gap_t)


def allocate_lanes(routes: list[dict], gap_x: list) -> None:
    """Distribui uma pista x distinta por ligação dentro de cada vão."""
    for gi in (0, 1):
        users = [r for r in routes if gi in r.get("gaps", [])]
        gx0, gx1 = gap_x[gi]
        lo, hi = gx0 + GAP_LANE_MARGIN, gx1 - GAP_LANE_MARGIN
        for i, r in enumerate(users):
            r.setdefault("lanes", {})[gi] = round(lo + (hi - lo) * (i + 1) / (len(users) + 1))


def allocate_corridors(routes: list[dict], corridors: list) -> None:
    for ci, (bottom, top) in enumerate(corridors):
        users = [r for r in routes if r.get("corridor") == ci]
        lo, hi = bottom + CORRIDOR_PAD, top - CORRIDOR_PAD
        for i, r in enumerate(users):
            r["cy"] = round(lo + (hi - lo) * (i + 1) / (len(users) + 1))


def _anchor_frag(prefix: str, anchor: str) -> str:
    vals = {"L": (0, 0.5), "R": (1, 0.5), "T": (0.5, 0), "B": (0.5, 1)}[anchor]
    return f"{prefix}X={vals[0]};{prefix}Y={vals[1]};{prefix}Dx=0;{prefix}Dy=0;"


def edge_points(r: dict) -> list[tuple]:
    if r["shape"] == "vstraight":
        return []
    if r["shape"] == "s":
        if abs(r["sy"] - r["ty"]) < 0.5:
            return []
        lane = r["lanes"][r["gaps"][0]]
        return [(lane, round(r["sy"])), (lane, round(r["ty"]))]
    gap_s, gap_t = r["gaps"]
    lane_s, lane_t = r["lanes"][gap_s], r["lanes"][gap_t]
    return [
        (lane_s, round(r["sy"])),
        (lane_s, r["cy"]),
        (lane_t, r["cy"]),
        (lane_t, round(r["ty"])),
    ]


def edge_cell(r: dict) -> list[str]:
    style = r["style"] + _anchor_frag("exit", r["sanchor"]) + _anchor_frag("entry", r["tanchor"])
    points = edge_points(r)
    points_xml = ""
    if points:
        inner = "".join(f'<mxPoint x="{x}" y="{y}"/>' for x, y in points)
        points_xml = f'<Array as="points">{inner}</Array>'
    cells = [
        f'<mxCell id="{r["id"]}" value="{esc(r["value"])}" style="{style}" edge="1" parent="1" source="{r["source"]}" target="{r["target"]}">'
        f'<mxGeometry relative="1" as="geometry">{points_xml}</mxGeometry></mxCell>'
    ]
    for suffix, text, align in r["labels"]:
        cells.append(
            f'<mxCell id="{r["id"]}{suffix}" value="{esc(text)}" style="edgeLabel;resizable=0;html=1;align={align};verticalAlign=bottom;fontSize=11;fontColor=#334155;" vertex="1" connectable="0" parent="{r["id"]}"><mxGeometry x="{-1 if suffix == "_src" else 1}" relative="1" as="geometry"/></mxCell>'
        )
    return cells


# ------------------------------------------------------------------ páginas

def _page_header_cells(kind: str, module: str, width: int) -> list[str]:
    fill, stroke = PALETTE[module]
    title = TITLES[module]
    prefix = "ER" if kind == "er" else "Classes"
    subtitle = (
        "EduGestor · modelo entidade-relacionamento · cardinalidades crow's foot · PK/FK/UK"
        if kind == "er"
        else "EduGestor · diagrama de classes UML · atributos, operações e multiplicidades"
    )
    return [
        f'<mxCell id="title" value="{prefix} — {esc(title)}" style="text;html=1;fontSize=22;fontStyle=1;align=left;verticalAlign=middle;fontColor=#0f172a;" vertex="1" parent="1"><mxGeometry x="40" y="24" width="700" height="32" as="geometry"/></mxCell>',
        f'<mxCell id="subtitle" value="{esc(subtitle)}" style="text;html=1;fontSize=11;align=left;verticalAlign=middle;fontColor=#64748b;" vertex="1" parent="1"><mxGeometry x="40" y="56" width="900" height="24" as="geometry"/></mxCell>',
        f'<mxCell id="badge" value="{esc(title)}" style="rounded=1;arcSize=50;html=1;fontSize=11;fontStyle=1;fillColor={fill};strokeColor={stroke};fontColor=#1f2937;align=center;verticalAlign=middle;" vertex="1" parent="1"><mxGeometry x="{width - 240}" y="26" width="200" height="28" as="geometry"/></mxCell>',
    ]


def _model_xml(width: int, height: int, cells: list[str]) -> str:
    return (
        f'<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{width}" pageHeight="{height}" math="0" shadow="0" background="#ffffff">'
        "<root>"
        '<mxCell id="0"/><mxCell id="1" parent="0"/>'
        + "".join(cells)
        + "</root></mxGraphModel>"
    )


def er_page(module: str) -> str:
    boxes, corridors, gap_x, col_of = page_geometry("er", module)
    routes = build_routes("er", module, boxes, col_of)
    plan_routes(routes, boxes, corridors, col_of)
    allocate_lanes(routes, gap_x)
    allocate_corridors(routes, corridors)
    width = PAGE_W["er"]
    height = max(b[3] for b in boxes.values()) + PAGE_BOTTOM_PAD
    cells = _page_header_cells("er", module, width)
    for entity_key, (x, y) in ER_LAYOUTS[module].items():
        cells.extend(er_table(entity_key, x, y, module))
    for r in routes:
        cells.extend(edge_cell(r))
    cells.append(
        f'<mxCell id="legend" value="PK chave primária · FK chave estrangeira · UK único · 1 : N / 0..1 : N conforme a ponta" style="text;html=1;fontSize=10;align=left;verticalAlign=middle;fontColor=#64748b;" vertex="1" parent="1"><mxGeometry x="40" y="{height - 34}" width="900" height="20" as="geometry"/></mxCell>'
    )
    return _model_xml(width, height, cells)


def class_page(module: str) -> str:
    boxes, corridors, gap_x, col_of = page_geometry("cl", module)
    routes = build_routes("cl", module, boxes, col_of)
    plan_routes(routes, boxes, corridors, col_of)
    allocate_lanes(routes, gap_x)
    allocate_corridors(routes, corridors)
    width = PAGE_W["cl"]
    height = max(b[3] for b in boxes.values()) + PAGE_BOTTOM_PAD
    cells = _page_header_cells("cl", module, width)
    for entity_key, (x, y) in CLASS_LAYOUTS[module].items():
        cells.extend(class_table(entity_key, x, y, module))
    for r in routes:
        cells.extend(edge_cell(r))
    cells.append(
        f'<mxCell id="legend" value="Multiplicidades: 1 · 0..1 · 0..* · 1..* · herança com triângulo vazio · composição com losango preenchido" style="text;html=1;fontSize=10;align=left;verticalAlign=middle;fontColor=#64748b;" vertex="1" parent="1"><mxGeometry x="40" y="{height - 34}" width="950" height="20" as="geometry"/></mxCell>'
    )
    return _model_xml(width, height, cells)


def wrap_drawio(name: str, diagram_id: str, model: str) -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<mxfile host="app.diagrams.net" agent="EduGestor" version="24.7.17" type="device">'
        f'<diagram id="{diagram_id}" name="{esc(name)}">{model}</diagram>'
        "</mxfile>"
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    XML_OUT.mkdir(parents=True, exist_ok=True)
    pages: list[tuple[str, str, str]] = []
    for module in ["acesso", "academico", "avaliacoes", "financeiro", "presenca", "agenda", "biblioteca"]:
        er_id = f"er-{module}"
        cl_id = f"cl-{module}"
        er_model = er_page(module)
        cl_model = class_page(module)
        er_name = f"ER {module.title()} — {TITLES[module]}"
        cl_name = f"Classes {module.title()} — {TITLES[module]}"
        (OUT / f"ER-{module}.drawio").write_text(wrap_drawio(er_name, er_id, er_model), encoding="utf-8")
        (OUT / f"CL-{module}.drawio").write_text(wrap_drawio(cl_name, cl_id, cl_model), encoding="utf-8")
        (XML_OUT / f"ER-{module}.xml").write_text(er_model, encoding="utf-8")
        (XML_OUT / f"CL-{module}.xml").write_text(cl_model, encoding="utf-8")
        pages.append((er_id, er_name, er_model))
        pages.append((cl_id, cl_name, cl_model))

    combined = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<mxfile host="app.diagrams.net" agent="EduGestor" version="24.7.17" type="device">'
        + "".join(
            f'<diagram id="{pid}" name="{esc(name)}">{model}</diagram>' for pid, name, model in pages
        )
        + "</mxfile>"
    )
    (OUT / "EduGestor-Diagramas.drawio").write_text(combined, encoding="utf-8")
    manifest = [
        {"id": pid, "name": name, "file": f"docs/diagramas/xml/{pid}.xml"} for pid, name, _ in pages
    ]
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(pages)} páginas geradas em {OUT}")


if __name__ == "__main__":
    main()
