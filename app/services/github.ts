import { graphql } from "@octokit/graphql"
import { Issue, FilterParams } from "../types"

const ISSUES_PER_PAGE = 30
const REPOS_PER_PAGE = 10
const ISSUES_PER_REPO = 5

export async function fetchGitHubIssues(params: FilterParams) {
  const githubToken = process.env.GITHUB_API_KEY
  if (!githubToken) {
    throw new Error("GITHUB_API_KEY is not set in environment variables")
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  })

  const query = `
    query($queryString: String!, $cursor: String) {
      search(query: $queryString, type: ISSUE, first: ${ISSUES_PER_PAGE}, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Issue {
            title
            url
            createdAt
            repository {
              nameWithOwner
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
            }
            assignees(first: 1) {
              totalCount
            }
            labels(first: 10) {
              nodes {
                name
              }
            }
            comments {
              totalCount
            }
            timelineItems(first: 1, itemTypes: [CROSS_REFERENCED_EVENT]) {
              totalCount
            }
          }
        }
      }
    }
  `

  let queryString = 'is:open is:issue label:"good first issue" archived:false'
  if (params.language) queryString += ` language:${params.language}`
  if (params.isAssigned) {
    queryString += " assigned:*"
  } else {
    queryString += " no:assignee"
  }
  if (params.hasPullRequests) {
    queryString += " linked:pr"
  } else {
    queryString += " -linked:pr"
  }
  queryString += " sort:created-desc"

  const variables = {
    queryString,
    cursor: params.cursor,
  }

  const response: any = await graphqlWithAuth(query, variables)

  const issues: Issue[] = response.search.nodes
    .filter((issue: any) => {
      const stars = issue.repository.stargazerCount
      const forks = issue.repository.forkCount
      return stars >= params.minStars && stars <= params.maxStars && forks >= params.minForks
    })
    .map((issue: any) => ({
      id: issue.url,
      title: issue.title,
      html_url: issue.url,
      created_at: issue.createdAt,
      repository_url: issue.repository.url,
      repository_name: issue.repository.nameWithOwner,
      stars_count: issue.repository.stargazerCount,
      fork_count: issue.repository.forkCount,
      language: issue.repository.primaryLanguage?.name || null,
      is_assigned: issue.assignees.totalCount > 0,
      labels: issue.labels.nodes.map((label: any) => label.name),
      comments_count: issue.comments.totalCount,
      has_pull_requests: issue.timelineItems.totalCount > 0,
    }))

  const sortedIssues = issues.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return {
    issues: sortedIssues,
    hasNextPage: response.search.pageInfo.hasNextPage,
    endCursor: response.search.pageInfo.endCursor,
  }
}

