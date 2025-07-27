#!/bin/bash

echo "🚀 Quick Push to JECRC Grievance Portal"
echo "========================================"
echo ""

# Your token (you can update this if needed)
TOKEN="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"
USERNAME="Ruchin-Audichya"
REPO="JECRC-Grievance-Portal"

echo "Removing old remotes..."
git remote remove origin 2>/dev/null
git remote remove new-origin 2>/dev/null

echo "Adding new remote..."
git remote add origin https://${USERNAME}:${TOKEN}@github.com/${USERNAME}/${REPO}.git

echo "Current branch:"
git branch --show-current

echo ""
echo "Attempting to push..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo "Visit: https://github.com/${USERNAME}/${REPO}"
else
    echo ""
    echo "❌ Push failed. Possible issues:"
    echo "1. Make sure the repository exists on GitHub"
    echo "2. Check if the token has 'repo' permissions"
    echo "3. Try creating a new token with full 'repo' scope"
    echo ""
    echo "Alternative: Try this command manually:"
    echo "git push https://${USERNAME}:${TOKEN}@github.com/${USERNAME}/${REPO}.git main --force"
fi