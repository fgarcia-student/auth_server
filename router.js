const passport = require('passport');
const Authentication = require('./controllers/authentication');
const userController = require('./controllers/user');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/userData', requireAuth, userController.getAppData);
  app.post('/login', requireSignin, Authentication.signin);
  app.post('/register', Authentication.signup);
}
