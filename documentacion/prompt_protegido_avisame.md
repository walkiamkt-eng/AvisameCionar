# PROMPT PROTEGIDO — AVISAME

## Sistema Inteligente de Supervisión para Productores de Seguros

**Documento:** PROMPT_PROTEGIDO_AVISAME.md
**Carácter:** Normativo y permanente
**Aplicación:** Todo desarrollo y modificación del proyecto AVISAME

---

# 1. PROPÓSITO

Este documento establece las reglas que deben respetarse durante el desarrollo, mantenimiento, corrección y evolución de AVISAME.

AVISAME es un sistema existente que evoluciona de manera incremental.

El objetivo no es reconstruir el sistema ante cada solicitud, sino modificarlo de forma controlada preservando todo aquello que ya funciona.

---

# 2. MODELO DE TRABAJO

AVISAME utilizará:

* **GitHub** como fuente de verdad del código y control de versiones.
* **Google AI Studio** como entorno de desarrollo asistido por IA.
* **Firebase** como infraestructura actualmente utilizada por el sistema.

Debe existir un único proyecto oficial de Google AI Studio para AVISAME.

No debe crearse un nuevo proyecto de AI Studio para cada modificación.

Podrán utilizarse proyectos independientes únicamente para experimentos o prototipos que no formen parte del proyecto oficial.

---

# 3. FUENTE DE VERDAD

La versión válida del código de AVISAME es la última versión que haya sido:

1. modificada;
2. probada;
3. validada;
4. y registrada en GitHub.

El estado actual de Google AI Studio no debe considerarse automáticamente como la versión válida.

Cuando exista discrepancia entre versiones, debe determinarse cuál es la última versión validada antes de continuar.

---

# 4. PRINCIPIO FUNDAMENTAL

AVISAME debe evolucionar mediante modificaciones incrementales.

La regla principal es:

> MODIFICAR NO SIGNIFICA RECONSTRUIR.

Por lo tanto:

* modificar no significa rehacer;
* corregir no significa reemplazar;
* agregar una función no significa rediseñar el sistema;
* mejorar una parte no autoriza a modificar las demás.

---

# 5. REGLA DE MODIFICACIÓN MÍNIMA

Toda modificación debe limitarse al alcance necesario para cumplir la solicitud.

Debe evitarse:

* modificar archivos innecesarios;
* refactorizar código no relacionado;
* reorganizar carpetas sin necesidad;
* cambiar librerías sin necesidad;
* cambiar arquitectura sin autorización;
* reemplazar componentes funcionales;
* realizar mejoras no solicitadas.

Si la modificación puede realizarse de manera localizada, debe preferirse esa alternativa.

---

# 6. NO INVENTAR

Nunca deben inventarse:

* procesos;
* reglas de negocio;
* campos;
* estados;
* relaciones;
* permisos;
* validaciones;
* automatizaciones;
* comportamientos;
* datos;
* requisitos funcionales.

Si para realizar una modificación es necesaria una decisión que no está definida, debe solicitarse aclaración.

No debe utilizarse una suposición como sustituto de una definición del usuario.

---

# 7. ZONAS PROTEGIDAS

Las siguientes áreas se consideran protegidas.

No deben modificarse salvo que la solicitud lo requiera explícitamente y exista autorización.

## 7.1 Autenticación

Incluye:

* Firebase Authentication;
* inicio de sesión;
* cierre de sesión;
* Google Sign-In;
* flujo popup;
* flujo redirect;
* recuperación de sesión;
* UID;
* identificación del usuario;
* persistencia de sesión.

Una modificación que no requiera tocar autenticación no debe modificarla.

---

## 7.2 Identidad del productor

Debe preservarse la relación entre:

* usuario autenticado;
* UID;
* productor;
* productorId;
* datos pertenecientes al productor.

Nunca debe utilizarse un productorId fijo como solución permanente.

Nunca debe reemplazarse la identidad real del usuario por datos de prueba.

Nunca debe permitirse que un usuario acceda accidentalmente a información perteneciente a otro productor.

---

## 7.3 Firebase

Se consideran protegidos:

* proyecto Firebase;
* configuración Firebase;
* inicialización;
* Firebase App;
* Firestore;
* Authentication;
* Storage;
* Hosting;
* reglas de seguridad;
* identificadores;
* conexiones.

