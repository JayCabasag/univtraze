import barangays from './data/barangay.json'
import cities from './data/city.json'
import provinces from './data/province.json'
import regions from './data/region.json'

export class PhAddress {
  static getRegions() {
    return regions
  }

  static getProvincesByRegion(regionCode) {
    let regionProvinces = []
    for (let province of provinces) {
      if (province.region_code == regionCode) {
        regionProvinces.push(province)
      }
    }
    return regionProvinces
  }

  static getCitiesByProvince(provinceCode) {
    let provinceCities = []
    for (let city of cities) {
      if (city.province_code == provinceCode) {
        provinceCities.push(city)
      }
    }
    return provinceCities
  }

  static getBarangaysByCity(cityCode) {
    let cityBarangays = []
    for (let brgy of barangays) {
      if (brgy.city_code == cityCode) {
        cityBarangays.push(brgy)
      }
    }
    return cityBarangays
  }
}
