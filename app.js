// Importamos los módulos necesarios.
// express → framework para crear el servidor web.
// hbs → motor de plantillas (Handlebars) para renderizar vistas dinámicas.
// fs → módulo nativo de Node.js para trabajar con archivos (persistencia).
// path → módulo nativo para manejar rutas de archivos de forma segura.
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');

// Creamos la aplicación Express.
// Aquí aplicamos el concepto de inicialización del servidor.
const app = express();

// Definimos la ruta absoluta del archivo data.json.
// Usamos path.join() para evitar problemas entre sistemas operativos (Windows, Linux, etc.).
// Esto es una buena práctica en el manejo de archivos.
const DATA_PATH = path.join(__dirname, 'data.json');


// ===== Helper Handlebars =====
// Registramos un helper personalizado llamado "eq".
// Los helpers en Handlebars permiten agregar lógica simple en las vistas.
// En este caso, comparamos dos valores para saber si son iguales (===).
// Esto se usa mucho en vistas para validar estados o condiciones.
hbs.registerHelper('eq', (a, b) => a === b);


// ===== Configuración =====
// Configuramos el motor de plantillas.
// Aquí aplicamos el concepto de View Engine en Express.
app.set('view engine', 'hbs');

// Middleware para servir archivos estáticos (CSS, imágenes, JS del frontend).
// express.static es un middleware, concepto clave en Express.
app.use(express.static('public'));

// Middleware para poder leer datos enviados desde formularios (req.body).
// extended: true permite enviar objetos complejos.
// Aquí aplicamos el concepto de procesamiento de formularios en backend.
app.use(express.urlencoded({ extended: true }));


// ===== Persistencia =====
// Función para obtener las tareas desde el archivo JSON.
// Aquí aplicamos lectura síncrona con fs.readFileSync.
// Se usa JSON.parse para convertir texto JSON en objeto JavaScript.
const getTasks = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

// Función para guardar tareas en el archivo JSON.
// JSON.stringify convierte el objeto en texto JSON.
// null, 2 sirve para formatear el archivo con indentación (más legible).
// Aquí aplicamos persistencia básica sin base de datos.
const saveTasks = (data) =>
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));


// ===== HU-01 =====
// Definimos rutas GET.
// Las rutas son parte fundamental del enrutamiento en Express.
// Cada ruta responde renderizando una vista diferente.
app.get('/', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));


// ===== HU-02 =====
// Ruta GET para mostrar el dashboard.
// Aquí aplicamos el patrón básico tipo MVC:
// - Modelo → data.json
// - Controlador → esta función
// - Vista → dashboard.hbs
app.get('/dashboard', (req, res) => {
    const data = getTasks(); // Obtenemos datos desde el archivo
    // Enviamos las tareas a la vista usando render y pasando un objeto.
    res.render('dashboard', { tasks: data.tasks });
});


// ===== HU-03 (CON VALIDACIÓN) =====
// Ruta POST para crear nueva tarjeta.
// Aquí trabajamos con envío de formularios (método POST).
app.post('/nueva-tarjeta', (req, res) => {
    const { title } = req.body; // Desestructuración de objeto (ES6)

    // 🛑 VALIDACIÓN SERVIDOR
    // Aplicamos validación backend, concepto clave en desarrollo seguro.
    // Nunca debemos confiar solo en validaciones del frontend.
    if (!title || title.trim() === '') {
        console.log('⚠️ Tarea vacía detectada. No se guardó.');
        return res.redirect('/dashboard');
    }

    const db = getTasks(); // Leemos la base de datos actual

    // Creamos un nuevo objeto tarea.
    // Date.now() genera un ID único basado en el tiempo.
    // Esto aplica el concepto de generación simple de identificadores.
    const newTask = {
        id: Date.now(),
        title: title.trim(),
        status: "To Do"
    };

    // Insertamos la nueva tarea en el arreglo (estructura tipo colección).
    db.tasks.push(newTask);

    // Guardamos los cambios en el archivo.
    saveTasks(db);

    // Redirigimos al dashboard (patrón PRG: Post-Redirect-Get).
    // Esto evita que el formulario se reenvíe si el usuario recarga la página.
    res.redirect('/dashboard');
});


// ===== Servidor ======
// Iniciamos el servidor en el puerto 3000.
// app.listen es el método que pone el servidor a escuchar peticiones.
// El callback confirma que el servidor está activo.
app.listen(3000, () =>
    console.log('🚀 KanbanPro corriendo en http://localhost:3000')
);
