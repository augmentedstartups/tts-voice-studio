# 🚀 GitHub Repository Information

## ✅ Successfully Pushed to GitHub

**Repository**: https://github.com/augmentedstartups/tts-voice-studio

**Branch**: `master`  
**Remote**: `origin`  
**Status**: Public

---

## 📊 Repository Stats

- **Size on GitHub**: ~22MB
- **Files**: 146 source files
- **Commits**: 2
- **Account**: augmentedstartups

---

## 🧹 Cleanup Complete

### Old Git Repositories Removed
To prevent VS Code from showing multiple repositories in the source control panel, the following old `.git` directories were removed:

✅ `/Users/riteshkanjee/Documents/dev/neurotts/neutts-air/.git`  
✅ `/Users/riteshkanjee/Documents/dev/neurotts/higgs-audio/.git`  
✅ `/Users/riteshkanjee/Documents/dev/neurotts/augmented-voice-studio/.git`

These folders still exist as reference, but are no longer git repositories. They won't show up in VS Code's source control panel anymore.

### Active Git Repository
✅ `/Users/riteshkanjee/Documents/dev/tts-voice-studio/.git` (monorepo)

---

## 🔄 Working with the Repository

### Clone on Another Machine
```bash
git clone https://github.com/augmentedstartups/tts-voice-studio.git
cd tts-voice-studio
./setup.sh
```

### Pull Latest Changes
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
git pull origin master
```

### Make Changes and Push
```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin master
```

### View on GitHub
```bash
gh repo view --web
```

---

## 📁 Directory Structure

```
/Users/riteshkanjee/Documents/dev/
├── tts-voice-studio/        ✅ Active monorepo (on GitHub)
│   ├── .git/                ✅ Only active git repo
│   ├── frontend/
│   ├── backend/
│   ├── models/
│   └── docs/
│
└── neurotts/                📦 Old reference (not on GitHub)
    ├── neutts-air/          ❌ Git removed
    ├── higgs-audio/         ❌ Git removed
    ├── augmented-voice-studio/ ❌ Git removed
    └── backend/             ❌ Git removed (if existed)
```

---

## 🎯 VS Code Source Control Panel

After removing the old `.git` directories, VS Code will only show:
- **tts-voice-studio** (master)

The old repositories (neutts-air, higgs-audio, augmented-voice-studio) will no longer appear in the source control panel.

**If they still appear**: Reload VS Code window:
- Press: `Cmd + Shift + P`
- Type: `Developer: Reload Window`
- Press: `Enter`

---

## 🔐 Repository Settings

### Visibility
- **Public** - Anyone can clone and view

### To make private:
```bash
gh repo edit --visibility private
```

### Collaborators
```bash
# Add collaborator
gh repo add-collaborator USERNAME

# List collaborators
gh repo list-collaborators
```

---

## 📊 GitHub Stats

View repository insights:
```bash
# Open in browser
gh repo view --web

# View issues
gh issue list

# View pull requests
gh pr list

# View releases
gh release list
```

---

## 🎉 Success!

Your TTS Voice Studio monorepo is now:
- ✅ On GitHub: https://github.com/augmentedstartups/tts-voice-studio
- ✅ Clean git structure (only one .git directory)
- ✅ VS Code source control panel cleaned up
- ✅ Ready to share and deploy anywhere

---

**Need help?** See README.md or DEPLOYMENT_GUIDE.md

