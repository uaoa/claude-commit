# AI Генератор Commit Messages

🇺🇦 Українська | **[🇬🇧 English version](./README.md)**

AI-генератор commit messages для git використовуючи Claude AI. Підтримує як Anthropic API, так і Claude Code CLI (для власників підписки Claude Pro).

## Можливості

- ✅ **Два методи генерації**: Anthropic API або Claude Code CLI
- ✅ **Автоматичний fallback**: Переключається на CLI якщо API недоступний
- ✅ **Підтримка мов**: English (за замовчуванням) або Українська
- ✅ **AI-редагування**: Опишіть що виправити, AI застосує зміни автоматично
- ✅ **Conventional Commits формат**: Минулий час, макс 50 символів
- ✅ **Інтерактивне підтвердження**: Enter = згода, Esc = скасувати, e = редагувати
- ✅ **Швидкий і ефективний**: Оптимізовані промпти, ліміт 6000 символів

## Встановлення

### Варіант A: Глобальне встановлення (NPM пакет)

```bash
# Встановити глобально
npm install -g claude-commit

# Або використовувати з npx (без встановлення)
npx claude-commit
```

### Варіант B: Локальне встановлення (для проєкту)

1. **Клонуйте або завантажте репозиторій**
   ```bash
   git clone https://github.com/uaoa/claude-commit.git
   cd claude-commit
   ```

2. **Встановіть залежності**
   ```bash
   npm install
   ```

3. **Зробіть скрипт виконуваним (Unix/Mac)**
   ```bash
   chmod +x generate-commit.mjs
   ```

4. **Додайте в package.json вашого проєкту**
   ```json
   {
     "scripts": {
       "commit": "node шлях/до/generate-commit.mjs"
     }
   }
   ```

### Варіант C: Тільки з Claude Code CLI

Якщо у вас є підписка Claude Pro і ви хочете використовувати CLI без API ключа:

1. **Встановіть Claude Code CLI** (якщо ще не встановлено)
   ```bash
   # Інструкції: https://docs.claude.com/claude-code
   ```

2. **Перевірте встановлення**
   ```bash
   claude --version
   ```

3. **Клонуйте репо і встановіть залежності**
   ```bash
   git clone https://github.com/uaoa/claude-commit.git
   cd claude-commit
   npm install
   ```

## Налаштування

### Метод 1: З API ключем

