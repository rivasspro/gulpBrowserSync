const gulp = require("gulp"); // Requerir el módulo gulp
const sass = require("gulp-sass")(require("sass")); // Requerir el módulo gulp-sass y configurarlo para utilizar el compilador sass
const cleanCSS = require("gulp-clean-css"); // Requerir el módulo gulp-clean-css para minificar el CSS
const rename = require("gulp-rename"); // Requerir el módulo gulp-rename para renombrar archivos
const rimraf = require("rimraf").sync; // Requerir el módulo rimraf para eliminar archivos y directorios
const browserSync = require("browser-sync").create(); // Crear una instancia de browser-sync


function style() {
  // 1. ¿Dónde se encuentra mi archivo scss?
  //return gulp.src("./scss/**/*.scss")
  return gulp.src("./scss/gulp.scss")
    // 2. Pasa el archivo por el compilador de sass
    .pipe(sass().on('error', sass.logError))
    // 3. ¿Dónde guardo el CSS compilado?
    .pipe(gulp.dest("./css"))
    // 4. Transmitir cambios al navegador
    .pipe(browserSync.stream())
    .on("end", minifyCSS); // 5. Llama a la función minifyCSS después de que se complete esta tarea
}

function minifyCSS() {
  // 1. Obtener el archivo CSS compilado
  return gulp.src("./css/gulp.css")
    // 2. Minificar el CSS
    .pipe(cleanCSS())
    // 3. Renombrar el archivo añadiendo el sufijo ".min"
    .pipe(rename({ suffix: ".min" }))
    // 4. ¿Dónde guardar el CSS minificado?
    .pipe(gulp.dest("./css"))
    .on("end", deleteOriginalCSS) // 5. Llama a la función deleteOriginalCSS después de que se complete esta tarea
    .pipe(browserSync.stream()); // Actualizar CSS minificado
}

function deleteOriginalCSS() {
  // Eliminar el archivo CSS original
  rimraf("./css/gulp.css");
}

function images() {
  return gulp.src("./images/**/*") // Ruta de las imágenes de origen
    .pipe(imagemin()) // Comprimir las imágenes
    .pipe(gulp.dest("./dist/images")); // Ruta de destino para las imágenes comprimidas
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  // Observar cambios en los archivos SCSS y llamar a la función style
  gulp.watch("./scss/**/*.scss", style);
  // Observar cambios en los archivos HTML y recargar el navegador
  gulp.watch("./*.html").on("change", browserSync.reload);
  // Observar cambios en los archivos JS y recargar el navegador
  gulp.watch("./js/**/*.js").on("change", browserSync.reload);
}

// Exportar la tarea style para que sea accesible desde el exterior
exports.style = style;
// Exportar la tarea minifyCSS para que sea accesible desde el exterior
exports.minifyCSS = minifyCSS;
// Exportar la tarea watch para que sea accesible desde el exterior
exports.watch = watch;

// Configurar la tarea predeterminada que se ejecutará al correr gulp sin especificar una tarea
exports.default = gulp.series(style, watch);

