# Documentação do Frontend — PetCare

## Estrutura

```text
petcare/
│
├── README.md
│
├── front/
│   ├── .kiro/
│   │   └── specs/
│   │       └── petcare/
│   │           ├── requirements.md
│   │           └── design.md
│   │
│   ├── docs/
│   │   ├── README.md
│   │   ├── design-system.md
│   │   └── figma.md
│   │
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
│
└── back/
    ├── .kiro/
    │   └── specs/
    │       └── petcare/
    │           └── ...
    │
    ├── docs/
    │   └── ...
    │
    └── ...

```

## Ordem recomendada de leitura

1. `figma.md` — entende as telas e o comportamento visual.
2. `design-system.md` — entende os padrões reutilizáveis.
3. `requirements.md` — entende o que o frontend precisa fazer.
4. `design.md` — reúne as diretrizes gerais de implementação.

## Regra principal

O frontend é Angular + TypeScript.

A implementação deve usar o Figma como referência visual, o Design System como referência de UI e o backend como fonte de verdade para contratos, dados e regras de negócio.

Os fluxos `Registrar Vacina`, `Agendar Nova Consulta` e `Criar Novo Lembrete` são modais.
