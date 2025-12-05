# Split Keyboard API - Backend

FastAPI backend for the split keyboard comparison website.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Important:** Change the `SECRET_KEY` in production! Generate a secure key:

```bash
openssl rand -hex 32
```

### 3. Create Initial Admin Account

```bash
python create_admin.py admin your_password
```

### 4. Run Development Server

```bash
python run.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT authentication
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── keyboards.py     # Public keyboard API
│   │   └── admin.py         # Admin API
│   └── utils/
│       ├── __init__.py
│       ├── security.py      # Password hashing
│       └── file_upload.py   # File upload handling
├── uploads/                 # Uploaded images
├── database.db             # SQLite database
├── requirements.txt
├── .env                    # Environment variables
├── run.py                  # Development server
└── create_admin.py         # Admin creation script
```

## API Endpoints

### Public Endpoints

- `GET /api/keyboards` - Get keyboards list with filtering
- `GET /api/keyboards/{id}` - Get specific keyboard
- `POST /api/keyboards/compare` - Compare two keyboards
- `GET /uploads/{filename}` - Get uploaded image

### Admin Endpoints (Authentication Required)

- `POST /api/admin/login` - Admin login
- `POST /api/admin/keyboards` - Create keyboard
- `PUT /api/admin/keyboards/{id}` - Update keyboard
- `DELETE /api/admin/keyboards/{id}` - Delete keyboard
- `POST /api/admin/accounts` - Create admin account
- `GET /api/admin/accounts` - List admin accounts
- `DELETE /api/admin/accounts/{id}` - Delete admin account

## Database

The project uses SQLite by default. The database file is created automatically on first run.

### Tables

- `keyboards` - Keyboard information
- `admins` - Admin accounts

## Security Features

- Password hashing with bcrypt (10+ rounds)
- JWT authentication with configurable expiration
- File upload validation (type, size, sanitization)
- CORS configuration
- SQL injection protection via ORM

## Production Deployment

1. Change `SECRET_KEY` in `.env`
2. Update `ALLOWED_ORIGINS` with your frontend domain
3. Use a production WSGI server (uvicorn with multiple workers)
4. Consider using PostgreSQL instead of SQLite for better performance
5. Set up Nginx as reverse proxy
6. Enable HTTPS

Example production command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Testing

To test the API, you can use:
- Swagger UI at `/docs`
- curl or httpie
- Postman or Insomnia

Example: Get all keyboards

```bash
curl http://localhost:8000/api/keyboards
```

Example: Admin login

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```
