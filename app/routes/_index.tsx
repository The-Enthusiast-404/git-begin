// app/routes/index.tsx
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSubmit, Form, Link } from "@remix-run/react";
import { graphql } from "@octokit/graphql";
import { useState, useEffect, useTransition } from "react";

const ISSUES_PER_PAGE = 10;

type Issue = {
  id: string;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
  repository_name: string;
  stars_count: number;
  language: string | null;
  is_assigned: boolean;
};

type LoaderData = {
  issues: Issue[];
  error?: string;
  hasNextPage: boolean;
  endCursor: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const minStars = parseInt(url.searchParams.get("minStars") || "0", 10);
  const maxStars = parseInt(url.searchParams.get("maxStars") || "1000000", 10);
  const language = url.searchParams.get("language") || "";
  const isAssigned = url.searchParams.get("isAssigned") === "true";
  const cursor = url.searchParams.get("cursor") || null;

  const githubToken = process.env.GITHUB_API_KEY;
  if (!githubToken) {
    console.error("GITHUB_API_KEY is not set in environment variables");
    return json(
      {
        issues: [],
        error: "GitHub API key is not configured",
        hasNextPage: false,
        endCursor: null,
      },
      { status: 500 }
    );
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  });

  try {
    const query = `
      query($queryString: String!, $cursor: String) {
        search(query: $queryString, type: ISSUE, first: 100, after: $cursor) {
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
            }
          }
        }
      }
    `;

    let queryString = 'is:open is:issue label:"good first issue"';
    if (language) queryString += ` language:${language}`;
    if (!isAssigned) queryString += " no:assignee";

    const variables = {
      queryString,
      cursor: cursor,
    };

    const response: any = await graphqlWithAuth(query, variables);

    const filteredIssues = response.search.nodes
      .filter((issue: any) => {
        const stars = issue.repository.stargazerCount;
        return stars >= minStars && stars <= maxStars;
      })
      .slice(0, ISSUES_PER_PAGE)
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
      }));

    return json({
      issues: filteredIssues,
      hasNextPage: response.search.pageInfo.hasNextPage,
      endCursor: response.search.pageInfo.endCursor,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return json(
      {
        issues: [],
        error: "Failed to fetch issues",
        hasNextPage: false,
        endCursor: null,
      },
      { status: 500 }
    );
  }
};

export default function Index() {
  const { issues, error, hasNextPage, endCursor } = useLoaderData<LoaderData>();
  const [minStars, setMinStars] = useState("0");
  const [maxStars, setMaxStars] = useState("1000000");
  const [language, setLanguage] = useState("");
  const [isAssigned, setIsAssigned] = useState(false);
  const submit = useSubmit();
  const transition = useTransition();

  useEffect(() => {
    const url = new URL(window.location.href);
    setMinStars(url.searchParams.get("minStars") || "0");
    setMaxStars(url.searchParams.get("maxStars") || "1000000");
    setLanguage(url.searchParams.get("language") || "");
    setIsAssigned(url.searchParams.get("isAssigned") === "true");
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("cursor"); // Reset cursor when applying new filters
    submit(formData, { method: "get" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        GitHub Good First Issues Finder
      </h1>
      <Form method="get" onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="minStars"
              className="block text-sm font-medium text-gray-700"
            >
              Min Stars
            </label>
            <input
              type="number"
              id="minStars"
              name="minStars"
              value={minStars}
              onChange={(e) => setMinStars(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="maxStars"
              className="block text-sm font-medium text-gray-700"
            >
              Max Stars
            </label>
            <input
              type="number"
              id="maxStars"
              name="maxStars"
              value={maxStars}
              onChange={(e) => setMaxStars(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="e.g. JavaScript"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAssigned"
              name="isAssigned"
              checked={isAssigned}
              onChange={(e) => setIsAssigned(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isAssigned"
              className="ml-2 block text-sm text-gray-900"
            >
              Include Assigned Issues
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting" ? "Filtering..." : "Filter"}
          </button>
        </div>
      </Form>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-4">
        <ul className="divide-y divide-gray-200">
          {issues.map((issue) => (
            <li key={issue.id}>
              <a href={issue.html_url} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {issue.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Good First Issue
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {issue.repository_name} • ⭐ {issue.stars_count}
                        {issue.language && ` • ${issue.language}`}
                        {issue.is_assigned && " • Assigned"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Created on{" "}
                        {new Date(issue.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        {hasNextPage && (
          <Link
            to={`?minStars=${minStars}&maxStars=${maxStars}&language=${language}&isAssigned=${isAssigned}&cursor=${endCursor}`}
            className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Load More
          </Link>
        )}
      </div>
    </div>
  );
}
