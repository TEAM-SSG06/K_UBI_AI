# K_UBI_AI - Unified Business Identity & Active Intelligence Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2.5-61DAFB)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://www.docker.com/)

**An AI-powered Entity Resolution and Business Activity Classification system for creating unified business identities from diverse data sources.**

[Features](#features) • [Architecture](#architecture) • [Quick Start](#quick-start) • [API Documentation](#api-documentation) • [Development](#development)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start Guide](#quick-start)
- [API Endpoints](#api-documentation)
- [Data Flow](#data-flow)
- [Engines & Components](#engines--components)
- [Configuration](#configuration)
- [Development Setup](#development)
- [Contributing](#contributing)

---

## 🎯 Overview

**K_UBI_AI** (Unified Business Identity & Active Intelligence) is an enterprise-grade platform designed to solve the critical problem of **Entity Resolution** in business data management. 

### The Problem
Organizations often have fragmented data about the same business entities across multiple systems, databases, and sources—making it difficult to maintain a single source of truth. This leads to:
- Duplicate records
- Inconsistent business intelligence
- Fragmented customer views
- Inefficient operational processes

### The Solution
K_UBI_AI provides:
1. **Advanced Entity Resolution** using Splink's probabilistic matching algorithms
2. **AI-Powered Activity Classification** to categorize business activities
3. **Human-in-the-Loop Review Queue** for confidence-based decisions
4. **Unified Business Identity (UBID)** system for canonical entity representation
5. **Comprehensive Audit Trails** for compliance and traceability

---

## ✨ Features

### Core Capabilities

- **🔗 Probabilistic Entity Resolution**
  - Splink-based machine learning matching
  - Multi-field comparison (name, address, phone, PAN, etc.)
  - Confidence scoring with Gold/Silver/Bronze tiers
  - Support for phonetic matching and fuzzy logic

- **🤖 Activity Classification**
  - ML-based business activity categorization
  - Support for complex business hierarchies
  - Real-time classification engine
  - Training data management

- **👤 Human-in-the-Loop Review**
  - Smart review queue for silver-tier matches (60-95% confidence)
  - Batch review capabilities
  - Decision audit trail
  - User feedback integration

- **📊 Interactive Dashboard**
  - Real-time statistics and KPIs
  - Entity resolution progress tracking
  - Activity distribution analytics
  - System health monitoring

- **🔍 Advanced Entity Explorer**
  - Search and filter unified business identities
  - Merge visualization
  - Relationship mapping
  - Historical change tracking

- **📋 Registry Management**
  - Complete business entity registry
  - Bulk operations support
  - Export to multiple formats (CSV, JSON)
  - Data validation and quality checks

- **📝 Audit & Compliance**
  - Complete audit logs
  - Change history tracking
  - User action logging
  - Compliance reporting

---

## 🏗️ Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.100+ |
| ORM | SQLAlchemy | Latest |
| Database | PostgreSQL | 15 |
| Cache | Redis | 7 |
| Entity Resolution | Splink | Latest |
| Data Processing | Pandas | Latest |
| ML Libraries | Scikit-learn, XGBoost | Latest |
| String Matching | Jellyfish | Latest |
| Validation | Pydantic | Latest |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.5 |
| Build Tool | Vite | 8.0+ |
| Styling | Tailwind CSS | 3.4+ |
| UI Components | Radix UI | 1.4.3 |
| HTTP Client | Axios | 1.16.0 |
| Visualization | Mermaid | 11.14.0 |
| Icons | Lucide React | 1.14.0 |

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Architecture**: Microservices-ready
- **API**: RESTful with OpenAPI documentation

---

## 🏛️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Dashboard │ ReviewQueue │ Explorer │ Registry │ Audit│   │
│  └──────────┬───────────────┬──────────┬─────────┬──────┘   │
│             │               │          │         │           │
│             └───────────────┼──────────┼─────────┘           │
│                             │ AXIOS    │                     │
└─────────────────────────────┼──────────┼─────────────────────┘
                              │          │
                     ┌────────▼──────────▼────────┐
                     │   FastAPI Backend         │
                     │   (Port: 8000)            │
                     └─────┬──────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐   ┌──────▼──────┐
   │  App    │      │  Engines    │   │   Core     │
   │  Layer  │      │  Layer      │   │  Services  │
   │         │      │             │   │            │
   │ • API   │      │ • Resolution│   │ • Database │
   │ • Routes│      │ • Activity  │   │ • Auth     │
   │ • Models│      │ • Security  │   │ • Cache    │
   │ • Schema│      │ • Generator │   │            │
   └────┬────┘      └──────┬──────┘   └──────┬─────┘
        │                  │                 │
        └──────────────────┼─────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐   ┌──────▼──────┐
   │PostgreSQL│      │   Redis    │   │  DuckDB    │
   │  (UBID)  │      │  (Cache)   │   │  (Splink)  │
   │          │      │            │   │            │
   └──────────┘      └────────────┘   └────────────┘
```

### Data Flow

```
Raw Data Input
      │
      ▼
Data Validation & Extraction
      │
      ▼
┌─────────────────────────────────┐
│  Entity Resolution Engine       │
│  ├─ Splink Probabilistic Match  │
│  ├─ Multi-field Comparison      │
│  └─ Confidence Scoring          │
└──────────┬────────────────────────┘
           │
     ┌─────┴──────────────┐
     │                    │
  ┌──▼────┐        ┌──────▼──────┐
  │ GOLD  │        │   SILVER    │
  │ (≥95%)│        │  (60-95%)   │
  │ Auto  │        │ Human Review│
  │ Merge │        │  Queue      │
  └──┬────┘        └──────┬──────┘
     │                    │
     │              ┌─────▼──────┐
     │              │ User Review│
     │              │ Decision   │
     │              └─────┬──────┘
     │                    │
     └────────┬───────────┘
              │
         ┌────▼──────┐
         │   UBID    │
         │ Generation│
         └────┬──────┘
              │
         ┌────▼──────────────┐
         │ Activity          │
         │ Classification    │
         └────┬──────────────┘
              │
         ┌────▼──────────────┐
         │ Unified Registry  │
         │ & Audit Trail     │
         └───────────────────┘
```

### Component Interaction Flow

```
Frontend Request
      │
      ▼
┌─────────────────────────┐
│  FastAPI Router         │ (/api/...)
└──────────┬──────────────┘
           │
      ┌────▼────┐
      │Endpoint │
      │Handler  │
      └────┬────┘
           │
      ┌────▼────────────────────────┐
      │ Business Logic              │
      │ (engines/ or app/core/)      │
      └────┬───────────────────────┘
           │
      ┌────▼─────────────────┐
      │ Data Access Layer    │
      │ (SQLAlchemy ORM)     │
      └────┬────────────────┘
           │
    ┌──────┴──────────┬──────────┐
    │                 │          │
┌───▼────┐      ┌─────▼────┐ ┌──▼──────┐
│Database│      │ Cache    │ │External │
│        │      │(Redis)  │ │Services │
└────────┘      └──────────┘ └─────────┘
```

---

## 📁 Project Structure

```
K_UBI_AI/
├── frontend/                      # React + Vite Application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReviewQueue.jsx
│   │   │   ├── EntityExplorer.jsx
│   │   │   ├── RegistryTable.jsx
│   │   │   ├── AuditLogs.jsx
│   │   │   ├── SchemaViewer.jsx
│   │   │   └── MergeVisualizer.jsx
│   │   ├── lib/                  # Utility functions & helpers
│   │   ├── assets/               # Static assets (images, fonts)
│   │   ├── App.jsx               # Main App component
│   │   ├── App.css               # Global styles
│   │   ├── index.css             # Tailwind imports
│   │   └── main.jsx              # React entry point
│   ├── public/                   # Public static files
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── components.json           # Shadcn UI config
│   └── eslint.config.js          # ESLint configuration
│
├── backend/                       # FastAPI Backend
│   ├── app/
│   │   ├── api/                  # API Route Handlers
│   │   │   ├── endpoints/
│   │   │   │   ├── dashboard.py  # Dashboard stats
│   │   │   │   ├── review.py     # Review queue management
│   │   │   │   ├── search.py     # Entity search
│   │   │   │   ├── export.py     # Data export
│   │   │   │   └── audit.py      # Audit logs
│   │   │   └── __init__.py
│   │   ├── core/                 # Core Services
│   │   │   ├── database.py       # SQLAlchemy setup
│   │   │   ├── config.py         # Configuration
│   │   │   ├── security.py       # Auth & security
│   │   │   └── __init__.py
│   │   ├── models/               # SQLAlchemy Models
│   │   │   ├── entities.py       # UBID, SourceRecord, etc.
│   │   │   └── __init__.py
│   │   ├── schemas/              # Pydantic Schemas
│   │   │   ├── entity.py         # Entity validation
│   │   │   ├── review.py         # Review schemas
│   │   │   └── __init__.py
│   │   ├── main.py               # FastAPI App Initialization
│   │   └── __init__.py
│   │
│   ├── engines/                  # Business Logic Engines
│   │   ├── resolution.py         # Splink-based entity resolution
│   │   ├── activity.py           # Activity classification
│   │   ├── data_generator.py     # Synthetic data generation
│   │   ├── security.py           # Encryption & hashing
│   │   └── __init__.py
│   │
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables
│   ├── ubid.db                    # SQLite (development)
│   └── __init__.py
│
├── docker-compose.yml             # Docker Compose configuration
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
└── LICENSE                        # License file
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended) or
- **Python 3.9+** & **Node.js 16+** (for local development)
- **PostgreSQL 15** & **Redis 7** (if not using Docker)

### Option 1: Docker Compose (Recommended)

#### 1. Clone the Repository
```bash
git clone https://github.com/TEAM-SSG06/K_UBI_AI.git
cd K_UBI_AI
```

#### 2. Start Services with Docker Compose
```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432` (credentials: ubid_user / ubid_password)
- **Redis** on port `6379`

#### 3. Setup Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

#### 4. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Application will be available at: **http://localhost:5173**

---

### Option 2: Local Development Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cat > .env << EOF
DATABASE_URL=postgresql://ubid_user:ubid_password@localhost:5432/ubid_db
REDIS_URL=redis://localhost:6379/0
DEBUG=True
EOF

# Start development server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server (Vite)
npm run dev
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Core Endpoints

#### Dashboard Endpoints
```
GET  /dashboard/stats           - Get dashboard statistics
GET  /dashboard/health          - System health check
GET  /dashboard/metrics         - Performance metrics
```

#### Review Queue
```
GET    /review/queue            - Get pending reviews
GET    /review/queue/{id}       - Get specific review
POST   /review/queue/{id}/approve - Approve match
POST   /review/queue/{id}/reject  - Reject match
GET    /review/history          - Get review history
```

#### Entity Search
```
POST   /search/entities         - Search by criteria
GET    /search/ubid/{ubid_id}   - Get UBID details
GET    /search/records/{id}     - Get source record
```

#### Data Export
```
POST   /export/ubid            - Export UBIDs
POST   /export/records         - Export source records
POST   /export/audit-logs      - Export audit trail
GET    /export/status/{task_id} - Get export status
```

#### Audit Logs
```
GET    /audit/logs             - Get audit trail
GET    /audit/logs/user/{user} - Get user actions
GET    /audit/stats            - Get audit statistics
```

### Interactive API Explorer
Visit **http://localhost:8000/docs** for the interactive Swagger UI with all endpoints and test capabilities.

---

## 🔄 Data Flow

### Complete Entity Resolution Workflow

```
1. INPUT DATA
   └─ CSV/JSON/Database records with business data

2. DATA INGESTION
   ├─ Validation
   ├─ Extraction (name, address, phone, PAN, etc.)
   └─ Hashing sensitive data (PAN)

3. ENTITY RESOLUTION (Splink Engine)
   ├─ Blocking Rules:
   │  ├─ By Pincode
   │  ├─ By Phonetic Name
   │  └─ By Hashed PAN
   ├─ Comparison:
   │  ├─ Name Fuzzy Matching
   │  ├─ Address Levenshtein Distance
   │  ├─ Phone Exact Match
   │  └─ PAN Exact Match
   └─ Probability Calculation:
      └─ Uses Expectation-Maximization algorithm

4. CONFIDENCE SCORING
   ├─ GOLD TIER (≥ 95%)
   │  └─ Automatic merge
   ├─ SILVER TIER (60-95%)
   │  └─ Send to review queue
   └─ BRONZE TIER (< 60%)
      └─ Assign separate UBID

5. HUMAN REVIEW (Silver Tier)
   ├─ User reviews match
   ├─ Decision recorded in audit log
   └─ UBID assigned based on decision

6. ACTIVITY CLASSIFICATION
   ├─ Classify business activity
   └─ Update entity attributes

7. UNIFIED REGISTRY
   ├─ Generate canonical UBID
   ├─ Link all source records
   └─ Maintain audit trail

8. OUTPUT
   └─ Unified Business Registry with UBID mapping
```

---

## ⚙️ Engines & Components

### 1. Resolution Engine (`backend/engines/resolution.py`)

**Purpose**: Performs probabilistic entity matching using Splink

**Key Features**:
- Deduplication of records
- Multi-field matching with custom comparison logic
- Probability-based confidence scoring
- Three-tier classification (Gold/Silver/Bronze)

**Usage**:
```python
from engines.resolution import perform_entity_resolution

result = perform_entity_resolution()
# Returns: {"status": "success", "pairs_predicted": 1250}
```

**Configuration**:
- `probability_two_random_records_match`: 0.05
- `threshold_gold`: 0.95
- `threshold_silver`: 0.60

---

### 2. Activity Classification Engine (`backend/engines/activity.py`)

**Purpose**: Classifies business activities based on source data

**Key Features**:
- ML-based activity categorization
- Support for hierarchical classification
- Training data management

**Usage**:
```python
from engines.activity import classify_activity

activity = classify_activity(ubid_id, attributes)
```

---

### 3. Data Generator (`backend/engines/data_generator.py`)

**Purpose**: Generates synthetic test data for development and testing

**Key Features**:
- Realistic business data generation
- Configurable duplicate ratios
- Variation generation (typos, name variations, etc.)

**Usage**:
```bash
python -c "from engines.data_generator import generate_sample_data; generate_sample_data(1000)"
```

---

### 4. Security Engine (`backend/engines/security.py`)

**Purpose**: Handles encryption, hashing, and data protection

**Key Features**:
- PAN hashing with salt
- Data encryption for sensitive fields
- Secure password handling

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```bash
# Database
DATABASE_URL=postgresql://ubid_user:ubid_password@localhost:5432/ubid_db

# Redis Cache
REDIS_URL=redis://localhost:6379/0

# API Configuration
API_TITLE=UBID & Active Business Intelligence API
API_VERSION=1.0.0
DEBUG=False

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# Entity Resolution
SPLINK_THRESHOLD_GOLD=0.95
SPLINK_THRESHOLD_SILVER=0.60
SPLINK_THRESHOLD_BRONZE=0.20

# Activity Classification
MODEL_PATH=./models/activity_classifier.pkl
```

### Frontend Environment Variables

Create `.env.local` in `frontend/`:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

### Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ubid_user
      POSTGRES_PASSWORD: ubid_password
      POSTGRES_DB: ubid_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 💻 Development

### Running Tests

#### Backend Tests
```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_resolution.py -v
```

#### Frontend Tests
```bash
cd frontend

# Run linting
npm run lint

# Fix linting issues
npm run lint --fix
```

### Building for Production

#### Backend
```bash
cd backend

# Create production build
pip install -r requirements.txt
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

#### Frontend
```bash
cd frontend

# Create optimized production build
npm run build

# Output will be in dist/ directory
```

### Code Style & Standards

- **Python**: PEP 8 with Black formatter
- **JavaScript**: ESLint + Prettier
- **Git**: Conventional commits

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Setup hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

---

## 📊 Database Schema

### Key Tables

#### Source Records
```sql
CREATE TABLE source_records (
  id UUID PRIMARY KEY,
  extracted_name VARCHAR,
  extracted_address VARCHAR,
  extracted_pincode VARCHAR,
  hashed_pan VARCHAR,
  phonetic_name VARCHAR,
  department VARCHAR,
  ubid_id UUID FOREIGN KEY,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Unified Business Identities (UBID)
```sql
CREATE TABLE ubids (
  id UUID PRIMARY KEY,
  canonical_name VARCHAR,
  canonical_address VARCHAR,
  confidence_score FLOAT,
  record_count INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Review Queue
```sql
CREATE TABLE review_queue (
  id UUID PRIMARY KEY,
  record_1_id UUID,
  record_2_id UUID,
  confidence_score FLOAT,
  status ENUM('PENDING', 'APPROVED', 'REJECTED'),
  reviewer_id UUID,
  decision_at TIMESTAMP,
  created_at TIMESTAMP
);
```

#### Audit Logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  entity_type VARCHAR,
  entity_id UUID,
  action VARCHAR,
  user_id UUID,
  changes JSONB,
  ip_address VARCHAR,
  created_at TIMESTAMP
);
```

---

## 🔒 Security

### Authentication
- JWT-based token authentication
- Secure password hashing with bcrypt
- CORS protection for frontend requests

### Data Protection
- PAN hashing with unique salt
- Encryption for sensitive fields
- Audit logging for all modifications
- Role-based access control (RBAC)

### Best Practices
- Use environment variables for secrets
- Never commit `.env` files
- Enable HTTPS in production
- Regular security audits
- SQL injection prevention via SQLAlchemy ORM

---

## 📈 Performance Optimization

### Caching Strategy
- Redis caching for frequent queries
- Query result caching (TTL: 1 hour)
- UBID cache with invalidation

### Database Optimization
- Indexed columns on foreign keys
- Connection pooling via SQLAlchemy
- Query optimization for large datasets

### Frontend Performance
- Code splitting with Vite
- Lazy loading of components
- Memoization of expensive computations
- Debounced search queries

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write descriptive commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- 📧 Email: [team@example.com](mailto:team@example.com)
- 🐙 GitHub Issues: [K_UBI_AI/issues](https://github.com/TEAM-SSG06/K_UBI_AI/issues)
- 💬 Discussions: [K_UBI_AI/discussions](https://github.com/TEAM-SSG06/K_UBI_AI/discussions)

---

## 🙏 Acknowledgments

- **Splink** - For the probabilistic record linkage framework
- **FastAPI** - For the modern async web framework
- **React** - For the powerful UI framework
- **Open Source Community** - For the amazing libraries and tools

---

<div align="center">

**Made with ❤️ by TEAM-SSG06**

⭐ If you find this project helpful, please consider giving it a star!

</div>
