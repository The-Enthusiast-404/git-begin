import React from "react"
import { Issue } from "~/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Calendar,
  Code,
  Tag,
  MessageSquare,
  GitPullRequest,
} from "lucide-react"
import {
  ReactIcon,
  NodeJsIcon,
  VueJsIcon,
  TypeScriptIcon,
  DockerIcon,
  PythonIcon,
  JavaIcon,
  PhpIcon,
  AwsIcon,
  FlutterIcon,
  MdxIcon,
  AngularIcon,
  GoIcon,
  CSharpIcon,
  SwiftIcon,
  KotlinIcon,
  ScalaIcon,
  RubyIcon,
  RustIcon,
  CplusplusIcon,
  CIcon,
  ElixirIcon,
  HaskellIcon,
  DartIcon,
} from "app/icons"
import BookmarkButton from "./BookmarkButton"

type IssueCardProps = {
  issue: Issue
  showPullRequests: boolean
  isBookmarked: boolean
  onToggleBookmark: (issueId: string) => void
}

const languageIcons: { [key: string]: JSX.Element } = {
  JavaScript: <NodeJsIcon />,
  TypeScript: <TypeScriptIcon />,
  Python: <PythonIcon />,
  Java: <JavaIcon />,
  PHP: <PhpIcon />,
  React: <ReactIcon />,
  Vue: <VueJsIcon />,
  Angular: <AngularIcon />,
  Flutter: <FlutterIcon />,
  MDX: <MdxIcon />,
  Docker: <DockerIcon />,
  AWS: <AwsIcon />,
  Go: <GoIcon />,
  "C#": <CSharpIcon />,
  Swift: <SwiftIcon />,
  Kotlin: <KotlinIcon />,
  Scala: <ScalaIcon />,
  Ruby: <RubyIcon />,
  Rust: <RustIcon />,
  "C++": <CplusplusIcon />,
  C: <CIcon />,
  Elixir: <ElixirIcon />,
  Haskell: <HaskellIcon />,
  Dart: <DartIcon />,
}

export function IssueCard({
  issue,
  showPullRequests,
  isBookmarked,
  onToggleBookmark,
}: IssueCardProps) {
  const LanguageIcon =
    issue.language && languageIcons[issue.language] ? (
      languageIcons[issue.language]
    ) : (
      <Code className="w-4 h-4" />
    )

  return (
    <Card className="border rounded-md hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="mb-2">
          <a
            href={issue.html_url}
            rel="noreferrer"
            target="_blank"
            className="text-lg font-semibold text-blue-600 hover:underline block"
          >
            {issue.title}
          </a>
        </div>
        <p className="text-sm text-gray-600 mb-2">{issue.repository_name}</p>
        <Separator className="my-4" />
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1" /> {issue.stars_count}
          </span>
          <span className="flex items-center">
            {LanguageIcon}
            <span className="ml-1">{issue.language || "N/A"}</span>
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(issue.created_at).toLocaleString()}
          </span>
          <span className="flex items-center">
            <Tag className="w-4 h-4 mr-1" /> {issue.labels.join(", ")}
          </span>
          <span className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" /> {issue.comments_count}
          </span>
          {showPullRequests && issue.has_pull_requests && (
            <span className="flex items-center">
              <GitPullRequest className="w-4 h-4 mr-1" /> Has PRs
            </span>
          )}
          {issue.is_assigned && <Badge variant="outline">Assigned</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 bg-gray-50 dark:bg-gray-800">
        <BookmarkButton
          isBookmarked={isBookmarked}
          onClick={() => onToggleBookmark(issue.id)}
        />
      </CardFooter>
    </Card>
  )
}
