# InterDuo - Simulador de Entrevistas con IA 🤖

<img width="2484" height="1356" alt="image" src="https://github.com/user-attachments/assets/d5936aa9-69fb-4b90-80c9-c3d46b366adf" />


InterDuo es un simulador de entrevistas laborales diseñado para ayudar a los desarrolladores y profesionales de IT a prepararse para entrevistas técnicas y de competencias. La plataforma utiliza IA (OpenAI) para proporcionar feedback instantáneo y estructurado.

Este proyecto está construido con el **T-3 Stack** (Next.js, Tailwind CSS, TypeScript) y utiliza **Supabase** como backend.

[Link al Deploy en Vercel](https://interduo-aledul.vercel.app/)

---

## Características Principales

* **Flujo de Onboarding:** Cuestionario de bienvenida para personalizar la experiencia del usuario (selección de área y nivel de experiencia).
* **Generación de Entrevistas Dinámicas:** Elige entre entrevistas "Técnicas" (hard skills, coding) o "Competencias" (soft skills). Las preguntas se seleccionan aleatoriamente de la base de datos basándose en el área y nivel de dificultad del usuario.
* **Simulación Realista:**
    * Interfaz limpia y sin distracciones.
    * Editor de código (Monaco Editor) que aparece automáticamente para preguntas de tipo `coding_exercise`.
    * Textarea estándar para preguntas teóricas o de comportamiento.
* **Evaluación por IA:** Al finalizar, una Server Action evalúa todas las respuestas en paralelo usando la API de OpenAI (GPT-3.5/4) y guarda el puntaje y la retroalimentación en la base de datos.
* **Página de Resultados:** Un informe detallado que muestra el puntaje promedio, la pregunta, la respuesta del usuario y el feedback de la IA para cada pregunta.
* **Autenticación y Seguridad:** Flujo completo de registro e inicio de sesión con Supabase Auth, protegido con **Row Level Security (RLS)** en todas las tablas para garantizar que los usuarios solo puedan ver y escribir sus propios datos.

---

## Stack Tecnológico

* **Framework:** Next.js 14+ (App Router)
* **Base de Datos:** Supabase (PostgreSQL)
* **Autenticación:** Supabase Auth
* **IA:** OpenAI (API de GPT-3.5-Turbo)
* **Estilos:** Tailwind CSS
* **UI:** Headless UI (para menús desplegables)
* **Editor de Código:** @monaco-editor/react
* **Lenguaje:** TypeScript

---

## Empezando (Configuración Local)

Sigue estos pasos para levantar el proyecto en tu máquina local.

### 1. Prerrequisitos

* Node.js (v18+)
* pnpm (o npm / yarn)
* Git
* Una cuenta de [Supabase](https://supabase.com) (Plan Gratuito)
* Una cuenta de [OpenAI](https://platform.openai.com/) (con créditos de API)

### 2. Clonar el Repositorio

```bash
git clone [https://github.com/tu-usuario/interduo.git](https://github.com/tu-usuario/interduo.git)
cd interduo


🤝 Autores
Emmanuel Alejandro

Dulce María

¡Hecho con <3!
