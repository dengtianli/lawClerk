const Gulp = require("gulp"),
  Connect = require("gulp-connect"),
  Nodemon = require("gulp-nodemon"),
  Less = require("gulp-less"),
  Concat = require("gulp-concat"),
  UglifyJS = require("gulp-uglify"),
  MinifyCSS = require("gulp-clean-css"),
  MinHtml = require("gulp-htmlmin"),
  Replace = require("gulp-replace"),
  CompressZip = require("gulp-zip"),
  Minimist = require('minimist'),
  GulpIf = require("gulp-if"),
  CompressTar = require('gulp-tar'),
  CompressGzip = require('gulp-gzip'),
  Moment = require("moment"),
  Delete = require("del");

const Argument = Minimist(process.argv.slice(2));

/** gulp */
Gulp.task("default", () => {
  // less & concat
  const source = "./sources/partials/";
  const target = "./sources/bundles";
  const combine = () => {
    Gulp.src([source + "**/*.less"])
      .pipe(Concat("styles.css"))
      .pipe(Less())
      .pipe(Gulp.dest(target));
    Gulp.src([source + "app.js", source + "**/*.js"])
      .pipe(Concat("scripts.js"))
      .pipe(Gulp.dest(target));
  };
  combine();
  Gulp.watch([
    source + "**/*.less",
    source + "**/*.js",
    source + "app.js"
  ], combine);
  // live reload
  const reloadSource = [
    "./sources/index.html",
    "./sources/partials/**/*.html",
    "./sources/bundles/**/*"
  ];
  Connect.server({
    root: "sources",
    port: 5008,
    livereload: true
  });
  Gulp.watch(reloadSource, () => {
    Gulp.src(reloadSource)
      .pipe(Connect.reload());
  });
  // nodemon
  const server = "./mocks/server.js";
  Nodemon({
    script: server,
    execMap: {
      js: "node --harmony"
    },
    env: {
      "NODE_ENV": "development"
    }
  });
});

/** gulp build */
Gulp.task("build", () => {
  const source = "./sources/";
  const target = "./build/";
  // html
  Gulp.src([source + "partials/**/*.html"])
    .pipe(MinHtml({
      collapseWhitespace: false
    }))
    .pipe(Gulp.dest(target + "/partials"));
  // update index.html /<!--Start-->[\s\S]*<!--End-->/g
  Gulp.src([source + "index.html"])
    .pipe(Replace("bundles/scripts", "bundles/scripts.min"))
    .pipe(Replace("bundles/styles", "bundles/styles.min"))
    .pipe(Gulp.dest(target));
  // css
  Gulp.src([source + "partials/**/*.less"])
    .pipe(Concat("styles.min.css"))
    .pipe(Less())
    .pipe(MinifyCSS({
      compatibility: "ie8"
    }))
    .pipe(Gulp.dest(target + "bundles"));
  // javascript
  Gulp.src([source + "partials/**/*.js", source + "app.js"])
    .pipe(Concat("scripts.min.js"))
    .pipe(UglifyJS())
    .pipe(Gulp.dest(target + "bundles"));
  // image & fonts
  Gulp.src([source + "assets/**/*"])
    .pipe(Gulp.dest(target + "assets"));
  // library
  Gulp.src([source + "libraries/**/*"])
    .pipe(Gulp.dest(target + "/libraries"));
});

/** gulp release */
Gulp.task("release", ["build"], () => {
  const releaseTime = Moment().format("YYYY-MM-DD HH.mm.ss");
  const NameZip = ("release " + releaseTime + ".zip");
  const NameTar = ("release " + releaseTime + ".tar");
  // zip
  GulpIf(Argument.zip === true, Gulp.src("./build/**/*"))
    .pipe(CompressZip(NameZip))
    .pipe(Gulp.dest("./release"))
  // tar
  GulpIf(Argument.tar === true, Gulp.src("./build/**/*"))
    .pipe(CompressTar(NameTar))
    .pipe(CompressGzip())
    .pipe(Gulp.dest("./release"))
  // default
  GulpIf(Argument.zip !== true, Gulp.src("./build/**/*"))
    .pipe(CompressZip(NameZip))
    .pipe(Gulp.dest("./release"))
  GulpIf(Argument.tar !== true, Gulp.src("./build/**/*"))
    .pipe(CompressTar(NameTar))
    .pipe(CompressGzip())
    .pipe(Gulp.dest("./release"))
});

/** gulp clean */
Gulp.task("clean", () => {
  Delete([
    "./release/**/*", "./build/**/*"
  ]);
});