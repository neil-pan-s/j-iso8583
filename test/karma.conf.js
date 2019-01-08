const webpackConfig = require('../build/test.config.js')

module.exports = (config) => {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    usePolling: true,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    // singleRun: true,
    // Run the tests on the same window as the client, without using iframe or a new window
    // client: {
    //   useIframe: false,
    //   runInParent: true,
    // },
    // reporters: ['spec', 'coverage'],

    frameworks: ['mocha', 'sinon-chai'], // , 'phantomjs-shim'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
  });
}