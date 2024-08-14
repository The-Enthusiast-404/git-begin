import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchGitHubIssues } from "../services/github";
import { FilterForm } from "../components/FilterForm";
import { IssueCard } from "../components/IssueCard";
import { FilterParams, LoaderData } from "~/types";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params: FilterParams = {
    minStars: parseInt(url.searchParams.get("minStars") || "0", 10),
    maxStars: parseInt(url.searchParams.get("maxStars") || "1000000", 10),
    language: url.searchParams.get("language") || "",
    isAssigned: url.searchParams.get("isAssigned") === "true",
    cursor: url.searchParams.get("cursor") || null,
  };

  try {
    const data = await fetchGitHubIssues(params);
    return json(data);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return json(
      {
        issues: [],
        error:
          "Failed to fetch issues: " +
          (error instanceof Error ? error.message : String(error)),
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
  const [allIssues, setAllIssues] = useState(issues);
  const submit = useSubmit();
  const navigation = useNavigation();

  useEffect(() => {
    const url = new URL(window.location.href);
    setMinStars(url.searchParams.get("minStars") || "0");
    setMaxStars(url.searchParams.get("maxStars") || "1000000");
    setLanguage(url.searchParams.get("language") || "");
    setIsAssigned(url.searchParams.get("isAssigned") === "true");
  }, []);

  useEffect(() => {
    if (issues.length > 0) {
      setAllIssues((prev) => [...prev, ...issues]);
    }
  }, [issues]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("cursor");
    setAllIssues([]);
    submit(formData, { method: "get" });
  };

  const handleLoadMore = () => {
    const formData = new FormData();
    formData.set("minStars", minStars);
    formData.set("maxStars", maxStars);
    formData.set("language", language);
    formData.set("isAssigned", isAssigned.toString());
    formData.set("cursor", endCursor || "");
    submit(formData, { method: "get" });
  };

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GitHub Beginner-Friendly Issues Finder
      </h1>
      <FilterForm
        minStars={minStars}
        maxStars={maxStars}
        language={language}
        isAssigned={isAssigned}
        isLoading={isLoading}
        onMinStarsChange={setMinStars}
        onMaxStarsChange={setMaxStars}
        onLanguageChange={setLanguage}
        onIsAssignedChange={setIsAssigned}
        onSubmit={handleSubmit}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          Error: {error}
        </div>
      )}

      {allIssues.length === 0 && !error && (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
          No issues found matching the current criteria.
        </div>
      )}

      <div className="space-y-4">
        {allIssues.map((issue, index) => (
          <IssueCard key={`${issue.id}-${index}`} issue={issue} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
