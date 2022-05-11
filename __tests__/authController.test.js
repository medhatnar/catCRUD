const { Create, Login, Logout } = require("../controllers/authController");
const db = require("../database/db");
const User = db.models.user;

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
    } catch (err) {
      console.log(err);
    }
  })
);
