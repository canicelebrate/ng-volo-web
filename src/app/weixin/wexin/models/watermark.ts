
export class Watermark  {
  appid: string;
  timestamp: number;
  dateTimeStamp: string;

  constructor(initialValues: Partial<Watermark> = {}) {
    if (initialValues) {
      for (const key in initialValues) {
        if (initialValues.hasOwnProperty(key)) {
          this[key] = initialValues[key];
        }
      }
    }
  }
}
