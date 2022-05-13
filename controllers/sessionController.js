const attachSession = async ({ session, userId }) => {
  session.userId = userId;
};

const destroySession = ({ session }) => {
  session.userId = "";
};

module.exports = { attachSession, destroySession };
