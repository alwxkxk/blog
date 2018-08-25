var spawn = require('child_process').spawn;
/* 其实就是等于执行hexo server --draft*/
free = spawn('hexo', ['server', '-p 3000']);
free.stdout.on('data', function (data) {
  console.log('standard output:\n' + data);
});
free.stderr.on('data', function (data) {
  console.log('standard error output:\n' + data);
});
free.on('exit', function (code, signal) {
  console.log('child process eixt ,exit:' + code);
});