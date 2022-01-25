import { TechnologyModel } from '../models';

const addTechnology = async () => {
  const data = ['FTTN', 'FTTP', 'FTTB', 'FTTC', 'HFC'];
  for (let x in data) {
    const result = await TechnologyModel.find({ technologyName: data[x] });
    if (result.length == 0) {
      TechnologyModel.create({
        technologyName: data[x],
      });
    }
  }
};
addTechnology();
