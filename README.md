# CollegeFinder - College Discovery & Decision Platform

A production-grade MVP for discovering, comparing, and making informed decisions about engineering colleges in India.

![CollegeFinder](https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop)

## 🚀 Live Demo

**[Deploy your own instance](#deployment)** | **[View Features](#features)**

## ✨ Features

### 1. College Listing & Search
- Browse 45+ engineering colleges across India
- Advanced filtering by:
  - State/Location
  - Fee range (₹0 - ₹5 Lakhs)
  - Minimum rating (4+ stars, 4.5+ stars)
- Debounced real-time search by college name
- Pagination support (12 colleges per page)
- URL query parameter syncing for shareable filters

### 2. College Detail Pages
- Comprehensive college information:
  - Overview & description
  - Location & establishment year
  - National ranking
  - Rating & reviews
  - Placement statistics
  - Average package (LPA)
- Courses offered with fees
- Student reviews with ratings
- Quick stats cards

### 3. Compare Colleges (⭐ High Priority)
- Side-by-side comparison of up to 3 colleges
- Compare metrics:
  - Location
  - National Ranking
  - Rating
  - Annual Fees
  - Placement Rate (with progress bar)
  - Average Package
  - Established Year
- Persistent comparison state (Zustand + localStorage)
- Remove colleges from comparison
- Direct links to detail pages

### 4. Authentication & Saved Colleges
- Secure credential-based authentication (NextAuth.js)
- Register with email & password
- Save favorite colleges to your account
- Manage saved colleges (view, remove)
- Protected routes for saved page

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React Framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide Icons** - Clean, consistent iconography
- **TanStack Query** - Data fetching & caching
- **Zustand** - Lightweight state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM for TypeScript
- **PostgreSQL** - Reliable relational database
- **NextAuth.js** - Authentication for Next.js
- **bcryptjs** - Password hashing

### Database
- **Neon PostgreSQL** - Serverless Postgres (recommended for deployment)
- Local PostgreSQL for development

## 📁 Project Structure

```
college/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── colleges/  # College endpoints
│   │   │   └── saved/     # Saved colleges endpoints
│   │   ├── colleges/
│   │   │   ├── page.tsx   # College listing page
│   │   │   └── [slug]/    # College detail page
│   │   ├── compare/       # Compare page
│   │   ├── saved/         # Saved colleges page
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   └── Navbar.tsx     # Navigation bar
│   ├── hooks/
│   │   └── useToast.ts    # Toast notification hook
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client singleton
│   │   └── utils.ts       # Utility functions
│   ├── store/
│   │   └── compareStore.ts # Zustand compare state
│   └── types/
│       └── next-auth.d.ts # NextAuth type extensions
├── .env.local             # Environment variables
├── components.json        # shadcn/ui config
├── prisma.config.ts       # Prisma configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- PostgreSQL database (local or Neon)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd college

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database - Neon PostgreSQL (recommended)
DATABASE_URL="postgresql://username:password@ep-example.us-east-2.aws.neon.tech/college?sslmode=require"

# OR for local development
# DATABASE_URL="postgresql://localhost:5432/college"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Generate a secret key:
# openssl rand -base64 32
```

### 3. Database Setup

#### Option A: Neon PostgreSQL (Recommended)
1. Create a free account at [Neon](https://neon.tech)
2. Create a new database named `college`
3. Copy the connection string to `.env.local`

#### Option B: Local PostgreSQL
1. Create a database:
```sql
CREATE DATABASE college;
```
2. Update `DATABASE_URL` in `.env.local`

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Seed the database (45+ colleges)
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials
After seeding, use these credentials to test:
- **Email:** demo@collegefinder.com
- **Password:** demo123

## 📊 Database Schema

### Models
- **User** - Authentication & profile
- **College** - College information (45+ entries)
- **Course** - Courses offered by each college
- **Review** - Student reviews & ratings
- **SavedCollege** - User's saved colleges

### Sample Data
The seed script creates:
- 45+ colleges (IITs, NITs, IIITs, Private)
- 5-8 courses per college
- 2-4 reviews per college
- 1 demo user

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth endpoints |

### Colleges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges (with filters) |
| GET | `/api/colleges/:slug` | Get college details |
| GET | `/api/states` | Get all states with counts |

### Saved Colleges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved` | Get user's saved colleges |
| POST | `/api/saved` | Save a college |
| DELETE | `/api/saved/:id` | Remove saved college |

## 🚀 Deployment

### Vercel (Frontend + API)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL` (Neon connection string)
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

4. Deploy!

### Neon PostgreSQL (Database)

1. Create account at [Neon](https://neon.tech)
2. Create database `college`
3. Copy connection string to Vercel env vars
4. Run migrations in Vercel:
```bash
vercel env pull  # Pull env vars
npx prisma migrate deploy  # Run migrations
npx prisma db seed  # Seed data
```

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
```

## 📱 Features in Detail

### Search & Filter
- Real-time debounced search
- Multi-criteria filtering
- URL state persistence
- Responsive grid layout

### Comparison
- Up to 3 colleges
- Visual progress bars
- Best value highlighting
- Persistent state

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancements
- Touch-friendly interactions

## 🛡 Security

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- SQL injection prevention (Prisma)
- XSS protection

## 📈 Performance

- Image optimization (Next.js Image)
- Query caching (TanStack Query)
- Code splitting
- Lazy loading
- Debounced search inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Lucide Icons](https://lucide.dev) for consistent iconography
- [Neon](https://neon.tech) for serverless PostgreSQL
- [Vercel](https://vercel.com) for deployment platform

---

Built with ❤️ for students making important education decisions.#   c o l l e g e  
 