# JECRC SolveIt - Technical Documentation

## 🏗️ Complete Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | Core UI framework |
| TypeScript | Latest | Type safety & development experience |
| Vite | Latest | Build tool & dev server |
| Tailwind CSS | Latest | Utility-first CSS framework |
| Shadcn/ui | Latest | Accessible component library |
| React Router DOM | 6.26.2 | Client-side routing |
| TanStack Query | 5.56.2 | Server state management |
| React Hook Form | 7.53.0 | Form handling |
| Zod | 3.23.8 | Schema validation |
| Lucide React | 0.462.0 | Icon library |
| Recharts | 2.12.7 | Data visualization |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service platform |
| PostgreSQL | Primary database |
| PostgREST | Auto-generated REST API |
| Row Level Security | Database security |
| Supabase Auth | User authentication |
| Supabase Storage | File storage |
| Supabase Edge Functions | Serverless functions |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript | Static type checking |
| Vite | Development server |
| Bun | Package manager |

## 🗂️ Project Architecture

### Folder Structure Explained
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base Shadcn/ui components
│   │   ├── button.tsx   # Button component with variants
│   │   ├── card.tsx     # Card layout component
│   │   ├── input.tsx    # Form input component
│   │   └── ...          # Other UI primitives
│   ├── Header.tsx       # Main application header
│   ├── AppSidebar.tsx   # Navigation sidebar
│   ├── HeroSection.tsx  # Landing page hero
│   └── ...              # Feature-specific components
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── hooks/               # Custom React hooks
│   ├── useTickets.ts    # Ticket CRUD operations
│   ├── useUsers.ts      # User management
│   ├── useNotifications.ts # Notification system
│   └── ...              # Other business logic hooks
├── pages/               # Page-level components
│   ├── Auth.tsx         # Authentication (login/signup)
│   ├── Demo.tsx         # Demo portal for testing
│   ├── Dashboard.tsx    # Main user dashboard
│   ├── CreateTicket.tsx # Ticket creation form
│   └── ...              # Other pages
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
├── lib/                 # Utility functions
│   └── utils.ts         # Helper functions
└── integrations/        # External service integrations
    └── supabase/        # Supabase configuration
        ├── client.ts    # Supabase client setup
        └── types.ts     # Auto-generated DB types
```

## 🗃️ Database Design

### Tables & Relationships
```sql
-- User profiles with role-based access
profiles (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES auth.users,
  name: TEXT,
  role: user_role (student|resolver|admin),
  department: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- Support tickets
tickets (
  id: UUID PRIMARY KEY,
  title: TEXT,
  description: TEXT,
  category: ticket_category,
  priority: ticket_priority,
  status: ticket_status,
  location: TEXT,
  created_by: UUID REFERENCES profiles(user_id),
  assigned_to: UUID REFERENCES profiles(user_id),
  attachments: TEXT[],
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  resolved_at: TIMESTAMP
)

-- Ticket communication
ticket_messages (
  id: UUID PRIMARY KEY,
  ticket_id: UUID REFERENCES tickets,
  user_id: UUID REFERENCES profiles(user_id),
  message: TEXT,
  is_internal: BOOLEAN,
  attachments: TEXT[],
  created_at: TIMESTAMP
)

-- User notifications
notifications (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES profiles(user_id),
  ticket_id: UUID REFERENCES tickets,
  title: TEXT,
  message: TEXT,
  type: TEXT,
  read: BOOLEAN DEFAULT FALSE,
  created_at: TIMESTAMP
)

-- System audit logs
activity_logs (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES profiles(user_id),
  action: TEXT,
  resource_type: TEXT,
  resource_id: UUID,
  details: JSONB,
  ip_address: INET,
  user_agent: TEXT,
  created_at: TIMESTAMP
)
```

### Security Policies (RLS)
```sql
-- Students can only see their own tickets
CREATE POLICY "Users can view their own tickets" 
ON tickets FOR SELECT 
USING (auth.uid() = created_by OR auth.uid() = assigned_to OR is_resolver_or_admin(auth.uid()));

-- Only resolvers and admins can update tickets
CREATE POLICY "Resolvers and admins can update tickets" 
ON tickets FOR UPDATE 
USING (is_resolver_or_admin(auth.uid()) OR auth.uid() = created_by);

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);
```

## 🔐 Authentication Flow

### Sign Up Process
1. User fills registration form with JECRC details
2. Supabase creates auth.users record
3. Trigger creates corresponding profiles record
4. Email verification (if enabled)
5. User can access role-based features

### Sign In Process
1. User enters email/password
2. Supabase validates credentials
3. JWT token issued with session
4. Profile data fetched and cached
5. User redirected to dashboard

### Role-Based Access
```typescript
// Role hierarchy
type UserRole = 'student' | 'resolver' | 'admin';

