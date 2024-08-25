import React from "react"
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
import { categories } from "~/data/categories"
import { languages } from "~/data/languages"

type FilterFormProps = {
  service: Service
  minStars: string
  maxStars: string
  language: string
  isAssigned: boolean
  category: string
  framework: string
  hasPullRequests: boolean
  showBookmarked: boolean
  isLoading: boolean
  onServiceChange: (value: Service) => void
  onMinStarsChange: (value: string) => void
  onMaxStarsChange: (value: string) => void
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
  onLanguageChange,
  onIsAssignedChange,
  onCategoryChange,
  onFrameworkChange,
  onHasPullRequestsChange,
  onShowBookmarkedChange,
  onSubmit,
}: FilterFormProps) {
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
                  {service === "github" ? "GitHub" : "GitLab"} Issue Filters
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="get" onSubmit={onSubmit}>
                <input type="hidden" name="service" value={service} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                  <div className="space-y-2">
                    <label htmlFor="minStars" className="text-sm font-medium">
                      Min Stars
                    </label>
                    <Input
                      type="number"
                      id="minStars"
                      name="minStars"
                      value={minStars}
                      onChange={(e) => onMinStarsChange(e.target.value)}
                      className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
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
                      onChange={(e) => onMaxStarsChange(e.target.value)}
                      className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-200"
                    />
                  </div>
                  console.log(language);
                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium">
                      Language
                    </label>
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white py-1 light:border-transparent dark:border-transparent focus-within:border-blue-500 focus-within:outline-none rounded-md transition-colors duration-200">
                      <Select value={language} onValueChange={onLanguageChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent rounded-md shadow-lg w-full">
                          {languages.map((lang) => (
                            <SelectItem
                              key={lang.value}
                              value={lang.value}
                              className="my-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                            >
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> 
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white py-1 light:border-transparent dark:border-transparent focus-within:border-blue-500 focus-within:outline-none rounded-md transition-colors duration-200">
                      <Select value={category} onValueChange={onCategoryChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-transparent rounded-md shadow-lg w-full">
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
                      Framework/Library
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
                      Assigned
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
                          Include Assigned Issues
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="hasPullRequests"
                      className="text-sm font-medium text-black dark:text-white"
                    >
                      Has Pull Requests
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
                          Include Issues with Pull Requests
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="showBookmarked"
                      className="text-sm font-medium text-black dark:text-white"
                    >
                      Show Bookmarked
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
                          Show Only Bookmarked Issues
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
                  {isLoading ? "Filtering..." : "Filter"}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