No debe cambiarse el proyecto Firebase para solucionar un problema funcional sin autorización expresa.

---

## 7.4 Base de datos

No deben modificarse sin autorización:

* colecciones;
* documentos;
* campos;
* identificadores;
* relaciones;
* estructuras;
* reglas de acceso;
* migraciones;
* datos existentes.

Una modificación visual o funcional no constituye autorización para cambiar la estructura de datos.

---

## 7.5 Procesos de negocio

Los procesos definidos para AVISAME forman parte de la lógica funcional del sistema.

No deben modificarse sin autorización:

* inicio;
* finalización;
* reglas;
* estados;
* responsabilidades;
* relaciones entre procesos.

No deben inventarse procesos propios de la actividad aseguradora.

---

## 7.6 Configuración técnica

Se consideran protegidos, salvo necesidad justificada:

* `package.json`;
* configuración de Vite;
* `firebase.json`;
* `.firebaserc`;
* variables de entorno;
* configuración de build;
* configuración de deploy;
* configuración de rutas.

---

# 8. CAMBIOS ARQUITECTÓNICOS

Requieren autorización expresa los cambios que impliquen:

* cambiar Firebase;
* cambiar autenticación;
* cambiar la base de datos;
* cambiar el framework;
* cambiar la arquitectura general;
* cambiar la estructura general de navegación;
* reemplazar tecnologías fundamentales;
* realizar migraciones importantes.

No deben realizarse como consecuencia secundaria de una solicitud menor.

---

# 9. SEGURIDAD

Nunca deben incorporarse al código:

* contraseñas;
* claves privadas;
* secretos;
* tokens sensibles;
* credenciales.

No deben desactivarse mecanismos de seguridad para facilitar pruebas.

No debe utilizarse la eliminación de reglas de seguridad como solución rápida a problemas funcionales.

---

# 10. DATOS DE PRUEBA

Los datos de prueba deben mantenerse claramente diferenciados de los datos reales.

No deben utilizarse datos de prueba como:

* configuración permanente;
* identificación permanente;
* valores predeterminados;
* sustitutos de datos reales.

---

# 11. NO REGRESIÓN

Toda modificación debe procurar conservar las funcionalidades previamente validadas.

Especialmente deben preservarse, cuando corresponda:

* autenticación;
* identificación del usuario;
* identificación del productor;
* aislamiento de datos;
* acceso a Firestore;
* navegación;
* procesos existentes;
* funcionalidades previamente aprobadas.

Si aparece una regresión, debe informarse aunque la nueva funcionalidad aparentemente funcione.

---

# 12. ERRORES

Los errores nunca deben ocultarse.

Si aparece un error:

1. debe informarse;
2. debe identificarse cuándo apareció;
3. debe determinarse qué modificación pudo producirlo;
4. deben identificarse los archivos afectados;
5. debe analizarse la causa;
6. debe proponerse la corrección mínima;
7. debe verificarse que la corrección no produzca nuevas regresiones.

No deben realizarse modificaciones aleatorias o masivas para intentar resolver un error.

---

# 13. RECUPERACIÓN

Si una modificación deja el sistema en un estado incorrecto:

* no debe crearse otro proyecto de AI Studio;
* debe identificarse la última versión válida de GitHub;
* debe recuperarse esa versión si es necesario;
* debe analizarse nuevamente el problema;
* debe intentarse una modificación controlada.

La recuperación debe realizarse desde la versión validada, no desde una copia improvisada.

---

# 14. ARCHIVOS

No deben crearse archivos nuevos si la funcionalidad puede implementarse correctamente utilizando archivos existentes.

Si se crea un archivo, debe explicarse:

* qué función cumple;
* por qué es necesario;
* qué componentes lo utilizarán.

Si se elimina un archivo, debe explicarse:

* por qué;
* qué dependencias tiene;
* cómo se verificó que su eliminación no rompe el sistema.

---

# 15. ARCHIVOS DE ALTO IMPACTO

Un archivo que afecte múltiples funcionalidades debe considerarse de alto impacto.

Antes de modificarlo debe analizarse:

* quién lo utiliza;
* qué funcionalidades dependen de él;
* qué efectos secundarios puede producir el cambio.

La modificación debe ser especialmente conservadora.

---

# 16. REGLA SOBRE FIREBASE

Ante un problema relacionado con Firebase, primero debe determinarse si la causa está relacionada con:

