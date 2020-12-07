
export class MpAuthenticateModel  {
  appName: string;
  code: string;
  encryptedData: string;
  iv: string;

  constructor(initialValues: Partial<MpAuthenticateModel> = {}) {
    if (initialValues) {
      for (const key in initialValues) {
        if (initialValues.hasOwnProperty(key)) {
          this[key] = initialValues[key];
        }
      }
    }
  }
}
