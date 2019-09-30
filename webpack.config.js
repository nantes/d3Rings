const path = require('path');

module.exports = {
  entry: {
    'bundle.js': [
      path.resolve(__dirname, 'js/index')
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  }
};
