// Barrel export for all types
export * from "./database"

// Common app-level utility types
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface SelectOption<T = string> {
  label: string
  value: T
}

export type SortDirection = "asc" | "desc"

export interface SortParams {
  column: string
  direction: SortDirection
}

export interface DateRangeFilter {
  from: string | null
  to: string | null
}

/** Generic filter bag used across list pages */
export interface BaseFilters {
  search?: string
  dateRange?: DateRangeFilter
  assignedTo?: string
  tags?: string[]
}

export interface LeadFilters extends BaseFilters {
  status?: import("./database").LeadStatus
  source?: import("./database").LeadSource
}

export interface DealFilters extends BaseFilters {
  stage?: import("./database").DealStage
  pipelineId?: string
}

export interface TaskFilters extends BaseFilters {
  priority?: import("./database").TaskPriority
  status?: import("./database").TaskStatus
  linkedType?: import("./database").LinkedRecordType
}

export interface ContactFilters extends BaseFilters {
  company?: string
}
