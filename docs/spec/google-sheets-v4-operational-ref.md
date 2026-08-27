# GOOGLE SHEETS API v4 — REFERÊNCIA OPERACIONAL PARA A IA (ADR-0201 / V5)

## 1. Regra Principal
Este projeto usa **Google Sheets API v4 REST**, não uma API inventada e não uma abstração genérica de planilhas.

**Base oficial:**
- https://developers.google.com/workspace/sheets/api/reference/rest
- https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets
- https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request
- https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/values/update
- https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate

---

## 2. Endpoints Usados pelo Projeto

### Ler Metadados
`GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}`
- **Uso:** Obter `sheetId`, conferir títulos das abas, validar estrutura antes de modificar.

### Ler Células
`GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}`
- **Exemplo:** `GET .../values/%F0%9F%8F%A2%20Matriz%20B2B%20RJ%21A1%3AAZ500`

### Escrever Células
`PUT https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}?valueInputOption=USER_ENTERED`
- **Body:**
```json
{
  "range": "A1",
  "majorDimension": "ROWS",
  "values": [["texto", "=SUM(A1:A2)"]]
}
```
`USER_ENTERED` interpreta fórmulas como a interface do Sheets. Fórmulas devem obrigatoriamente usar nomes em inglês canônico (`COUNTIFS`, `COUNTIF`, `IF`, `HYPERLINK`) e vírgulas `,` como separador.

### Batch de Estrutura e Formatação
`POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}:batchUpdate`
- **Body:**
```json
{
  "requests": [
    { "repeatCell": {} },
    { "setDataValidation": {} },
    { "updateSheetProperties": {} }
  ]
}
```
*O `batchUpdate` é atômico: se uma request for inválida, a operação inteira não é aplicada.*

---

## 3. Requests Válidas Usadas neste Projeto
- `repeatCell`
- `setDataValidation`
- `addConditionalFormatRule`
- `clearBasicFilter`
- `setBasicFilter`
- `updateSheetProperties`
- `updateDimensionProperties`

---

## 4. RepeatCell e FieldMask
```json
{
  "repeatCell": {
    "range": {
      "sheetId": 123,
      "startRowIndex": 0,
      "endRowIndex": 10,
      "startColumnIndex": 0,
      "endColumnIndex": 5
    },
    "cell": {
      "userEnteredFormat": {
        "backgroundColor": { "red": 1, "green": 1, "blue": 1 }
      }
    },
    "fields": "userEnteredFormat(backgroundColor)"
  }
}
```
*Não inventar propriedades dentro de `userEnteredFormat`.*
Exemplos válidos: `backgroundColor`, `textFormat`, `horizontalAlignment`, `verticalAlignment`, `numberFormat`, `wrapStrategy`.

---

## 5. Data Validation

### Checkbox
```json
{
  "setDataValidation": {
    "range": { "sheetId": 123, "startRowIndex": 4, "endRowIndex": 100, "startColumnIndex": 2, "endColumnIndex": 3 },
    "rule": { "condition": { "type": "BOOLEAN" }, "showCustomUi": true }
  }
}
```

### Dropdown
```json
{
  "setDataValidation": {
    "range": { "sheetId": 123, "startRowIndex": 4, "endRowIndex": 100, "startColumnIndex": 5, "endColumnIndex": 6 },
    "rule": {
      "condition": {
        "type": "ONE_OF_LIST",
        "values": [
          { "userEnteredValue": "PROSPECCAO" },
          { "userEnteredValue": "AGENDADA" },
          { "userEnteredValue": "HOMOLOGADO" }
        ]
      },
      "showCustomUi": true,
      "strict": false
    }
  }
}
```

---

## 6. Filtro
`setBasicFilter` exige um objeto `filter` com `range`. A tabela deve ser contínua. Não colocar linhas artificiais de seções dentro do corpo filtrável.

---

## 7. Congelamento
```json
{
  "updateSheetProperties": {
    "properties": {
      "sheetId": 123,
      "gridProperties": { "frozenRowCount": 4, "frozenColumnCount": 2 }
    },
    "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"
  }
}
```

---

## 8. Limpeza
`spreadsheets.values.clear` limpa valores. Não remove formatação. Para resetar formatação, usar `repeatCell` com `fields: "userEnteredFormat"`.

---

## 9. Preservação de Estado Operacional
Nunca ler a matriz V5 e limpá-la cegamente sobrescrevendo colunas. O script detecta o layout antes de escrever:
- **LEGACY:** Converte o modelo antigo.
- **V5:** Preserva o estado operacional atual (visitas, status, observações).
- **Desconhecido:** Aborta antes de sobrescrever.

---

## 10. Modelo de Dados V5 (24 Colunas A-X)

| Coluna | Campo | Descrição / Tipo |
| :---: | :--- | :--- |
| **A** | `ID` | Identificador Único |
| **B** | `FORNECEDOR` | Nome Fantasia / Razão |
| **C** | `VISITADO` | Checkbox Nativa (`BOOLEAN`) |
| **D** | `WHATSAPP` | Link `HYPERLINK` (Botão Verde) |
| **E** | `MAPA` | Link `HYPERLINK` Google Maps (Botão Azul) |
| **F** | `STATUS` | Seletor Dropdown Operacional |
| **G** | `PRIORIDADE` | Seletor Dropdown Prioridade |
| **H** | `POLO` | Polo Regional (Polo 1, Polo 2, Polo 3) |
| **I** | `BAIRRO` | Bairro do Estabelecimento |
| **J** | `CIDADE` | Município |
| **K** | `CATEGORIA` | Categoria de Produtos |
| **L** | `PERFIL B2B` | Perfil Comercial |
| **M** | `ENDEREÇO` | Logradouro Completo |
| **N** | `TELEFONE` | Link `tel:` (Botão Azul Celeste) |
| **O** | `INSTAGRAM` | Link `HYPERLINK` (Botão Rosa) |
| **P** | `WEBSITE` | Link `HYPERLINK` (Botão Roxo) |
| **Q** | `REVIEWS` | Link `HYPERLINK` GMB (Botão Âmbar) |
| **R** | `DATA VISITA` | Data Registrada |
| **S** | `RESULTADO` | Parecer da Auditoria |
| **T** | `PRÓXIMO FOLLOW-UP` | Data de Retorno |
| **U** | `PRAZO PGTO` | Condições Comerciais |
| **V** | `DESCONTO B2B` | Percentual / Tabela |
| **W** | `PEDIDO MÍNIMO` | Valor Mínimo em R$ |
| **X** | `OBSERVAÇÕES` | Observações Gerais & Termos |

---

## 11. Fluxo Operacional
`PROSPECCAO` ➔ `CONTATO_REALIZADO` ➔ `AGENDADA` ➔ `VISITA_REALIZADA` ➔ `HOMOLOGADO`
*(Alternativas: `FOLLOW_UP`, `REJEITADO`)*

---

## 12. Regras Estritas para a IA
1. Consultar a documentação oficial da Google Sheets API v4.
2. Verificar o schema REST correspondente antes de formar o JSON.
3. Nunca inventar nomes de propriedades.
4. Validar o JSON antes de disparar `api_request`.
5. Preferir requisições pequenas e diagnosticáveis.
6. Nunca destruir dados existentes para "testar".
