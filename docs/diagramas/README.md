# Diagramas do EduGestor

O modelo foi dividido em 14 páginas para manter a leitura confortável. Todas usam a mesma paleta por módulo e foram geradas a partir de `tools/gerar_diagramas_drawio.py`.

## Arquivo multipágina

Abra [`drawio/EduGestor-Diagramas.drawio`](drawio/EduGestor-Diagramas.drawio) no draw.io. As abas estão nomeadas por tipo e módulo:

| Aba | Arquivo individual |
| --- | --- |
| ER 00 — Acesso | `drawio/ER-acesso.drawio` |
| ER 01 — Acadêmico | `drawio/ER-academico.drawio` |
| ER 02 — Avaliações | `drawio/ER-avaliacoes.drawio` |
| ER 03 — Financeiro | `drawio/ER-financeiro.drawio` |
| ER 04 — Presença | `drawio/ER-presenca.drawio` |
| ER 05 — Agenda | `drawio/ER-agenda.drawio` |
| ER 06 — Biblioteca | `drawio/ER-biblioteca.drawio` |
| Classes 00 — Acesso | `drawio/CL-acesso.drawio` |
| Classes 01 — Acadêmico | `drawio/CL-academico.drawio` |
| Classes 02 — Avaliações | `drawio/CL-avaliacoes.drawio` |
| Classes 03 — Financeiro | `drawio/CL-financeiro.drawio` |
| Classes 04 — Presença | `drawio/CL-presenca.drawio` |
| Classes 05 — Agenda | `drawio/CL-agenda.drawio` |
| Classes 06 — Biblioteca | `drawio/CL-biblioteca.drawio` |

## Renderizações

- `render/*.svg`: diagramas vetoriais, usados no PDF.
- `render/*.png`: prévias em 1,15×.
- `xml/*.xml`: `mxGraphModel` individual, usado nas chamadas ao MCP do Draw.io.

## Regenerar

```powershell
python tools\gerar_diagramas_drawio.py
```

O script regrava as 14 páginas, o arquivo multipágina e o `manifest.json`. A renderização para SVG/PNG e a montagem do PDF usam `tools/gerar_pdf.py` e o visualizador local do draw.io; consulte o script para os caminhos.

## Convenções

- ER: tabelas com PK/FK/UK e conectores crow's foot entre as linhas de chave.
- Classes: atributos, operações, herança, composição e multiplicidades nas duas pontas.
- Cores: acesso (azul), acadêmico (verde), avaliações (roxo), financeiro (amarelo), presença (laranja), agenda (ciano), biblioteca (cinza).