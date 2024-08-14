// app/routes/index.tsx
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSubmit, Form, Link } from "@remix-run/react";
import { graphql } from "@octokit/graphql";
import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar, Code } from "lucide-react";

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
    formData.delete("cursor");
    submit(formData, { method: "get" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GitHub Good First Issues Finder
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="get" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="minStars" className="text-sm font-medium">
                  Min Stars
                </label>
                <Input
                  type="number"
                  id="minStars"
                  name="minStars"
                  value={minStars}
                  onChange={(e) => setMinStars(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="maxStars" className="text-sm font-medium">
                  Max Stars
                </label>
                <Input
                  type="number"
                  id="maxStars"
                  name="maxStars"
                  value={maxStars}
                  onChange={(e) => setMaxStars(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Language
                </label>
                <Input
                  type="text"
                  id="language"
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. JavaScript"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAssigned"
                  name="isAssigned"
                  checked={isAssigned}
                  onCheckedChange={(checked) =>
                    setIsAssigned(checked as boolean)
                  }
                />
                <label
                  htmlFor="isAssigned"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Assigned Issues
                </label>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4"
              disabled={transition.state === "submitting"}
            >
              {transition.state === "submitting" ? "Filtering..." : "Filter"}
            </Button>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-4 bg-red-50">
          <CardContent className="text-red-500 p-4">Error: {error}</CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {issues.map((issue) => (
          <Card
            key={issue.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <a
                  href={issue.html_url}
                  className="text-lg font-semibold text-blue-600 hover:underline truncate max-w-[80%]"
                >
                  {issue.title}
                </a>
                <Badge variant="secondary">Good First Issue</Badge>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1" /> {issue.stars_count}
                </span>
                <span className="flex items-center">
                  <Code className="w-4 h-4 mr-1" /> {issue.language || "N/A"}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />{" "}
                  {new Date(issue.created_at).toLocaleDateString()}
                </span>
                {issue.is_assigned && <Badge variant="outline">Assigned</Badge>}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {issue.repository_name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Link
            to={`?minStars=${minStars}&maxStars=${maxStars}&language=${language}&isAssigned=${isAssigned}&cursor=${endCursor}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Load More
          </Link>
        </div>
      )}
    </div>
  );
}
