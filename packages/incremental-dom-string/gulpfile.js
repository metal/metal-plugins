const babel = require('rollup-plugin-babel');
const buffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');

gulp.task('build', ['clean'], () =>
  rollup({
    input: 'index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            "env",
            {
              "modules": false
            }
          ]
        ],
        exclude: 'node_modules/**'
      }),
    ],
    format: 'umd',
    name: 'IncrementalDOM',
  })
  .pipe(source('incremental-dom-string.js'))
  .pipe(buffer())
  .pipe(gulp.dest('lib')));

gulp.task('build:watch', () =>
  gulp.watch('src/*.js', ['build']));

gulp.task('clean', () => del('lib'));