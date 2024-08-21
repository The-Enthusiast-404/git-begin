import React from "react"
import { Issue } from "~/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Calendar, Code, Tag, MessageSquare } from "lucide-react"
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

type IssueCardProps = {
  issue: Issue
}

const getBeginnerFriendlyLabel = (labels: string[]): string => {
  const beginnerFriendlyLabels: string[] = [
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

export function IssueCard({ issue }: IssueCardProps) {
  const LanguageIcon =
    issue.language && languageIcons[issue.language] ? (
      languageIcons[issue.language]
    ) : (
      <Code className="w-4 h-4" />
    )

  return (
    <Card className="border rounded-md hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <a
            href={issue.html_url}
            rel="noreferrer"
            target="_blank"
            className="text-lg font-semibold text-blue-600 hover:underline truncate max-w-[80%]"
          >
            {issue.title}
          </a>
        </div>
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
          {issue.is_assigned && <Badge variant="outline">Assigned</Badge>}
        </div>
        <p className="mt-2 text-sm text-gray-600">{issue.repository_name}</p>
      </CardContent>
    </Card>
  )
}
