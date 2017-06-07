import * as _ from "lodash";

export class InfoObject {
  first_name: string;
  last_name: string;
  address_street: string;
  address_country: string;

  constructor(info?: InfoObject) {
    if (!_.isUndefined(info)) {
      this.first_name = info.first_name;
      this.last_name = info.last_name;
      this.address_street = info.address_street;
      this.address_country = info.address_country;
    } else {
      this.first_name = '';
      this.last_name = '';
      this.address_street = '';
      this.address_country = '';
    }
    console.log(this.first_name);
  }
}
