var gulp = require('gulp');
var ts = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
var sourcemaps = require('gulp-sourcemaps')
const istanbul = require('gulp-istanbul');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var del = require('del');
var tslint = require("gulp-tslint");7
var tsProject = ts.createProject('./src/tsconfig.json');


gulp.task('build:clean', function() {
    return del([
        './transpiled',
        './coverage',
        './report'
    ]);
});

gulp.task("build:lint", function() {
    return gulp.src(["./**/*.ts", "!./node_modules/**/*"])
        .pipe(tslint({
            configuration:  {
                rules: {
                    "variable-name": true,
                    "quotemark": [true, "single"]
                }
            }
        }))
        .pipe(tslint.report("verbose", {
           // emitError: true
        }));
});


gulp.task('build',[/*'build:lint', */'build:clean'], function() {
    //find test code - note use of 'base'
    return gulp.src('./src/**/*.ts', { base: '.' })
        /*transpile*/
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        /*flush to disk*/
        .pipe(gulp.dest('./transpiled'));
});

gulp.task('test:instrument', ['build'], function() {
    return gulp.src('./transpiled/src/app/**/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire()); //this forces any call to 'require' to return our instrumented files
});

gulp.task('test', ['test:instrument'], function() {
    //find test code - note use of 'base'
    return gulp.src('./transpiled/src/spec/unit**/*.js', { base: '.' })

        .pipe(jasmine()).pipe(istanbul.writeReports({
            reporters: [ 'json' ] //this yields a basic non-sourcemapped coverage.json file
        })).on('end', remapCoverageFiles);
});

gulp.task('rebuild', function () {
    return gulp.src('./src/**/*.ts', { base: '.' })
    /*transpile*/
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        /*flush to disk*/
        .pipe(gulp.dest('./transpiled'));
});

//integration test task
gulp.task('it', ['rebuild'], function () {
        gulp.src('./transpiled/src/spec/it/**/*.spec.js').pipe(jasmine());
});

function remapCoverageFiles () {
    return gulp.src('./coverage/coverage-final.json')
        .pipe(remapIstanbul(
            {
                //basePath: '.',
                reports: {
                    'json': 'coverage/coverage-remapped.json',
                    'text-summary': null,
                    'text' : null,
                    'lcovonly': './coverage/lcov.info'
            }
        }));
}

/* single command to hook into VS Code */
gulp.task('default', ['test']);






