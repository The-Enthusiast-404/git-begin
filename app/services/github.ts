// github.ts

import { graphql } from "@octokit/graphql"
import { Issue, FilterParams } from "../types"

const ISSUES_PER_PAGE = 30

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
          }
        }
      }
    }
  `

  let queryString = 'is:open is:issue label:"good first issue"'
  if (params.language) queryString += ` language:${params.language}`
  if (!params.isAssigned) queryString += " no:assignee"
  queryString += " sort:created-desc"

  const variables = {
    queryString,
    cursor: params.cursor,
  }

  const response: any = await graphqlWithAuth(query, variables)

  const issues: Issue[] = response.search.nodes
    .filter((issue: any) => {
      const stars = issue.repository.stargazerCount
      return stars >= params.minStars && stars <= params.maxStars
    })
    .map((issue: any) => ({
      id: issue.url,
      title: issue.title,
      html_url: issue.url,
      created_at: issue.createdAt,
      repository_url: issue.repository.url,
      repository_name: issue.repository.nameWithOwner,
      stars_count: issue.repository.stargazerCount,
      language: issue.repository.primaryLanguage?.name || null,
      is_assigned: issue.assignees.totalCount > 0,
      labels: issue.labels.nodes.map((label: any) => label.name),
      comments_count: issue.comments.totalCount,
    }))

  return {
    issues,
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
      search(query: $queryString, type: REPOSITORY, first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Repository {
            nameWithOwner
            url
            stargazerCount
            primaryLanguage {
              name
            }
            issues(labels: ["good first issue"], states: OPEN, first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
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

  let queryString = "is:public"
  if (params.language) queryString += ` language:${params.language}`
  queryString += ` stars:${params.minStars}..${params.maxStars}`

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
        language: repo.primaryLanguage?.name || null,
        is_assigned: issue.assignees.totalCount > 0,
        labels: issue.labels.nodes.map((label: any) => label.name),
        comments_count: issue.comments.totalCount,
      }))
    )
    .filter((issue: Issue) => !params.isAssigned || issue.is_assigned)

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
      search(query: $queryString, type: REPOSITORY, first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Repository {
            nameWithOwner
            url
            stargazerCount
            primaryLanguage {
              name
            }
            issues(labels: ["good first issue"], states: OPEN, first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
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

  let queryString = `topic:${params.framework} is:public`
  if (params.language) queryString += ` language:${params.language}`
  queryString += ` stars:${params.minStars}..${params.maxStars}`

  console.log("GitHub framework query string:", queryString)

  const variables = {
    queryString,
    cursor: params.cursor,
  }

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
        language: repo.primaryLanguage?.name || null,
        is_assigned: issue.assignees.totalCount > 0,
        labels: issue.labels.nodes.map((label: any) => label.name),
        comments_count: issue.comments.totalCount,
      }))
    )
    .filter((issue: Issue) => !params.isAssigned || issue.is_assigned)

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
