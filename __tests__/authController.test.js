const {
  Create,
  Login,
  Logout,
  Destroy,
} = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const db = require("../database/db");
const User = db.models.user;

jest.mock("../controllers/sessionController", () => ({
  attachSession: jest
    .fn()
    .mockImplementation(
      () => "session in database and has been associated to user"
    ),
  destroySession: jest
    .fn()
    .mockImplementation(
      () => "session removed from database and dissociated from user"
    ),
}));

describe(
  "Create",
  () =>
    it("creates a new user entity", async () => {
      const passwordBeforeHashing = "password";
      const username = "username123";

      const result = await Create({
        username,
        password: passwordBeforeHashing,
      });

      expect(result).toBeInstanceOf(User);
      expect(result).toEqual(
        expect.objectContaining({
          username,
          type: "member",
          password: expect.not.stringMatching(passwordBeforeHashing),
        })
      );
    }),

  it("throws an error if an invalid parameter is passed in", async () => {
    const password = "password";
    const username = "username123";
    const invalidUserType = "hacker";
    const expectedError = `${invalidUserType} is an invalid user type`;

    try {
      await Create({ username, password }, invalidUserType).catch((err) => {
        expect(err).toThrow(expectedError);
      });
    } catch (err) {}
  })
);

describe("Login", () => {
  it("logs in existing user and attaches them to a new session", async () => {
    const password = "password";
    const username = "username123";
    const user = await Create({ username, password });
    const session = { cookie: { _expires: "some timestamp" } };

    const result = await Login({
      username: user.username,
      password,
      session,
    });

    expect(sessionController.attachSession).toHaveBeenCalled();
    expect(result.message).toBe(`${user.username} is now logged in.`);
    expect(result.status).toBe(200);

    await Destroy({ id: user.id });
  }),
    it("throws an error if user does not exist", async () => {
      const password = "password";
      const username = "username321";
      const expectedError = `User ${username} does not exist`;
      const session = { cookie: { _expires: "some timestamp" } };

      try {
        await Login({
          username,
          password,
          session,
        }).catch((error) => {
          const errorPayload = JSON.parse(error);
          expect(error).toThrowError();
          expect(errorPayload.message).toBe(expectedError);
          expect(errorPayload.status).toBe(401);
        });
      } catch (err) {}
    }),
    it("throws an error if password is invalid", async () => {
      const password = "password";
      const username = "username123";
      const user = await Create({ username, password });
      const session = { cookie: { _expires: "some timestamp" } };

      try {
        await Login({
          username,
          password: "incorrect password",
          session,
        }).catch((error) => {
          const errorPayload = JSON.parse(error);
          expect(error).toThrowError();
          expect(errorPayload.message).toBe(expectedError);
          expect(errorPayload.status).toBe(400);
        });
      } catch (err) {}

      await Destroy({ id: user.id });
    });
});

describe("Logout", () =>
  it("removes session association with user", async () => {
    const password = "password";
    const username = "username123";
    const user = await Create({ username, password });
    const session = { userId: user.id, cookie: { _expires: "some timestamp" } };
    await Login({
      username: user.username,
      password,
      session,
    });

    await Logout({
      session,
    });

    expect(sessionController.destroySession).toHaveBeenCalled();

    await Destroy({ id: user.id });
  }));
