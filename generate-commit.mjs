#!/usr/bin/env node

import { execSync } from 'child_process';
import * as readline from 'readline';
import fs from 'fs';
import path from 'path';

// Кольори для консолі
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Вибір мови для commit message
function selectLanguage() {
  // Перевіряємо ENV змінну
  const envLang = process.env.COMMIT_LANG?.toUpperCase();
  if (envLang === 'EN' || envLang === 'UA') {
    return envLang;
  }

  // Перевіряємо CLI аргумент
  const args = process.argv.slice(2);
  const langArg = args.find(arg => arg.startsWith('--lang='));
  if (langArg) {
    const lang = langArg.split('=')[1].toUpperCase();
    if (lang === 'EN' || lang === 'UA') {
      return lang;
    }
  }

  // За замовчуванням EN
  return 'EN';
}

// Перевірка наявності Claude Code CLI
function hasClaudeCodeCLI() {
  try {
    execSync('which claude', { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Перевірка наявності staged changes
function getStagedChanges() {
  try {
    const status = execSync('git diff --cached --stat', { encoding: 'utf-8' });
    if (!status.trim()) {
      log('❌ Немає staged changes. Спочатку додайте файли через git add', colors.red);
      process.exit(1);
    }
    return status;
  } catch (error) {
    log('❌ Помилка при читанні git status', colors.red);
    process.exit(1);
  }
}

// Отримання diff
function getDiff() {
  try {
    // Обмежуємо diff до 6000 символів для економії токенів
    const diff = execSync('git diff --cached --unified=1', { encoding: 'utf-8' });
    return diff.slice(0, 6000);
  } catch (error) {
    log('❌ Помилка при читанні git diff', colors.red);
    process.exit(1);
  }
}

// Генерація commit message через Claude Code CLI
function generateWithCLI(status, diff, lang = 'UA') {
  log('\n🤖 Генерую commit message через Claude Code CLI...', colors.cyan);

  const prompt = lang === 'EN'
    ? `Analyze git changes and generate commit message in conventional commits format.

Status:
${status}

Diff (first 6000 characters):
${diff}

STRICT RULES:
- Format: <type>(<scope>): <subject>
- Type: feat/fix/refactor/docs/style/test/chore/perf
- Subject in PAST TENSE (what WAS DONE), max 50 characters, no period
- Use verbs like: added, fixed, updated, removed, refactored
- WRONG: "add feature", "fix bug", "update styles"
- CORRECT: "added feature", "fixed bug", "updated styles"

Examples:
feat(auth): added Google OAuth provider
fix(api): fixed validation error in user endpoint
refactor(store): optimized cart state management
docs(readme): updated installation instructions

Return ONLY the commit message (one line), no explanations.`
    : `Проаналізуй git зміни та згенеруй commit message у форматі conventional commits.

Status:
${status}

Diff (перші 6000 символів):
${diff}

СУВОРІ ПРАВИЛА:
- Формат: <type>(<scope>): <subject>
- Type: feat/fix/refactor/docs/style/test/chore/perf
- Subject ТІЛЬКИ у МИНУЛОМУ ЧАСІ (що ЗРОБЛЕНО), макс 50 символів, без крапки
- Використовуй дієслова: додано, виправлено, оновлено, видалено, рефакторено
- НЕПРАВИЛЬНО: "додати функцію", "виправити баг", "оновити стилі"
- ПРАВИЛЬНО: "додано функцію", "виправлено баг", "оновлено стилі"

Приклади:
feat(auth): додано Google OAuth провайдер
fix(api): виправлено помилку валідації в user endpoint
refactor(store): оптимізовано управління станом корзини
docs(readme): оновлено інструкції встановлення

Поверни ТІЛЬКИ commit message (один рядок), без пояснень.`;

  try {
    // Викликаємо Claude CLI через heredoc (одинарні лапки вимикають інтерпретацію)
    const command = `cat << 'CLAUDEPROMPT' | claude
${prompt}
CLAUDEPROMPT`;

    const result = execSync(command, {
      encoding: 'utf-8',
      shell: '/bin/bash',
      maxBuffer: 10 * 1024 * 1024
    });

    // Очищаємо відповідь - беремо останній непорожній рядок
    const lines = result.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Шукаємо рядок, що схожий на commit message
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      // Перевіряємо, чи це схоже на conventional commit
      if (/^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+?\))?:.+/.test(line)) {
        return line;
      }
    }

    // Якщо не знайшли conventional commit, беремо останній рядок
    return lines[lines.length - 1] || 'chore: update code';
  } catch (error) {
    log(`❌ Помилка Claude CLI: ${error.message}`, colors.red);
    log('Переконайтесь, що Claude Code встановлено та працює: claude --version', colors.yellow);
    process.exit(1);
  }
}

// Генерація commit message через API
async function generateWithAPI(status, diff, lang = 'UA') {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY не знайдено');
  }

  // Динамічний імпорт SDK
  let Anthropic;
  try {
    const module = await import('@anthropic-ai/sdk');
    Anthropic = module.default;
  } catch (error) {
    throw new Error('Не вдалося завантажити @anthropic-ai/sdk. Встановіть: npm install @anthropic-ai/sdk');
  }

  const anthropic = new Anthropic({ apiKey });

  log('\n🤖 Генерую commit message через API...', colors.cyan);

  const promptContent = lang === 'EN'
    ? `Analyze git changes and generate commit message in conventional commits format.

Status:
${status}

Diff (first 6000 characters):
${diff}

STRICT RULES:
- Format: <type>(<scope>): <subject>
- Type: feat/fix/refactor/docs/style/test/chore/perf
- Subject in PAST TENSE (what WAS DONE), max 50 characters, no period
- Use verbs like: added, fixed, updated, removed, refactored
- WRONG: "add feature", "fix bug", "update styles"
- CORRECT: "added feature", "fixed bug", "updated styles"

Examples:
feat(auth): added Google OAuth provider
fix(api): fixed validation error in user endpoint
refactor(store): optimized cart state management
docs(readme): updated installation instructions

Return ONLY the commit message (one line), no explanations.`
    : `Проаналізуй git зміни та згенеруй commit message у форматі conventional commits.

Status:
${status}

Diff (перші 6000 символів):
${diff}

СУВОРІ ПРАВИЛА:
- Формат: <type>(<scope>): <subject>
- Type: feat/fix/refactor/docs/style/test/chore/perf
- Subject ТІЛЬКИ у МИНУЛОМУ ЧАСІ (що ЗРОБЛЕНО), макс 50 символів, без крапки
- Використовуй дієслова: додано, виправлено, оновлено, видалено, рефакторено
- НЕПРАВИЛЬНО: "додати функцію", "виправити баг", "оновити стилі"
- ПРАВИЛЬНО: "додано функцію", "виправлено баг", "оновлено стилі"

Приклади:
feat(auth): додано Google OAuth провайдер
fix(api): виправлено помилку валідації в user endpoint
refactor(store): оптимізовано управління станом корзини
docs(readme): оновлено інструкції встановлення

Поверни ТІЛЬКИ commit message (один рядок), без пояснень.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: promptContent
      }]
    });

    const commitMessage = message.content[0].text.trim();
    return commitMessage;
  } catch (error) {
    throw new Error(`API помилка: ${error.message}`);
  }
}

// Головна функція генерації
async function generateCommitMessage(status, diff, lang = 'UA') {
  const hasAPIKey = !!process.env.ANTHROPIC_API_KEY;
  const hasCLI = hasClaudeCodeCLI();

  // Пріоритет: API key > Claude Code CLI
  if (hasAPIKey) {
    try {
      return await generateWithAPI(status, diff, lang);
    } catch (error) {
      log(`⚠️  API недоступний: ${error.message}`, colors.yellow);

      // Fallback на CLI
      if (hasCLI) {
        log('Переключаюсь на Claude Code CLI...', colors.yellow);
        return generateWithCLI(status, diff, lang);
      } else {
        log('❌ Немає доступних методів для генерації commit message', colors.red);
        process.exit(1);
      }
    }
  } else if (hasCLI) {
    return generateWithCLI(status, diff, lang);
  } else {
    log('❌ Не знайдено способу генерації commit message', colors.red);
    log('\nОберіть один з варіантів:', colors.yellow);
    log('1. Додайте ANTHROPIC_API_KEY в .env файл', colors.cyan);
    log('2. Встановіть Claude Code CLI: https://docs.claude.com/claude-code', colors.cyan);
    process.exit(1);
  }
}

// Запит підтвердження від користувача
function askConfirmation(commitMessage) {
  return new Promise((resolve) => {
    log(`\n${colors.bright}Згенерований commit message:${colors.reset}`, colors.green);
    log(`${colors.cyan}${commitMessage}${colors.reset}\n`);
    log('Підтвердити та виконати commit?');
    log(`  ${colors.green}Enter/y${colors.reset} - так`);
    log(`  ${colors.cyan}e${colors.reset} - редагувати`);
    log(`  ${colors.yellow}n/Esc${colors.reset} - скасувати\n`);

    const stdin = process.stdin;
    const isRaw = stdin.isRaw;

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = (key) => {
      // Escape key
      if (key === '\u001b') {
        cleanup();
        resolve('n');
        return;
      }

      // Ctrl+C
      if (key === '\u0003') {
        cleanup();
        log('\n❌ Скасовано (Ctrl+C)', colors.yellow);
        process.exit(0);
      }

      // Enter
      if (key === '\r' || key === '\n') {
        cleanup();
        resolve('y');
        return;
      }

      // Інші клавіші - читаємо як звичайний текст
      const char = key.toLowerCase();
      if (char === 'y' || char === 'т' || char === 'так' || char === 'yes') {
        cleanup();
        resolve('y');
      } else if (char === 'n' || char === 'н' || char === 'ні' || char === 'no') {
        cleanup();
        resolve('n');
      } else if (char === 'e' || char === 'е' || char === 'edit') {
        cleanup();
        resolve('e');
      }
    };

    const cleanup = () => {
      stdin.removeListener('data', onData);
      stdin.setRawMode(isRaw);
      stdin.pause();
    };

    stdin.on('data', onData);
  });
}

// AI-powered редагування message
async function editMessageWithAI(originalMessage, lang = 'UA') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const promptText = lang === 'UA'
      ? 'Що треба виправити? (Enter - залишити як є): '
      : 'What to fix? (Enter - keep as is): ';

    log(`\n${colors.yellow}Поточний message: ${originalMessage}${colors.reset}`, colors.yellow);
    rl.question(promptText, async (feedback) => {
      rl.close();

      const trimmedFeedback = feedback.trim();

      // Якщо порожній ввід - залишаємо як є
      if (!trimmedFeedback) {
        resolve(originalMessage);
        return;
      }

      // Генеруємо оновлений message через AI
      log('\n🤖 Редагую commit message...', colors.cyan);

      try {
        const hasAPIKey = !!process.env.ANTHROPIC_API_KEY;
        const hasCLI = hasClaudeCodeCLI();

        let updatedMessage;

        if (hasAPIKey) {
          updatedMessage = await refineMessageWithAPI(originalMessage, trimmedFeedback, lang);
        } else if (hasCLI) {
          updatedMessage = refineMessageWithCLI(originalMessage, trimmedFeedback, lang);
        } else {
          log('⚠️  AI недоступний, введіть message вручну:', colors.yellow);
          const rl2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          rl2.question('Новий message: ', (manual) => {
            rl2.close();
            resolve(manual.trim() || originalMessage);
          });
          return;
        }

        resolve(updatedMessage);
      } catch (error) {
        log(`❌ Помилка редагування: ${error.message}`, colors.red);
        resolve(originalMessage);
      }
    });
  });
}

// Редагування через API
async function refineMessageWithAPI(originalMessage, feedback, lang = 'UA') {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey });

  const instruction = lang === 'UA'
    ? `Виправ commit message згідно з цим feedback. Збережи формат conventional commits.`
    : `Fix commit message according to this feedback. Keep conventional commits format.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: `${instruction}

Original message: ${originalMessage}

Feedback: ${feedback}

Return ONLY the updated commit message, no explanations.`
    }]
  });

  return message.content[0].text.trim();
}