// Permission checks
const canViewAllTickets = (role: UserRole) => 
  role === 'resolver' || role === 'admin';

const canManageUsers = (role: UserRole) => 
  role === 'admin';
```

## 🚀 Deployment Architecture

### Development Environment
- **Local Development**: Vite dev server on localhost:5173
- **Database**: Supabase hosted PostgreSQL
- **Authentication**: Supabase Auth service
- **File Storage**: Supabase Storage

### Production Environment
- **Frontend Hosting**: Vercel/Netlify (static deployment)
- **Backend**: Supabase (fully managed)
- **CDN**: Automatic via hosting provider
- **Domain**: Custom domain configuration

### Environment Configuration
```typescript
// Supabase configuration
const SUPABASE_URL = "https://hhofvgpwjkygshussumk.supabase.co";
const SUPABASE_ANON_KEY = "[PUBLIC_ANON_KEY]";

// Client initialization
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

## 🛠️ Development Workflow

### Code Organization
- **Component-driven development** with Shadcn/ui
- **Custom hooks** for business logic
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Context providers** for state management

### State Management
```typescript
// Authentication context
const AuthContext = createContext<AuthContextType>();

// Ticket management hook
const useTickets = () => {
  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets
  });
  return { tickets };
};
```

### API Integration
```typescript
// Supabase queries
const fetchTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

## 🔧 Customization Guide

### Adding New Features
1. **Database**: Add tables/columns via Supabase
2. **Types**: Update TypeScript interfaces
3. **Hooks**: Create custom hooks for API calls
4. **Components**: Build UI components
5. **Pages**: Create page components
6. **Routing**: Update route configuration

### Styling System
```css
/* Design tokens in index.css */
:root {
  --primary: 220 90% 56%;
  --secondary: 210 40% 98%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
}

/* Component styling with Tailwind */
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}
```

### Security Best Practices
- **Never expose secrets** in client-side code
- **Use RLS policies** for data access control
- **Validate inputs** on both client and server
- **Sanitize user content** to prevent XSS
- **Use HTTPS** for all communications

## 🐛 Debugging Guide

### Common Issues & Solutions
1. **Build Errors**: Check TypeScript types match database schema
2. **Auth Issues**: Verify Supabase configuration
3. **Permission Errors**: Review RLS policies
4. **Styling Issues**: Check Tailwind configuration

### Debugging Tools
- **Browser DevTools**: Network, Console, React DevTools
- **Supabase Dashboard**: Database, Auth, Logs
- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality issues

## 📈 Performance Optimization

### Frontend Optimizations
- **Code splitting** with React.lazy()
- **Image optimization** with proper formats
- **Bundle analysis** with Vite bundle analyzer
- **Caching strategies** with TanStack Query

### Database Optimizations
- **Proper indexing** on frequently queried columns
- **Query optimization** with efficient joins
- **Connection pooling** via Supabase
- **Real-time subscriptions** for live updates

## 🔒 Security Considerations

### Data Protection
- **Encryption at rest** via Supabase
- **Encryption in transit** via HTTPS
- **Input sanitization** to prevent injection
- **Output encoding** to prevent XSS

### Access Control
- **Role-based permissions** at database level
- **JWT token validation** for API requests
- **Session management** with auto-refresh
- **Audit logging** for security monitoring

---

This documentation provides the complete technical foundation for understanding, maintaining, and extending the JECRC SolveIt system.