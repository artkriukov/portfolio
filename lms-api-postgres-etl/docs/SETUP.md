# Установка и запуск
## Требования
- Python 3.12+
- PostgreSQL
- доступ к API
- SMTP-аккаунт для отправки уведомлений
## Установка

### 1. Клонировать репозиторий
```bash
git clone https://github.com/artkriukov/portfolio.git
cd lms-api-postgres-etl
```

### 2. Создать виртуальное окружение
```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Установить зависимости

```bash
pip install -r requirements.txt
```

### Настройка
Создать файл .env в корне проекта:

```bash
API_URL=<адрес API>
API_CLIENT=<идентификатор клиента>
API_CLIENT_KEY=<ключ клиента>

DB_URL=<строка подключения к PostgreSQL>

SMTP_USER=<адрес отправителя>
SMTP_PASSWORD=<пароль приложения>
NOTIFICATION_EMAIL=<адрес получателя>
```

### Подготовка PostgreSQL
Перед запуском создать таблицу submissions и уникальное ограничение:

```sql
UNIQUE (user_id, attempt_type, created_at)
```

### Запуск
```python
python main.py
```
