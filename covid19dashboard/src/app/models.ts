export class SummaryData {
    Global: GlobalData;
    Countries: Array<CountryData>;
    Date: Date
}

export class GlobalData {
    NewConfirmed: number;
    NewDeaths: number;
    NewRecovered: number;
    TotalConfirmed: number;
    TotalDeaths: number;
    TotalRecovered: number
}

export class CountryData extends GlobalData {
    Country: string;
    CountryCode: string;
    Date: Date;
    Slug: string
}

export class WeeklyData {
     WeekData: Array<GlobalData>
}

export class CountryDataFromZero {
     Active: number;
     City: string;
    ​​ CityCode: string;
    ​​​ Confirmed: number;
    ​​​ Country: string;
    ​​​ CountryCode: string;
    ​​​ Date: string;
    ​​​ Deaths: number;
    ​​​ Lat: string;
    ​​​ Lon: string;
    ​​​ Province: string;
    ​​​ Recovered: number;
}

export class CountryAllDataFromZero {
     SingleCountryDataFromZero: Array<CountryDataFromZero>
}
