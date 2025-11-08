# AI Commit Generator

**[🇺🇦 Українська версія](./README.ua.md)** | 🇬🇧 English

AI-powered git commit message generator using Claude AI. Supports both Anthropic API and Claude Code CLI (for Claude Pro subscribers).

## Features

- ✅ **Dual Generation Methods**: Anthropic API or Claude Code CLI
- ✅ **Automatic Fallback**: Falls back to CLI if API is unavailable
- ✅ **Multi-Language Support**: English (default) or Ukrainian
- ✅ **AI-Powered Editing**: Describe what to fix, AI applies changes automatically
- ✅ **Conventional Commits Format**: Past tense, max 50 characters
- ✅ **Interactive Confirmation**: Enter = confirm, Esc = cancel, e = edit
- ✅ **Fast & Efficient**: Optimized prompts, 6000 char diff limit

## Installation

### Option A: Global Installation (NPM Package)

```bash
# Install globally
npm install -g @uaoa/ai-commit

# Or use with npx (no installation needed)
npx @uaoa/ai-commit
```

### Option B: Local Installation (Per Project)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/uaoa/ai-commit.git
   cd ai-commit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Make script executable (Unix/Mac)**
   ```bash
   chmod +x generate-commit.mjs
   ```

4. **Add to your project's package.json**
   ```json
   {
     "scripts": {
       "commit": "node path/to/generate-commit.mjs"
     }
   }
   ```

### Option C: With Claude Code CLI Only

If you have a Claude Pro subscription and want to use the CLI without an API key:

1. **Install Claude Code CLI** (if not already installed)
   ```bash
   # Follow instructions at: https://docs.claude.com/claude-code
   ```

2. **Verify installation**
   ```bash
   claude --version
   ```

3. **Clone this repo and install dependencies**
   ```bash
   git clone https://github.com/uaoa/ai-commit.git
   cd ai-commit
   npm install
   ```

## Configuration

### Method 1: With API Key

