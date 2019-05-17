const gulp = require('gulp')
const del = require('del')
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')

function copyTypes() {
  return gulp.src('src/type/*')
    .pipe(gulp.dest('lib/type'))
}

function clean() {
  return del(['dist', 'lib'])
}

function compileTS() {
  return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('lib'))
}

exports.ts = gulp.series(clean, copyTypes, compileTS)
