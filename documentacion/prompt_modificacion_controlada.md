# PROTOCOLO DE MODIFICACIÓN CONTROLADA — AVISAME

## 1. OBJETIVO

Este protocolo establece el procedimiento obligatorio para realizar modificaciones sobre AVISAME.

Debe utilizarse cada vez que se solicite:

* agregar una funcionalidad;
* modificar una funcionalidad;
* corregir un error;
* cambiar una interfaz;
* modificar una lógica;
* realizar una integración;
* realizar una modificación técnica.

Este protocolo debe aplicarse junto con:

`DOCUMENTACION/PROMPT_PROTEGIDO_AVISAME.md`

---

# 2. REGLA PRINCIPAL

Cada solicitud debe tratarse como una **unidad de modificación independiente**.

No deben incorporarse cambios adicionales que no formen parte de la solicitud.

Una modificación finaliza cuando:

1. el cambio fue realizado;
2. fue verificado;
3. se informó el resultado;
4. y el usuario lo validó.

---

# 3. FASE 1 — IDENTIFICACIÓN

Antes de modificar código, identificar:

### Solicitud

¿Qué pidió exactamente el usuario?

### Objetivo

¿Qué resultado debe obtenerse?

### Alcance

¿Qué parte del sistema debe modificarse?

### Fuera de alcance

¿Qué partes del sistema deben permanecer intactas?

Si alguno de estos puntos no puede determinarse razonablemente, debe solicitarse aclaración.

---

# 4. FASE 2 — INSPECCIÓN

Antes de escribir código:

1. localizar los archivos relacionados;
2. leer el código existente;
3. identificar dependencias;
4. identificar componentes que utilizan el código;
5. verificar si existe lógica compartida;
6. determinar si existen zonas protegidas involucradas.

No debe modificarse un archivo sin comprender su función dentro del sistema.

---

# 5. FASE 3 — ANÁLISIS DE IMPACTO

Clasificar el impacto.

### BAJO

Cambio localizado sin afectar datos, autenticación o arquitectura.

Ejemplos:

* texto;
* etiqueta;
* estilo;
* ajuste visual localizado.

### MEDIO

Cambio que afecta lógica o múltiples componentes.

Ejemplos:

* nueva validación;
* modificación de flujo;
* nuevo componente;
* cambio en comportamiento existente.

### ALTO

Cambio que afecta:

* autenticación;
* Firebase;
* Firestore;
* productorId;
* seguridad;
* estructura de datos;
* arquitectura;
* múltiples módulos.

Los cambios de alto impacto requieren especial análisis y autorización cuando afecten zonas protegidas.

---

# 6. FASE 4 — PLAN DE CAMBIO

Antes de ejecutar una modificación de impacto medio o alto, informar:

### Se modificará

* archivo;
* componente;
* función;
* configuración.

### Se preservará

* funcionalidades;
* archivos;
* zonas protegidas.

### Riesgo

Indicar los posibles efectos secundarios.

### Estrategia

Explicar brevemente cómo se realizará el cambio.

No debe ejecutarse una modificación de alto impacto sin autorización cuando afecte una zona protegida.

---

# 7. FASE 5 — EJECUCIÓN

Realizar únicamente los cambios necesarios.

Durante la ejecución:

* no refactorizar código no relacionado;
* no cambiar nombres innecesariamente;
* no mover archivos sin necesidad;
* no cambiar librerías sin necesidad;
* no modificar configuraciones protegidas sin autorización;
* no eliminar código funcional sin justificación.

Si durante la ejecución se descubre que el cambio requiere ampliar significativamente el alcance, detenerse y comunicarlo.

---

# 8. FASE 6 — VERIFICACIÓN TÉCNICA

Después de modificar:

### Código

Verificar:

* sintaxis;
* imports;
* referencias;
* tipos;
* componentes;
* funciones.

### Compilación

Ejecutar la verificación disponible para detectar errores de build.

### Funcionalidad

Comprobar que la funcionalidad modificada opere según lo solicitado.

### Regresión

Comprobar, cuando sea posible, que las funcionalidades relacionadas continúen funcionando.

---

# 9. FASE 7 — VERIFICACIÓN DE PROTECCIONES

Después del cambio comprobar expresamente que no se hayan alterado accidentalmente:

* autenticación;
* UID;
* productorId;
* aislamiento de datos;
* Firebase;
* Firestore;
* reglas de seguridad;
* configuración;
* procesos no relacionados.

Si alguna zona protegida fue modificada, debe informarse claramente.

---

# 10. FASE 8 — INFORME

Al terminar, generar el siguiente informe:

## MODIFICACIÓN REALIZADA

**Solicitud:**
[descripción]

**Resultado:**
[resultado obtenido]

**Archivos modificados:**

* `[archivo]` — [motivo]
* `[archivo]` — [motivo]

**Archivos creados:**

* ninguno / [lista]

**Archivos eliminados:**

* ninguno / [lista]

**Archivos inspeccionados pero no modificados:**

* [lista cuando sea relevante]

**Zonas protegidas afectadas:**

* ninguna / [detalle]

