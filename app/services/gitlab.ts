import { Issue, FilterParams } from "../types";

const ISSUES_PER_PAGE = 30;

export async function fetchGitLabIssues(params: FilterParams) {
  const gitlabToken = process.env.GITLAB_API_KEY;
  if (!gitlabToken) {
    throw new Error("GITLAB_API_KEY is not set in environment variables");
  }

  const baseUrl = "https://gitlab.com/api/v4";
  const labels = "good first issue,newcomer";
  const state = "opened";
  const scope = "all";
  const orderBy = "created_at";
  const sort = "desc";

  let url = `${baseUrl}/issues?labels=${labels}&state=${state}&scope=${scope}&order_by=${orderBy}&sort=${sort}&per_page=${ISSUES_PER_PAGE}`;

  if (params.language) {
    url += `&search=${params.language}`;
  }
  if (params.cursor) {
    url += `&page=${params.cursor}`;
  }

  const response = await fetch(url, {
    headers: {
      "PRIVATE-TOKEN": gitlabToken,
    },
  });

  if (!response.ok) {
    throw new Error(`GitLab API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  const totalPages = parseInt(response.headers.get("X-Total-Pages") || "1", 10);
  const currentPage = parseInt(response.headers.get("X-Page") || "1", 10);

  const issues: Issue[] = await Promise.all(
    data.map(async (issue: any) => {
      const projectResponse = await fetch(
        `${baseUrl}/projects/${issue.project_id}`,
        {
          headers: {
            "PRIVATE-TOKEN": gitlabToken,
          },
        }
      );
      const projectData = await projectResponse.json();

      return {
        id: issue.id.toString(),
        title: issue.title,
        html_url: issue.web_url,
        created_at: issue.created_at,
        repository_url: projectData.web_url,
        repository_name: projectData.name_with_namespace,
        stars_count: projectData.star_count,
        language: projectData.repository_language,
        is_assigned: issue.assignees.length > 0,
        labels: issue.labels,
        comments_count: issue.user_notes_count,
      };
    })
  );

  const filteredIssues = issues.filter(
    (issue) =>
      issue.stars_count >= params.minStars &&
      issue.stars_count <= params.maxStars
  );

  return {
    issues: filteredIssues,
    hasNextPage: currentPage < totalPages,
    endCursor: currentPage < totalPages ? (currentPage + 1).toString() : null,
  };
}
