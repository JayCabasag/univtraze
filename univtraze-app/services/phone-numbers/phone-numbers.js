import countryCodes from '../phone-numbers/data/country-dial-codes.json'
export class PhoneNumbers {
  static getPhoneNumberPrefixes() {
    return countryCodes
  }
}
