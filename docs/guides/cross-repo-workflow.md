# Cross-Repo Workflow Guide

## Overview

Convergio supports managing work across multiple repositories. This guide
covers opening issues, tracking PRs, and coordinating changes across repos.

## Opening Cross-Repo Issues

Use the GitHub CLI to create issues in related repos:

```bash
# Create an issue in another repo
gh issue create --repo org/other-repo --title "Title" --body "Description"

# Reference it from your PR
gh pr create --body "Depends on org/other-repo#42"
```

## Linking PRs Across Repos

When a change in `convergio` requires a matching change in another repo:

1. Create the PR in `convergio` first
2. Note the PR number in the other repo's issue
3. Use `Depends on:` or `Related:` in PR descriptions

## Coordination via Daemon

The Convergio daemon tracks cross-repo dependencies through its plan system:

- Plans can reference external repos in task notes
- The `mesh delegate` command can dispatch work to agents on other nodes
- Knowledge base entries can link to external documentation

## Best Practices

- Always create issues before PRs for cross-repo work
- Use conventional commit prefixes to make changes searchable
- Keep cross-repo PRs small and focused
- Merge the dependency first, then the dependent PR
