# Desarrollo de una Plataforma Web Integral para el Artista Jose Halconero

El presente **Trabajo de Fin de Grado (TFG)** se centra en el desarrollo e implementación de una plataforma web completa y funcional destinada a potenciar la presencia digital y gestionar las actividades del artista **Jose Halconero**.

Jose Halconero es un profesional con un perfil singular, graduado en **Conservación y Restauración de Bienes Culturales** y, además, un reconocido **tatuador**. La plataforma busca fusionar ambas facetas de su carrera, sirviendo como:

- Portafolio digital  
- Herramienta de interacción con la comunidad  
- Plataforma de gestión comercial  

El proyecto ha sido desarrollado por **Gonzalo Mansera Ruiz**, estudiante del **Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)** del **IES Politécnico Hermenegildo Lanz**.

---

## Objetivos y Características de la Plataforma

La página web se diseñará para ofrecer una experiencia de usuario rica e intuitiva, cumpliendo con los siguientes requisitos funcionales clave:

### 🎨 Portafolio de Obras
Apartado dedicado a la exposición detallada de las obras del artista, abarcando tanto sus trabajos de conservación/restauración como sus creaciones de tatuaje.  
Incluye:
- Galerías visuales de alta calidad  
- Descripciones contextuales de cada obra  

### 📝 Blog Interactivo
Sistema de blog que permitirá a Jose Halconero compartir:
- Noticias
- Procesos creativos
- Artículos relacionados con sus campos de especialización  

El blog contará con:
- Sistema de registro de usuarios  
- Posibilidad de comentar entradas  
- Fomento de la interacción con la comunidad  

### 📅 Gestión de Reservas y Contacto
Sección clave para la actividad profesional del artista, orientada a:
- Solicitud de información  
- Contacto directo con el artista  
- Gestión de solicitudes y pre-reservas de citas o proyectos  

### 🛒 Apartado de Merchandising
Sección dedicada a la venta de productos relacionados con el arte de Jose Halconero:
- Impresiones
- Prints
- Merchandising temático  

Esta funcionalidad sienta las bases para una futura implementación de **e-commerce**.

### 🌍 Internacionalización (i18n)
La plataforma será completamente traducible al **idioma inglés**, permitiendo alcanzar una audiencia global.

---

## Tecnologías Empleadas

El desarrollo del TFG se llevará a cabo utilizando un **stack tecnológico moderno y robusto**, garantizando escalabilidad, rendimiento y mantenibilidad.

| Componente                | Tecnología Principal        | Propósito |
|--------------------------|----------------------------|----------|
| **Frontend**              | React con TypeScript        | Desarrollo de una interfaz de usuario dinámica y tipada, asegurando un código más robusto y mantenible |
| **Backend**               | Symfony                     | Framework PHP para la lógica de negocio, gestión de la API y routing del servidor |
| **Base de Datos**         | PostgreSQL                  | Base de datos relacional fiable y eficiente para el manejo de datos complejos |
| **Procesamiento / Scripts** | Python                    | Automatización, scripts auxiliares y procesamiento de datos (ej. imágenes) |
| **Diseño y Prototipado**  | Figma                       | Creación de prototipos de alta fidelidad y definición de UX/UI |
| **Contenerización**       | Docker                      | Gestión de entornos de desarrollo, staging y producción |

---

## Alcance del Proyecto

Este proyecto no solo representa la culminación del **Ciclo Formativo de DAW**, sino también la aplicación práctica de conocimientos avanzados en un **proyecto real**, aportando un alto valor añadido a la actividad profesional del artista Jose Halconero.

---

## Backend

En primer lugar, se procederá a la configuración del **backend**.  
Dado que se utilizará **Symfony** como framework principal, se comenzará preparando el **esqueleto del proyecto**, sobre el cual se desarrollará toda la lógica de negocio y la API del sistema.


![Instalacion de symfony](img/EsqueletoSymfony.png)

Una vez realizada la instalacion procedemos a configurar el docker-compose.yml de la siguiente manera para conectar Symfony y PostgreSQL.

![docker-compose](img/compose.png)

