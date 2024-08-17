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
import { Service } from "../types"

const GitLabLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M503.5 204.6L502.8 202.8L433.1 21.02C431.7 17.45 429.2 14.43 425.9 12.38C423.5 10.83 420.8 9.865 417.9 9.57C415 9.275 412.2 9.653 409.5 10.68C406.8 11.7 404.4 13.34 402.4 15.46C400.5 17.58 399.1 20.13 398.3 22.9L351.3 166.9H160.8L113.8 22.9C112.9 20.13 111.5 17.59 109.6 15.47C107.6 13.35 105.2 11.72 102.5 10.7C99.86 9.675 96.98 9.295 94.12 9.587C91.26 9.878 88.51 10.83 86.08 12.38C82.84 14.43 80.33 17.45 78.92 21.02L9.267 202.8L8.543 204.6C-1.484 230.8-2.72 259.6 5.023 286.6C12.77 313.5 29.07 337.3 51.47 354.2L51.74 354.4L52.33 354.8L158.3 434.3L210.9 474L242.9 498.2C246.6 500.1 251.2 502.5 255.9 502.5C260.6 502.5 265.2 500.1 268.9 498.2L300.9 474L353.5 434.3L460.2 354.4L460.5 354.1C482.9 337.2 499.2 313.5 506.1 286.6C514.7 259.6 513.5 230.8 503.5 204.6Z"
      fill="currentColor"
    />
  </svg>
)

const categories = [
  { value: "all", label: "All Categories" },
  { value: "web-dev", label: "Web Development" },
  { value: "mobile-dev", label: "Mobile Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "devops", label: "DevOps" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "documentation", label: "Documentation" },
]

type FilterFormProps = {
  service: Service
  minStars: string
  maxStars: string
  language: string
  isAssigned: boolean
  category: string
  framework: string // New prop
  isLoading: boolean
  onServiceChange: (value: Service) => void
  onMinStarsChange: (value: string) => void
  onMaxStarsChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onIsAssignedChange: (value: boolean) => void
  onCategoryChange: (value: string) => void
  onFrameworkChange: (value: string) => void // New prop
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
  isLoading,
  onServiceChange,
  onMinStarsChange,
  onMaxStarsChange,
  onLanguageChange,
  onIsAssignedChange,
  onCategoryChange,
  onFrameworkChange,
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
            className={`flex items-center justify-center p-4 ${
              service === "github" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <GitHubLogoIcon className="w-6 h-6 mr-2" />
            GitHub
          </TabsTrigger>
          <TabsTrigger
            value="gitlab"
            className={`flex items-center justify-center p-4 ${
              service === "gitlab" ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            <GitLabLogo />
            <span className="ml-2">GitLab</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={service}>
          <Card
            className={
              service === "github" ? "border-blue-500" : "border-orange-500"
            }
          >
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
                      onChange={(e) => onMinStarsChange(e.target.value)}
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
                      onChange={(e) => onLanguageChange(e.target.value)}
                      placeholder="e.g. JavaScript"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select value={category} onValueChange={onCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAssigned"
                      name="isAssigned"
                      checked={isAssigned}
                      onCheckedChange={(checked) =>
                        onIsAssignedChange(checked as boolean)
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
                <Button type="submit" className="mt-4" disabled={isLoading}>
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
