const {
  Create,
  Get,
  GetUsersCats,
  GetOne,
  Update,
  Delete,
} = require("../controllers/catController");
const sessionController = require("../controllers/sessionController");
const db = require("../database/db");
const Cat = db.models.cat;

describe("Create", () =>
  it("creates a new Cat entity", async () => {
    const session = { cookie: { _expires: "some timestamp" }, userId: 1 };
    const catName = "Fluffy";
    const picPath = "path/to/cat/media.png";

    const result = await Create({ session, catName, picPath });

    expect(result).toBeInstanceOf(Cat);
    expect(result).toEqual(
      expect.objectContaining({
        name: catName,
        media: picPath,
        userId: session.userId,
      })
    );
  }),
  xit("will not allow someone to post a Cat pic if they are not logged in", async () => {
    const session = { cookie: { _expires: "some timestamp" }, userId: 1 };
    const catName = "Fluffy";
    const picPath = "path/to/cat/media.png";

    const result = await Create({ session, catName, picPath });

    expect(result).toBeInstanceOf(Cat);
    expect(result).toEqual(
      expect.objectContaining({
        name: catName,
        media: picPath,
        userId: session.userId,
      })
    );
  }),
  );
