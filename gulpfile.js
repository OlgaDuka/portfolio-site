"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var uglify = require("gulp-uglify");
var posthtml = require("gulp-posthtml");
var run = require("run-sequence");
var del = require("del");
var server = require("browser-sync").create();

// Препроцессор, префиксы, минификация стилей
gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions",
        "IE 11",
        "Firefox ESR"
      ]})
    ]))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

// Оптимизация графики
gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("images"));
});

// Создание SVG-спрайта
gulp.task("sprite", function() {
  return gulp.src("img/sprite-src/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img"));
});

// Минификация скриптов
gulp.task("jsmin", function() {
  return gulp.src(['js/*.js',
    '!js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("js"));
});

// Очистка билда
gulp.task("clean", function() {
  return del("build");
});

// Копирование файлов для сборки
gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    'images/**',
    'js/*.min.js',
    'css/*.min.css',
    '*.html'
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

// Cборка билда
gulp.task('build', function (done) {
  run(
      'clean',
      'style',
      'jsmin',
      'copy',
      done
  );
});

gulp.task('serve', ['style'], function () {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('sass/**/*.{scss,sass}', ['style']);
  gulp.watch('js/*.js').on('change', server.reload);
  gulp.watch('*.html').on('change', server.reload);
});
