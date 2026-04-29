# Contratos OPS — Painel Operacional

Sistema de controle operacional de validação de contratos de Geração Distribuída.

## Funcionalidades

- **Dashboard semanal** com KPIs, gráficos de feitos/meta, custo de excedente e erros por tipo
- **Entrada manual** por dia da semana com cálculo automático de custo de excedente aprovado
- **Importação** de planilhas `.xlsx` e `.csv`
- **Histórico** de semanas salvas com evolução temporal
- Dados salvos localmente no browser (localStorage)

## Regras de negócio

| Regra | Valor |
|---|---|
| Meta diária | 5.000 contratos |
| Excedente | Apenas contratos **aprovados** acima da meta |
| Valor excedente | R$ 2,70 por contrato aprovado |

> O excedente não é calculado automaticamente. Deve ser informado manualmente o valor aprovado.

## Estrutura de colunas para importação

```
dia | enviados | feitos | excedente_aprovado | erros_distribuidora | erros_sistema | erros_status
```

Exemplo de linha CSV:
```
Seg,5000,5200,200,3,1,2
```

## Deploy no GitHub Pages

1. Faça upload desta pasta para um repositório no GitHub
2. Vá em **Settings → Pages**
3. Em **Source**, selecione `main` branch e pasta `/ (root)`
4. Acesse via `https://seu-usuario.github.io/nome-do-repo`

## Estrutura de arquivos

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

---

Desenvolvido para o Setor de Contratos — Coordenação Gabrielle Silva.
