
#!/bin/bash

echo "🚀 Setting up OLOF Alumni App for GitHub..."

# Make sure we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Update GitHub username in the upload script
echo "📝 Please update the GITHUB_USERNAME in scripts/github-upload.js with your actual username"
echo "   Current value: 'your-username'"
read -p "Enter your GitHub username: " github_username

if [ ! -z "$github_username" ]; then
    sed -i "s/your-username/$github_username/g" scripts/github-upload.js
    echo "✅ Updated GitHub username to: $github_username"
fi

# Run the upload
echo "🚀 Uploading to GitHub..."
npm run github:upload

echo "✅ Setup complete!"
