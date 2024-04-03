module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');

if(!userData) {
  response.status(400);
  write('msg', 'You are not logged in.');
  exit();
}

session.close();
write('msg', 'Bye-bye! See you soon.')
}
}