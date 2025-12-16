 z# anonify.fun

Send your ideas, confessions, questions, anything you want to express. Read the following AI generated instructions (lol!) to get started.

## 🚀 Technologies

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- PostgreSQL
- express-rate-limit

## 📋 Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm (included with Node.js)
- Git

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/anonify.fun.git
cd anonify.fun
```

### 2. Configure the database

#### Option A: Recommended method

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create the database
CREATE DATABASE anonify;

# Connect to the database
\c anonify

# Run the SQL script
\i /full/path/to/project/sql/db.sql

# Exit
\q
```

#### Option B: From terminal

```bash
sudo -u postgres createdb anonify
sudo -u postgres psql anonify < sql/db.sql
```

#### Option C: Easy Mode!
Use pgadmin4

#### Configure PostgreSQL authentication

If you get "ident" or "peer" authentication errors (at least this happened to me), edit the `pg_hba.conf` file:

```bash
# Find the file
sudo find /etc/postgresql -name pg_hba.conf

# Edit (replace [version] with your PostgreSQL version)
sudo nano /etc/postgresql/[version]/main/pg_hba.conf
```

Change authentication lines to `md5`:

```
local   all             postgres                                md5
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

### 3. Install server dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `server/` folder:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
CLIENT_URLS="http://localhost:5500,http://127.0.0.1:8080"
DB_HOST="localhost"
DB_NAME="your_db_name"
DB_PASS="your_postgres_password"
DB_PORT="your_db_port"
DB_USER="your_db_user"
SERVER_PORT="3000"
```

## ▶️ Running the application

### Start the backend server

```bash
cd server
npm start
```

The server will be available at `http://localhost:3000`

### Start the frontend

You can use any static server. Options:

#### Option 1: Python
```bash
cd pages
python3 -m http.server 5500
```

#### Option 2: Node.js http-server
```bash
npx http-server pages -p 5500
```

The frontend will be available at `http://localhost:5500`

## 📁 Project structure

```
anonify.fun/
├── pages/                      # Frontend
│   ├── index.html             # Main page
│   ├── about.html             # About page
│   ├── messages.html          # Messages page
│   ├── css/                   # Styles
│   ├── scripts/               # JavaScript
│   │   ├── config.js          # Configuration (API URL)
│   │   ├── app.js             # Main logic
│   │   └── ...
│   └── icons/                 # Icons and resources
├── server/                     # Backend
│   ├── server.js              # Express server
│   ├── config/
│   │   └── db.js              # PostgreSQL configuration
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables (not included)
│   └── .env.example           # Environment variables example
├── sql/
│   └── db.sql                 # Database schema
└── README.md
```

## 🔒 Security

- **Rate Limiting:** The server implements rate limiting to prevent abuse
- **CORS:** Configured with specific allowed origins
- **Validation:** Data validation on the backend
- **Environment variables:** Credentials stored securely

## 🛠️ Development

### Available scripts

```bash
# In server/ folder
npm start          # Start server with nodemon (auto-reload)
npm run dev        # Alias for npm start
```

### Current rate limits

- **GET /messages:** 15 requests every 3 minutes
- **POST /search:** 3 requests every 2 minutes  
- **POST /send:** 1 request every 5 minutes

## 🚀 Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy-production.yml`) that:
- Creates a clean `production` branch
- Reorganizes folder structure
- Minifies CSS
- Removes development files

To run the deployment:
1. Go to "Actions" in your GitHub repository
2. Select "Deploy to Production"
3. Click "Run workflow"

## 📝 Notes

- The frontend automatically detects if it's in development (localhost) or production
- Make sure to change the PostgreSQL password before making the repository public
- The `.env` file should never be committed to Git

## 🐛 Troubleshooting

### Error: "Ident authentication failed"
Follow the steps in the "Configure PostgreSQL authentication" section

### Error: "ECONNREFUSED"
Verify that PostgreSQL is running:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Frontend cannot connect to backend
Verify that:
1. The backend server is running on port 3000
2. The frontend URL is in `CLIENT_URLS` in the `.env` file
3. CORS is configured correctly

## 🎨 Credits

Icons from [Pixel Icon Library](https://pixeliconlibrary.com/) by [HackerNoon](https://hackernoon.com/)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**CesarZ**
