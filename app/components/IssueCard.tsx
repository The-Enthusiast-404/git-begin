import { Issue } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Calendar, Code, Tag, MessageSquare } from "lucide-react"

type IssueCardProps = {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const getBeginnerFriendlyLabel = (labels: string[]): string => {
    const beginnerFriendlyLabels = [
      "good first issue",
      "quick wins",
      "first timers only",
      "up for grabs",
    ]
    return (
      labels.find((label) =>
        beginnerFriendlyLabels.includes(label.toLowerCase())
      ) || "Beginner Friendly"
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <a
            href={issue.html_url}
            className="text-lg font-semibold text-blue-600 hover:underline truncate max-w-[80%]"
          >
            {issue.title}
          </a>
          <Badge variant="secondary">
            {getBeginnerFriendlyLabel(issue.labels)}
          </Badge>
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
            {new Date(issue.created_at).toLocaleString()}
          </span>
          <span className="flex items-center">
            <Tag className="w-4 h-4 mr-1" /> {issue.labels.join(", ")}
          </span>
          <span className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" /> {issue.comments_count}
          </span>
          {issue.is_assigned && <Badge variant="outline">Assigned</Badge>}
        </div>
        <p className="mt-2 text-sm text-gray-600">{issue.repository_name}</p>
      </CardContent>
    </Card>
  )
}
