import React, { useEffect, useState } from "react"
import { useTheme } from "remix-themes"
import { Form } from "@remix-run/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Service } from "~/types"
import GitLabLogo from "~/components/GitLabLogo"
import { Multiselect } from "multiselect-react-dropdown"
import { useTranslatedText } from "~/locale/languageUtility"
import { useCategories } from "~/hooks/useCategories"
type FilterFormProps = {
  service: Service
  minStars: string
  maxStars: string
  minForks: string
  language: string[]
  isAssigned: boolean
  category: string
  framework: string
  hasPullRequests: boolean
  showBookmarked: boolean
  isLoading: boolean
  onServiceChange: (value: Service) => void
  onMinStarsChange: (value: string) => void
  onMaxStarsChange: (value: string) => void
  onMinForksChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onIsAssignedChange: (value: boolean) => void
  onCategoryChange: (value: string) => void
  onFrameworkChange: (value: string) => void
  onHasPullRequestsChange: (value: boolean) => void
  onShowBookmarkedChange: (value: boolean) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function FilterForm({
  service,
  minStars,
  maxStars,
  minForks,
  language,
  isAssigned,
  category,
  framework,
  hasPullRequests,
  showBookmarked,
  isLoading,
  onServiceChange,
  onMinStarsChange,
  onMaxStarsChange,
  onMinForksChange,
  onLanguageChange,
  onIsAssignedChange,
  onCategoryChange,
  onFrameworkChange,
  onHasPullRequestsChange,
  onShowBookmarkedChange,
  onSubmit,
}: FilterFormProps) {
  const languageOptions = [
    "JavaScript",
    "TypeScript",
    "Python",
    "C++",
    "C#",
    "Java",
    "Ruby",
    "PHP",
    "Swift",
    "Go",
    "Kotlin",
    "Rust",
    "R",
  ]
  const [theme] = useTheme()
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  const t = useTranslatedText()
  const categories = useCategories()

  return (
    <div className="mb-8">
      <Tabs
        value={service}
        onValueChange={(value) => onServiceChange(value as Service)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="github"
            className={`flex items-center justify-center p-4 rounded-l-md ${
              service === "github" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <GitHubLogoIcon className="w-6 h-6 mr-2" />
            GitHub
          </TabsTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="gitlab"
                  className={`flex items-center justify-center p-4 rounded-r-md cursor-not-allowed ${
                    service === "gitlab"
                      ? "bg-gray-400 text-gray-600"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  disabled={true}
                >
                  <GitLabLogo />
                  <span className="ml-2">GitLab</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitLab API is currently down</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>

        <TabsContent value={service}>
          <Card className="border rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                {service === "github" ? (
                  <GitHubLogoIcon className="w-6 h-6 mr-2" />
                ) : (
                  <GitLabLogo />
                )}
                <span className="ml-2">
                  {service === "github" ? "GitHub" : "GitLab"} {t('issueFiltersTitle')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="get" onSubmit={onSubmit}>
                <input type="hidden" name="service" value={service} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                  <div className="space-y-2">
                    <label htmlFor="minStars" className="text-sm font-medium">
                      {t('filters.minStars')}
                    </label>
                    <Input
                      type="number"
                      id="minStars"
                      name="minStars"
                      min="0"
                      max={maxStars}
                      value={minStars}
                      onChange={(e) =>
                        e.target.value < 0
                          ? onMaxStarsChange(0)
                          : onMinStarsChange(e.target.value)
                      }
                      className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="maxStars" className="text-sm font-medium">
                      {t('filters.maxStars')}
                    </label>
                    <Input
                      type="number"
                      id="maxStars"
                      name="maxStars"
                      value={maxStars}
                      min={minStars}
                      onChange={(e) =>
                        e.target.value < 0
                          ? onMaxStarsChange(0)
                          : onMaxStarsChange(e.target.value)
                      }
                      className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="minStars" className="text-sm font-medium">
                      Min Forks
                    </label>
                    <Input
                      type="number"
                      id="minForks"
                      name="minForks"
                      value={minForks}
                      min="0"
                      onChange={(e) =>
                        e.target.value < 0
                          ? onMinForksChange(0)
                          : onMinForksChange(e.target.value)
                      }
                      className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium">
                      {t('filters.language')}
                    </label>
                    {domLoaded && (
                      <Multiselect
                        isObject={false}
                        options={languageOptions}
                        selectedValues={language}
                        onRemove={onLanguageChange}
                        onSelect={onLanguageChange}
                        placeholder={
                          language.length === 0 ? "Select Languages" : ""
                        }
                        className="bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
                        style={{
                          chips: {
                            fontWeight: "bold",
                            marginRight: "4px",
                          },
                          searchBox: {
                            // To change search box element look
                            border: "none",
                            display: "flex",
                            flexWrap: "wrap",
                          },
                          inputField: {
                            // To change input field position or margin
                            padding: language.length === 0 ? "6px" : "0",
                            width: language.length === 0 ? "100%" : "1px",
                            height: "100%",
                          },
                          optionContainer: {
                            // To Set the dropdown background
                            backgroundColor:
                              theme === "dark" ? "#1F2937" : "white",
                            border: theme === "dark" ? "none" : "",
                            borderColor: "#D1D5DB",
                            borderWidth: "2px",
                            fontSize: "0.875rem",
                            overflow: "auto",
                            scrollbarColor:
                              theme === "dark"
                                ? "rgba(255, 255, 255, 0.5) transparent"
                                : "rgba(0, 0, 0, 0.5) transparent",
                          },
                          option: {
                            // To change css for dropdown options
                            color: theme === "dark" ? "white" : "black",
                          },
                        }}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      {t('filters.category')}
                    </label>
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white py-1 light:border-transparent dark:border-transparent focus-within:border-blue-500 focus-within:outline-none rounded-md transition-colors duration-200">
                      <Select value={category} onValueChange={onCategoryChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 
                        border-2 border-gray-300 dark:border-transparent rounded-md shadow-lg  
                         max-h-[--radix-select-content-available-height]" >
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.value}
                              value={cat.value}
                              className="my-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                            >
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="framework" className="text-sm font-medium">
                      {t('filters.frameworkLibrary')}
                    </label>
                    <Input
                      type="text"
                      id="framework"
                      name="framework"
                      value={framework}
                      onChange={(e) => onFrameworkChange(e.target.value)}
                      placeholder="e.g. reactjs, expressjs"
                      className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="isAssigned"
                      className="text-sm font-medium text-black dark:text-white"
                    >
                      {t('filters.assigned')}
                    </label>
                    <br />
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isAssigned"
                          name="isAssigned"
                          checked={isAssigned}
                          onCheckedChange={(checked) =>
                            onIsAssignedChange(checked as boolean)
                          }
                          className="form-checkbox w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <label
                          htmlFor="isAssigned"
                          className="text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('filters.includeAssignedIssues')}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="hasPullRequests"
                      className="text-sm font-medium text-black dark:text-white"
                    >
                      {t('filters.hasPullRequests')}
                    </label>
                    <br />
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasPullRequests"
                          name="hasPullRequests"
                          checked={hasPullRequests}
                          onCheckedChange={(checked) =>
                            onHasPullRequestsChange(checked as boolean)
                          }
                          className="form-checkbox w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <label
                          htmlFor="hasPullRequests"
                          className="text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('filters.includeIssuesPR')}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="showBookmarked"
                      className="text-sm font-medium text-black dark:text-white"
                    >
                      {t('filters.showBookmark')}
                    </label>
                    <br />
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showBookmarked"
                          name="showBookmarked"
                          checked={showBookmarked}
                          onCheckedChange={(checked) =>
                            onShowBookmarkedChange(checked as boolean)
                          }
                          className="form-checkbox w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <label
                          htmlFor="showBookmarked"
                          className="text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('filters.showOnlyBookmark')}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className={`mt-4 px-4 py-2 rounded-md transition-colors duration-200 ${
                    isLoading
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      : "bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-500"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Filtering..." : t('filters.filter')}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
