export const getDays = () => {
  let today = new Date();
  let dates = [];
  let times = [];

  for (let i = 0; i < 24; i++) {
    let hour = i < 10 ? `0${i}` : `${i}`;
    times.push(`${hour}:00`);
  }

  for (let i = 0; i < 7; i++) {
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);

    let formattedDate = nextDay.toLocaleDateString("en-US", {
      day: "numeric",
      weekday: "short",
    });
    formattedDate.split(" ").reverse().join(" ");

    dates.push({ date: formattedDate, times: times });
  }

  return dates;
};
