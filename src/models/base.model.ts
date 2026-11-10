export interface IBaseModel {
  [index: string]: any
  //  checkFields?(row?: any): void;
}

export class BaseModel {
  [index: string]: unknown
  checkFields(row?: unknown): void {
    if (row) {
      for (const prop in this) {
        if (row.hasOwnProperty(prop)) {
          this[prop] = row[prop]
        }
      }
    }
  }
}
