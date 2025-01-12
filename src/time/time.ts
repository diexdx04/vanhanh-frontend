import moment from "moment";

export const time = (date: Date): string => {
  const past = moment(date);
  const now = moment();
  const seconds = now.diff(past, "seconds");

  if (seconds < 60) {
    return "vừa mới";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút trước`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(seconds / 86400);
    if (days >= 1 && days <= 2) {
      return "hôm qua";
    } else {
      return past.format("DD/MM/YYYY");
    }
  }
};
