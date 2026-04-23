# HALCONERO
## Plataforma Digital Integral para la Gestión de Estudios de Tatuaje y Arte

**Trabajo de Fin de Grado — Ingeniería Informática / Desarrollo de Software**

| Campo | Detalle |
|---|---|
| Autor | Gonzalo Mansera Ruiz |
| Tutor | Ignacio Tomás Cabrero Barragán |
| Titulación | Desarrollo de Aplicaciones Web |
| Curso Académico | 2025-2026 |

---

## Índice de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Tecnologías Utilizadas](#2-tecnologías-utilizadas)
3. [Modelo Entidad-Relación y Esquema de Base de Datos](#3-modelo-entidad-relación-y-esquema-de-base-de-datos)
4. [Roles de Usuario y Permisos](#4-roles-de-usuario-y-permisos)
5. [Despliegue y Dockerización](#5-despliegue-y-dockerización)
6. [Casos de Uso](#6-casos-de-uso)
7. [Guía de Capturas de Pantalla Recomendadas](#7-guía-de-capturas-de-pantalla-recomendadas)
8. [Conclusiones y Trabajo Futuro](#8-conclusiones-y-trabajo-futuro)

---

## 1. Resumen del Proyecto

### 1.1 Descripción General

El presente Trabajo de Fin de Grado describe el diseño, desarrollo e implantación de **Halconero**, una plataforma web integral orientada a la digitalización y centralización de la gestión operativa de estudios de tatuaje y arte. El sistema ofrece un entorno unificado desde el que artistas tatuadores e ilustradores pueden administrar de forma autónoma su actividad profesional en línea, prescindiendo de herramientas externas desconectadas entre sí.

La plataforma aúna en un único sistema cuatro grandes módulos funcionales: un portafolio artístico interactivo, un sistema de gestión de citas con clientes, una tienda de merchandising con carrito de compra y un blog con capacidades de interacción social. El conjunto está diseñado para ofrecer una experiencia de usuario premium, apoyada en animaciones de alto rendimiento, y una interfaz de administración completa que centraliza todas las operaciones de negocio.

### 1.2 Problemática que Resuelve

Los estudios de tatuaje y arte independientes afrontan habitualmente una fragmentación en su gestión digital: utilizan redes sociales para mostrar su obra, aplicaciones externas para la agenda de citas, plataformas de terceros para ventas y herramientas separadas para la comunicación con clientes. Esta dispersión genera ineficiencias, pérdida de datos y una imagen de marca inconsistente.

Halconero propone una solución centralizada y con identidad visual propia que cubre la totalidad del ciclo cliente-artista: desde el primer contacto a través del portafolio hasta la finalización de una compra o la confirmación de una cita, pasando por la lectura del blog y la interacción social.

### 1.3 Objetivos del Proyecto

- Digitalizar la relación cliente-artista mediante un sistema de solicitud y gestión de citas personalizable.
- Centralizar la gestión de ventas de productos de merchandising con control de inventario en tiempo real.
- Proporcionar al artista una herramienta de publicación de contenido (blog) con capacidades de interacción social (comentarios, likes).
- Implementar una arquitectura robusta, escalable y portable basada en tecnologías modernas de desarrollo web.
- Garantizar la seguridad de los datos de los usuarios mediante prácticas estándar de la industria (JWT, Bcrypt).
- Facilitar el despliegue reproducible del entorno mediante contenedores Docker.

---

## 2. Tecnologías Utilizadas

La selección tecnológica del proyecto ha sido guiada por los principios de rendimiento, mantenibilidad, seguridad y adopción en la industria. Se ha optado por una arquitectura cliente-servidor desacoplada (frontend/backend independientes), lo que permite la evolución de cada capa de forma autónoma.

### 2.1 Frontend

La capa de presentación constituye la interfaz con la que interactúan directamente los usuarios finales. Se ha priorizado una experiencia visual de alta calidad, con tiempos de carga reducidos y animaciones fluidas.

| Tecnología / Librería | Versión | Propósito Principal |
|---|---|---|
| React | 19 | Biblioteca principal para la construcción de interfaces de usuario mediante componentes reutilizables y gestión del estado reactivo. |
| TypeScript | 5.x | Superconjunto tipado de JavaScript que mejora la robustez del código, facilita el mantenimiento y reduce errores en tiempo de desarrollo. |
| Vite | 6.x | Herramienta de construcción y servidor de desarrollo ultrarrápida que aprovecha los módulos ES nativos del navegador. |
| Tailwind CSS | 4 | Framework de CSS de utilidad que permite construir interfaces personalizadas directamente en el marcado sin salir del HTML/JSX. |
| GSAP (GreenSock) | 3.x | Librería de animación JavaScript de alto rendimiento profesional, utilizada para implementar transiciones, efectos de scroll y micro-interacciones de nivel premium. |
| Axios | 1.x | Cliente HTTP basado en promesas para la comunicación con la API REST del backend, con interceptores para la gestión centralizada de tokens JWT. |
| Lucide React | 0.x | Biblioteca de iconos SVG consistente y ligera, integrada con React para una iconografía uniforme en toda la interfaz. |

### 2.2 Backend

La capa de servidor gestiona la lógica de negocio, la persistencia de datos y la exposición de los servicios mediante una API REST. Se ha elegido Python con FastAPI por su excelente rendimiento asíncrono, su generación automática de documentación OpenAPI y su amplio ecosistema.

| Tecnología / Librería | Versión | Propósito Principal |
|---|---|---|
| Python | 3.12 | Lenguaje de programación principal del backend, elegido por su legibilidad, productividad y robusto ecosistema científico y web. |
| FastAPI | 0.110+ | Framework web moderno y de alto rendimiento para la creación de APIs REST con Python 3.8+, con soporte nativo para tipado y OpenAPI. |
| SQLAlchemy | 2.x | ORM (Object-Relational Mapping) que abstrae el acceso a la base de datos, permitiendo trabajar con modelos Python en lugar de SQL crudo. |
| Alembic | 1.x | Herramienta de migraciones de base de datos para SQLAlchemy, que permite gestionar la evolución del esquema de forma controlada y versionada. |
| Pydantic | 2.x | Librería de validación de datos que FastAPI utiliza internamente para serializar y validar los esquemas de entrada y salida de la API. |
| PostgreSQL | 15 | Sistema de gestión de base de datos relacional de código abierto, robusto y de alto rendimiento, elegido como motor principal de persistencia. |

### 2.3 Autenticación y Seguridad

La seguridad del sistema es un aspecto crítico que se ha abordado con las herramientas estándar de la industria, asegurando la correcta protección de las credenciales de los usuarios y el control de acceso a los recursos protegidos.

- **JWT (JSON Web Tokens):** Mecanismo de autenticación sin estado (stateless) utilizado para emitir tokens firmados digitalmente tras el inicio de sesión satisfactorio. Cada petición a un endpoint protegido debe incluir el token en la cabecera de autorización (Bearer Token). Los tokens tienen una vida útil limitada para reducir el riesgo en caso de interceptación.
- **Bcrypt:** Algoritmo de hashing adaptativo utilizado para el cifrado unidireccional de las contraseñas de los usuarios antes de su almacenamiento en la base de datos. Su factor de coste configurable lo protege contra ataques de fuerza bruta y ataques de diccionario.
- **CORS (Cross-Origin Resource Sharing):** Configuración explícita en FastAPI para controlar qué orígenes externos tienen permiso para realizar peticiones a la API, protegiendo contra solicitudes maliciosas desde dominios no autorizados.

---

## 3. Modelo Entidad-Relación y Esquema de Base de Datos

### 3.1 Descripción del Modelo

El esquema de base de datos de Halconero ha sido diseñado siguiendo los principios de normalización relacional (hasta tercera forma normal, 3NF) para evitar redundancias y garantizar la integridad referencial de los datos. El motor elegido es PostgreSQL 15, accedido a través del ORM SQLAlchemy.

### 3.2 Descripción de Tablas

#### Tabla: `usuarios`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único del usuario en el sistema. |
| nombre | VARCHAR(100) | NOT NULL | Nombre completo o nombre artístico del usuario. |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Dirección de correo electrónico, utilizada como identificador de inicio de sesión. |
| telefono | VARCHAR(20) | NULLABLE | Número de teléfono de contacto del usuario. |
| password_hash | VARCHAR(255) | NOT NULL | Hash Bcrypt de la contraseña. Nunca se almacena la contraseña en texto plano. |
| is_admin | BOOLEAN | NOT NULL, DEFAULT FALSE | Indicador del rol del usuario. TRUE para administradores, FALSE para clientes. |
| foto_perfil | VARCHAR(500) | NULLABLE | URL de la imagen de perfil del usuario, almacenada en el servidor de archivos. |

#### Tabla: `obras`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único de la obra artística. |
| titulo | VARCHAR(200) | NOT NULL | Título descriptivo de la obra o pieza del portafolio. |
| descripcion | TEXT | NULLABLE | Descripción extendida de la obra, técnica utilizada, contexto o inspiración. |
| tipo | VARCHAR(50) | NOT NULL | Categoría de la obra: valores posibles 'Tattoo' o 'Ilustracion'. |
| imagen_url | VARCHAR(500) | NOT NULL | URL de la imagen de alta resolución de la obra artística. |

#### Tabla: `citas`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único de la solicitud de cita. |
| usuario_id | INTEGER | FK(usuarios.id), NOT NULL | Referencia al usuario cliente que solicita la cita. |
| idea | TEXT | NOT NULL | Descripción detallada de la idea o diseño que el cliente desea tatuarse o encargar. |
| fecha_cita | TIMESTAMP | NOT NULL | Fecha y hora propuesta por el cliente para la cita. |
| estado | VARCHAR(20) | NOT NULL, DEFAULT 'pendiente' | Estado actual de la cita: 'pendiente', 'confirmada' o 'cancelada'. |

#### Tabla: `posts`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único de la entrada del blog. |
| titulo | VARCHAR(300) | NOT NULL | Título de la entrada del blog. |
| contenido | TEXT | NOT NULL | Cuerpo del artículo en formato texto enriquecido (Markdown o HTML). |
| categoria | VARCHAR(100) | NULLABLE | Categoría temática del post (e.g., 'Novedades', 'Tutoriales', 'Behind the Scenes'). |
| imagen_url | VARCHAR(500) | NULLABLE | URL de la imagen de cabecera o portada del post. |
| fecha | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora de publicación de la entrada. |

#### Tabla: `merchandising`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único del producto de la tienda. |
| nombre | VARCHAR(200) | NOT NULL | Nombre comercial del producto (e.g., 'Camiseta Halconero Edition'). |
| descripcion | TEXT | NULLABLE | Descripción detallada del producto, materiales, tallas disponibles, etc. |
| precio | DECIMAL(10,2) | NOT NULL | Precio de venta al público en euros, con precisión de dos decimales. |
| stock | INTEGER | NOT NULL, DEFAULT 0 | Cantidad disponible en inventario. El sistema previene ventas con stock <= 0. |
| imagen_url | VARCHAR(500) | NULLABLE | URL de la imagen representativa del producto. |

#### Tabla: `pedidos`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único del pedido. |
| usuario_id | INTEGER | FK(usuarios.id), NOT NULL | Referencia al usuario que realizó el pedido. |
| fecha_pedido | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora de creación del pedido. |
| total | DECIMAL(10,2) | NOT NULL | Importe total del pedido calculado como suma de sus líneas de detalle. |
| estado | VARCHAR(50) | NOT NULL, DEFAULT 'procesando' | Estado del pedido: 'procesando', 'enviado', 'entregado', 'cancelado'. |

#### Tabla: `items_pedido`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único del ítem de línea del pedido. |
| pedido_id | INTEGER | FK(pedidos.id), NOT NULL | Referencia al pedido al que pertenece el ítem. |
| producto_id | INTEGER | FK(merchandising.id), NOT NULL | Referencia al producto adquirido. |
| cantidad | INTEGER | NOT NULL, DEFAULT 1 | Número de unidades del producto incluidas en la línea. |
| precio_unitario | DECIMAL(10,2) | NOT NULL | Precio del producto en el momento de la compra (precio histórico). |

#### Tabla: `resenas`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único de la reseña. |
| usuario_id | INTEGER | FK(usuarios.id), NOT NULL | Referencia al usuario autor de la reseña. |
| contenido | TEXT | NOT NULL | Texto de la reseña o valoración del servicio o experiencia del usuario. |
| puntuacion | SMALLINT | NOT NULL, CHECK(1-5) | Valoración numérica del 1 al 5 estrellas. |
| fecha | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora de publicación de la reseña. |

#### Tabla: `comentarios`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único del comentario. |
| post_id | INTEGER | FK(posts.id), NOT NULL | Referencia al post del blog sobre el que se comenta. |
| usuario_id | INTEGER | FK(usuarios.id), NOT NULL | Referencia al usuario autor del comentario. |
| contenido | TEXT | NOT NULL | Texto del comentario. |
| fecha | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora de publicación del comentario. |

#### Tabla: `likes`

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT, NOT NULL | Identificador único del registro de like. |
| post_id | INTEGER | FK(posts.id), NOT NULL | Referencia al post del blog que recibe el like. |
| usuario_id | INTEGER | FK(usuarios.id), NOT NULL | Referencia al usuario que otorga el like. |
| fecha | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora en que se registró el like. |

### 3.3 Relaciones entre Entidades

- Un usuario puede tener muchas citas (relación **1:N** entre `usuarios` y `citas`).
- Un usuario puede realizar muchos pedidos; cada pedido pertenece a un único usuario (**1:N**).
- Un pedido puede contener muchos ítems; cada ítem pertenece a un único pedido (**1:N** entre `pedidos` e `items_pedido`).
- Un producto de merchandising puede aparecer en múltiples ítems de pedido (**1:N** entre `merchandising` e `items_pedido`).
- Un usuario puede publicar muchas reseñas (**1:N** entre `usuarios` y `resenas`).
- Un post puede recibir muchos comentarios de diferentes usuarios (**1:N** entre `posts` y `comentarios`).
- Un post puede recibir muchos likes de diferentes usuarios (**1:N** entre `posts` y `likes`). La combinación `(post_id, usuario_id)` es única para evitar duplicados.

---

## 4. Roles de Usuario y Permisos

El sistema de Halconero implementa un modelo de control de acceso basado en roles (**RBAC**, Role-Based Access Control) con dos perfiles diferenciados, cuya asignación queda registrada en el campo `is_admin` de la tabla `usuarios`. La validación de permisos se realiza en el backend mediante dependencias de FastAPI que verifican el payload del token JWT en cada endpoint protegido.

### 4.1 Rol Administrador

El administrador representa al propietario o gestor del estudio artístico. Tiene acceso total y exclusivo al panel de administración de la plataforma, desde el cual puede controlar todos los aspectos operativos del sistema.

**Gestión del Portafolio**
- Subir nuevas obras al portafolio (imagen, título, descripción y tipo: Tattoo o Ilustración).
- Editar los metadatos de obras existentes.
- Eliminar obras del portafolio público.

**Gestión del Blog**
- Crear, editar y eliminar entradas en el blog con soporte de texto enriquecido.
- Asignar categorías e imagen de portada a los posts.
- Moderar los comentarios publicados por los usuarios.

**Gestión de la Tienda**
- Crear, editar y eliminar productos de merchandising.
- Gestionar el stock de inventario de cada producto.
- Visualizar el historial completo de pedidos de todos los usuarios.
- Actualizar el estado de los pedidos (procesando, enviado, entregado, cancelado).

**Gestión de Citas**
- Visualizar el listado completo de todas las solicitudes de cita recibidas.
- Confirmar o denegar solicitudes de cita pendientes, mediante correo electrónico.
- Acceder al detalle de la idea descrita por el cliente para cada solicitud.

### 4.2 Rol Usuario Registrado (Cliente)

El usuario cliente es el visitante que se registra en la plataforma para acceder a las funcionalidades interactivas. A diferencia del administrador, su acceso está limitado a las acciones propias de un cliente.

**Portafolio**
- Explorar el portafolio público de obras filtrado por tipo (Tattoo / Ilustración).
- Visualizar el detalle de cada obra artística.

**Citas**
- Cumplimentar el formulario de solicitud de cita, describiendo su idea.

**Tienda**
- Navegar el catálogo de productos de merchandising.
- Añadir y eliminar productos del carrito de compra.
- Completar el proceso de compra y generar un pedido.
- Consultar el historial de sus pedidos personales.

**Blog e Interacción Social**
- Leer las entradas del blog publicadas por el administrador.
- Publicar comentarios en los posts del blog.
- Dar y retirar "me gusta" (like) a las entradas del blog.
- Publicar reseñas valorando la experiencia con el estudio.

---

## 5. Despliegue y Dockerización

### 5.1 Filosofía de Contenedores

Con el objetivo de garantizar la reproducibilidad del entorno de ejecución y eliminar las inconsistencias derivadas de diferencias entre entornos de desarrollo y producción, el sistema de base de datos de Halconero se ha dockerizado íntegramente utilizando **Docker** y **Docker Compose**.

Docker Compose permite definir y orquestar múltiples contenedores de forma declarativa en un único archivo (`docker-compose.yml`), gestionando las dependencias entre servicios, las variables de entorno, los volúmenes persistentes y la red interna de comunicación entre ellos.

### 5.2 Servicios Definidos

El archivo `docker-compose.yml` define dos servicios que operan en una red privada aislada:

#### Servicio: PostgreSQL 15 (`db`)

- **Imagen base:** `postgres:15-alpine` (imagen oficial minimalista de PostgreSQL versión 15).
- **Función:** Motor principal de base de datos relacional. Almacena la totalidad de los datos del sistema.
- **Configuración:** Las credenciales (usuario, contraseña y nombre de base de datos) se inyectan como variables de entorno, idealmente gestionadas mediante un archivo `.env` excluido del control de versiones.
- **Persistencia:** Se define un volumen Docker nombrado (`postgres_data`) para garantizar que los datos persisten más allá del ciclo de vida del contenedor, sobreviviendo a reinicios y actualizaciones de la imagen.
- **Healthcheck:** Se configura una comprobación de salud (`pg_isready`) para que los servicios dependientes no inicien hasta que PostgreSQL esté listo para aceptar conexiones.

#### Servicio: Adminer (`adminer`)

- **Imagen base:** `adminer` (imagen oficial del gestor de bases de datos web Adminer).
- **Función:** Interfaz web ligera para la administración visual de la base de datos PostgreSQL. Permite inspeccionar tablas, ejecutar consultas SQL, exportar datos y gestionar la estructura del esquema sin necesidad de un cliente de base de datos instalado localmente.
- **Acceso:** Expone su interfaz a través de un puerto del host (por defecto el 8080), accesible desde el navegador del desarrollador.
- **Dependencia:** El servicio se configura para iniciarse únicamente tras la correcta inicialización del servicio de base de datos (`depends_on` con condición `service_healthy`).

### 5.3 Ventajas del Enfoque Dockerizado

- **Portabilidad:** Cualquier miembro del equipo puede levantar el entorno de base de datos completo ejecutando un único comando (`docker-compose up -d`), independientemente de su sistema operativo.
- **Reproducibilidad:** El entorno de desarrollo es funcionalmente idéntico al de producción, eliminando la categoría de errores derivados de diferencias de versión o configuración.
- **Aislamiento:** Los servicios operan en una red Docker privada y no interfieren con otros proyectos o servicios del sistema anfitrión.
- **Facilidad de reinicio:** Restablecer el estado de la base de datos a un punto limpio es tan sencillo como eliminar el volumen y recrear los contenedores.

---

## 6. Casos de Uso

### 6.1 Casos de Uso del Administrador

#### CU-A01: Gestión del Portafolio Artístico

| Atributo | Detalle |
|---|---|
| Identificador | CU-A01 |
| Actor | Administrador |
| Precondición | El administrador ha iniciado sesión con credenciales válidas y posee token JWT con rol `is_admin=true`. |
| Descripción | El administrador accede al panel de gestión, navega a la sección de Obras y sube una nueva pieza artística adjuntando la imagen, indicando el título, la descripción y seleccionando el tipo (Tattoo o Ilustración). |
| Flujo principal | 1. Accede al panel de administración. 2. Selecciona "Nueva Obra". 3. Cumplimenta el formulario y adjunta la imagen. 4. Confirma el guardado. 5. La obra aparece publicada en el portafolio público. |
| Postcondición | La obra queda registrada en la tabla `obras` y es visible para todos los visitantes. |

#### CU-A02: Gestión de Solicitudes de Cita

| Atributo | Detalle |
|---|---|
| Identificador | CU-A02 |
| Actor | Administrador |
| Precondición | Existen solicitudes de cita con estado 'pendiente' en el sistema. |
| Descripción | El administrador consulta el listado de citas pendientes, revisa la idea descrita por el cliente y la fecha propuesta, y decide si confirma o rechaza la solicitud. El sistema actualiza el estado de la cita. |
| Flujo principal | 1. El administrador accede a "Gestión de Citas". 2. Revisa las citas con estado 'pendiente'. 3. Selecciona una cita para ver el detalle. 4. Pulsa "Confirmar" o "Cancelar". 5. El estado de la cita se actualiza en base de datos. |
| Postcondición | La cita queda con estado 'confirmada' o 'cancelada'. El cliente puede consultar el estado actualizado desde su perfil. |

#### CU-A03: Gestión del Inventario de la Tienda

| Atributo | Detalle |
|---|---|
| Identificador | CU-A03 |
| Actor | Administrador |
| Precondición | El administrador ha iniciado sesión. |
| Descripción | El administrador accede al módulo de tienda, puede crear nuevos productos indicando nombre, descripción, precio e imagen, así como actualizar el stock disponible de productos existentes. |
| Flujo principal | 1. Accede a "Gestión de Tienda". 2. Selecciona "Nuevo Producto" o edita uno existente. 3. Modifica los campos deseados (incluido el stock). 4. Guarda los cambios. |
| Postcondición | El producto queda creado o actualizado y los cambios se reflejan de inmediato en la tienda pública. |

### 6.2 Casos de Uso del Cliente Registrado

#### CU-C01: Solicitud de Cita Personalizada

| Atributo | Detalle |
|---|---|
| Identificador | CU-C01 |
| Actor | Usuario Registrado (Cliente) |
| Precondición | El usuario ha iniciado sesión y posee un token JWT válido. |
| Descripción | El usuario navega a la sección de citas, cumplimenta el formulario describiendo su idea (diseño, estilo, tamaño, zona corporal). La solicitud queda registrada con estado 'pendiente'. |
| Flujo principal | 1. El usuario navega a "Solicitar Cita". 2. Describe su idea en el campo de texto. 3. Envía el formulario. 4. El sistema crea el registro en `citas` con estado 'pendiente' y muestra confirmación. |
| Postcondición | La solicitud queda registrada. El administrador puede verla en su panel y el usuario puede consultar su estado desde "Mis Citas". |

#### CU-C02: Compra de Productos de Merchandising

| Atributo | Detalle |
|---|---|
| Identificador | CU-C02 |
| Actor | Usuario Registrado (Cliente) |
| Precondición | El usuario ha iniciado sesión. Existen productos con stock > 0 en la tienda. |
| Descripción | El usuario explora el catálogo de productos, añade artículos al carrito de compra y, cuando está listo, inicia el proceso de checkout. El sistema registra el pedido y descuenta el stock correspondiente. |
| Flujo principal | 1. El usuario navega a "Tienda". 2. Selecciona un producto y lo añade al carrito. 3. Repite con otros productos si lo desea. 4. Accede al carrito y revisa los artículos. 5. Confirma el pedido. 6. El sistema crea el pedido y actualiza el stock. |
| Postcondición | Se crea un registro en `pedidos` y los correspondientes `items_pedido`. El stock de cada producto adquirido se reduce en la cantidad comprada. |

#### CU-C03: Interacción con el Blog

| Atributo | Detalle |
|---|---|
| Identificador | CU-C03 |
| Actor | Usuario Registrado (Cliente) |
| Precondición | El usuario ha iniciado sesión. Existen posts publicados en el blog. |
| Descripción | El usuario lee las entradas del blog y puede participar activamente dando un "me gusta" al post o escribiendo y enviando un comentario que queda visible para todos los visitantes. |
| Flujo principal | 1. El usuario accede al Blog. 2. Lee la entrada deseada. 3a. Pulsa el icono de "Like": se registra un nuevo like asociado al `(post_id, usuario_id)`. Si ya existía, se elimina (toggle). 3b. O escribe un comentario y lo envía: se registra en la tabla `comentarios`. |
| Postcondición | El like o comentario queda registrado en base de datos y es visible de inmediato en la interfaz. |

---

## 7. Guía de Capturas de Pantalla Recomendadas

La documentación visual es un componente fundamental de la memoria de un Trabajo de Fin de Grado, ya que permite al tribunal evaluar de forma directa la calidad, coherencia y completitud de la solución desarrollada.

### 7.1 Capturas de la Interfaz Pública (Frontend)

| Ref. | Sección / Pantalla | Descripción | Captura |
|---|---|---|---|
| CP-01 | Página de Inicio (Home) — Estado inicial | La landing page completa, mostrando el hero section con el logotipo, el claim principal y el botón de llamada a la acción. Debe evidenciar la animación GSAP de entrada. | ![CP-01](img/user/Home.png) |
| CP-02 | Página de Inicio — Efecto Scroll (GSAP ScrollTrigger) | Captura tomada en posición intermedia del scroll, mostrando algún elemento en transición para evidenciar las animaciones premium. | ![CP-02](img/user/scroll-intermedio.png) |
| CP-03 | Galería del Portafolio — Vista general | La cuadrícula (grid) completa de obras artísticas con el filtro por tipo (Tattoo / Ilustración) visible. | ![CP-03](img/user/galeria-portfolio.png) |
| CP-04 | Galería del Portafolio — Vista de detalle de obra | El modal o página de detalle de una obra individual, mostrando imagen ampliada, título, descripción y tipo. | ![CP-04](img/user/detalle-obra.png) |
| CP-05 | Formulario de Solicitud de Cita | El formulario completo con los campos de descripción de idea, selector de fecha/hora y botón de envío, con datos de ejemplo introducidos. | ![CP-05](img/user/formulario-contacto.png) |
| CP-06 | Tienda de Merchandising — Catálogo | La página principal de la tienda mostrando la cuadrícula de productos con nombre, imagen y precio. | ![CP-06](img/user/catalogo-merchan.png) |
| CP-07 | Tienda de Merchandising — Carrito de compra | El panel del carrito con uno o varios productos añadidos, mostrando cantidades, precios unitarios y total acumulado. | ![CP-07](img/user/carrito.png) |
| CP-08 | Blog — Listado de posts | La página principal del blog con las entradas publicadas, imagen de portada, título, categoría y fecha. | ![CP-08](img/user/blog.png) |
| CP-09 | Blog — Detalle de un post con interacción | La página de lectura de un post mostrando el contenido, contador de likes, botón de like activo/inactivo y el hilo de comentarios. | ![CP-09](img/user/detalle-blog.png) |
| CP-10 | Sección de Reseñas | La sección de testimonios mostrando valoraciones publicadas por los usuarios con su puntuación en estrellas. | ![CP-10](img/user/valoraciones.png) |

### 7.2 Capturas del Panel de Administración

| Ref. | Sección / Pantalla | Descripción | Captura |
|---|---|---|---|
| CA-01 | Gestión de Citas — Listado y acciones | La tabla de citas con columnas de nombre del cliente, descripción breve de la idea y estado actual con etiquetas de color. Incluye los botones de acción "Confirmar" y "Cancelar" diferenciados visualmente. | ![CA-01](img/admin/admin-citas.png) |
| CA-02 | Gestión del Portafolio — Formulario de subida | El formulario de creación/edición de obra con los campos de título, descripción, tipo y selector de imagen. | ![CA-02](img/admin/gestion-obra.png) |
| CA-03 | Gestión de la Tienda — Listado de productos | La tabla de gestión de productos con nombre, precio, stock actual y botones de acción (editar, eliminar). | ![CA-03](img/admin/gestion-merchan.png) |
| CA-04 | Gestión de Pedidos — Historial | El listado de pedidos de todos los usuarios con información de fecha, total, cliente y estado, con posibilidad de actualizar el estado. | ![CA-04](img/admin/pedidos-admin.png) |
| CA-05 | Gestión del Blog — Editor de posts | El editor de creación de posts con los campos de título, categoría, contenido y previsualización de imagen de portada. | ![CA-05](img/admin/gestion-posts.png) |

### 7.3 Capturas de la Infraestructura y Herramientas de Desarrollo

| Ref. | Sección / Pantalla | Descripción | Captura |
|---|---|---|---|
| CI-01 | Adminer — Interfaz de base de datos | La interfaz web de Adminer con la conexión establecida a PostgreSQL, mostrando el listado de tablas del esquema de Halconero. | ![CI-01](img/Herramientas/Interfaz-adminer.png) |
| CI-02 | Adminer — Visualización de una tabla | La vista de contenido de alguna tabla relevante (e.g., `usuarios` o `citas`) con registros de prueba y sus columnas. | ![CI-02](img/Herramientas/tabla-adminer.png) |
| CI-03 | Documentación OpenAPI (Swagger UI) | La interfaz de documentación automática generada por FastAPI (`/docs`), con el listado de endpoints agrupados por módulo. | ![CI-03](img/Herramientas/OpenApi.png) |

---

## 8. Conclusiones y Trabajo Futuro

### 8.1 Conclusiones

El desarrollo de Halconero ha permitido abordar la construcción de una aplicación web full-stack completa, cubriendo desde el diseño del modelo de datos relacional hasta la implementación de una interfaz de usuario de alto nivel, pasando por el desarrollo de una API REST robusta y la configuración de un entorno de despliegue reproducible mediante Docker.

A lo largo del proyecto se han aplicado y consolidado conocimientos de diversas disciplinas de la ingeniería del software: patrones de arquitectura cliente-servidor desacoplada, seguridad en aplicaciones web (JWT, Bcrypt), diseño de bases de datos relacionales, desarrollo frontend con React y TypeScript, y automatización del entorno de desarrollo con contenedores.

El resultado es una plataforma funcional que da respuesta a una necesidad real del sector creativo y artístico, digitalizando de forma integral la relación entre el artista y sus clientes y centralizando la gestión de múltiples verticales de negocio en un único sistema coherente.

### 8.2 Posibles Líneas de Trabajo Futuro

- Implementación de un sistema de notificaciones en tiempo real (WebSockets o Server-Sent Events) para informar al cliente del cambio de estado de su cita o pedido.
- Integración de una pasarela de pago real (Stripe, PayPal) para completar el flujo de compra con transacciones reales.
- Desarrollo de una aplicación móvil nativa (React Native o Flutter) que consuma la misma API REST del backend.
- Implementación de un sistema de búsqueda avanzado con Elasticsearch para la búsqueda de obras, posts y productos.
- Incorporación de analíticas de uso mediante herramientas como Plausible o Umami para proporcionar métricas de negocio al administrador.
- Ampliación del sistema de roles con un perfil de "Artista Colaborador" que pueda publicar obras propias sin acceso completo al panel de administración.
- Certificación y despliegue en producción en un proveedor cloud (AWS, Railway, Fly.io) con HTTPS mediante Let's Encrypt.

---