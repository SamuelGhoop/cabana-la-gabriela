---
title: Decisión — Sistema de Reservas por Piso
date: 2026-03-18
tags: [decision, cabana-la-gabriela, feature, javascript]
status: active
related: [[Projects/cabana-la-gabriela/README]], [[cabana-la-gabriela-deploy]], [[fastapi-sqlite-rest-api]]
---

# Decisión: Sistema de Reservas por Piso

La cabaña se alquila por piso completo, no por habitación individual.

## Contexto

El modelo anterior de reserva por habitación no reflejaba la realidad operativa de la cabaña. Los grupos alquilan pisos completos y la cabaña tiene 3 opciones naturales de alquiler.

## Opciones consideradas

- **Opción A — Por habitación**: cada hab. con precio individual (complejo de gestionar)
- **Opción B — Por piso/plan**: 3 planes fijos con precio y capacidad clara ✅

## Decisión

**Elegimos**: Plan por piso (Opción B)

**Razón**: Más simple para el usuario, refleja la realidad del negocio, evita conflictos de grupos mezclados.

## Implementación técnica

### Planes y precios (constantes en main.js)
```javascript
const PLAN_PRICES = { piso1: 1000000, piso2: 1500000, completa: 2000000 };
const PLAN_MAX    = { piso1: 12, piso2: 20, completa: 40 };
const CHEF_PRICE  = 200000; // por día
```

### Componentes creados
- Radio cards visuales en `reservas.html` con `data-price` y `data-max`
- Calculadora automática de precio (noches × plan + chef)
- Validación: huéspedes no pueden superar `PLAN_MAX[plan]`
- Calendario de disponibilidad color-codeado por plan

### Almacenamiento
- Reservas en `localStorage` clave `cabana_reservas` (offline-first)
- Admin panel exporta a CSV
- Backend FastAPI + SQLite listo para producción

> [!warning] Pendiente
> El correo de confirmación aún no se envía automáticamente. Requiere deploy del backend con SendGrid o Resend.

## Consecuencias

- [[cabana-la-gabriela-deploy]] — al hacer deploy, conectar `API` en main.js
- [[fastapi-sqlite-rest-api]] — el backend ya está implementado con estos endpoints
