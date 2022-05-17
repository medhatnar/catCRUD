const checkSession = async ({ session }) => {
  if (session.hasOwnProperty("sid") && session.hasOwnProperty("userId")) {
    return true;
  } else {
    return false;
  }
};

const destroySession = async ({ session }) => {
  await session.destroy(session.id);
};

const attachSession = async ({ session, userId }) => {
  session.sid = session.id;
  session.userId = userId;
};

module.exports = { attachSession, checkSession, destroySession };