**Pruebas realizadas:**

* [lista]

**Errores encontrados:**

* ninguno / [detalle]

**Estado:**

* EN MODIFICACIÓN
* VALIDADO
* CON ERROR

---

# 11. SI LA PRUEBA FALLA

Si la modificación falla:

1. no ocultar el error;
2. no declarar la modificación como terminada;
3. identificar el error;
4. analizar la causa;
5. determinar si está relacionado con el cambio;
6. realizar únicamente la corrección necesaria;
7. volver a verificar.

Si para solucionar el error es necesario modificar una zona protegida, detenerse y solicitar autorización.

---

# 12. SI LA CORRECCIÓN NO FUNCIONA

No deben acumularse modificaciones indefinidamente sobre una versión inestable.

Si una modificación genera errores difíciles de resolver:

1. detener nuevos cambios;
2. identificar la última versión validada;
3. recuperar esa versión desde GitHub si fuera necesario;
4. documentar el problema;
5. analizar una estrategia alternativa;
6. iniciar nuevamente la modificación de forma controlada.

---

# 13. REGLA DE GITHUB

Una vez que el usuario valide una modificación:

1. identificar la versión resultante;
2. conservar el estado validado;
3. registrar la modificación en GitHub;
4. mantener el historial.

GitHub debe conservar la posibilidad de recuperar una versión anterior.

No debe eliminarse el historial para ocultar errores o simplificar el proyecto.

---

# 14. REGLA DE UNA MODIFICACIÓN A LA VEZ

Cuando sea posible:

**UNA SOLICITUD → UNA MODIFICACIÓN → UNA VALIDACIÓN**

No deben mezclarse modificaciones independientes.

Ejemplo incorrecto:

> Agregar clientes + cambiar login + modificar Firestore + rediseñar dashboard.

Ejemplo correcto:

> Agregar la funcionalidad solicitada al módulo de clientes.

Luego de validarla, realizar la siguiente modificación.

---

# 15. CAMBIOS NO SOLICITADOS

Si durante la modificación se detecta una mejora posible que no es necesaria para cumplir la solicitud:

**NO realizarla.**

Debe informarse como una posible mejora futura, sin incorporarla al cambio actual.

---

# 16. DESCUBRIMIENTO DE PROBLEMAS PREEXISTENTES

Si se encuentra un problema que ya existía antes de la modificación:

No debe atribuirse automáticamente al cambio actual.

Debe informarse como:

> **PROBLEMA PREEXISTENTE DETECTADO**

y explicar:

* dónde se detectó;
* qué impacto tiene;
* si afecta o no la modificación actual.

No debe corregirse automáticamente si está fuera del alcance de la solicitud.

---

# 17. CAMBIO DE ALCANCE

Si durante el trabajo se determina que la solicitud requiere cambios adicionales no previstos:

Detenerse y comunicar:

> **CAMBIO DE ALCANCE DETECTADO**

Indicar:

* qué nuevo cambio sería necesario;
* por qué;
* qué archivos afectaría;
* qué riesgos implica.

No ampliar unilateralmente el alcance.

---

# 18. REGLA PARA MODIFICACIONES DE ALTO IMPACTO

Antes de realizar una modificación de alto impacto debe quedar claramente establecido:

* qué se va a modificar;
* por qué;
* qué podría verse afectado;
* cómo se probará;
* cómo se recuperará la versión anterior si falla.

Las modificaciones que afecten autenticación, Firebase, Firestore, seguridad, productorId o arquitectura deben tratarse como modificaciones de alto impacto.

---

# 19. CIERRE DE LA MODIFICACIÓN

Una modificación se considera cerrada únicamente cuando:

* el cambio fue realizado;
* la compilación/verificación técnica fue realizada;
* la funcionalidad fue comprobada;
* no existen errores conocidos pendientes;
* se informó qué archivos fueron modificados;
* el usuario validó el resultado;
* la versión validada quedó identificada en GitHub.

Hasta entonces, el estado debe considerarse:

**EN MODIFICACIÓN**

---

# 20. SECUENCIA RESUMIDA

Todo cambio de AVISAME debe seguir:

```text
SOLICITUD
   ↓
IDENTIFICACIÓN
   ↓
INSPECCIÓN
   ↓
ANÁLISIS DE IMPACTO
   ↓
PLAN
   ↓
AUTORIZACIÓN SI CORRESPONDE
   ↓
MODIFICACIÓN MÍNIMA
   ↓
VERIFICACIÓN
   ↓
CONTROL DE REGRESIÓN
   ↓
INFORME
   ↓
VALIDACIÓN DEL USUARIO
   ↓
GITHUB
   ↓
NUEVA VERSIÓN VALIDADA
```

---

# 21. REGLA FINAL

El propósito de este protocolo no es impedir que AVISAME evolucione.

Su propósito es evitar que una modificación necesaria provoque accidentalmente daños en funcionalidades que ya funcionan.

Por lo tanto:

> **Cada cambio debe ser pequeño, comprensible, verificable, reversible y trazable.**

La estabilidad de AVISAME tiene prioridad sobre la velocidad de modificación.
