# PIEAS Blood Chapter Portal

## Overview

The PIEAS Blood Chapter Portal is a blood donation management system designed to connect blood donors with those in need. The application facilitates donor registration, blood request submissions, and administrative management of blood donation activities. Built with a focus on trust and clarity, it follows healthcare-inspired design patterns similar to Red Cross Blood Services and Zocdoc.

**Core Purpose:** Enable efficient coordination between blood donors and patients requiring blood transfusions through a centralized, user-friendly platform with admin oversight.

**Key Features:**
- Public-facing donor registration and blood request submission
- Blood inventory tracking across 8 blood groups (A+, A-, B+, B-, O+, O-, AB+, AB-)
- Admin dashboard for managing donors, requests, and donation records
- Matching system to connect compatible donors with blood requests
- Multi-level urgency classification (normal, urgent, emergency)
- Approval workflows for donor registrations and blood requests

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript using Vite as the build tool

**UI Library:** shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**Routing:** Wouter for client-side routing with two distinct route trees:
- Public routes (home, donor registration, blood request submission)
- Admin routes (dashboard, donor tracker, request manager, case log)

**State Management:** 
- TanStack Query (React Query) for server state management and API data fetching
- React Hook Form with Zod validation for form state

**Design System:**
- Custom color palette optimized for medical/healthcare context with primary red (hsl(342, 85%, 53%))
- Poppins font family from Google Fonts
- Tailwind-based spacing system using units: 1, 2, 4, 6, 8, 12, 16
- Responsive design with mobile breakpoint at 768px

**Key UI Patterns:**
- Blood group badges with circular medical-style indicators
- Urgency badges with animation for urgent/emergency cases
- Status badges for approval workflows and request states
- Eligibility indicators calculating donor availability based on 90-day donation intervals

### Backend Architecture

**Framework:** Express.js with TypeScript running on Node.js

**API Design:** RESTful API with the following resource endpoints:
- `/api/donors` - Donor CRUD operations and approval management
- `/api/blood-requests` - Blood request management with matching logic
- `/api/donations` - Donation history and case log
- `/api/blood-inventory` - Real-time blood inventory tracking
- `/api/stats` - Public and admin statistics

**Data Validation:** Zod schemas shared between frontend and backend via a `shared` directory, ensuring type safety across the full stack

**Development Features:**
- Request/response logging middleware
- Vite middleware integration for HMR in development
- Error overlay plugin for runtime errors

### Data Storage

**Database:** PostgreSQL accessed via Neon serverless driver with WebSocket support

**ORM:** Drizzle ORM for type-safe database operations

**Schema Design:**
- `donors` table with approval workflow and eligibility tracking
- `blood_requests` table with urgency levels and status management
- `donations` table linking donors to requests (case closure log)
- `blood_inventory` table tracking availability across blood groups
- `admin_users` table for administrative access control

**Key Enums:**
- Blood groups: A+, A-, B+, B-, O+, O-, AB+, AB-
- Urgency levels: normal, urgent, emergency
- Request status: pending, in_progress, completed, cancelled
- Approval status: pending, approved, rejected

**Business Logic:**
- Automatic blood inventory initialization on server startup
- 90-day eligibility calculation for repeat donations
- Donor-request matching based on blood group compatibility and location
- Last donation date tracking for donor eligibility

### External Dependencies

**Database Provider:** Neon (PostgreSQL serverless)
- Connection via `@neondatabase/serverless` package
- WebSocket-based connection pooling using `ws` package
- Environment variable: `DATABASE_URL`

**UI Component Libraries:**
- Radix UI primitives (@radix-ui/react-*) for accessible, unstyled components
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- Lucide React for iconography

**Form Handling:**
- React Hook Form for form state management
- @hookform/resolvers for Zod schema integration
- date-fns for date manipulation and formatting

**Development Tools:**
- Replit-specific plugins for Vite (runtime error overlay, cartographer, dev banner)
- Drizzle Kit for database migrations
- ESBuild for server-side bundling

**Typography:** Google Fonts integration for Poppins font family

**Session Management:** connect-pg-simple for PostgreSQL-backed session storage (referenced but not fully implemented in visible code)