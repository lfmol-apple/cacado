# OCS Gestão

Sistema de gestão (clientes, produtos, compras, vendas, movimentações) usado em produção pela OCS desde 2022.

## Estrutura

- `ocs-gestao/` — código-fonte: frontend Angular 13 (Material Dashboard) na raiz + API Node/Express em `ocs-gestao/api/`.
- `ocs-gestao/DB/` — modelo do banco (`Model.mwb`) e dumps (`DB/dumps/`).

## Rodando localmente

```bash
# Frontend
cd ocs-gestao
npm install --legacy-peer-deps
npm start        # http://localhost:4200

# API
cd ocs-gestao/api
npm install
cp .env.example .env   # preencher SECRET, DB_*, CORS_ORIGINS
npm run dev       # http://localhost:21007
```

Requer um MySQL local com o banco `ocsgestao` restaurado a partir de `DB/dumps/`.

## Produção

Hoje hospedado na Kinghost (VPS Windows + MySQL gerenciado). Migração planejada para uma VPS Hostinger
(Ubuntu + Nginx + PM2 + Certbot + MySQL local) — ver histórico de conversas para o checklist completo.
