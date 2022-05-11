// Modules //
const db = require("../database/db");
const Cat = db.models.cat

const Create = async ({session, catName, picPath}) => {
    const cat = await Cat.create({
        name: catName,
        media: picPath,
        userId: session.user_id,
    });
}

const Get = async () => {
    const cats = await Cat.findAll();
}

const GetUsersCats = async ({id}) => {
  const cats = await Cat.findAll({});
}

const GetOne = async (id) => {
    const cat = await Cat.findOne({
        where: {
          id,
        },
      });
}

const Update = async (id, picPath, payload) => {

  const updatedCat = await Cat.update(
    { media: picPath, ...body },
    {
      where: {
        id: params.id,
      },
    }
  );

}

const Delete = async () => { 

  const deletedCat = await Cat.destroy({
    where: {
      id,
    },
  });
  res.send(deletedCat.id);
}

module.exports = {Create, Get, GetUsersCats, GetOne, Update, Delete};