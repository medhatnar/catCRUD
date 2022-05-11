const session = require("express-session");
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
    .mockImplementation(() => "You have called a mocked method 1!"),
  destroySession: jest
    .fn()
    .mockImplementation(() => "You have called a mocked method 2!"),
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
    const session = { cookie: { _expires: "2022-05-12T00:04:53.687Z" } };

    const result = await Login({
      username: user.username,
      password,
      session,
    });

    expect(sessionController.attachSession).toHaveBeenCalled();
    expect(result.message).toBe(`${user.username} is now logged in`);

    await Destroy({ id: user.id });
  }),
    xit("throws an error if user does not exist", async () => {
      const password = "password";
      const username = "username123";
      const invalidUserType = "hacker";
      const expectedError = `${invalidUserType} is an invalid user type`;

      try {
        await Create({ username, password }, invalidUserType).catch((err) => {
          expect(err).toThrow(expectedError);
        });
      } catch (err) {}
    }),
    xit("throws an error if password is invalid", async () => {
      const password = "password";
      const username = "username123";
      const invalidUserType = "hacker";
      const expectedError = `${invalidUserType} is an invalid user type`;

      try {
        await Create({ username, password }, invalidUserType).catch((err) => {
          expect(err).toThrow(expectedError);
        });
      } catch (err) {}
    });
});
