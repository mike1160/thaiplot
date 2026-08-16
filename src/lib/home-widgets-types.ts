export type PropertyNewsItem = {
  title: string
  url: string
  published: string
  source: string
}

export type ExchangeRatesData = {
  rates: { EUR: number; USD: number; GBP: number; AUD: number }
  updatedAt: string
}

export type WeatherCity = {
  id: string
  name: string
  temp: number
  condition: string
  humidity: number
}

export type MarketStats = {
  totalListings: number
  averagePrice: number | null
  topRegion: string | null
  byType: Array<{ type: string; count: number }>
  newestListingAt: string | null
}
