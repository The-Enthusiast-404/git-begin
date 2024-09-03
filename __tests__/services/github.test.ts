import { fetchGitHubIssues, fetchGitHubIssuesByCategory, fetchGitHubIssuesByFramework } from "~/services/github"
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals"

import { mock } from "jest-mock-extended"

jest.mock("@octokit/graphql")

describe("", () => {
  it("should calculate correct sum", () => {
    expect(1 + 2).toBe(2)
  })
})
