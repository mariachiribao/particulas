# 🖐️ Sistema de Partículas 3D Interactivo – Three.js + Hand Tracking

## 📌 Descripción

Proyecto de partículas 3D interactivo en tiempo real desarrollado con **Three.js** y **MediaPipe Hands**.

La aplicación utiliza la **cámara web del dispositivo** para detectar las manos y sus gestos, permitiendo al usuario interactuar con el sistema de partículas en tiempo real.

Al ingresar a la experiencia, el usuario debe otorgar permiso de acceso a la cámara. Una vez habilitada, los movimientos y gestos de las manos son detectados mediante la webcam y utilizados para modificar dinámicamente la escala, expansión, tamaño y color de las partículas.

El proyecto fue desarrollado de manera iterativa, incorporando **testing funcional y exploratorio** para validar tanto el comportamiento de la aplicación como la interacción entre el usuario, la cámara y el sistema de partículas.

---

## ✨ Funcionalidades

* 🟣 Partículas 3D dinámicas con animaciones suaves.
* 📷 Acceso a la cámara web mediante permiso del usuario.
* ✋ Detección de manos en tiempo real mediante webcam.
* 🤏 Control de escala y expansión mediante gestos.
* 👋 Detección de gestos como pinch, apertura y cierre de la mano.
* 🎨 Cambio dinámico de color y tamaño según la interacción.
* 🌌 Movimiento y dispersión de partículas en tiempo real.
* 🎬 Animación de bienvenida **"BIENVENIDOS"** ante un gesto específico.
* ⚙️ Gestión de estados del sistema:

  * `QA_IDLE`
  * `BIENVENIDOS_ANIMATING`
* 🖥️ Experiencia interactiva directamente desde el navegador.

---

## 🧪 Proceso de QA y Testing

Durante el desarrollo se realizaron actividades de **QA manual y testing exploratorio**, con especial foco en la interacción en tiempo real entre el usuario, la cámara web, los gestos y el sistema de partículas.

### 🔎 Pruebas funcionales

Se diseñaron y ejecutaron pruebas para validar:

* Acceso y carga inicial de la aplicación.
* Solicitud de permisos para utilizar la cámara web.
* Comportamiento de la aplicación al **aceptar el permiso de cámara**.
* Comportamiento de la aplicación al **rechazar o bloquear el permiso de cámara**.
* Detección de manos mediante la webcam.
* Reconocimiento de diferentes gestos.
* Respuesta de las partículas ante cada interacción.
* Cambios de escala, expansión, color y tamaño.
* Activación de la animación **"BIENVENIDOS"**.
* Transiciones entre los diferentes estados del sistema.
* Comportamiento de las partículas durante la interacción en tiempo real.

### 🧭 Testing exploratorio

Se realizaron pruebas exploratorias orientadas a detectar comportamientos inesperados durante la interacción:

* Diferentes posiciones de las manos frente a la cámara.
* Movimientos rápidos y lentos.
* Apertura y cierre repetido de la mano.
* Gestos realizados a diferentes distancias de la cámara.
* Interacciones repetitivas.
* Cambios entre diferentes gestos.
* Comportamiento ante pérdida temporal de detección de la mano.
* Respuesta visual y fluidez de las animaciones.

### 🐛 Gestión de incidencias

Las incidencias encontradas durante las pruebas fueron documentadas y utilizadas como base para realizar ajustes iterativos sobre la funcionalidad y la experiencia de usuario.

Luego de cada modificación se realizaron **re-tests** para verificar la corrección de los comportamientos identificados.

### 🎯 Enfoque de QA

El proceso de testing estuvo orientado principalmente a validar:

**Permisos → Cámara → Detección → Gestos → Interacción → Animaciones → Física → UX/UI**

De esta manera se buscó garantizar que la experiencia completa funcionara correctamente desde el acceso inicial a la cámara hasta la interacción del usuario con las partículas en tiempo real.

https://mariachiribao.github.io/particulas/


