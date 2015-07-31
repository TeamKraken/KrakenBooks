// Karma configuration
// Generated on Tue Jul 28 2015 02:30:15 GMT+0900 (JST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-xeditable/xeditable.min.js',
      'public/lib/ng-file-upload.js',
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenMax.min.js",
      'bower_components/ngFx/dist/ngFx.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.13.0/ui-bootstrap.min.js',
      'https://cdn.firebase.com/js/client/2.2.4/firebase.js',
      'https://cdn.firebase.com/libs/angularfire/1.1.2/angularfire.min.js',
      'public/app.js',
      'public/js/*.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'karma.conf.js',
      'public/js/facebook.js',
      'public/js/passport.js',
      'public/js/local.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
