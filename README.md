# view_count

A web app (Node.js, Express, MongoDB, React) that reports **total views** and **unique users** per product over a custom date range. The app reads from a `userView` collection that stores one document per product view (userId, productId, viewDate).

---

## Prerequisites

- **Node.js** (v14 or later; v18+ recommended)
- **MongoDB** (local: 4.x/5.x/6.x, or a MongoDB Atlas connection string)
- **npm** (comes with Node.js)

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd view_count
```

Install dependencies for both backend and frontend:

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 2. Database

Ensure MongoDB is running (e.g. local install or MongoDB Atlas).

Configure the database URL via environment variable (recommended) or in code:

1. **Recommended:** In the `backend` folder, copy `.env.example` to `.env` and set `MONGO_URI` to your connection string. Never commit `.env` or real credentials. If a MongoDB URI was ever committed to this repo, rotate the password and revoke any exposed credentials in your MongoDB Atlas (or other provider) dashboard immediately.
2. **Alternatively:** Edit **`backend/configs/db.js`** and set the connection string. Use only the local example below in the repo; for Atlas or other hosted MongoDB, use a `.env` file.

```javascript
// Example for local MongoDB only (safe to commit):
const DB_CONNECTION_STRING = process.env.MONGO_URI || 'mongodb://localhost:27017/reports';
```

### 3. Seed data (optional)

To populate the `userView` collection with sample data (5,000 records across 100 products and 50 users with random dates):

```bash
cd backend
npm run seed
cd ..
```

### 4. Run the app

Use **two terminals**.

**Terminal 1 — Backend (API):**

```bash
cd backend
npm start
```

You should see:

- `Database connected`
- `Server running on port 8100`

**Terminal 2 — Frontend (React):**

```bash
cd frontend
npm start
```

The app will open in your browser (default: **http://localhost:3000**).  
If port 3000 is in use, the script may prompt to use another port, or you can set one explicitly:

- **Windows (PowerShell):** `$env:PORT=3001; npm start`
- **Windows (CMD):** `set PORT=3001 && npm start`
- **macOS/Linux:** `PORT=3001 npm start`

Then open **http://localhost:3001** (or the port shown in the terminal).

### 5. Use the app

1. Open the app in the browser (e.g. http://localhost:3000 or http://localhost:3001).
2. Choose **Start Date** and **End Date**.
3. Click **Get Report**.
4. The table shows, per product: **Product ID**, **Total Views**, **Unique Users** for that date range.

---

## Ports and URLs

| Service   | Default port | URL                    |
|----------|--------------|------------------------|
| Backend  | 8100         | http://localhost:8100  |
| Frontend | 3000         | http://localhost:3000  |

The frontend calls the backend at `http://localhost:8100`. If you run the backend on another host/port, update the `fetch` URL in **`frontend/src/App.js`**.

---

## API

### Get view report

**GET** `/api/reports/getViewReport`

**Query parameters:**

| Parameter   | Type   | Required | Description                    |
|------------|--------|----------|--------------------------------|
| `startDate`| string | No       | Start of range (e.g. `2020-01-01`). Default: epoch. |
| `endDate`  | string | No       | End of range (e.g. `2020-01-31`). Default: now.     |

**Example:**

```text
GET http://localhost:8100/api/reports/getViewReport?startDate=2020-01-01&endDate=2020-01-31
```

**Response (200):** JSON array of:

```json
[
  {
    "productId": "1",
    "totalUsers": 45,
    "uniqueUsers": 12
  }
]
```

- **productId** — Product identifier  
- **totalUsers** — Total view events in the date range  
- **uniqueUsers** — Count of distinct users who viewed the product in the range  

---

## Project structure

```text
view_count/
├── backend/
│   ├── configs/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── report.js          # getViewReport handler & aggregation
│   ├── models/
│   │   └── userView.js        # userView schema & indexes
│   ├── routes/
│   │   └── reportRoutes.js    # GET /getViewReport
│   ├── seeds/
│   │   └── index.js           # Seed userView collection
│   ├── index.js               # Express app entry
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ReportForm.js   # Date range form
│   │   │   └── ReportDisplay.js # Report table
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docs/
│   └── ARCHITECTURE.md        # HLD & LLD diagrams
└── README.md
```

---

## Data model

**Collection:** `userView` (MongoDB; Mongoose model in `backend/models/userView.js`)

| Field      | Type   | Description           |
|-----------|--------|-----------------------|
| `userId`  | String | Viewer identifier     |
| `productId` | String | Product identifier  |
| `viewDate`  | Date  | When the view occurred |

Indexes: `userId`, `productId` (for faster queries and aggregation).

---

## Troubleshooting

- **"Database connection failed"** — Start MongoDB or fix `DB_CONNECTION_STRING` in `backend/configs/db.js`.
- **"Something is already running on port 3000"** — Use another port for the frontend (e.g. `PORT=3001 npm start` in the frontend directory).
- **Empty report** — Ensure there is data in the date range (run `npm run seed` in `backend` and pick dates that include 2019–today).

---

## License

ISC
