// Modules //
const db = require("../database/db");
const Session = db.models.session;

const attachSession = ({ session, userId }) => {
  Session.create({
    userId,
    expires_at: session.cookie._expires,
  });
  session.userId = userId;
};

const destroySession = ({ session }) => {
  session.destroy();
  Session.destroy({
    where: {
      userId: session.userId,
    },
  });
};

module.exports = { attachSession, destroySession };
// session Session {
//   cookie: {
//     path: '/',
//     _expires: 2022-05-12T00:04:53.687Z,
//     originalMaxAge: 86400000,
//     httpOnly: true
//   }
// }
