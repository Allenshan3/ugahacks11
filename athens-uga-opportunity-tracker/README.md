## Athens & UGA Opportunity Tracker

A Next.js (App Router) project that helps UGA students discover local opportunities and track their applications. The app now ships with full authentication and authorization powered by **NextAuth.js**.

### Key Features
- Credential-based authentication with role-aware sessions (student + admin demo accounts included)
- Middleware-protected dashboard, job editor, and stats routes
- Admin-only access to analytics (`/stats`)
- Client-side session awareness across navigation, dashboard, and tracker flows

## Getting Started

Install dependencies (if you haven't already):

```bash
npm install
```

### Database Setup

1. **Set up MongoDB**: 
   - Create a MongoDB database (local or cloud via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
   - Get your MongoDB connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database-name` or `mongodb://localhost:27017/database-name`)

2. **Create a `.env.local` file** in the project root with the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-random-string-here

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string-here

# Demo User Credentials (optional - for seeding initial users)
NEXTAUTH_DEMO_EMAIL=student@uga.edu
NEXTAUTH_DEMO_PASSWORD=GoDawgs123!
NEXTAUTH_ADMIN_EMAIL=coach@uga.edu
NEXTAUTH_ADMIN_PASSWORD=CoachMode123!
```

3. **Seed the database** with demo users (optional):

You can create the initial demo users by running a seed script, or simply sign up new users through the signup page. The demo credentials above are only used if you run the seed script.

4. **Run the development server**:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) and either:
- Sign up for a new account at `/signup`
- Log in with existing credentials (if you seeded the database)

## Authentication & Authorization Notes

- **Database-backed authentication**: User credentials and roles are stored in MongoDB
- **Password security**: Passwords are hashed using bcrypt before storage
- **Role-based access**: Users can have `student` or `admin` roles
- The login page uses the `Credentials` provider from NextAuth and supports redirecting back to protected routes via `callbackUrl`.
- `middleware.ts` enforces login for `/dashboard`, `/job/*`, and `/stats`. Only `admin` users can reach `/stats`.
- Client components (Nav, dashboard, job forms, etc.) read session data via `useSession` to tailor the UI.
- New users can sign up at `/signup` - accounts are created with `student` role by default.

## Project Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js dev server |
| `npm run build` | Creates a production build |
| `npm start` | Runs the production build |
| `npm run lint` | Lints the project |

## Folder Structure Highlights

- `src/app` – App Router routes and UI
- `src/app/lib/mongodb.ts` – MongoDB connection utility
- `src/app/models/User.ts` – User model/schema with password hashing
- `src/app/api/auth/signup/route.ts` – User registration API endpoint
- `src/auth.ts` – Central NextAuth configuration (now uses MongoDB)
- `src/middleware.ts` – Route protection and role enforcement
- `types/next-auth.d.ts` – Type augmentation for role-aware sessions

## Deployment

When deploying, be sure to supply the same environment variables shown above (with updated secrets/credentials). Platforms such as Vercel, Netlify, or Render work great with this setup.
