const { src, dest, series, watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

sass.compiler = require('node-sass');

const origin = 'src',
    destination = 'build';

async function clean (callback) {
    await del(destination);
    callback();
}

function views (callback) {
    src(`${origin}/views/*.html`)
    .pipe(dest(`${destination}`));
    callback();
}

function styles (callback) {
    src(`${origin}/styles/style.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('../styles'))
    .pipe(dest(`${destination}/styles`));
    callback();
}

function scripts (callback) {
    src(`${origin}/scripts/script.js`)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('build.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../scripts'))
    .pipe(dest(`${destination}/scripts`));
    callback();
}

function libs (callback) {
    src([
        // `${origin}/scripts/lib/jquery-3.5.1.min.js`
        `${origin}/scripts/lib/handlebars-v4.7.7.js`
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../scripts'))
    .pipe(dest(`${destination}/scripts`));
    callback();
}

function watcher (callback) {
    watch(`${origin}/views/*.html`).on('change', series(views, browserSync.reload));
    watch(`${origin}/styles/**/*.scss`).on('change', series(styles, browserSync.reload));
    watch(`${origin}/scripts/libs/*.js`).on('change', series(libs, browserSync.reload));
    watch(`${origin}/scripts/*.js`).on('change', series(scripts, browserSync.reload));
    callback();
}

function server (callback) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: `${destination}`
        }
    });
    callback();
}

exports.views = views;
exports.scripts = scripts;
exports.styles = styles;

exports.default = series(clean, views, styles, libs, scripts, server, watcher);