1. **Get your API key** from [Anthropic Console](https://console.anthropic.com/settings/keys)

2. **Create `.env` file** in the project root:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   COMMIT_LANG=EN  # Optional: EN or UA (default: EN)
   ```

### Method 2: With Claude Code CLI

No configuration needed! Just ensure Claude Code CLI is installed and authenticated.

## Usage

### Basic Usage

1. **Stage your changes**
   ```bash
   git add .
   # or
   git add specific-file.js
   ```

2. **Run the generator**
   ```bash
   # If installed globally
   ai-commit

   # If using npm script
   npm run commit

   # If using npx
   npx @uaoa/ai-commit

   # With language selection
   npm run commit -- --lang=en  # English
   npm run commit -- --lang=ua  # Ukrainian
   ```

3. **Review the generated message**
   - Press `Enter` or `y` to confirm and create commit
   - Press `e` to edit with AI assistance (describe what to fix)
   - Press `n` or `Esc` to cancel

### AI-Powered Editing

When you press `e`, you can describe what needs to be fixed - AI will apply changes automatically!

**Examples:**

```bash
# Add scope
What to fix? add scope "auth"
# feat: added OAuth → feat(auth): added OAuth

# Change type
What to fix? this should be fix, not feat
# feat: added validation → fix: added validation

# Shorten (to 50 chars)
What to fix? shorten to 50 characters
# feat: added new functionality for user authentication through OAuth providers
# → feat: added OAuth authentication

# Fix tense
What to fix? should be in past tense
# feat: add function → feat: added function

# Translate to Ukrainian
What to fix? translate to Ukrainian
# feat: added feature → feat: додано функцію
```

AI maintains Conventional Commits format and applies changes intelligently!

### Keyboard Controls

| Key | Action |
|-----|--------|
| `Enter` | Confirm and create commit |
| `y` | Confirm and create commit |
| `e` | Open AI-powered editing |
| `n` | Cancel commit |
| `Esc` | Cancel commit |
| `Ctrl+C` | Exit program |

## Commit Message Format

The script generates messages in [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>
```

### Strict Rules:
- **Subject**: max 50 characters, no period
- **Tense**: ONLY past tense (what WAS DONE)
- **Verbs EN**: added, fixed, updated, removed, refactored
- **Verbs UA**: додано, виправлено, оновлено, видалено, рефакторено

### Types:
- `feat` - new feature
- `fix` - bug fix
- `refactor` - code refactoring
- `docs` - documentation changes
- `style` - formatting, styles
- `test` - adding/updating tests
- `chore` - other changes (build, CI, etc.)
- `perf` - performance improvements

### ✅ Correct Examples:

**English:**
```
feat(auth): added Google OAuth provider
fix(api): fixed validation error
refactor(store): optimized state management
docs(readme): updated installation instructions
style(button): formatted button components
```

**Ukrainian:**
```
feat(auth): додано Google OAuth провайдер
fix(api): виправлено помилку валідації
refactor(store): оптимізовано управління станом
docs(readme): оновлено інструкції встановлення
```

### ❌ Wrong (imperative mood):
```
feat: add feature           # WRONG
fix: fix bug                # WRONG
feat: додати функцію        # WRONG
```

### ✅ Correct (past tense):
```
feat: added feature         # CORRECT
fix: fixed bug              # CORRECT
feat: додано функцію        # CORRECT
```

## Generation Methods Priority

The script selects the method in this order:

1. **First**: Try to use API (if `ANTHROPIC_API_KEY` exists)
2. **Fallback**: If API unavailable → Claude Code CLI
3. **Error**: If both methods unavailable → error message

## Language Configuration

### Option 1: Via CLI Argument (One-time)
```bash
npm run commit -- --lang=en  # English
npm run commit -- --lang=ua  # Ukrainian
```

### Option 2: Via ENV Variable (.env file)
```bash
# Add to .env for permanent use
COMMIT_LANG=EN  # or UA (default: EN)
```

**Priority**:
1. CLI argument `--lang=`
2. ENV variable `COMMIT_LANG`
3. Default: EN

## Examples

### Example 1: New Feature
```bash
$ git add src/auth/oauth.js
$ npm run commit

🚀 Git Commit Generator
📝 Language: English

🤖 Generating commit message via API...

Generated commit message:
feat(auth): added Google OAuth provider

Confirm and create commit?
  Enter/y - yes
  e - edit
  n/Esc - cancel

[Press Enter]

✅ Commit created successfully!
```

### Example 2: Bug Fix with Editing
```bash
$ git add src/api/users.js
$ npm run commit

🚀 Git Commit Generator
📝 Language: English

🤖 Generating commit message via Claude Code CLI...

Generated commit message:
feat(api): added validation for user endpoint

Confirm and create commit?
  Enter/y - yes
  e - edit
  n/Esc - cancel

[Press e]

Current message: feat(api): added validation for user endpoint
What to fix? this should be fix, not feat

🤖 Editing commit message...

Generated commit message:
fix(api): added validation for user endpoint

Confirm and create commit?
  Enter/y - yes
  e - edit
  n/Esc - cancel

[Press Enter]

✅ Commit created successfully!
```

### Example 3: Fallback to CLI
```bash
$ npm run commit

🚀 Git Commit Generator
📝 Language: Ukrainian

🤖 Generating commit message via API...
⚠️  API unavailable: Invalid API key
Switching to Claude Code CLI...

🤖 Generating commit message via Claude Code CLI...

Generated commit message:
refactor(store): оптимізовано управління корзиною

✅ Commit created successfully!
```

## Troubleshooting

### Error: "No staged changes"
```bash
# Check status
git status

# Add files
git add .
```

### Error: "No way to generate commit message found"

**Solution 1** - Use API:
```bash
# Add key to .env file
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
```

**Solution 2** - Use Claude Code CLI:
```bash
# Install Claude Code
# https://docs.claude.com/claude-code

# Verify installation
which claude
claude --version
```

### Error: "API unavailable"

The script will automatically switch to Claude Code CLI if it's installed.

If CLI is also unavailable:
- Check API key validity
- Check account balance at https://console.anthropic.com
- Check internet connection

### Error: "Claude Code CLI unavailable"
```bash
# Check if Claude Code is installed
which claude

# If not installed, install via instructions
# https://docs.claude.com/claude-code
```

## Method Comparison

| Criteria | Claude API | Claude Code CLI |
|----------|-----------|-----------------|
| **Cost** | ~$0.01-0.02 per commit | Included in subscription |
| **Speed** | Faster | Slower |
| **Reliability** | High | Depends on CLI |
| **Setup** | Requires API key | Requires CLI |
| **Offline** | ❌ No | ❌ No |

## Technical Details

### Model:
- **API**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **CLI**: Uses subscription model

### Tokens:
- Max tokens for response: 500 (generation), 300 (editing)
- Diff limit: 6000 characters
- Temperature: 0.3 (for stability)

### Dependencies:
- `@anthropic-ai/sdk` (optional, for API method)
- Node.js 18+ (for ES modules)
- Git (required)

## Publishing to NPM

Want to fork and publish your own version? See the [Publishing Guide](./PUBLISHING.md) for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/uaoa/ai-commit/issues)
- **Documentation**: [Anthropic Docs](https://docs.anthropic.com)
- **Claude Code**: [Claude Code Docs](https://docs.claude.com/claude-code)

## Author

**Zakharii Melnyk**

- GitHub: [@uaoa](https://github.com/uaoa)
- LinkedIn: [Zakharii Melnyk](https://www.linkedin.com/in/undef-zakhar/)

---

Made with ❤️ using Claude AI
