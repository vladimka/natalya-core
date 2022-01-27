const { src, dest, task, watch } = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');

task('dev', () => {
    return src('src/**/*.ts')
        .pipe(ts({
            sourceMap : true,
            declaration : true,
            declarationDir : 'types'
        }))
        .pipe(dest('dist'));
});

task('dev:watch', () => {
    return watch('src/**/*.ts', ['dev']);
});