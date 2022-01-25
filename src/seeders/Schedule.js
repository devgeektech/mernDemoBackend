import { ScheduleModel } from '../models';

const addSchedule = async () => {
  const data = ['Schedule 1', 'Schedule 2', 'Schedule 3'];
  for (let x in data) {
    const result = await ScheduleModel.find({ scheduleName: data[x] });
    if (result.length == 0) {
      ScheduleModel.create({
        scheduleName: data[x],
      });
    }
  }
};
addSchedule();