// Редагування через CLI
function refineMessageWithCLI(originalMessage, feedback, lang = 'UA') {
  const instruction = lang === 'UA'
    ? `Виправ commit message згідно з цим feedback. Збережи формат conventional commits.`
    : `Fix commit message according to this feedback. Keep conventional commits format.`;

  const prompt = `${instruction}

Original message: ${originalMessage}

Feedback: ${feedback}

Return ONLY the updated commit message, no explanations.`;

  const command = `cat << 'CLAUDEPROMPT' | claude
${prompt}
CLAUDEPROMPT`;

  const result = execSync(command, {
    encoding: 'utf-8',
    shell: '/bin/bash',
    maxBuffer: 10 * 1024 * 1024
  });

  const lines = result.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Шукаємо conventional commit
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (/^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+?\))?:.+/.test(line)) {
      return line;
    }
  }

  return lines[lines.length - 1] || originalMessage;
}

// Виконання commit
function executeCommit(message) {
  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    log('\n✅ Commit успішно створено!', colors.green);
  } catch (error) {
    log('❌ Помилка при створенні commit', colors.red);
    process.exit(1);
  }
}

// Головна функція
async function main() {
  const lang = selectLanguage();

  log('🚀 Git Commit Generator', colors.bright);
  log(`📝 Мова: ${lang === 'UA' ? 'Українська' : 'English'}`, colors.cyan);

  const status = getStagedChanges();
  const diff = getDiff();

  let commitMessage = await generateCommitMessage(status, diff, lang);

  while (true) {
    const answer = await askConfirmation(commitMessage);

    if (answer === 'y' || answer === 'yes' || answer === 'так' || answer === 'т') {
      executeCommit(commitMessage);
      break;
    } else if (answer === 'e' || answer === 'edit' || answer === 'редагувати') {
      commitMessage = await editMessageWithAI(commitMessage, lang);
    } else {
      log('❌ Commit скасовано', colors.yellow);
      process.exit(0);
    }
  }
}

main().catch(error => {
  log(`❌ Критична помилка: ${error.message}`, colors.red);
  process.exit(1);
});
