import { TechnologyModel, CategoryModel } from '../models';

const addCategory = async () => {
  const checkRecord = await CategoryModel.find();
  if (checkRecord.length == 0) {
    const technologyData = await TechnologyModel.find();
    for (let x in technologyData) {
      /* CategoryModel.create({
        technologyId: technologyData[x]._id,
        categoryName: 'ACTIVATIONS JUMPER AND CENTRAL SPLITTERS',
      }); */
    }
  }
};
addCategory();
