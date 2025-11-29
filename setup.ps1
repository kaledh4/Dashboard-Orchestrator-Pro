Write-Host "🚀 Setting up Dashboard Orchestrator Pro..." -ForegroundColor Cyan

# Initialize Git
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..."
    git init
    git branch -M main
} else {
    Write-Host "ℹ️ Git repository already initialized."
}

# Install Dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..."
    npm install
} else {
    Write-Host "ℹ️ Dependencies already installed."
}

# Create Briefs Directory
if (-not (Test-Path "briefs")) {
    New-Item -ItemType Directory -Force -Path "briefs" | Out-Null
    Write-Host "📂 Created 'briefs' directory."
}

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Create a new repository on GitHub."
Write-Host "2. Run the following commands to push your code:"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/dashboard-orchestrator-pro.git"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial commit'"
Write-Host "   git push -u origin main"
Write-Host "3. Add your OPENROUTER_API_KEY to GitHub Secrets."
Write-Host "4. Enable GitHub Pages in Settings."
