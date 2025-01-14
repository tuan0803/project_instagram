export class DateTimeUtil {
  static timeToMs (time: Date) {
    if (time === null || time === undefined) {
      return undefined;
    }

    return Math.floor(time.getTime());
  }

  static msToTime (ms: number) {
    return new Date(ms);
  }

  static dateToMs (date: Date) {
    if (date === null || date === undefined) {
      return undefined;
    }

    return DateTimeUtil.timeToMs(date);
  }
}
