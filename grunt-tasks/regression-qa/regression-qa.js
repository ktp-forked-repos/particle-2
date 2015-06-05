module.exports = function (grunt, config) {
  "use strict";
  // `config` vars set in `Gruntconfig.yml`
  
  grunt.registerTask('regressionQA', [
    'clean:preRegressionQA',
    'phantomcss:all',
    'clean:postRegressionQA'
  ]);
  
  grunt.config.merge({

    phantomcss: {// https://github.com/micahgodbolt/grunt-phantomcss
      options: {
        mismatchTolerance: 0.05,
        logLevel: 'error',
        cleanupComparisonImages: true
      },
      all: {
        options: {
          screenshots: 'baselines',
          results: 'results',
          viewportSize: [1280, 800]
        },
        src: [
          config.regressionTestRoot + '**/*.test.js'
        ]
      }
    },
    
    clean: {// https://www.npmjs.com/package/grunt-contrib-clean
      preRegressionQA: [
        'baselines',
        config.regressionTestRoot + '**/results/*.{diff,fail}.png'
      ],
      postRegressionQA: [
        config.regressionTestRoot + '**/baselines/*.{diff,fail}.png',
        config.regressionTestRoot + '**/results/*.png',
        '!' + config.regressionTestRoot + '**/results/*.{diff,fail}.png'
      ]
    }

  });

  // grunt testClean:featured-item will remove the baseline folder adjacent to featured-item-test.js
  grunt.registerTask('testClean', function (option) {
    if (option == undefined) {
      grunt.fail.fatal('A test file must be specified for testClean. You can also pass "all" to remove all baselines ');
    }
    if (option === 'all') {
      option = '*';
    }
    
    grunt.file.expand([config.regressionTestRoot + '**/' + option + '.test.js']).forEach(function (filepath) {
      var directory;
      directory = require('path').dirname(filepath);
      
      grunt.log.debug("Attempting to delete: " + directory + "/" + grunt.config.get("phantomcss.all.options.screenshots"));
      grunt.file.delete(directory + "/" + grunt.config.get("phantomcss.all.options.screenshots"));
      grunt.log.debug("Attempting to delete: " + directory + "/" + grunt.config.get("phantomcss.all.options.results"));
      grunt.file.delete(directory + "/" + grunt.config.get("phantomcss.all.options.results"));
    });
  });


  // test task can accept two params
  // tests: if this param is blank then a server is spun up and all tests are run
  //        If a value is passed (i.e. featured-item or *) then featured-item-test.js (or all tests '*') is run without compiling or new server. This is useful when styleguide is already running and you simply want to run tests.
  // new:   If 'new' is passed in to the second param, then the associated baselines for the selected test file is deleted before running
  //
  // grunt test
  // grunt test:*
  // grunt test:featured-item:new
  grunt.registerTask('test', function (tests, isNew) {
    if (tests == undefined) {
      grunt.config.set('phantomcss.all.src', config.regressionTestRoot + '**/*.test.js');
    }
    else {
      if (isNew == 'new') {
        grunt.task.run('testClean:' + tests);
      }
      grunt.config.set('phantomcss.all.src', config.regressionTestRoot + '**/' + tests + '.test.js');
    }
    grunt.task.run('phantomcss');
  });

};
