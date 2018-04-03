const gulp = require('gulp');
const ts = require("gulp-typescript");
const tsProject = ts.createProject('tsconfig.json', {
  declaration: true
});

function scripts() {
  const tsResult = gulp.src("./src/**/*.ts").pipe(tsProject(ts.reporter.fullReporter()));
  return tsResult.js.pipe(gulp.dest("dist/"));
}

function watch() {
  return gulp.watch('./src/**/*.ts', gulp.series('build'));
}

const build = gulp.series(gulp.parallel(scripts));
gulp.task('default', build);
gulp.task('build', build);
gulp.task('watch', watch);
