---
title: decision-precio-cocinero
date: 2026-03-22
tags: [decision, cabana-la-gabriela, precios]
status: active
related: [[decision-sistema-reservas-por-piso]], [[Projects/cabana-la-gabriela/README]]
---

# Decisión: Precio del servicio de cocinero

## Contexto
El formulario de reservas incluía una opción de cocinero a tarifa fija de $200.000/día, independiente del número de personas.

## Decisión
**Cambio a**: $100.000 por persona por día, incluyendo desayuno, almuerzo y cena.

**Razón**: La tarifa fija no era justa para grupos grandes ni pequeños. El precio por persona escala correctamente con el grupo y es más transparente para el usuario.

## Impacto técnico

- `CHEF_PRICE = 100000` en `main.js`
- Fórmula: `noches × huéspedes × 100.000`
- UI actualizada: "+$100.000 / persona / día · 3 comidas incluidas"
- Mensaje de WhatsApp: refleja el costo total calculado correctamente

> [!warning] Recuerda actualizar el precio también en el prompt del agente IA si se usa.

## Relacionado
- [[decision-sistema-reservas-por-piso]]
