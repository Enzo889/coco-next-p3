# 🧠 Integración Comunitaria — coco-next-p3

**Repositorio:** Enzo889/coco-next-p3  
**Descripción breve:** Plataforma de integración comunitaria basada en Next.js que conecta peticiones de servicios con personas interesadas en ofrecerlos.

---

## 🚀 Descripción general

**coco-next-p3** es una aplicación web construida con **Next.js** que implementa un **mercado de servicios comunitario**.  
Su propósito es conectar a dos grupos de usuarios:

- **Clientes:** crean peticiones (solicitudes de servicio)
- **Proveedores:** envían postulaciones para cumplir dichas peticiones

El sistema utiliza un **mecanismo inteligente basado en intereses por categorías**.  
Los usuarios seleccionan sus intereses, y el sistema **envía notificaciones automáticas** cuando se crean nuevas peticiones que coinciden con esos intereses.

---

## 🔁 Flujo principal de usuario

1. Los usuarios se registran y eligen sus categorías de interés
2. Los clientes crean peticiones describiendo los servicios que necesitan
3. El sistema notifica automáticamente a los proveedores interesados
4. Los proveedores envían postulaciones con propuestas y costos
5. Los clientes revisan las postulaciones y seleccionan un ganador
6. La selección del ganador habilita el **chat entre ambas partes**

---

## 🧩 Arquitectura del sistema

El proyecto sigue una **arquitectura en capas** que separa claramente:

- **Presentación:** componentes y páginas de interfaz
- **Lógica de negocio:** servicios de dominio y validaciones
- **Acceso a datos:** integración API mediante Axios

El archivo principal de servicios es  
`app/api/service.ts`, que define dos instancias de Axios:

- `client`: instancia básica para operaciones CRUD
- `axiosInstance`: instancia avanzada con interceptores de autenticación y manejo de errores

---

## 🏗️ Sistemas principales

1. **Gestión de Peticiones** – creación, listado y revisión de postulaciones
2. **Gestión de Postulaciones** – envío, seguimiento y actualización del estado
3. **Sistema de Intereses de Usuario** – selección de categorías y configuración de preferencias
4. **Sistema de Notificaciones** – notificaciones automáticas basadas en intereses

**Interacción general del sistema:**

- Los usuarios configuran intereses (`api.addUserInterest()`)
- Los clientes crean peticiones (`api.createPetition()`)
- El backend genera notificaciones (`api.getNotifications()`)
- Los proveedores envían postulaciones (`api.createPostulation()`)
- Los clientes seleccionan ganadores (`api.updatePostulation()`)

---

## 🗂️ Modelo de datos

| Entidad          | Campos clave                                                           | Propósito principal                       |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| **User**         | id, name, email, group                                                 | Autenticación e identidad                 |
| **Category**     | idCategory, name                                                       | Clasificación de peticiones e intereses   |
| **UserInterest** | idUserInterest, idUser, idCategory                                     | Configuración de preferencias del usuario |
| **Petition**     | idPetition, description, idCategory, idState, idCustomer               | Solicitudes creadas por los clientes      |
| **Postulation**  | idPostulation, idPetition, idProvider, winner, proposal, cost, idState | Aplicaciones para cumplir peticiones      |
| **Notification** | idNotification, idProvider, type, message, viewed, deleted             | Alertas y avisos a los usuarios           |

### Estados de Peticiones

1. **Activa** – Aceptando postulaciones
2. **En progreso** – Postulación ganadora seleccionada
3. **Completada** – Servicio finalizado

### Estados de Postulaciones

- **Pendiente** – A la espera de revisión
- **Ganadora** – Indicada con `winner: true`

---

## 🧠 Stack tecnológico

| Tecnología           | Versión | Propósito                                 |
| -------------------- | ------- | ----------------------------------------- |
| **Next.js**          | 16.0.0  | Framework frontend, enrutamiento y SSR    |
| **React**            | 19.2.0  | Librería de componentes UI                |
| **NextAuth.js**      | 4.24.11 | Autenticación y gestión de sesión         |
| **Axios**            | 1.13.1  | Cliente HTTP para comunicación con la API |
| **Socket.IO Client** | 4.8.1   | Comunicación en tiempo real               |
| **Radix UI**         | —       | Componentes accesibles y modulares        |
| **React Hook Form**  | 7.65.0  | Manejo y validación de formularios        |
| **Zod**              | 4.1.12  | Validación de esquemas de datos           |
| **TailwindCSS**      | 4.x     | Framework CSS basado en utilidades        |
| **TypeScript**       | 5.x     | Tipado estático y seguridad de tipos      |

---

## ⚙️ Capa de servicios API

El archivo `app/api/service.ts` centraliza la comunicación entre el frontend y el backend.  
Exporta funciones CRUD como:

- `getCategories()`
- `createPetition()`
- `getNotifications()`
- `createPostulation()`
- `updatePostulation()`

### 🔐 Autenticación

- Usa `NextAuth` para manejar sesiones
- Los tokens JWT se añaden automáticamente a las solicitudes mediante interceptores
- En caso de error `401`, redirige al login

---

## 🎨 Estructura visual

El **layout principal** (`app/layout.tsx`) incluye:

- `ThemeProvider` → cambia entre modo oscuro/claro
- `SessionAuthProvider` → contexto global de autenticación
- `<html suppressHydrationWarning>` → evita parpadeos de tema al recargar

---

## 🌍 Landing Page

El archivo `app/page.tsx` define la **página pública principal** con secciones:

- **Navbar:** enlaces de inicio de sesión/registro
- **Hero Section:** “Conecta peticiones con personas”
- **Beneficios:** crear, recibir notificaciones y postularse
- **Estadísticas:** 2.5k+ peticiones, 98% éxito, 10k+ usuarios
- **CTA:** botones _Crear Petición_ y _Explorar Peticiones_

Diseño responsive con breakpoints `sm`, `md`, `lg` y `xl`.

---

## 🧩 Patrones de diseño implementados

1. **Servicio API centralizado:** un único punto de acceso para todas las operaciones
2. **Doble instancia Axios:** `client` (CRUD) y `axiosInstance` (con autenticación)
3. **Sistema de notificaciones inteligentes:** basado en intereses y categorías
4. **Composición de componentes:** siguiendo los patrones de Radix UI + TailwindCSS
5. **Autenticación híbrida:** NextAuth + JWT del backend

---

## ⚙️ Variables de entorno

El proyecto requiere el siguiente valor en tu archivo `.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```