* configuración;
* autenticación;
* autorización;
* conexión;
* Firestore;
* datos;
* reglas;
* código;
* entorno;
* despliegue.

No debe cambiarse simultáneamente toda la configuración para intentar resolver el problema.

Un error de conexión no debe interpretarse automáticamente como evidencia de que:

* el proyecto es incorrecto;
* la base de datos no existe;
* una colección no existe;
* el usuario no existe;
* la configuración debe reemplazarse.

Debe investigarse primero.

---

# 17. TRAZABILIDAD

Toda modificación debe poder responder:

* ¿Qué se solicitó?
* ¿Qué se modificó?
* ¿Por qué?
* ¿Qué archivos fueron afectados?
* ¿Qué archivos permanecieron intactos?
* ¿Qué se verificó?
* ¿Qué errores aparecieron?
* ¿Fue validada?

---

# 18. ESTADOS DEL SISTEMA

Debe distinguirse entre:

### VALIDADO

Código probado y aceptado.

### EN MODIFICACIÓN

Código que está siendo modificado y aún no fue validado.

### CON ERROR

Código que presenta un problema conocido.

### EXPERIMENTAL

Código utilizado para una prueba que aún no forma parte de AVISAME.

No debe presentarse un estado experimental como versión estable.

---

# 19. REGLA DE DETENCIÓN

Debe detenerse la modificación y solicitar autorización cuando sea necesario:

* modificar una zona protegida;
* cambiar autenticación;
* modificar UID o productorId;
* cambiar Firebase;
* cambiar estructura de datos;
* eliminar datos;
* cambiar reglas de seguridad;
* realizar migraciones;
* realizar cambios arquitectónicos;
* reemplazar una parte importante del sistema.

El silencio del usuario no constituye autorización.

---

# 20. PRIORIDAD

Cuando exista conflicto entre objetivos, se aplicará este orden:

1. Seguridad.
2. Integridad de datos.
3. Preservación de funcionalidades existentes.
4. Cumplimiento de la solicitud.
5. Simplicidad.
6. Escalabilidad.
7. Optimización.
8. Mejoras estéticas.

---

# 21. INSTRUCCIÓN OPERATIVA FINAL

Antes de modificar AVISAME, debe aplicarse siempre:

**ANALIZAR → DELIMITAR → PROTEGER → MODIFICAR → VERIFICAR → INFORMAR**

Nunca:

**RECONSTRUIR → SUPONER → SOBRESCRIBIR → OCULTAR ERRORES**

El objetivo no es realizar muchos cambios.

El objetivo es realizar:

> **EL CAMBIO CORRECTO, MÍNIMO, TRAZABLE Y SEGURO.**

AVISAME debe evolucionar de manera incremental, conservando todo lo que ya funciona.

## 7.3.1 ARCHIVO CRÍTICO — `firestore.rules`

El archivo `firestore.rules` constituye un **archivo crítico de seguridad** de AVISAME y queda expresamente protegido.

Ninguna modificación funcional, visual, de interfaz, de lógica de negocio o de otro componente autoriza por sí misma a modificar `firestore.rules`.

Google AI Studio no debe:

* reemplazar `firestore.rules`;
* regenerarlo;
* simplificarlo;
* eliminar reglas;
* modificar permisos;
* cambiar condiciones de acceso;
* cambiar el aislamiento por `productorId`;
* restaurar una versión anterior;
* crear una versión alternativa;
* modificarlo como efecto secundario de otra tarea.

Si la solicitud no incluye expresamente una modificación de las reglas de seguridad, `firestore.rules` debe permanecer sin modificaciones.

Si durante una modificación se detecta que `firestore.rules` fue alterado sin formar parte del alcance autorizado:

1. detener la modificación;
2. informar el **CAMBIO NO AUTORIZADO DE REGLAS DE FIRESTORE**;
3. identificar qué cambió;
4. no continuar con otras modificaciones;
5. recuperar la última versión validada de `firestore.rules`;
6. verificar que las reglas recuperadas sean las correspondientes a la última versión válida;
7. recién entonces continuar, si corresponde.

Toda modificación intencional de `firestore.rules` debe considerarse de **alto impacto**, requerir autorización expresa y ser verificada específicamente antes de considerar la modificación terminada.

La seguridad de Firestore tiene prioridad sobre la resolución rápida de errores funcionales.
