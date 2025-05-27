export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ProductRateMaster: {
        Row: {
          ProductCode: string
          StateCode: string
          RateCode: number
          DateOn: string
          DateOff: string | null
          HealthCategory: number | null
          BaseRate: number | null
          LHCApplicable: string | null
          RebateApplicable: string | null
          LastUpdateTimestamp: string
          LastUpdateUser: string | null
        }
        Insert: {
          ProductCode: string
          StateCode: string
          RateCode: number
          DateOn: string
          DateOff?: string | null
          HealthCategory?: number | null
          BaseRate?: number | null
          LHCApplicable?: string | null
          RebateApplicable?: string | null
          LastUpdateTimestamp?: string
          LastUpdateUser?: string | null
        }
        Update: {
          ProductCode?: string
          StateCode?: string
          RateCode?: number
          DateOn?: string
          DateOff?: string | null
          HealthCategory?: number | null
          BaseRate?: number | null
          LHCApplicable?: string | null
          RebateApplicable?: string | null
          LastUpdateTimestamp?: string
          LastUpdateUser?: string | null
        }
      }
      RiskLoading: {
        Row: {
          ProductCode: string
          DateOn: string
          DateOff: string | null
          Sex: string
          Age: number
          RiskLoading: number | null
          LastUpdateUser: string | null
          LastUpdateTimestamp: string | null
        }
        Insert: {
          ProductCode: string
          DateOn: string
          DateOff?: string | null
          Sex: string
          Age: number
          RiskLoading?: number | null
          LastUpdateUser?: string | null
          LastUpdateTimestamp?: string | null
        }
        Update: {
          ProductCode?: string
          DateOn?: string
          DateOff?: string | null
          Sex?: string
          Age?: number
          RiskLoading?: number | null
          LastUpdateUser?: string | null
          LastUpdateTimestamp?: string | null
        }
      }
      ScaleFactors: {
        Row: {
          ProductCode: string
          ScaleCode: string
          DateOn: string
          DateOff: string | null
          ScaleFactor: number | null
          LastUpdateUser: string | null
          LastUpdateTimestamp: string | null
        }
        Insert: {
          ProductCode: string
          ScaleCode: string
          DateOn: string
          DateOff?: string | null
          ScaleFactor?: number | null
          LastUpdateUser?: string | null
          LastUpdateTimestamp?: string | null
        }
        Update: {
          ProductCode?: string
          ScaleCode?: string
          DateOn?: string
          DateOff?: string | null
          ScaleFactor?: number | null
          LastUpdateUser?: string | null
          LastUpdateTimestamp?: string | null
        }
      }
      RebatePercentage: {
        Row: {
          RebateType: string
          IncomeTier: number
          DateOn: string
          DateOff: string | null
          Rebate: number | null
          LastUpdateUserid: string | null
          LastUpdateTimestamp: string | null
        }
        Insert: {
          RebateType: string
          IncomeTier: number
          DateOn: string
          DateOff?: string | null
          Rebate?: number | null
          LastUpdateUserid?: string | null
          LastUpdateTimestamp?: string | null
        }
        Update: {
          RebateType?: string
          IncomeTier?: number
          DateOn?: string
          DateOff?: string | null
          Rebate?: number | null
          LastUpdateUserid?: string | null
          LastUpdateTimestamp?: string | null
        }
      }
      ProductToPartyMapping: {
        Row: {
          PartyId: number
          Chanel: string
          ChanelId: string
          LastUpdateUserid: string
          LastUpdateTimestamp: string
        }
        Insert: {
          PartyId: number
          Chanel: string
          ChanelId: string
          LastUpdateUserid: string
          LastUpdateTimestamp: string
        }
        Update: {
          PartyId?: number
          Chanel?: string
          ChanelId?: string
          LastUpdateUserid?: string
          LastUpdateTimestamp?: string
        }
      }
      ProductRateDetail: {
        Row: {
          ProductCode: string
          StateCode: string
          RateCode: number
          ScaleCode: string
          DateOn: string
          DateOff: string | null
          WeeklyRate: number | null
          MonthlyRate: number | null
          QuarterlyRate: number | null
          HalfYearlyRate: number | null
          YearlyRate: number | null
          LastUpdateUser: string | null
          LastUpdateTimestamp: string | null
        }
        Insert: {
          ProductCode: string
          StateCode: string
          RateCode: number
          ScaleCode: string
          DateOn: string
          DateOff?: string | null
          WeeklyRate?: number | null
          MonthlyRate?: number | null
          QuarterlyRate?: number | null
          HalfYearlyRate?: number | null
          YearlyRate?: number | null
          LastUpdateUser?: string | null
          LastUpdateTimestamp?: string | null
        }
        Update: {
          ProductCode?: string
          StateCode?: string
          RateCode?: number
          ScaleCode?: string
          DateOn?: string
          DateOff?: string | null
          WeeklyRate?: number | null
          MonthlyRate?: number | null
          QuarterlyRate?: number | null
          HalfYearlyRate?: number | null
          YearlyRate?: number | null
          LastUpdateUser?: string | null
          LastUpdateTimestamp?: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}