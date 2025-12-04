param()

function RunGit {
  param([string]$Args)
  Write-Host "> git $Args"
  git $Args
}

# Rebuild/export and stage dist
Write-Host "Running export-pages..."
npm run export-pages

Write-Host "Staging dist directory..."
git add dist

$staged = git diff --cached --stat
if ($staged) {
  Write-Host "Committing staged changes..."
  git commit -m "deploy build"
} else {
  Write-Host "No staged changes to commit."
}

Write-Host "Pushing commits..."
git push

Write-Host "Triggering Pages rebuild..."
git commit --allow-empty -m "force gh-pages rebuild" | Out-Null
git push
