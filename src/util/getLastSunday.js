const getLastSunday = () => {
  const date = new Date();
  const today = date.getDate();
  const dayOfTheWeek = date.getDay();
  const newDate = date.setDate(today - (dayOfTheWeek || 7));
  return new Date(newDate);
};

export default getLastSunday;
