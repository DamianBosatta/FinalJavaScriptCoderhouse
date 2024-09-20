Proyecto de Simulación de Estacionamiento

Descripción
Este proyecto simula un sistema de estacionamiento que permite a los usuarios gestionar el ingreso y salida de vehículos. El sistema incluye funcionalidades como estacionar coches, liberar espacios y reiniciar el estacionamiento, todo con almacenamiento local y una interfaz visual simple.

Requisitos Técnicos
Manipulación del DOM:

El proyecto utiliza JavaScript para manipular dinámicamente el HTML. No se incluye código JS dentro de los archivos HTML.
Uso de localStorage:

Se utilizan los métodos getItem, setItem y clear para almacenar y gestionar los datos del estacionamiento en el almacenamiento local del navegador.
Fetch y async/await:

Los datos del estacionamiento (como la disposición de espacios) se cargan desde un archivo .JSON usando fetch, y las operaciones asíncronas se manejan con async/await. Los errores se gestionan con bloques try/catch.
Estilos básicos:

El proyecto utiliza Bootstrap para la estructura básica y estilo visual, complementado con algunos estilos CSS personalizados.
Librerías externas:

Se ha utilizado SweetAlert2 para mejorar la experiencia de usuario en lugar de usar alert, prompt, o confirm.
Validación de datos:

Los datos ingresados (por ejemplo, las patentes de los vehículos) son validados antes de ser procesados.

Estructura del Proyecto
bash
Copy code
.
├── assets                  # Imágenes y otros elementos multimedia
│   └── coderimg.jpg         # Imagen de referencia para la página
├── css
│   └── style.css            # Estilos personalizados
├── js
│   ├── main.js              # Lógica principal de la aplicación
│   └── map.js               # Funciones relacionadas con la visualización del mapa de estacionamiento
├── json
│   └── parkingData.json     # Base de datos simulada para la disposición del estacionamiento
├── index.html               # Documento HTML principal
└── README.md                # Instrucciones del proyecto

Instalación y Uso

Requisitos:
Un navegador moderno con soporte para localStorage y fetch.
Conexión a internet para acceder a las librerías externas (Bootstrap y SweetAlert2).

Pasos para correr el proyecto:
Clonar el repositorio desde GitHub:


Uso del Simulador:

Estacionar Coche: Al hacer clic en el botón "Estacionar Coche", se te solicitará una patente. Si el formato es válido y hay espacio disponible, el coche será estacionado.
Liberar Espacio: Puedes liberar un espacio ingresando la patente del vehículo correspondiente.
Reiniciar Estacionamiento: Esta opción vacía todos los espacios y resetea los datos.
Tecnologías Utilizadas
HTML5
CSS3 (Bootstrap 5.3)
JavaScript (ES6+)
SweetAlert2: Para mostrar alertas interactivas y mensajes.
LocalStorage: Para almacenar el estado del estacionamiento.
Fetch API: Para cargar datos desde un archivo JSON.
Buenas Prácticas Aplicadas
Programación defensiva: Se validan los datos ingresados y se proporcionan valores por defecto en los parámetros de las funciones.
Consistencia en nombres: Se usa camelCase de forma consistente en todo el proyecto.
Manejo de errores: Uso de try/catch en todas las operaciones asíncronas.

Autor
Damian Bosatta
