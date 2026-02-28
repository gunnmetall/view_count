# View Count — High-Level & Low-Level Design

## 1. High-Level Design (HLD)

### 1.1 System Context

```mermaid
flowchart LR
    subgraph User
        U[User / Browser]
    end
    subgraph View Count Application
        FE[React Frontend]
        BE[Express Backend]
        FE -->|HTTP GET /api/reports/getViewReport| BE
    end
    subgraph Data
        MongoDB[(MongoDB\nuserView collection)]
        BE -->|Mongoose / Aggregation| MongoDB
    end
    U -->|Pick date range, Get Report| FE
    U -->|View report table| FE
```

### 1.2 Component Overview

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        UI[UI Layer]
    end
    subgraph Backend["Backend (Node.js / Express)"]
        API[API Layer]
        Logic[Business Logic]
        DataAccess[Data Access]
    end
    subgraph Database["Database"]
        DB[(MongoDB)]
    end
    UI -->|REST GET + query params| API
    API --> Logic
    Logic --> DataAccess
    DataAccess --> DB
```

### 1.3 Request Flow (HLD)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB

    U->>FE: Select start/end date, click Get Report
    FE->>BE: GET /api/reports/getViewReport?startDate=&endDate=
    BE->>DB: Aggregate: match by date, group by productId
    DB-->>BE: Aggregated docs (productId, totalUsers, uniqueUsers)
    BE-->>FE: 200 JSON array
    FE-->>U: Render report list
```

### 1.4 HLD — Deployment / Runtime

```mermaid
flowchart TB
    subgraph Client["Client"]
        Browser[Browser]
    end
    subgraph Server["Server"]
        ReactDev[React Dev Server\n(e.g. port 3000)]
        Express[Express Server\nport 8100]
    end
    subgraph DataStore["Data Store"]
        Mongo[(MongoDB\nlocalhost:27017/reports)]
    end
    Browser --> ReactDev
    Browser --> Express
    Express --> Mongo
```

---

## 2. Low-Level Design (LLD)

### 2.1 Backend — File-Level Structure

```mermaid
flowchart TB
    subgraph Entry["Entry & Config"]
        index["backend/index.js\n(Express app, CORS, routes, listen)"]
        db["backend/configs/db.js\n(MongoDB connection)"]
    end
    subgraph Routes["Routes"]
        reportRoutes["backend/routes/reportRoutes.js\n(GET /getViewReport → userViewReport)"]
    end
    subgraph Controllers["Controllers"]
        report["backend/controllers/report.js\n(userViewReport: parse dates, aggregate, respond)"]
    end
    subgraph Models["Models"]
        userView["backend/models/userView.js\n(UserViewSchema, indexes)"]
    end
    subgraph Scripts["Scripts"]
        seeds["backend/seeds/index.js\n(Insert 5k userView records)"]
    end
    index --> db
    index --> reportRoutes
    reportRoutes --> report
    report --> userView
    seeds --> db
    seeds --> userView
```

### 2.2 Frontend — File-Level Structure

```mermaid
flowchart TB
    subgraph Entry["Entry & Shell"]
        indexHtml["frontend/public/index.html\n(#root div)"]
        indexJs["frontend/src/index.js\n(ReactDOM.render App)"]
    end
    subgraph App["App Root"]
        app["frontend/src/App.js\n(state: reportData, fetchReport)"]
    end
    subgraph Components["Components"]
        reportForm["frontend/src/components/ReportForm.js\n(startDate, endDate, submit → fetchReport)"]
        reportDisplay["frontend/src/components/ReportDisplay.js\n(render reportData list)"]
    end
    indexHtml --> indexJs
    indexJs --> app
    app --> reportForm
    app --> reportDisplay
```

### 2.3 LLD — Request Path with Filenames

```mermaid
sequenceDiagram
    participant ReportForm as ReportForm.js
    participant App as App.js
    participant reportRoutes as reportRoutes.js
    participant report as report.js
    participant userView as userView.js
    participant MongoDB as MongoDB

    ReportForm->>App: fetchReport(startDate, endDate)
    App->>reportRoutes: GET .../api/reports/getViewReport?startDate=&endDate=
    reportRoutes->>report: userViewReport(req, res)
    report->>userView: UserView.aggregate([...])
    userView->>MongoDB: aggregation pipeline
    MongoDB-->>userView: cursor/docs
    userView-->>report: report array
    report-->>App: res.json(report)
    App->>App: setReportData(data)
    App->>ReportDisplay: reportData prop
```

### 2.4 LLD — Aggregation Pipeline (report.js)

```mermaid
flowchart LR
    A["$match\nviewDate in [start, end)"] --> B["$group by productId\ntotalUsers: $sum(1)\nuniqueUsers: $addToSet(userId)"]
    B --> C["$project\nproductId, totalUsers\nuniqueUsers: $size(uniqueUsers)"]
```

| Stage   | Purpose |
|--------|---------|
| `$match`  | Filter documents by `viewDate` (startDate ≤ viewDate < endDate). |
| `$group`  | Group by `productId`; count rows (`totalUsers`), collect distinct `userId` (`uniqueUsers` array). |
| `$project`| Expose `productId`, `totalUsers`, and replace `uniqueUsers` array with its size. |

### 2.5 LLD — File Reference Table

| Layer        | Responsibility                    | Filename |
|-------------|------------------------------------|----------|
| **Backend** |                                    |          |
| Entry       | Express app, middleware, server    | `backend/index.js` |
| Config      | MongoDB connection                 | `backend/configs/db.js` |
| Routes      | Mount GET /getViewReport           | `backend/routes/reportRoutes.js` |
| Controller  | Parse query, run aggregation, send | `backend/controllers/report.js` |
| Model       | userView schema and indexes       | `backend/models/userView.js` |
| Seed        | Populate userView collection      | `backend/seeds/index.js` |
| **Frontend**|                                    |          |
| Shell       | HTML root                          | `frontend/public/index.html` |
| Entry       | React mount                        | `frontend/src/index.js` |
| App         | State + fetch + layout             | `frontend/src/App.js` |
| Form        | Date inputs + submit               | `frontend/src/components/ReportForm.js` |
| Display     | Report list / empty message        | `frontend/src/components/ReportDisplay.js` |

---

## 3. Data Model (LLD)

### userView collection (backend/models/userView.js)

| Field      | Type   | Description           |
|-----------|--------|-----------------------|
| `userId`  | String | Viewer identifier     |
| `productId` | String | Product identifier  |
| `viewDate`  | Date  | When the view occurred |

**Indexes:** `{ userId: 1 }`, `{ productId: 1 }`

### API response shape (from backend/controllers/report.js)

| Field        | Type   | Description                    |
|-------------|--------|--------------------------------|
| `productId` | string | Product id from $group _id     |
| `totalUsers`| number | Total view events in range    |
| `uniqueUsers` | number | Count of distinct userIds   |

---

*Generated for the view_count repository.*
