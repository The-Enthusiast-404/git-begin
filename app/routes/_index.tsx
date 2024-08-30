import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { LoaderData, FilterParams, Service, Issue } from "~/types"
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
import { useBookmarks } from "~/hooks/useBookmarks"
import { categories } from "~/data/categories"

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
  const [language, setLanguage] = useState<string[]>([])
  const [isAssigned, setIsAssigned] = useState(false)
  const [category, setCategory] = useState("all")
  const [framework, setFramework] = useState("")
  const [hasPullRequests, setHasPullRequests] = useState(false)
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const submit = useSubmit()
  const navigation = useNavigation()
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks()

  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    setService((url.searchParams.get("service") || "github") as Service)
    setMinStars(url.searchParams.get("minStars") || "0")
    setMaxStars(url.searchParams.get("maxStars") || "1000000")
    setMinForks(url.searchParams.get("minForks") || "0")

    const languageParam = url.searchParams.get("language")
    setLanguage(languageParam ? languageParam.split(" ") : [])

    setIsAssigned(url.searchParams.get("isAssigned") === "true")
    setCategory(url.searchParams.get("category") || "all")
    setFramework(url.searchParams.get("framework") || "")
    setHasPullRequests(url.searchParams.get("hasPullRequests") === "true")
    setShowBookmarked(url.searchParams.get("showBookmarked") === "true")
  }, [])

  useEffect(() => {
    if (showBookmarked) {
      const bookmarkedIssues = issues.filter((issue) => isBookmarked(issue.id))
      setIssues(bookmarkedIssues)
    } else {
      setIssues(initialIssues)
    }
  }, [initialIssues, showBookmarked, isBookmarked])

  const handleLanguageChange = (selectedLanguage: any) => {
    setLanguage(selectedLanguage)
  }

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
    formData.set("language", language.join(" "))
    setIssues([])
    setIsSearching(true)
    submit(formData, { method: "get" })
  }

  const handleLoadMore = () => {
    const formData = new FormData()
    formData.set("service", service)
    formData.set("minStars", minStars)
    formData.set("maxStars", maxStars)
    formData.set("minForks", minForks)
    formData.set("language", language.join(" "))
    formData.set("isAssigned", isAssigned.toString())
    formData.set("category", category)
    formData.set("framework", framework)
    formData.set("hasPullRequests", hasPullRequests.toString())
    formData.set("showBookmarked", showBookmarked.toString())
    formData.set("cursor", endCursor || "")
    setIsSearching(true)
    submit(formData, { method: "get" })
  }

  const handleServiceChange = (newService: Service) => {
    setService(newService)
    const formData = new FormData()
    formData.set("service", newService)
    formData.set("minStars", minStars)
    formData.set("maxStars", maxStars)
    formData.set("minForks", minForks)
    formData.set("language", language.join(" "))
    formData.set("isAssigned", isAssigned.toString())
    formData.set("category", category)
    formData.set("framework", framework)
    formData.set("hasPullRequests", hasPullRequests.toString())
    formData.set("showBookmarked", showBookmarked.toString())
    setIssues([])
    setIsSearching(true)
    submit(formData, { method: "get" })
  }

  const handleToggleBookmark = (issueId: string) => {
    toggleBookmark(issueId)
    if (showBookmarked) {
      setIssues((prevIssues) =>
        prevIssues.filter(
          (issue) => issue.id !== issueId || isBookmarked(issue.id)
        )
      )
    }
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set("service", service)
    formData.set("minStars", minStars)
    formData.set("maxStars", maxStars)
    formData.set("minForks", minForks)
    formData.set("language", mobileSearchQuery)
    formData.set("isAssigned", isAssigned.toString())
    formData.set("category", category)
    formData.set("framework", framework)
    formData.set("hasPullRequests", hasPullRequests.toString())
    formData.set("showBookmarked", showBookmarked.toString())
    setIssues([])
    setIsSearching(true)
    submit(formData, { method: "get" })
  }

  const handleFilterChange = (newFilters) => {
    setMinStars(newFilters.minStars)
    setMaxStars(newFilters.maxStars)
    setMinForks(newFilters.minForks)
    setLanguage(newFilters.language)
    setCategory(newFilters.category)
    setFramework(newFilters.framework)
    setIsAssigned(newFilters.isAssigned)
    setHasPullRequests(newFilters.hasPullRequests)
    setShowBookmarked(newFilters.showBookmarked)

    const formData = new FormData()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === "language") {
        formData.set(key, value.join(" "))
      } else {
        formData.append(key, value.toString())
      }
    })
    formData.set("service", service)
    setIssues([])
    setIsSearching(true)
    submit(formData, { method: "get" })
  }

  useEffect(() => {
    if (navigation.state === "idle") {
      setIsSearching(false)
    }
  }, [navigation.state])

  const renderIssueList = () => (
    <div className="space-y-4">
      {isSearching ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {issues.map((issue: Issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              showPullRequests={hasPullRequests}
              isBookmarked={isBookmarked(issue.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
          {!showBookmarked && hasNextPage && (
            <div className="flex justify-center mt-6 mb-6">
              <Button
                onClick={handleLoadMore}
                disabled={isSearching}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSearching ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting"

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 pb-16">
        {/* Mobile and Tablet View */}
        <div className="lg:hidden">
          <Card className="mb-4">
            <CardContent className="pt-6">
              <form
                onSubmit={handleMobileSearch}
                className="flex items-center space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Search issues..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <Button type="submit" size="icon" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Popover open={showFilter} onOpenChange={setShowFilter}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <FilterPopover
                      filters={{
                        minStars,
                        maxStars,
                        minForks,
                        language,
                        isAssigned,
                        category,
                        framework,
                        hasPullRequests,
                        showBookmarked,
                      }}
                      onFilterChange={handleFilterChange}
                      setShowFilter={setShowFilter}
                    />
                  </PopoverContent>
                </Popover>
              </form>
            </CardContent>
          </Card>
          <ScrollArea className="h-[calc(100vh-16rem)] overflow-y-auto">
            {error && !isSearching && (
              <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
                Error: {error}
              </div>
            )}
            {issues.length === 0 && !error && !isLoading && !isSearching && (
              <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
                {showBookmarked
                  ? "No bookmarked issues found. Try bookmarking some issues first."
                  : "No issues found matching the current criteria. Try adjusting your filters."}
              </div>
            )}
            {renderIssueList()}
          </ScrollArea>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex lg:space-x-4">
          <div className="w-1/3">
            <Card>
              <CardContent>
                <FilterForm
                  service={service}
                  onServiceChange={handleServiceChange}
                  minStars={minStars}
                  onMinStarsChange={setMinStars}
                  maxStars={maxStars}
                  onMaxStarsChange={setMaxStars}
                  minForks={minForks}
                  onMinForksChange={setMinForks}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  isAssigned={isAssigned}
                  onIsAssignedChange={setIsAssigned}
                  category={category}
                  onCategoryChange={setCategory}
                  framework={framework}
                  onFrameworkChange={setFramework}
                  hasPullRequests={hasPullRequests}
                  onHasPullRequestsChange={setHasPullRequests}
                  showBookmarked={showBookmarked}
                  onShowBookmarkedChange={setShowBookmarked}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 lg:overflow-hidden">
            <ScrollArea className="h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-700 dark:scrollbar-track-gray-800">
              {error && !isSearching && (
                <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
                  Error: {error}
                </div>
              )}
              {issues.length === 0 && !error && !isLoading && !isSearching && (
                <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
                  {showBookmarked
                    ? "No bookmarked issues found. Try bookmarking some issues first."
                    : "No issues found matching the current criteria. Try adjusting your filters."}
                </div>
              )}
              <div className="space-y-4 p-4">{renderIssueList()}</div>
            </ScrollArea>
          </div>
        </div>
      </main>

      <Footer className="mt-auto" />
    </div>
  )
}

const FilterPopover = ({ filters, onFilterChange, setShowFilter }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string) => {
    setLocalFilters((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleCategoryChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, category: value }))
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
    setShowFilter(false)
  }

  return (
    <ScrollArea className="h-[80vh] w-full">
      <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <Label
            htmlFor="minStars"
            className="text-gray-700 dark:text-gray-300"
          >
            Min Stars
          </Label>
          <Input
            type="number"
            id="minStars"
            name="minStars"
            value={localFilters.minStars}
            onChange={handleInputChange}
            min="0"
            className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label
            htmlFor="maxStars"
            className="text-gray-700 dark:text-gray-300"
          >
            Max Stars
          </Label>
          <Input
            type="number"
            id="maxStars"
            name="maxStars"
            value={localFilters.maxStars}
            onChange={handleInputChange}
            min="0"
            className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label
            htmlFor="minForks"
            className="text-gray-700 dark:text-gray-300"
          >
            Min Forks
          </Label>
          <Input
            type="number"
            id="minForks"
            name="minForks"
            value={localFilters.minForks}
            onChange={handleInputChange}
            min="0"
            className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label
            htmlFor="language"
            className="text-gray-700 dark:text-gray-300"
          >
            Language
          </Label>
          <Input
            type="text"
            id="language"
            name="language"
            value={localFilters.language}
            onChange={handleInputChange}
            placeholder="e.g. JavaScript"
            className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label
            htmlFor="category"
            className="text-gray-700 dark:text-gray-300"
          >
            Category
          </Label>
          <Select
            value={localFilters.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger
              id="category"
              className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {categories.map((cat) => (
                <SelectItem
                  key={cat.value}
                  value={cat.value}
                  className="text-gray-900 dark:text-gray-100"
                >
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="framework"
            className="text-gray-700 dark:text-gray-300"
          >
            Framework/Library
          </Label>
          <Input
            type="text"
            id="framework"
            name="framework"
            value={localFilters.framework}
            onChange={handleInputChange}
            placeholder="e.g. React, Vue"
            className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAssigned"
              checked={localFilters.isAssigned}
              onCheckedChange={() => handleCheckboxChange("isAssigned")}
              className="border-gray-300 dark:border-gray-600"
            />
            <Label
              htmlFor="isAssigned"
              className="text-gray-700 dark:text-gray-300"
            >
              Include Assigned Issues
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasPullRequests"
              checked={localFilters.hasPullRequests}
              onCheckedChange={() => handleCheckboxChange("hasPullRequests")}
              className="border-gray-300 dark:border-gray-600"
            />
            <Label
              htmlFor="hasPullRequests"
              className="text-gray-700 dark:text-gray-300"
            >
              Include Issues with Pull Requests
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showBookmarked"
              checked={localFilters.showBookmarked}
              onCheckedChange={() => handleCheckboxChange("showBookmarked")}
              className="border-gray-300 dark:border-gray-600"
            />
            <Label
              htmlFor="showBookmarked"
              className="text-gray-700 dark:text-gray-300"
            >
              Show Only Bookmarked Issues
            </Label>
          </div>
        </div>
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </ScrollArea>
  )
}
