
import { Watermark } from './watermark';
export class DecodeEntityBase  {
  watermark: any;

  constructor(initialValues: Partial<DecodeEntityBase> = {}) {
    if (initialValues) {
      for (const key in initialValues) {
        if (initialValues.hasOwnProperty(key)) {
          this[key] = initialValues[key];
        }
      }
    }
  }
}
