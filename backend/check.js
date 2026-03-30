try {
  require('./server');
} catch (e) {
  require('fs').writeFileSync('err.txt', e.stack);
}
