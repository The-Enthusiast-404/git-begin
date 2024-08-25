import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoaderData, FilterParams, Service } from "~/types"
import {
  fetchGitHubIssues,
  fetchGitHubIssuesByCategory,
  fetchGitHubIssuesByFramework,
} from "~/services/github"
import {
  fetchGitLabIssues,
  fetchGitLabIssuesByCategory,
  fetchGitLabIssuesByFramework,
} from "~/services/gitlab"
import { FilterForm } from "~/components/FilterForm"
import { IssueCard } from "~/components/IssueCard"
import NavBar from "~/components/NavBar"
import Footer from "~/components/Footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBookmarks } from "~/hooks/useBookmarks"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params: FilterParams = {
    service: (url.searchParams.get("service") || "github") as Service,
    minStars: parseInt(url.searchParams.get("minStars") || "0", 10),
    maxStars: parseInt(url.searchParams.get("maxStars") || "1000000", 10),
    minForks: parseInt(url.searchParams.get("minForks") || "0", 10),
    language: url.searchParams.get("language") || "",
    isAssigned: url.searchParams.get("isAssigned") === "true",
    cursor: url.searchParams.get("cursor") || null,
    category: url.searchParams.get("category") || "all",
    framework: url.searchParams.get("framework") || "",
    hasPullRequests: url.searchParams.get("hasPullRequests") === "true",
  }

  try {
    let data
    if (params.framework) {
      data =
        params.service === "github"
          ? await fetchGitHubIssuesByFramework(params)
          : await fetchGitLabIssuesByFramework(params)
    } else if (params.category && params.category !== "all") {
      data =
        params.service === "github"
          ? await fetchGitHubIssuesByCategory(params)
          : await fetchGitLabIssuesByCategory(params)
    } else {
      data =
        params.service === "github"
          ? await fetchGitHubIssues(params)
          : await fetchGitLabIssues(params)
    }
    console.log("Loader data:", data) // Debug log
    return json({ ...data, service: params.service })
  } catch (error) {
    console.error("Error fetching issues:", error)
    return json(
      {
        issues: [],
        error:
          "Failed to fetch issues: " +
          (error instanceof Error ? error.message : String(error)),
        hasNextPage: false,
        endCursor: null,
        service: params.service,
      },
      { status: 500 }
    )
  }
}

export default function Index() {
  const {
    issues: initialIssues,
    error,
    hasNextPage,
    endCursor,
    service: initialService,
  } = useLoaderData<LoaderData & { service: Service }>()
  const [service, setService] = useState<Service>(initialService)
  const [minStars, setMinStars] = useState("0")
  const [maxStars, setMaxStars] = useState("1000000")
  const [minForks, setMinForks] = useState("0")
  const [language, setLanguage] = useState("")
  const [isAssigned, setIsAssigned] = useState(false)
  const [category, setCategory] = useState("all")
  const [framework, setFramework] = useState("")
  const [hasPullRequests, setHasPullRequests] = useState(false)
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const submit = useSubmit()
  const navigation = useNavigation()
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks()

  useEffect(() => {
    const url = new URL(window.location.href)
    setService((url.searchParams.get("service") || "github") as Service)
    setMinStars(url.searchParams.get("minStars") || "0")
    setMaxStars(url.searchParams.get("maxStars") || "1000000")
    setMinForks(url.searchParams.get("minForks") || "0")
    setLanguage(url.searchParams.get("language") || "")
    setIsAssigned(url.searchParams.get("isAssigned") === "true")
    setCategory(url.searchParams.get("category") || "all")
    setFramework(url.searchParams.get("framework") || "")
    setHasPullRequests(url.searchParams.get("hasPullRequests") === "true")
    setShowBookmarked(url.searchParams.get("showBookmarked") === "true")
  }, [])

  useEffect(() => {
    if (showBookmarked) {
      // When showing bookmarks, filter the issues to only show bookmarked ones
      const bookmarkedIssues = issues.filter((issue) => isBookmarked(issue.id))
      setIssues(bookmarkedIssues)
    } else {
      // When not showing bookmarks, use the initial issues from the loader
      setIssues(initialIssues)
    }
  }, [initialIssues, showBookmarked, isBookmarked])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.delete("cursor")
    if (category === "all") {
      formData.delete("category")
    } else {
      formData.set("category", category)
    }
    if (!framework) {
      formData.delete("framework")
    }
    formData.set("hasPullRequests", hasPullRequests.toString())
    formData.set("showBookmarked", showBookmarked.toString())
    formData.set("isAssigned", isAssigned.toString())
    setIssues([])
    submit(formData, { method: "get" })
  }

  const handleLoadMore = () => {
    const formData = new FormData()
    formData.set("service", service)
    formData.set("minStars", minStars)
    formData.set("maxStars", maxStars)
    formData.set("minForks", minForks)
    formData.set("language", language)
    formData.set("isAssigned", isAssigned.toString())
    formData.set("category", category)
    formData.set("framework", framework)
    formData.set("hasPullRequests", hasPullRequests.toString())
    formData.set("showBookmarked", showBookmarked.toString())
    formData.set("cursor", endCursor || "")
    submit(formData, { method: "get" })
  }

  const handleServiceChange = (newService: Service) => {
    setService(newService)
    const formData = new FormData()
    formData.set("service", newService)
    formData.set("minStars", minStars)
    formData.set("maxStars", maxStars)
    formData.set("minForks", minForks)
    formData.set("language", language)
    formData.set("isAssigned", isAssigned.toString())
    formData.set("category", category)
    formData.set("framework", framework)
    formData.set("hasPullRequests", hasPullRequests.toString())
    formData.set("showBookmarked", showBookmarked.toString())
    setIssues([])
    submit(formData, { method: "get" })
  }

  const handleToggleBookmark = (issueId: string) => {
    toggleBookmark(issueId)
    if (showBookmarked) {
      // If we're showing bookmarks, remove the issue from the list if it's unbookmarked
      setIssues((prevIssues) =>
        prevIssues.filter(
          (issue) => issue.id !== issueId || isBookmarked(issue.id)
        )
      )
    }
  }

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting"

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-500 dark:scrollbar-track-gray-800">
              <FilterForm
                service={service}
                minStars={minStars}
                maxStars={maxStars}
                minForks={minForks}
                language={language}
                isAssigned={isAssigned}
                category={category}
                framework={framework}
                hasPullRequests={hasPullRequests}
                showBookmarked={showBookmarked}
                isLoading={isLoading}
                onServiceChange={handleServiceChange}
                onMinStarsChange={setMinStars}
                onMaxStarsChange={setMaxStars}
                onMinForksChange={setMinForks}
                onLanguageChange={setLanguage}
                onIsAssignedChange={setIsAssigned}
                onCategoryChange={setCategory}
                onFrameworkChange={setFramework}
                onHasPullRequestsChange={setHasPullRequests}
                onShowBookmarkedChange={setShowBookmarked}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          <div className="flex-1 lg:overflow-hidden">
            <ScrollArea className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-700 dark:scrollbar-track-gray-800">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
                  Error: {error}
                </div>
              )}
              {issues.length === 0 && !error && !isLoading && (
                <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
                  {showBookmarked
                    ? "No bookmarked issues found. Try bookmarking some issues first."
                    : "No issues found matching the current criteria. Try adjusting your filters."}
                </div>
              )}
              <div className="space-y-4 p-4">
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    showPullRequests={hasPullRequests}
                    isBookmarked={isBookmarked(issue.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            </ScrollArea>

            {!showBookmarked && hasNextPage && (
              <div className="flex justify-center mt-6 mb-6">
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
