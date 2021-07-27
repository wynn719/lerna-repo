const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const base64 = require('gulp-base64-inline');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const gulpChanged = require('gulp-changed');
const gulpTypescript = require('gulp-typescript');
const gulpSourcemaps = require('gulp-sourcemaps');
const updateJsonFile = require('update-json-file');
const gulpReplace = require('gulp-replace');
const gulpFile = require('gulp-file');
const dotenv = require('dotenv');
const argv = require('yargs').argv;

const packagejson = require('./package.json');
const tsProject = gulpTypescript.createProject('tsconfig.json');
const appRoot = path.join(__dirname);

// 设置环境变量
const projectEnvPath = argv['env-file'] ? path.join(appRoot, argv['env-file']) : path.join(appRoot, './.env');
const projectEnv = dotenv.config({ path: projectEnvPath }).parsed;

// 格式化环境变量
Object.entries(projectEnv).forEach((item) => {
  const [key, value] = item;

  if (value === 'true') projectEnv[key] = true;
  if (value === 'false') projectEnv[key] = false;
  if (!isNaN(value)) projectEnv[key] = Number(value);
});

projectEnv.APP_VERSION = `v${packagejson.version}`;

const src = path.join(appRoot, 'src');
const build = path.join(appRoot, 'dist');
const execPath = {
  wxml: 'src/**/*.wxml',
  wxs: 'src/**/*.wxs',
  wxss: 'src/**/*.wxss',
  js: 'src/**/*.js',
  ts: 'src/**/*.ts',
  json: 'src/**/*.json',
  less: 'src/**/*.less',
  img: 'src/images/**',
};
const copyPaths = [execPath.wxml, execPath.wxs, execPath.wxss, execPath.json];

/**
 * wxml、wxss、wxs、json 不需要做转换，直接 copy 到 build 目录下就行了
 * 针对～images路径替换成cdn路径
 */
function copyFiles() {
  return gulp
    .src(copyPaths)
    .pipe(gulpReplace('~images/', `${projectEnv.IMAGE_CDN}/`))
    .pipe(gulpChanged(build))
    .pipe(gulp.dest(build));
}

/**
 * 微信小程序内置了很多 api 和特性，除了 async await，基本的 es 语法都能支持，也不做语法转换，简单复制
 * 这里留个缺口，说不定后面需要做其他的语法支持
 */
function handleJs() {
  return gulp
    .src(execPath.js)
    .pipe(gulpChanged(build))
    .pipe(gulpSourcemaps.init())
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest(build));
}

function handleTs() {
  return gulp
    .src(execPath.ts)
    .pipe(gulpChanged(build, { extension: '.js' }))
    .pipe(gulpSourcemaps.init())
    .pipe(tsProject())
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest(build));
}

/**
 * 小程序的 wxss 不支持嵌套变量等属性，很影响使用，这里用 less 来代替开发
 * less 先编译为 css，将 background-image inline 的图片转换为 base64，再 rename 为 wxss
 */
function handleLess() {
  const extname = '.wxss';

  return gulp.src(execPath.less).pipe(less()).pipe(base64()).pipe(rename({ extname })).pipe(gulp.dest(build));
}

/**
 * image 先无损压缩
 */
function handleImage() {
  return gulp
    .src(execPath.img)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.mozjpeg({ progressive: false }),
        imagemin.gifsicle({ optimizationLevel: 2 }),
        imagemin.svgo({ plugins: { removeViewBox: true } }),
      ]).pipe(gulp.dest(`${build}/images`))
    );
}

function clean() {
  return del([`${build}/**`]);
}

function checkEnv() {
  // 注入版本号
  projectEnv.APP_VERSION = packagejson.version;

  // 生成 env.js 文件
  const createEnvFile = () => {
    const envFileString = `module.exports = ${JSON.stringify(projectEnv)}`;

    return gulpFile('env.js', envFileString, { src: true }).pipe(gulp.dest('dist'));
  };

  // 变更 project.config.json
  const updateProjectConfig = () => {
    return updateJsonFile(
      path.join(appRoot, 'project.config.json'),
      (data) => {
        data.appid = projectEnv.APP_ID;
        return data;
      },
      {
        detectIndent: true,
      }
    );
  };

  return gulp.parallel(createEnvFile, updateProjectConfig);
}

const switchEnv = checkEnv();

const runDefault = gulp.series(clean, switchEnv, copyFiles, handleJs, handleTs, handleImage, handleLess);

function runWatch() {
  const copyWatcher = gulp.watch(copyPaths, copyFiles);

  copyWatcher.on('unlink', (unlinkFilepath) => {
    const filepathFromSrc = path.relative(src, unlinkFilepath);
    const filepathFromDist = path.resolve(build, filepathFromSrc);

    del.sync(filepathFromDist);
  });

  gulp.watch(execPath.ts, handleTs);
  gulp.watch(execPath.js, handleJs);
  gulp.watch(execPath.less, handleLess);
  gulp.watch(execPath.img, handleImage);

  return Promise.resolve();
}

const runBuild = runDefault; // 暂时没想到什么要处理的，先用 default 的模式

exports.default = runDefault;
exports.dev = gulp.series(runDefault, runWatch);
exports.build = runBuild;
