import { Issue, FilterParams } from "../types"

const ISSUES_PER_PAGE = 30

export async function fetchGitLabIssues(params: FilterParams) {
  const gitlabToken = process.env.GITLAB_API_KEY
  if (!gitlabToken) {
    throw new Error("GITLAB_API_KEY is not set in environment variables")
  }

  const baseUrl = "https://gitlab.com/api/v4"
  const labels = "good first issue,newcomer"
  const state = "opened"
  const scope = "all"
  const orderBy = "created_at"
  const sort = "desc"

  let url = `${baseUrl}/issues?labels=${labels}&state=${state}&scope=${scope}&order_by=${orderBy}&sort=${sort}&per_page=${ISSUES_PER_PAGE}`

  if (params.language) {
    url += `&search=${params.language}`
  }
  if (params.cursor) {
    url += `&page=${params.cursor}`
  }

  const response = await fetch(url, {
    headers: {
      "PRIVATE-TOKEN": gitlabToken,
    },
  })

  if (!response.ok) {
    throw new Error(`GitLab API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  const totalPages = parseInt(response.headers.get("X-Total-Pages") || "1", 10)
  const currentPage = parseInt(response.headers.get("X-Page") || "1", 10)

  const issues: Issue[] = await Promise.all(
    data.map(async (issue: any) => {
      const projectResponse = await fetch(
        `${baseUrl}/projects/${issue.project_id}`,
        {
          headers: {
            "PRIVATE-TOKEN": gitlabToken,
          },
        }
      )
      const projectData = await projectResponse.json()

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
      }
    })
  )

  const filteredIssues = issues.filter(
    (issue) =>
      issue.stars_count >= params.minStars &&
      issue.stars_count <= params.maxStars
  )

  return {
    issues: filteredIssues,
    hasNextPage: currentPage < totalPages,
    endCursor: currentPage < totalPages ? (currentPage + 1).toString() : null,
  }
}
export async function fetchGitLabIssuesByCategory(params: FilterParams) {
  const gitlabToken = process.env.GITLAB_API_KEY
  if (!gitlabToken) {
    throw new Error("GITLAB_API_KEY is not set in environment variables")
  }

  const baseUrl = "https://gitlab.com/api/v4"

  let projectsUrl = `${baseUrl}/projects?min_access_level=10&archived=false&order_by=last_activity_at&sort=desc&per_page=10`

  if (params.language) {
    projectsUrl += `&with_programming_language=${encodeURIComponent(
      params.language
    )}`
  }

  if (params.category && params.category !== "all") {
    projectsUrl += `&topic=${encodeURIComponent(params.category)}`
  }

  if (params.cursor) {
    projectsUrl += `&page=${params.cursor}`
  }

  console.log("GitLab projects URL:", projectsUrl)

  const projectsResponse = await fetch(projectsUrl, {
    headers: {
      "PRIVATE-TOKEN": gitlabToken,
    },
  })

  if (!projectsResponse.ok) {
    throw new Error(`GitLab API request failed: ${projectsResponse.statusText}`)
  }

  const projects = await projectsResponse.json()

  const issues: Issue[] = await Promise.all(
    projects.map(async (project: any) => {
      const issuesUrl = `${baseUrl}/projects/${project.id}/issues?labels=good first issue&state=opened&per_page=5`
      const issuesResponse = await fetch(issuesUrl, {
        headers: {
          "PRIVATE-TOKEN": gitlabToken,
        },
      })

      if (!issuesResponse.ok) {
        console.error(
          `Failed to fetch issues for project ${project.id}: ${issuesResponse.statusText}`
        )
        return []
      }

      const projectIssues = await issuesResponse.json()

      return projectIssues.map((issue: any) => ({
        id: issue.id.toString(),
        title: issue.title,
        html_url: issue.web_url,
        created_at: issue.created_at,
        repository_url: project.web_url,
        repository_name: project.name_with_namespace,
        stars_count: project.star_count,
        language: project.repository_language,
        is_assigned: issue.assignees.length > 0,
        labels: issue.labels,
        comments_count: issue.user_notes_count,
      }))
    })
  ).then((nestedIssues) => nestedIssues.flat())

  const filteredIssues = issues.filter(
    (issue) =>
      issue.stars_count >= params.minStars &&
      issue.stars_count <= params.maxStars &&
      (params.isAssigned || !issue.is_assigned)
  )

  const totalPages = parseInt(
    projectsResponse.headers.get("X-Total-Pages") || "1",
    10
  )
  const currentPage = parseInt(
    projectsResponse.headers.get("X-Page") || "1",
    10
  )

  return {
    issues: filteredIssues,
    hasNextPage: currentPage < totalPages,
    endCursor: currentPage < totalPages ? (currentPage + 1).toString() : null,
  }
}

import { Issue, FilterParams } from "../types"

// ... (existing code remains the same)

export async function fetchGitLabIssuesByFramework(params: FilterParams) {
  const gitlabToken = process.env.GITLAB_API_KEY
  if (!gitlabToken) {
    throw new Error("GITLAB_API_KEY is not set in environment variables")
  }

  const baseUrl = "https://gitlab.com/api/v4"

  let projectsUrl = `${baseUrl}/projects?min_access_level=10&archived=false&order_by=last_activity_at&sort=desc&per_page=10&topic=${encodeURIComponent(
    params.framework
  )}`

  if (params.language) {
    projectsUrl += `&with_programming_language=${encodeURIComponent(
      params.language
    )}`
  }

  if (params.cursor) {
    projectsUrl += `&page=${params.cursor}`
  }

  console.log("GitLab projects URL:", projectsUrl)

  const projectsResponse = await fetch(projectsUrl, {
    headers: {
      "PRIVATE-TOKEN": gitlabToken,
    },
  })

  if (!projectsResponse.ok) {
    throw new Error(`GitLab API request failed: ${projectsResponse.statusText}`)
  }

  const projects = await projectsResponse.json()

  const issues: Issue[] = await Promise.all(
    projects.map(async (project: any) => {
      const issuesUrl = `${baseUrl}/projects/${project.id}/issues?labels=good first issue&state=opened&per_page=5`
      const issuesResponse = await fetch(issuesUrl, {
        headers: {
          "PRIVATE-TOKEN": gitlabToken,
        },
      })

      if (!issuesResponse.ok) {
        console.error(
          `Failed to fetch issues for project ${project.id}: ${issuesResponse.statusText}`
        )
        return []
      }

      const projectIssues = await issuesResponse.json()

      return projectIssues.map((issue: any) => ({
        id: issue.id.toString(),
        title: issue.title,
        html_url: issue.web_url,
        created_at: issue.created_at,
        repository_url: project.web_url,
        repository_name: project.name_with_namespace,
        stars_count: project.star_count,
        language: project.repository_language,
        is_assigned: issue.assignees.length > 0,
        labels: issue.labels,
        comments_count: issue.user_notes_count,
      }))
    })
  ).then((nestedIssues) => nestedIssues.flat())

  const filteredIssues = issues.filter(
    (issue) =>
      issue.stars_count >= params.minStars &&
      issue.stars_count <= params.maxStars &&
      (params.isAssigned || !issue.is_assigned)
  )

  const totalPages = parseInt(
    projectsResponse.headers.get("X-Total-Pages") || "1",
    10
  )
  const currentPage = parseInt(
    projectsResponse.headers.get("X-Page") || "1",
    10
  )

  return {
    issues: filteredIssues,
    hasNextPage: currentPage < totalPages,
    endCursor: currentPage < totalPages ? (currentPage + 1).toString() : null,
  }
}
