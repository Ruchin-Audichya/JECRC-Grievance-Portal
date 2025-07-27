#!/bin/bash

echo "🚀 JECRC Grievance Portal - Push to New Repository Script"
echo "========================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 successful${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}Step 1: Removing existing remotes...${NC}"
git remote remove origin 2>/dev/null
git remote remove new-origin 2>/dev/null
echo -e "${GREEN}✓ Cleaned up remotes${NC}"

echo ""
echo -e "${YELLOW}Step 2: Adding your new repository...${NC}"
git remote add origin https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git
check_status "Remote added"

echo ""
echo -e "${YELLOW}Step 3: Checking current branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

echo ""
echo -e "${YELLOW}Step 4: Creating a clean commit history...${NC}"
echo "Do you want to create a single clean commit? (recommended)"
echo "This will combine all changes into one professional commit."
echo -e "${GREEN}[Y]es${NC} / ${RED}[N]o${NC} (keep current history): "
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Creating backup branch..."
    git branch backup-before-push 2>/dev/null
    
    echo "Creating clean commit..."
    git reset --soft $(git rev-list --max-parents=0 HEAD)
    git add -A
    git commit -m "🚀 Initial Commit: JECRC Grievance Portal v2.0

Professional Grievance Management System for JECRC University

Features:
✅ Anonymous grievance submission
✅ Formal workflow (Submitted → Under Review → Action Taken → Resolved → Appealed)  
✅ Multi-level escalation system
✅ Role-based access control
✅ Real-time updates with Supabase
✅ Comprehensive audit logging
✅ Knowledge base integration
✅ Bulk operations support

Developed by: Ruchin Audichya (23BCON0208)
Supervised by: CP Beniwal Sir
For: JECRC University IT Cell"
    check_status "Clean commit created"
fi

echo ""
echo -e "${YELLOW}Step 5: Ready to push!${NC}"
echo "Your repository: https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal"
echo ""
echo -e "${RED}IMPORTANT:${NC} You'll need to authenticate with GitHub."
echo "Options:"
echo "1. Use your GitHub password"
echo "2. Use a Personal Access Token (recommended)"
echo "   - Go to: GitHub → Settings → Developer settings → Personal access tokens"
echo "   - Generate new token with 'repo' scope"
echo ""
echo -e "${YELLOW}Press Enter when ready to push...${NC}"
read -r

echo ""
echo "Pushing to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! Your code is now on GitHub!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Visit: https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal"
    echo "2. Add description: 'Professional Grievance Management System for JECRC University'"
    echo "3. Add topics: grievance-portal, jecrc, react, typescript, supabase"
    echo "4. Create release: v2.0.0"
    echo "5. Share with CP Beniwal Sir!"
else
    echo ""
    echo -e "${RED}Push failed. Common solutions:${NC}"
    echo "1. Create a Personal Access Token on GitHub"
    echo "2. Try: git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git main"
    echo "3. Or use GitHub Desktop for easier authentication"
fi

echo ""
echo "Script completed!"