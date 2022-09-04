const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");

// //order of css files
// const cssFiles = ["./src/css/main.css", "./src/css/media.css"];

//order of scss files
const cssFiles = ["./src/css/main.scss", "./src/css/media.scss"];

//order of js files
const jsFiles = ["./src/js/lib.js", "./src/js/main.js"];

//task for styles
function styles() {
  return gulp
    .src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(
      autoprefixer({
        browserlist: ["2 las versions"],
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
}

//task for js files
function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(concat("script.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());
}

function clean() {
  return del(["build/*"]);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  // gulp.watch("./src/css/**/*.css", styles);
  gulp.watch("./src/css/**/*.scss", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("del", clean);
gulp.task("watch", watch);
gulp.task("build", gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task("dev", gulp.series("build", "watch"));
