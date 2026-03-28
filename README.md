# Cabaña La Gabriela — Sitio Web

Sitio web de alquiler vacacional para **Cabaña La Gabriela**, ubicada en Playa Venado, entre Moñitos y San Bernardo del Viento, Córdoba, Colombia.

**Demo:** [verdant-heliotrope-c68fde.netlify.app](https://verdant-heliotrope-c68fde.netlify.app)

---

## Stack

- **Frontend:** HTML5, CSS3, JavaScript Vanilla (sin frameworks)
- **Base de datos:** Supabase (PostgreSQL en la nube)
- **Hosting:** Netlify (auto-deploy desde GitHub)
- **Email:** EmailJS (confirmaciones al cliente)
- **Chatbot:** Groq API — Llama 3.3 70B

---

## Estructura

```
web/
├── index.html              ← Página principal
├── habitaciones.html       ← Detalle de habitaciones
├── galeria.html            ← Galería de fotos y video
├── lugares.html            ← Playas y destinos cercanos
├── como-llegar.html        ← Cómo llegar + mapa
├── reservas.html           ← Formulario de reserva + calendario
├── reserva-exitosa.html    ← Confirmación de solicitud
├── admin.html              ← Panel administrador (protegido)
├── css/styles.css          ← Design system compartido
└── js/
    ├── main.js             ← Lógica principal y formulario
    ├── supabase.js         ← Cliente Supabase (CRUD + auth)
    └── chatbot.js          ← Widget chatbot IA
```

---

## Planes y precios

| Plan | Incluye | Precio/noche | Capacidad |
|---|---|---|---|
| Primer Piso | 3 hab. + área social + cocina + 2 baños | $1.000.000 COP | 12 personas |
| 2° Piso + Terraza | 4 hab. + asoleadero panorámico | $1.500.000 COP | 20 personas |
| Cabaña Completa | 7 hab. + todos los pisos | $2.000.000 COP | 40+ personas |

**Cocinero opcional:** +$100.000 COP/persona/día (3 comidas incluidas)

---

## Flujo de reservas

1. Cliente llena el formulario en `reservas.html`
2. La solicitud se guarda en Supabase con estado `pendiente`
3. El administrador la revisa en `admin.html`
4. Al confirmar → se envía WhatsApp + email automático al cliente
5. Las fechas se bloquean en el calendario solo al **confirmar** (no al solicitar)

---

## Panel Administrador

URL: `/admin.html`

Login con email y contraseña configurados en **Supabase Authentication**.
El acceso está protegido por Supabase Auth + Row Level Security (RLS).

Funciones:
- Ver, filtrar y buscar reservas en tiempo real
- Confirmar reserva → WhatsApp + email automático al cliente
- Cambiar estado (pendiente / confirmada / cancelada)
- Exportar reservas a Excel (.xlsx)

---

## Deploy

El sitio se despliega automáticamente en Netlify al hacer `git push`:

```bash
git add web/
git commit -m "descripción del cambio"
git push origin main
# Netlify redeploya en ~30 segundos
```

**Publish directory:** `web/`
**Build command:** *(vacío — sitio estático)*

---

## Servicios externos

| Servicio | Uso |
|---|---|
| Supabase | Base de datos de reservas + autenticación admin |
| EmailJS | Emails de confirmación al cliente |
| Groq (Llama 3.3 70B) | Chatbot de atención al visitante |
| Netlify | Hosting y deploy continuo |

---

## Video dron

El archivo de video es demasiado grande para GitHub. Para agregarlo:

1. Sube el video a YouTube como **No listado**
2. En `galeria.html`, reemplaza el placeholder por:
```html
<iframe width="100%" style="aspect-ratio:16/9"
  src="https://www.youtube.com/embed/TU_VIDEO_ID?rel=0"
  frameborder="0" allowfullscreen></iframe>
```

---

## Contacto

- **WhatsApp:** +57 313 754 9732
- **Correo:** cabanalagabriela1@gmail.com
- **Instagram:** [@lagabriela06](https://instagram.com/lagabriela06)
- **TikTok:** @la_gabriela06
- **GPS:** [9.35933, -76.00764](https://maps.google.com/?q=9.35933,-76.00764)
- **Ubicación:** Playa Venado, entre Moñitos y San Bernardo del Viento, Córdoba
