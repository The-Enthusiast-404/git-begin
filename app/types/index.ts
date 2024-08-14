export type Issue = {
  id: string;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
  repository_name: string;
  stars_count: number;
  language: string | null;
  is_assigned: boolean;
  labels: string[];
  comments_count: number;
};

export type LoaderData = {
  issues: Issue[];
  error?: string;
  hasNextPage: boolean;
  endCursor: string | null;
};

export type FilterParams = {
  minStars: number;
  maxStars: number;
  language: string;
  isAssigned: boolean;
  cursor: string | null;
};
