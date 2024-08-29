// types.ts
export type Issue = {
  has_pull_requests: any
  pr_status: string
  license:any
  id: string
  title: string
  html_url: string
  created_at: string
  repository_url: string
  repository_name: string
  archived: boolean
  stars_count: number
  fork_count: number
  language: string | null
  is_assigned: boolean
  labels: string[]
  comments_count: number
  pull_requests_count: number
}

export type LoaderData = {
  issues: Issue[]
  error?: string
  hasNextPage: boolean
  endCursor: string | null
}

export type Service = "github" | "gitlab"

export type FilterParams = {
  service: Service
  minStars: number
  maxStars: number
  minForks: number
  language: string
  isAssigned: boolean
  cursor: string | null
  category: string // New field for category filter
  framework: string
  hasPullRequests: boolean
}