export async function fetchGitHubIssuesByCategory(params: FilterParams) {
  const githubToken = process.env.GITHUB_API_KEY
  if (!githubToken) {
    throw new Error("GITHUB_API_KEY is not set in environment variables")
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  })

  const query = `
    query($queryString: String!, $cursor: String) {
      search(query: $queryString, type: REPOSITORY, first: ${REPOS_PER_PAGE}, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Repository {
            nameWithOwner
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
            }
            issues(labels: ["good first issue"], states: OPEN, first: ${ISSUES_PER_REPO}, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                title
                url
                createdAt
                assignees(first: 1) {
                  totalCount
                }
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                comments {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `

  let queryString = "is:public archived:false"
  if (params.language) queryString += ` language:${params.language}`
  queryString += ` stars:${params.minStars}..${params.maxStars}`
  queryString += ` forks:>=${params.minForks}`

  if (params.category && params.category !== "all") {
    switch (params.category) {
      case "web-dev":
        queryString += " topic:web"
        break
      case "mobile-dev":
        queryString += " topic:mobile"
        break
      case "data-science":
        queryString += " topic:data-science"
        break
      case "machine-learning":
        queryString += " topic:machine-learning"
        break
      case "devops":
        queryString += " topic:devops"
        break
      case "cybersecurity":
        queryString += " topic:security"
        break
      case "documentation":
        queryString += " topic:documentation"
        break
    }
  }

  console.log("GitHub category query string:", queryString)

  const variables = {
    queryString,
    cursor: params.cursor,
  }

  try {
    const response: any = await graphqlWithAuth(query, variables)

    console.log(
      "GitHub API category response:",
      JSON.stringify(response, null, 2)
    )

    const issues: Issue[] = response.search.nodes
      .flatMap((repo: any) =>
        repo.issues.nodes.map((issue: any) => ({
          id: issue.url,
          title: issue.title,
          html_url: issue.url,
          created_at: issue.createdAt,
          repository_url: repo.url,
          repository_name: repo.nameWithOwner,
          stars_count: repo.stargazerCount,
          forkCount: repo.forkCount,
          language: repo.primaryLanguage?.name || null,
          is_assigned: issue.assignees.totalCount > 0,
          labels: issue.labels.nodes.map((label: any) => label.name),
          comments_count: issue.comments.totalCount,
        }))
      )
      .filter((issue: Issue) => !params.isAssigned || issue.is_assigned)

    // If we have no issues but there are more pages, fetch the next page immediately
    if (issues.length === 0 && response.search.pageInfo.hasNextPage) {
      return fetchGitHubIssuesByCategory({
        ...params,
        cursor: response.search.pageInfo.endCursor,
      })
    }

    return {
      issues,
      hasNextPage: response.search.pageInfo.hasNextPage,
      endCursor: response.search.pageInfo.endCursor,
    }
  } catch (error) {
    console.error("Error fetching GitHub issues by category:", error)
    throw error
  }
}

export async function fetchGitHubIssuesByFramework(params: FilterParams) {
  const githubToken = process.env.GITHUB_API_KEY
  if (!githubToken) {
    throw new Error("GITHUB_API_KEY is not set in environment variables")
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  })

  const query = `
    query($queryString: String!, $cursor: String) {
      search(query: $queryString, type: REPOSITORY, first: ${REPOS_PER_PAGE}, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Repository {
            nameWithOwner
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
            }
            issues(labels: ["good first issue"], states: OPEN, first: ${ISSUES_PER_REPO}, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                title
                url
                createdAt
                assignees(first: 1) {
                  totalCount
                }
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                comments {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `

  let queryString = `topic:${params.framework} is:public archived:false`
  if (params.language) queryString += ` language:${params.language}`
  queryString += ` stars:${params.minStars}..${params.maxStars}`
  queryString += ` forks:>=${params.minForks}`

  console.log("GitHub framework query string:", queryString)

  const variables = {
    queryString,
    cursor: params.cursor,
  }

  try {
    const response: any = await graphqlWithAuth(query, variables)

    console.log(
      "GitHub API framework response:",
      JSON.stringify(response, null, 2)
    )

    const issues: Issue[] = response.search.nodes
      .flatMap((repo: any) =>
        repo.issues.nodes.map((issue: any) => ({
          id: issue.url,
          title: issue.title,
          html_url: issue.url,
          created_at: issue.createdAt,
          repository_url: repo.url,
          repository_name: repo.nameWithOwner,
          stars_count: repo.stargazerCount,
          forkCount: repo.forkCount,
          language: repo.primaryLanguage?.name || null,
          is_assigned: issue.assignees.totalCount > 0,
          labels: issue.labels.nodes.map((label: any) => label.name),
          comments_count: issue.comments.totalCount,
        }))
      )
      .filter((issue: Issue) => !params.isAssigned || issue.is_assigned)

    // If we have no issues but there are more pages, fetch the next page immediately
    if (issues.length === 0 && response.search.pageInfo.hasNextPage) {
      return fetchGitHubIssuesByFramework({
        ...params,
        cursor: response.search.pageInfo.endCursor,
      })
    }

    return {
      issues,
      hasNextPage: response.search.pageInfo.hasNextPage,
      endCursor: response.search.pageInfo.endCursor,
    }
  } catch (error) {
    console.error("Error fetching GitHub issues by framework:", error)
    throw error
  }
}
