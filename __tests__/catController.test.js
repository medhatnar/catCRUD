const {
  Create,
  Get,
  GetUsersCats,
  GetOne,
  Update,
  Delete,
} = require("../controllers/catController");
const db = require("../database/db");
const Cat = db.models.cat;
const User = db.models.user;

beforeAll(async () => {
  return await db.sync({ force: true, logging: false });
});

afterAll(async () => {
  await db.drop();
  return await db.close();
});

afterEach(async () => {
  return await User.destroy({
    where: {
      username: "username",
    },
  });
});

describe(
  "Create",
  () =>
    it("creates a new Cat entity", async () => {
      const user = await User.create({
        username: "username",
        password: "password",
      });
      const session = {
        userId: user.id,
        cookie: { _expires: "some timestamp" },
      };
      const name = "Fluffy";
      const picPath = "path/to/cat/media.png";
      const result = await Create({ session, name, picPath });

      expect(result).toBeInstanceOf(Cat);
      expect(result).toEqual(
        expect.objectContaining({
          name,
          media: picPath,
          userId: session.userId,
        })
      );
    }),

  it("does not allow Cat creation unless user is signed in", async () => {
    const session = {
      cookie: { _expires: "some timestamp" },
    };
    const name = "Fluffy";
    const picPath = "path/to/cat/media.png";
    const expectedError = "You can not post Cat pics without logging in first!";

    try {
      await Create({ session, name, picPath }).catch((err) => {
        expect(err).toThrowError(expectedError);
      });
    } catch (err) {}
  })
);

describe("Get", () =>
  it("fetches all Cat pics that have been uploaded to database", async () => {
    const user = await User.create({
      username: "username",
      password: "password",
    });
    const session = {
      userId: user.id,
      cookie: { _expires: "some timestamp" },
    };
    const name = "Fluffy";
    const picPath = "path/to/cat/media.png";
    const cat = await Cat.create({
      name,
      media: picPath,
      userId: session.userId,
    });

    const result = await Get();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: cat.id,
          name: cat.name,
          media: cat.media,
        }),
      ])
    );
  }));

describe(
  "GetUsersCats",
  () =>
    it("fetches all Cat pics uplaoded by the given User", async () => {
      const user = await User.create({
        username: "username",
        password: "password",
      });

      const session = {
        userId: user.id,
        cookie: { _expires: "some timestamp" },
      };
      const name = "Fluffy";
      const picPath = "path/to/cat/media.png";
      const cat = await Cat.create({
        name,
        media: picPath,
        userId: session.userId,
      });

      const result = await GetUsersCats({ userId: user.id, session });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: cat.id,
            userId: user.id,
          }),
        ])
      );
    }),
  it("throws an error if you are an unauthorized User", async () => {
    const user = await User.create({
      username: "username",
      password: "password",
    });

    const session = {
      userId: "a different user's id",
      cookie: { _expires: "some timestamp" },
    };
    const expectedError = "403";
    // const expectedError = "You are NOT authorized to see these cats.";

    try {
      await GetUsersCats({ userId: user.id, session }).catch((err) => {
        expect(err).toThrowError(expectedError);
      });
    } catch (error) {}
  })
);

describe(
  "GetOne",
  () =>
    it("fetches a Cat by its id", async () => {
      const user = await User.create({
        username: "username",
        password: "password",
      });

      const session = {
        userId: user.id,
        cookie: { _expires: "some timestamp" },
      };
      const name = "Fluffy";
      const picPath = "path/to/cat/media.png";
      const cat = await Cat.create({
        name,
        media: picPath,
        userId: session.userId,
      });

      const result = await GetOne({ id: cat.id, session });

      expect(result).toEqual(
        expect.objectContaining({
          id: cat.id,
          name: cat.name,
          media: cat.media,
        })
      );
    }),
  it("throws an error if you are an unauthorized User", async () => {
    const user = await User.create({
      username: "username",
      password: "password",
    });

    const session = {
      userId: "a different user's id",
      cookie: { _expires: "some timestamp" },
    };
    const name = "Fluffy";
    const picPath = "path/to/cat/media.png";
    const cat = await Cat.create({
      name,
      media: picPath,
      userId: user.id,
    });
    const expectedError = "403";
    // const expectedError = "You are NOT authorized to see these cats.";

    try {
      await GetOne({ id: cat.id, session }).catch((err) => {
        expect(err).toThrowError(expectedError);
      });
    } catch (error) {}
  })
);

describe("Update", () =>
  it("updates an existing Cat entry", async () => {
    const user = await User.create({
      username: "username",
      password: "password",
    });

    const session = {
      userId: user.id,
      cookie: { _expires: "some timestamp" },
    };
    const name = "Fluffy";
    const picPath = "path/to/cat/media.png";
    const cat = await Cat.create({
      name,
      media: picPath,
      userId: session.userId,
    });
    const payload = { name: "new name who dis?" };

    const result = await Update({ id: cat.id, picPath, session, payload });

    expect(result).toEqual(
      expect.objectContaining({
        id: cat.id,
        name: payload.name,
      })
    );
  }));

describe("Delete", () =>
  it("removes an existing Cat Entry", async () => {
    const user = await User.create({
      username: "username",
      password: "password",
    });

    const session = {
      userId: user.id,
      cookie: { _expires: "some timestamp" },
    };
    const name = "Fluffy";
    const picPath = "path/to/cat/media.png";
    const cat = await Cat.create({
      name,
      media: picPath,
      userId: session.userId,
    });

    const result = await Delete({ id: cat.id, session });

    expect(result).toBeInstanceOf(Cat);
  }));
