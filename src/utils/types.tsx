// Report related data types
export enum ChartType {
  Bar = "bar",
  Column = "column",
  Donut = "donut",
  Pie = "pie"
}

export interface ReportField {
  id: number,
  label: string,
  chartType: ChartType,
  chartSize: number,
  isVisible: boolean,
  showDataTable: boolean
}

export interface FilterCategory {
  id?: number,
  label: string,
  isFilter: boolean
}

export interface ReportFilter {
  label: string,
  isActive: boolean,
  isGroupFilter: boolean,
  showAllContacts: boolean,
  fieldId?: number,
  categories: FilterCategory[]
}

export interface SegmentCategory {
  id?: number,
  label: string,
  color: string,
  isSegment: boolean
}

export interface ReportSegment{
  fieldId?: any,
  label: string,
  isSegment: boolean,
  isGroupSegment: boolean,
  categories: SegmentCategory[]
}

export interface ReportConfig {
  fields: ReportField[],
  filters: ReportFilter[],
  segments: ReportSegment[]
}

export interface Report {
  id?: number,
  text: string,
  description: string,
  config: ReportConfig
}

// Flow related data types
export interface FlowRuleCategory{
  label: string,
  count?: number,
  categories?: FlowRuleCategory[]
}

export interface FlowRule {
  id: number,
  flow: number,
  text: string,
  stats: {
    created_on: string
  },
}

export interface Flow {
  id: number,
  text: string,
  rules: FlowRule[],
  stats: {
    created_on: string,
    contacts?: number,
    runs: number,
  }
}

// ContactGroup related data types
export interface Group {
  id: number,
  name: string,
  count: number
}

// Other types

export interface Field extends ReportField{
  id: any,
  label: string,
  chartSize: number,
  chartType: ChartType,
  isVisible: boolean,
  showDataTable: boolean,

  categories?: FlowRuleCategory[],
}

export interface DataStatus {
  lastUpdated: string|null,
  completed: boolean,
  progress: number,
}