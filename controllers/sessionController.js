// Modules //
const db = require("../database/db");
const Session = db.models.session;

const attachSession = async ({ session, userId }) => {
  await Session.create({
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
