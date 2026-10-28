"""Monta o PDF da entrega a partir dos documentos Markdown e dos SVGs do Draw.io."""

from __future__ import annotations

import html
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DIAGRAMS = DOCS / "diagramas" / "render"
OUT = DOCS / "Entrega-Modelagem-Educacional.pdf"
HTML_OUT = ROOT / "docs" / "entrega.html"

CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
PROFILE = Path(r"C:\Users\PedroMigueldeAlmeida\AppData\Local\Temp\chrome-edugestor-pdf")


def inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{html.escape(m.group(2))}">{m.group(1)}</a>',
        text,
    )
    return text


def convert_table(lines: list[str]) -> str:
    rows = []
    for line in lines:
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(cells)
    if not rows:
        return ""
    header, body = rows[0], rows[1:]
    if body and all(re.fullmatch(r":?-{2,}:?", c.replace(" ", "")) for c in body[0]):
        body = body[1:]
    out = ['<table><thead><tr>']
    out.extend(f"<th>{inline(c)}</th>" for c in header)
    out.append("</tr></thead><tbody>")
    for row in body:
        out.append("<tr>")
        out.extend(f"<td>{inline(c)}</td>" for c in row)
        out.append("</tr>")
    out.append("</tbody></table>")
    return "".join(out)


def markdown_to_html(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if stripped.startswith("```"):
            block = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                block.append(lines[i])
                i += 1
            i += 1
            out.append("<pre><code>" + html.escape("\n".join(block)) + "</code></pre>")
            continue
        if stripped.startswith("|") and i + 1 < len(lines) and lines[i + 1].strip().startswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            out.append(convert_table(table_lines))
            continue
        heading = re.match(r"^(#{1,4})\s+(.*)$", stripped)
        if heading:
            level = len(heading.group(1))
            text = inline(heading.group(2).rstrip("#").strip())
            out.append(f"<h{level}>{text}</h{level}>")
            i += 1
            continue
        if re.match(r"^[-*]\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i].strip()):
                items.append(inline(lines[i].strip()[2:].strip()))
                i += 1
            out.append("<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>")
            continue
        if re.match(r"^\d+\.\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                items.append(inline(re.sub(r"^\d+\.\s+", "", lines[i].strip())))
                i += 1
            out.append("<ol>" + "".join(f"<li>{x}</li>" for x in items) + "</ol>")
            continue
        if stripped.startswith(">"):
            quote = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote.append(inline(lines[i].strip()[1:].strip()))
                i += 1
            out.append("<blockquote>" + " ".join(quote) + "</blockquote>")
            continue
        para = [stripped]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{1,4}\s|[-*]\s|\d+\.\s|\||>|```)", lines[i].strip()):
            para.append(lines[i].strip())
            i += 1
        out.append("<p>" + inline(" ".join(para)) + "</p>")
    return "\n".join(out)


def doc_section(path: Path, anchor: str) -> str:
    body = markdown_to_html(path.read_text(encoding="utf-8"))
    return f'<section class="doc" id="{anchor}">{body}</section>'


ER_PAGES = [
    ("ER-acesso.svg", "ER 00 — Núcleo de Acesso", "Papel, Grupo, Usuario, Modulo e a associação GrupoModulo.", "Acesso"),
    ("ER-academico.svg", "ER 01 — Base Acadêmica", "Curso, Aluno, Professor, Turma e Matricula; os perfis herdam de Usuario.", "Acadêmico"),
    ("ER-avaliacoes.svg", "ER 02 — Avaliações", "Avaliacao, GestaoAvaliacao, Questao, Alternativa, Tentativa e RespostaAluno.", "Avaliações"),
    ("ER-financeiro.svg", "ER 03 — Financeiro", "Mensalidade, Pagamento e MetodoPagamento ligados à matrícula.", "Financeiro"),
    ("ER-presenca.svg", "ER 04 — Presença", "Sessao e RegistroPresenca com unicidade por sessão e matrícula.", "Presença"),
    ("ER-agenda.svg", "ER 05 — Agenda", "GradeHoraria, Evento e SolicitacaoAlteracao com aprovador opcional.", "Agenda"),
    ("ER-biblioteca.svg", "ER 06 — Biblioteca", "Acervo, Livro, Exemplar e HistoricoBusca.", "Biblioteca"),
]

CL_PAGES = [
    ("CL-acesso.svg", "Classes 00 — Núcleo de Acesso", "Papel, Grupo, Usuario, Modulo e GrupoModulo com operações de autorização.", "Acesso"),
    ("CL-academico.svg", "Classes 01 — Base Acadêmica", "Herança de Usuario, vínculo de Curso, Turma e Matricula.", "Acadêmico"),
    ("CL-avaliacoes.svg", "Classes 02 — Avaliações", "Configuração de gestão, questões, tentativas e respostas.", "Avaliações"),
    ("CL-financeiro.svg", "Classes 03 — Financeiro", "Mensalidade, Pagamento e MetodoPagamento com saldo e baixa.", "Financeiro"),
    ("CL-presenca.svg", "Classes 04 — Presença", "Sessao, RegistroPresenca e cálculo de frequência.", "Presença"),
    ("CL-agenda.svg", "Classes 05 — Agenda", "GradeHoraria, Evento e Solicitação de alteração.", "Agenda"),
    ("CL-biblioteca.svg", "Classes 06 — Biblioteca", "Acervo, Livro, Exemplar e Histórico de busca.", "Biblioteca"),
]


def diagram_page(svg_name: str, title: str, subtitle: str, module: str, kind: str) -> str:
    svg_path = DIAGRAMS / svg_name
    if not svg_path.exists():
        raise FileNotFoundError(svg_path)
    svg = svg_path.read_text(encoding="utf-8")
    svg = re.sub(r"<\?xml[^>]*\?>", "", svg).strip()
    return f"""<section class="diagram-page">
      <div class="diagram-head">
        <div><div class="diagram-kicker">{kind} · {html.escape(module)}</div><h2>{html.escape(title)}</h2><p>{html.escape(subtitle)}</p></div>
        <div class="diagram-brand">EduGestor</div>
      </div>
      <div class="diagram-frame">{svg}</div>
      <div class="diagram-foot"><span>EduGestor · modelo acadêmico modular</span><span>{html.escape(module)} · página {kind}</span></div>
    </section>"""


def build_html() -> str:
    tema = doc_section(DOCS / "TEMA_E_REGRAS.md", "tema")
    er_doc = doc_section(DOCS / "MODELO_ER.md", "er")
    cl_doc = doc_section(DOCS / "DIAGRAMA_CLASSES.md", "classes")
    er_pages = "\n".join(diagram_page(*p, "ER") for p in ER_PAGES)
    cl_pages = "\n".join(diagram_page(*p, "Classes") for p in CL_PAGES)

    cover = """<section class="cover">
      <div class="cover-grid"></div>
      <div class="cover-top"><div class="cover-brand"><span class="cover-mark">E</span><span>EduGestor</span></div><span class="cover-tag">Trabalho final · 2026/2</span></div>
      <div class="cover-main">
        <div class="cover-kicker">Modelagem de banco de dados</div>
        <h1>Plataforma de Gestão Acadêmica Modular</h1>
        <p class="cover-lead">Tema reescrito para o contexto de uma faculdade, com cinco módulos educacionais, núcleo de acesso, modelo ER e diagrama de classes.</p>
        <div class="cover-modules">
          <span>Avaliações</span><span>Financeiro</span><span>Presença</span><span>Agenda</span><span>Biblioteca</span>
        </div>
      </div>
      <div class="cover-stats">
        <div><strong>28</strong><span>entidades</span></div>
        <div><strong>5</strong><span>módulos</span></div>
        <div><strong>14</strong><span>páginas Draw.io</span></div>
        <div><strong>2</strong><span>diagramas principais</span></div>
      </div>
      <div class="cover-foot"><span>Domínio: faculdade · SQLite / modelo relacional</span><span>Outubro de 2026</span></div>
    </section>"""

    summary = """<section class="doc summary">
      <div class="eyebrow">Entrega</div>
      <h1>Sumário</h1>
      <div class="summary-grid">
        <div class="summary-card"><h3>Texto e regras</h3><ol>
          <li>Tema reescrito e objetivos</li><li>Núcleo de acesso e grupos</li><li>Base acadêmica</li><li>Regras de Avaliações, Financeiro, Presença, Agenda e Biblioteca</li><li>Entidades e adaptação do projeto anterior</li>
        </ol></div>
        <div class="summary-card"><h3>Modelos</h3><ol>
          <li>Modelo ER e dicionário</li><li>Relacionamentos e cardinalidades</li><li>Diagramas ER por módulo (7 páginas)</li><li>Diagrama de classes e multiplicidades</li><li>Diagramas de classes por módulo (7 páginas)</li>
        </ol></div>
      </div>
      <div class="summary-note">Os diagramas usam páginas A3 paisagem para preservar a leitura dos atributos. O arquivo Draw.io multipágina acompanha a entrega em <code>docs/diagramas/drawio/</code>.</div>
      <div class="legend">
        <div><strong>ER</strong><span>PK/FK/UK e cardinalidades crow's foot</span></div>
        <div><strong>Classes</strong><span>atributos, operações, herança, composição e multiplicidades</span></div>
        <div><strong>Cores</strong><span>cada módulo tem uma cor de identificação</span></div>
      </div>
    </section>"""

    er_intro = """<section class="doc section-intro">
      <div class="eyebrow">Modelo entidade-relacionamento</div>
      <h1>ER por módulo</h1>
      <p>As sete páginas a seguir mostram as entidades, as chaves e as cardinalidades. O núcleo de acesso e a base acadêmica aparecem primeiro; os módulos vêm na sequência. As tabelas de contexto repetem entidades compartilhadas para que cada página seja lida de forma independente.</p>
      <div class="legend">
        <div><strong>1 : N</strong><span>um registro à esquerda, muitos à direita</span></div>
        <div><strong>0..1 : N</strong><span>participação opcional</span></div>
        <div><strong>N : N</strong><span>resolvido por entidade associativa</span></div>
      </div>
    </section>"""

    cl_intro = """<section class="doc section-intro">
      <div class="eyebrow">Modelo orientado a objetos</div>
      <h1>Classes por módulo</h1>
      <p>As sete páginas de classes mostram os atributos principais, as operações de domínio e as multiplicidades. <strong>Aluno</strong> e <strong>Professor</strong> herdam de <strong>Usuario</strong>; <strong>GrupoModulo</strong> é a classe associativa da habilitação de módulos.</p>
      <div class="legend">
        <div><strong>Herança</strong><span>triângulo vazio na ponta da superclasse</span></div>
        <div><strong>Composição</strong><span>losango preenchido na ponta do todo</span></div>
        <div><strong>Associação</strong><span>multiplicidades nas duas pontas</span></div>
      </div>
    </section>"""

    return f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>EduGestor — Entrega de Modelagem</title>
<style>
  @page {{ size: A4 portrait; margin: 16mm 15mm 18mm; }}
  @page cover {{ size: A4 portrait; margin: 0; }}
  @page diagram {{ size: A3 landscape; margin: 9mm 10mm; }}
  * {{ box-sizing: border-box; }}
  html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  body {{ margin: 0; color: #152238; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 9.8pt; line-height: 1.5; }}
  h1, h2, h3, h4 {{ font-family: "Palatino Linotype", Georgia, serif; font-weight: 600; letter-spacing: -0.015em; color: #0b1f33; }}
  h1 {{ font-size: 23pt; line-height: 1.1; margin: 0 0 6mm; padding-bottom: 3mm; border-bottom: 1.2pt solid #cfc6b4; }}
  h2 {{ font-size: 15.5pt; margin: 7mm 0 2.5mm; break-after: avoid; }}
  h3 {{ font-size: 12.5pt; margin: 5mm 0 2mm; break-after: avoid; }}
  h4 {{ font-size: 10.5pt; margin: 4mm 0 1.5mm; break-after: avoid; }}
  p {{ margin: 0 0 2.6mm; text-align: justify; }}
  ul, ol {{ margin: 0 0 3mm 5mm; padding: 0; }}
  li {{ margin-bottom: 1mm; }}
  strong {{ color: #0b1f33; }}
  code {{ font-family: "Cascadia Code", Consolas, monospace; font-size: 8.3pt; background: #f1ede3; border: 0.4pt solid #e2dccf; border-radius: 2pt; padding: 0.3mm 1.2mm; color: #0f5c56; }}
  pre {{ background: #0b1f33; color: #e8f1f6; border-radius: 3mm; padding: 4mm; white-space: pre-wrap; font-size: 8pt; }}
  pre code {{ background: transparent; border: none; color: inherit; padding: 0; }}
  a {{ color: #0f766e; text-decoration: none; }}
  blockquote {{ margin: 3mm 0; padding: 3mm 4mm; background: #f7f3ea; border-left: 3pt solid #0f766e; }}
  table {{ width: 100%; border-collapse: collapse; margin: 3mm 0 4mm; font-size: 8.2pt; break-inside: auto; }}
  thead {{ display: table-header-group; }}
  th {{ text-align: left; background: #0b1f33; color: #fff; padding: 2mm 2.2mm; font-size: 7.4pt; letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600; }}
  td {{ padding: 1.8mm 2.2mm; border-bottom: 0.4pt solid #e2dccf; vertical-align: top; }}
  tr {{ break-inside: avoid; }}
  tbody tr:nth-child(even) {{ background: #faf7f0; }}
  .doc {{ break-before: page; }}
  .doc:first-of-type {{ break-before: auto; }}
  .eyebrow {{ font-size: 8pt; letter-spacing: 0.16em; text-transform: uppercase; color: #0f766e; font-weight: 700; margin-bottom: 2mm; }}
  .cover {{ page: cover; width: 210mm; height: 297mm; background: #0b1f33; color: #eaf2f8; padding: 22mm 20mm; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }}
  .cover-grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px); background-size: 16mm 16mm; }}
  .cover::after {{ content: ""; position: absolute; width: 120mm; height: 120mm; border-radius: 50%; right: -30mm; top: -30mm; background: radial-gradient(circle, rgba(45,212,191,.22), transparent 65%); }}
  .cover-top, .cover-main, .cover-stats, .cover-foot {{ position: relative; z-index: 1; }}
  .cover-top {{ display: flex; justify-content: space-between; align-items: center; }}
  .cover-brand {{ display: flex; align-items: center; gap: 4mm; font-family: Georgia, serif; font-size: 17pt; }}
  .cover-mark {{ width: 12mm; height: 12mm; border-radius: 3.5mm; background: linear-gradient(145deg, #2dd4bf, #0f766e); color: #06211e; display: grid; place-items: center; font-size: 20pt; font-weight: 700; }}
  .cover-tag {{ font-size: 8pt; letter-spacing: 0.12em; text-transform: uppercase; color: #8fb4c9; border: 0.5pt solid rgba(143,180,201,.35); padding: 1.5mm 3mm; border-radius: 10mm; }}
  .cover-kicker {{ color: #5eead4; font-size: 8.5pt; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; margin-bottom: 5mm; }}
  .cover h1 {{ color: #f8fbff; border: none; font-size: 42pt; line-height: 1.02; margin: 0 0 7mm; max-width: 160mm; }}
  .cover-lead {{ color: #b7c9d8; font-size: 12pt; max-width: 150mm; line-height: 1.55; }}
  .cover-modules {{ display: flex; flex-wrap: wrap; gap: 2.5mm; margin-top: 10mm; }}
  .cover-modules span {{ border: 0.5pt solid rgba(255,255,255,.18); background: rgba(255,255,255,.07); border-radius: 10mm; padding: 2mm 4mm; font-size: 9pt; color: #d8e5ee; }}
  .cover-stats {{ display: flex; gap: 8mm; border-top: 0.5pt solid rgba(255,255,255,.16); border-bottom: 0.5pt solid rgba(255,255,255,.16); padding: 6mm 0; }}
  .cover-stats div {{ min-width: 35mm; }}
  .cover-stats strong {{ display: block; font-family: Georgia, serif; font-size: 25pt; color: #5eead4; line-height: 1; }}
  .cover-stats span {{ font-size: 8pt; color: #8fb4c9; text-transform: uppercase; letter-spacing: 0.1em; }}
  .cover-foot {{ display: flex; justify-content: space-between; color: #7899ad; font-size: 8pt; }}
  .summary-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin: 8mm 0; }}
  .summary-card {{ border: 0.5pt solid #e2dccf; background: #fffdf8; border-radius: 3mm; padding: 5mm; }}
  .summary-card h3 {{ margin-top: 0; font-size: 12pt; }}
  .summary-card ol {{ font-size: 9pt; }}
  .summary-note {{ background: #f1ede3; border-left: 3pt solid #0f766e; padding: 4mm; font-size: 9pt; }}
  .legend {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 7mm; }}
  .legend div {{ border: 0.5pt solid #e2dccf; border-radius: 2.5mm; padding: 3.5mm; background: #fffdf8; }}
  .legend strong {{ display: block; font-family: Georgia, serif; font-size: 12pt; color: #0f766e; margin-bottom: 1mm; }}
  .legend span {{ font-size: 8pt; color: #64748b; }}
  .section-intro {{ break-before: page; }}
  .diagram-page {{ page: diagram; break-before: page; width: 400mm; height: 279mm; display: flex; flex-direction: column; background: #fff; }}
  .diagram-head {{ display: flex; justify-content: space-between; align-items: flex-start; gap: 8mm; border-bottom: 0.7pt solid #cfc6b4; padding-bottom: 3mm; }}
  .diagram-kicker {{ font-size: 7.5pt; letter-spacing: 0.15em; text-transform: uppercase; color: #0f766e; font-weight: 700; }}
  .diagram-head h2 {{ font-size: 17pt; margin: 1mm 0 1mm; }}
  .diagram-head p {{ font-size: 8.5pt; color: #64748b; margin: 0; }}
  .diagram-brand {{ font-family: Georgia, serif; font-size: 10pt; color: #94a3b8; white-space: nowrap; }}
  .diagram-frame {{ flex: 1; display: flex; align-items: center; justify-content: center; padding: 3mm 0 1mm; overflow: hidden; }}
  .diagram-frame svg {{ max-width: 100%; max-height: 242mm; width: auto; height: auto; display: block; }}
  .diagram-foot {{ display: flex; justify-content: space-between; border-top: 0.4pt solid #e2dccf; padding-top: 2mm; color: #94a3b8; font-size: 7.5pt; }}
  .doc table, .doc pre, .doc .legend, .doc .summary-grid {{ break-inside: avoid; }}
</style></head><body>
{cover}
{summary}
{tema}
{er_doc}
{er_intro}
{er_pages}
{cl_doc}
{cl_intro}
{cl_pages}
</body></html>"""


def main() -> None:
    html_text = build_html()
    HTML_OUT.write_text(html_text, encoding="utf-8")
    PROFILE.mkdir(parents=True, exist_ok=True)
    if not CHROME.exists():
        raise FileNotFoundError(CHROME)
    subprocess.run(
        [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            f"--user-data-dir={PROFILE}",
            "--no-pdf-header-footer",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=15000",
            f"--print-to-pdf={OUT}",
            HTML_OUT.as_uri(),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if not OUT.exists() or OUT.stat().st_size < 100_000:
        raise RuntimeError("PDF não foi gerado corretamente")
    data = OUT.read_bytes().decode("latin-1", errors="ignore")
    pages = len(re.findall(r"/Type\s*/Page\b", data))
    boxes = sorted(set(re.findall(r"/MediaBox\s*\[([^\]]+)\]", data)))
    print(f"PDF: {OUT} ({OUT.stat().st_size / 1024 / 1024:.2f} MB, {pages} páginas)")
    print("MediaBox:", " | ".join(boxes))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Erro: {exc}", file=sys.stderr)
        raise