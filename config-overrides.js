const DeadCodePlugin = require('webpack-deadcode-plugin');

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    const newConfig = {...config};
    newConfig.optimization = newConfig.optimization || {};
    newConfig.optimization.usedExports = true;
    newConfig.plugins.push(
        new DeadCodePlugin({
            patterns: [
              'src/**/*.(js|jsx)',
            ],
            exclude: [
              '**/*.(stories|spec).(js|jsx)',
            ],
          })
    )

    return newConfig;
  }