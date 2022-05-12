// Modules //
const db = require("../database/db");
const Cat = db.models.cat;

const Create = async ({ session, name, picPath }) => {
  if (!session || !session.userId) {
    throw new Error({
      status: 401,
      message: "You can not post Cat pics without logging in first!",
    });
  }

  const cat = await Cat.create({
    name,
    media: picPath,
    userId: session.userId,
  });

  return cat;
};

const Get = async () => {
  const cats = await Cat.findAll();
  return cats;
};

const GetUsersCats = async ({ userId, session }) => {
  if (session.userId !== userId) {
    throw new Error("403");
  }
  const cats = Cat.findAll({
    where: {
      userId,
    },
  });
  return cats;
};

const GetOne = async ({ id, session }) => {
  const cat = await Cat.findOne({
    where: {
      id,
    },
  });
  if (cat) {
    if (session.userId !== cat.userId) {
      throw new Error("403");
    } else {
      return cat;
    }
  } else {
    throw new Error("404");
  }
};

const Update = async ({ id, picPath, session, payload }) => {
  const cat = await Cat.findOne({
    where: {
      id,
    },
  });
  if (cat) {
    if (session.userId !== cat.userId) {
      throw new Error("You are NOT authorized to update this cat.");
    }
    return await cat.update(
      { media: picPath, ...payload },
      {
        where: {
          id,
        },
      }
    );
  } else {
    throw new Error("Cat does not exist!");
  }
};

const Delete = async ({ id, session }) => {
  const cat = await Cat.findOne({
    where: {
      id,
    },
  });
  if (session.userId !== cat.userId) {
    throw new Error("403");
  }
  await Cat.destroy({
    where: {
      id,
    },
  });

  return cat;
};

module.exports = { Create, Get, GetUsersCats, GetOne, Update, Delete };
