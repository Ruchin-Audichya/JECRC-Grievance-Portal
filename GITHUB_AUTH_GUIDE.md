# 🔐 GitHub Authentication Guide

## Quick Fix for Permission Issues

### Method 1: Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to GitHub → Click your profile → Settings
   - Scroll down to "Developer settings" (left sidebar)
   - Click "Personal access tokens" → "Tokens (classic)"
   - Click "Generate new token" → "Generate new token (classic)"
   - Note: Give it a descriptive name like "JECRC Portal Push"
   - Select scopes: ✅ `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN NOW!** (You won't see it again)

2. **Use the Token to Push:**
   ```bash
   # Remove old remotes
   git remote remove origin
   git remote remove new-origin
   
   # Add new remote with token
   git remote add origin https://YOUR_GITHUB_USERNAME:YOUR_TOKEN@github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git
   
   # Push your code
   git push -u origin main --force
   ```

   Replace:
   - `YOUR_GITHUB_USERNAME` with your GitHub username
   - `YOUR_TOKEN` with the token you just copied

### Method 2: GitHub CLI (Easiest)

1. **Install GitHub CLI:**
   - Windows: Download from https://cli.github.com/
   - Mac: `brew install gh`
   - Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

2. **Authenticate and Push:**
   ```bash
   # Login to GitHub
   gh auth login
   
   # Push using gh
   gh repo clone Ruchin-Audichya/JECRC-Grievance-Portal temp-folder
   cp -r * temp-folder/
   cd temp-folder
   git add .
   git commit -m "Initial commit: JECRC Grievance Portal v2.0"
   git push
   ```

### Method 3: SSH Key (Most Secure)

1. **Generate SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add to GitHub:**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your key and save

3. **Push with SSH:**
   ```bash
   git remote set-url origin git@github.com:Ruchin-Audichya/JECRC-Grievance-Portal.git
   git push -u origin main
   ```

## 🚀 Quick One-Liner (After Getting Token)

```bash
git push https://Ruchin-Audichya:YOUR_TOKEN_HERE@github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git main --force
```

## ⚠️ Security Tips

1. **Never share your token** - Treat it like a password
2. **Set expiration** - Set tokens to expire in 30-90 days
3. **Minimal scope** - Only give `repo` access, nothing more
4. **Delete after use** - Remove token after pushing if not needed

## 🆘 Still Having Issues?

Try GitHub Desktop:
1. Download from https://desktop.github.com/
2. Sign in with your GitHub account
3. Clone your repository
4. Copy all project files
5. Commit and push with one click!

---

**Remember:** The token is like a temporary password. Keep it safe and delete it when done!