1. **Отримайте API ключ** на [Anthropic Console](https://console.anthropic.com/settings/keys)

2. **Створіть файл `.env`** в корені проєкту:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   COMMIT_LANG=EN  # Опціонально: EN або UA (за замовчуванням: EN)
   ```

### Метод 2: З Claude Code CLI

Налаштування не потрібні! Просто переконайтесь, що Claude Code CLI встановлено та авторизовано.

## Використання

### Базове використання

1. **Додайте зміни до staging area**
   ```bash
   git add .
   # або
   git add конкретний-файл.js
   ```

2. **Запустіть генератор**
   ```bash
   # Якщо встановлено глобально
   claude-commit

   # Якщо використовуєте npm script
   npm run commit

   # Якщо використовуєте npx
   npx claude-commit

   # З вибором мови
   npm run commit -- --lang=en  # English
   npm run commit -- --lang=ua  # Українська
   ```

3. **Перегляньте згенерований message**
   - Натисніть `Enter` або `y` для підтвердження та створення коміту
   - Натисніть `e` для редагування з допомогою AI (опишіть що виправити)
   - Натисніть `n` або `Esc` для скасування

### AI-Редагування

Коли натискаєте `e`, можете описати що потрібно виправити - AI застосує зміни автоматично!

**Приклади:**

```bash
# Додати scope
Що треба виправити? додати scope "auth"
# feat: додано OAuth → feat(auth): додано OAuth

# Змінити type
Що треба виправити? це має бути fix, а не feat
# feat: додано валідацію → fix: додано валідацію

# Скоротити (до 50 символів)
Що треба виправити? скоротити до 50 символів
# feat: додано нову функціональність для автентифікації користувачів через OAuth провайдери
# → feat: додано OAuth автентифікацію

# Виправити на минулий час
Що треба виправити? має бути в минулому часі
# feat: додати функцію → feat: додано функцію

# Перекласти на English
Що треба виправити? перекласти на англійську
# feat: додано функцію → feat: added feature
```

AI зберігає Conventional Commits формат та застосовує правки інтелектуально!

### Клавіші керування

| Клавіша | Дія |
|---------|-----|
| `Enter` | Підтвердити та створити commit |
| `y` | Підтвердити та створити commit |
| `e` | Відкрити AI-редагування |
| `n` | Скасувати commit |
| `Esc` | Скасувати commit |
| `Ctrl+C` | Вийти з програми |

## Формат Commit Messages

Скрипт генерує messages у форматі [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

### Суворі правила:
- **Subject**: макс 50 символів, без крапки
- **Час**: ТІЛЬКИ минулий час (що ЗРОБЛЕНО)
- **Дієслова UA**: додано, виправлено, оновлено, видалено, рефакторено
- **Дієслова EN**: added, fixed, updated, removed, refactored

### Types:
- `feat` - нова функціональність
- `fix` - виправлення бага
- `refactor` - рефакторинг коду
- `docs` - зміни в документації
- `style` - форматування, стилі
- `test` - додавання/оновлення тестів
- `chore` - інші зміни (build, CI, etc.)
- `perf` - покращення продуктивності

### ✅ Правильні приклади:

**Українською:**
```
feat(auth): додано Google OAuth провайдер
fix(api): виправлено помилку валідації
refactor(store): оптимізовано управління станом
docs(readme): оновлено інструкції встановлення
style(button): відформатовано компоненти кнопок
```

**Англійською:**
```
feat(auth): added Google OAuth provider
fix(api): fixed validation error
refactor(store): optimized state management
docs(readme): updated installation instructions
```

### ❌ Неправильно (наказова форма):
```
feat: add feature           # НЕПРАВИЛЬНО
fix: fix bug                # НЕПРАВИЛЬНО
feat: додати функцію        # НЕПРАВИЛЬНО
```

### ✅ Правильно (минулий час):
```
feat: added feature         # ПРАВИЛЬНО
fix: fixed bug              # ПРАВИЛЬНО
feat: додано функцію        # ПРАВИЛЬНО
```

## Пріоритет методів генерації

Скрипт обирає метод у такому порядку:

1. **Спочатку**: Спроба використати API (якщо є `ANTHROPIC_API_KEY`)
2. **Fallback**: Якщо API недоступний → Claude Code CLI
3. **Помилка**: Якщо обидва методи недоступні → повідомлення про помилку

## Налаштування мови

### Варіант 1: Через CLI аргумент (одноразово)
```bash
npm run commit -- --lang=en  # English
npm run commit -- --lang=ua  # Українська
```

### Варіант 2: Через ENV змінну (.env файл)
```bash
# Додайте в .env для постійного використання
COMMIT_LANG=EN  # або UA (за замовчуванням: EN)
```

**Пріоритет**:
1. CLI аргумент `--lang=`
2. ENV змінна `COMMIT_LANG`
3. За замовчуванням: EN

## Приклади використання

### Приклад 1: Нова функція
```bash
$ git add src/auth/oauth.js
$ npm run commit

🚀 Git Commit Generator
📝 Мова: Українська

🤖 Генерую commit message через API...

Згенерований commit message:
feat(auth): додано Google OAuth провайдер

Підтвердити та виконати commit?
  Enter/y - так
  e - редагувати
  n/Esc - скасувати

[Натискаємо Enter]

✅ Commit успішно створено!
```

### Приклад 2: Виправлення бага з редагуванням
```bash
$ git add src/api/users.js
$ npm run commit

🚀 Git Commit Generator
📝 Мова: Українська

🤖 Генерую commit message через Claude Code CLI...

Згенерований commit message:
feat(api): додано валідацію для user endpoint

Підтвердити та виконати commit?
  Enter/y - так
  e - редагувати
  n/Esc - скасувати

[Натискаємо e]

Поточний message: feat(api): додано валідацію для user endpoint
Що треба виправити? це має бути fix, а не feat

🤖 Редагую commit message...

Згенерований commit message:
fix(api): додано валідацію для user endpoint

Підтвердити та виконати commit?
  Enter/y - так
  e - редагувати
  n/Esc - скасувати

[Натискаємо Enter]

✅ Commit успішно створено!
```

### Приклад 3: Fallback на CLI
```bash
$ npm run commit

🚀 Git Commit Generator
📝 Мова: Українська

🤖 Генерую commit message через API...
⚠️  API недоступний: Невалідний API ключ
Переключаюсь на Claude Code CLI...

🤖 Генерую commit message через Claude Code CLI...

Згенерований commit message:
refactor(store): оптимізовано управління корзиною

✅ Commit успішно створено!
```

## Вирішення проблем

### Помилка: "Немає staged changes"
```bash
# Перевірте статус
git status

# Додайте файли
git add .
```

### Помилка: "Не знайдено способу генерації commit message"

**Рішення 1** - Використовуйте API:
```bash
# Додайте ключ в .env файл
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
```

**Рішення 2** - Використовуйте Claude Code CLI:
```bash
# Встановіть Claude Code
# https://docs.claude.com/claude-code

# Перевірте встановлення
which claude
claude --version
```

### Помилка: "API недоступний"

Скрипт автоматично переключиться на Claude Code CLI, якщо він встановлений.

Якщо CLI також недоступний:
- Перевірте валідність API ключа
- Перевірте баланс акаунту на https://console.anthropic.com
- Перевірте інтернет-з'єднання

### Помилка: "Claude Code CLI недоступний"
```bash
# Перевірте, чи встановлено Claude Code
which claude

# Якщо не встановлено, встановіть за інструкцією
# https://docs.claude.com/claude-code
```

## Порівняння методів

| Критерій | Claude API | Claude Code CLI |
|----------|-----------|-----------------|
| **Вартість** | ~$0.01-0.02 за commit | Входить у підписку |
| **Швидкість** | Швидше | Повільніше |
| **Надійність** | Висока | Залежить від CLI |
| **Налаштування** | Потребує API ключ | Потребує CLI |
| **Offline** | ❌ Ні | ❌ Ні |

## Технічні деталі

### Модель:
- **API**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **CLI**: Використовує модель з підписки

### Токени:
- Max tokens для відповіді: 500 (генерація), 300 (редагування)
- Обмеження diff: 6000 символів
- Temperature: 0.3 (для стабільності)

### Залежності:
- `@anthropic-ai/sdk` (опціонально, для API методу)
- Node.js 18+ (для ES modules)
- Git (обов'язково)

## Публікація на NPM

Хочете зробити форк і опублікувати власну версію? Дивіться [Гайд з Публікації](./PUBLISHING.ua.md) для детальних інструкцій.

## Внесок

Вітаються внески! Будь ласка, створюйте Pull Request.

## Ліцензія

MIT License - детальніше в файлі LICENSE

## Підтримка

- **Issues**: [GitHub Issues](https://github.com/uaoa/claude-commit/issues)
- **Документація**: [Anthropic Docs](https://docs.anthropic.com)
- **Claude Code**: [Claude Code Docs](https://docs.claude.com/claude-code)

## Автор

**[Захарій Мельник](https://uaoa.github.io/uk/)** (Zakharii Melnyk), український full-stack розробник із Києва і засновник AOA. Створює вебпродукти, iOS-застосунки та інструменти для розробників.

- Сайт: [uaoa.github.io](https://uaoa.github.io/uk/)
- GitHub: [@uaoa](https://github.com/uaoa)
- LinkedIn: [undef-zakhar](https://www.linkedin.com/in/undef-zakhar/)
- YouTube: [@undefzakhar](https://www.youtube.com/@undefzakhar)
- Telegram: [@undefZakhar](https://t.me/undefZakhar)

Інші проєкти:

- [Claude Commit для VS Code](https://marketplace.visualstudio.com/items?itemName=ZakhariiMelnyk.claude-git-commit): той самий генератор як розширення VS Code
- [whatsmyera.com](https://whatsmyera.com/): скільки подій відбулося за твоє життя
- [wherethefuckismy.money](https://wherethefuckismy.money/): калькулятор реальної купівельної спроможності доходів в Україні
- [AOA](https://aoa.com.ua/): зʼєднує людей наживо в закладах і на подіях

---

Зроблено з ❤️ використовуючи Claude AI
