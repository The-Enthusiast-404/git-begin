// app/routes/index.tsx
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Octokit } from "@octokit/rest";

type Issue = {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
  repository_name: string;
  stars_count: number;
};

export const loader: LoaderFunction = async () => {
  const githubToken = process.env.GITHUB_API_KEY;
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is not set in environment variables");
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    const response = await octokit.search.issuesAndPullRequests({
      q: "is:issue is:open label:good-first-issue sort:created-desc",
      per_page: 20,
    });

    const issues: Issue[] = await Promise.all(
      response.data.items.map(async (item: any) => {
        const repoUrl = new URL(item.repository_url);
        const [, , owner, repo] = repoUrl.pathname.split("/");

        try {
          const repoResponse = await octokit.repos.get({ owner, repo });
          return {
            id: item.id,
            title: item.title,
            html_url: item.html_url,
            created_at: item.created_at,
            repository_url: item.repository_url,
            repository_name: `${owner}/${repo}`,
            stars_count: repoResponse.data.stargazers_count,
          };
        } catch (repoError) {
          console.error(
            `Error fetching repo details for ${owner}/${repo}:`,
            repoError
          );
          return {
            id: item.id,
            title: item.title,
            html_url: item.html_url,
            created_at: item.created_at,
            repository_url: item.repository_url,
            repository_name: `${owner}/${repo}`,
            stars_count: -1, // Use -1 to indicate an error in fetching stars
          };
        }
      })
    );

    return json({ issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return json(
      { issues: [], error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
};

export default function Index() {
  const { issues, error } = useLoaderData<{
    issues: Issue[];
    error?: string;
  }>();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
                      {issue.repository_name}
                      {issue.stars_count >= 0
                        ? ` • ⭐ ${issue.stars_count}`
                        : " • ⭐ N/A"}
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
  );
}
