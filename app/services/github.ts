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

  const filteredIssues = response.search.nodes
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
    issues: filteredIssues,
    hasNextPage: response.search.pageInfo.hasNextPage,
    endCursor: response.search.pageInfo.endCursor,
  }
}
