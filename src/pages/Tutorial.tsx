import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  CheckCircle, 
  Book, 
  Users, 
  Settings, 
  TicketIcon as Ticket,
  ChevronRight,
  Code,
  Database,
  Shield,
  Zap
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  content: string;
}

interface TutorialSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  steps: TutorialStep[];
}

const tutorialSections: TutorialSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: PlayCircle,
    description: 'Learn the basics of navigating and using the IT support system',
    steps: [
      {
        id: 'login',
        title: 'Login to the System',
        description: 'Access your account and understand user roles',
        completed: false,
        content: `
**How to Login:**
1. Navigate to the login page
2. Enter your JECRC email address
3. Use the default password: "password123"
4. Click "Sign In"

**User Roles:**
- **Student**: Can create and track tickets
- **Resolver**: Can view and resolve tickets
- **Admin**: Full system access including user management

**Demo Accounts:**
- Student: student@jecrcu.edu.in
- Resolver: resolver@jecrcu.edu.in  
- Admin: admin@jecrcu.edu.in
        `
      },
      {
        id: 'dashboard',
        title: 'Understanding the Dashboard',
        description: 'Navigate the main interface and key features',
        completed: false,
        content: `
**Dashboard Overview:**
- **Ticket Statistics**: View open, in-progress, and resolved tickets
- **Recent Activity**: See latest ticket updates and system events
- **Quick Actions**: Create new tickets or access frequently used features
- **Navigation**: Use the sidebar or header menu to access different sections

**Key Metrics:**
- Total tickets created
- Resolution time averages
- Priority distribution
- User activity levels
        `
      },
      {
        id: 'navigation',
        title: 'System Navigation',
        description: 'Learn to use menus, sidebar, and search features',
        completed: false,
        content: `
**Navigation Elements:**
- **Header Menu**: Quick access to main features
- **Sidebar**: Detailed navigation with collapsible sections
- **Breadcrumbs**: Track your current location
- **Search**: Find tickets, users, or documentation

**Keyboard Shortcuts:**
- Ctrl/Cmd + K: Open search
- Ctrl/Cmd + N: Create new ticket
- Esc: Close modals or dialogs
        `
      }
    ]
  },
  {
    id: 'ticket-management',
    title: 'Ticket Management',
    icon: Ticket,
    description: 'Master ticket creation, tracking, and resolution processes',
    steps: [
      {
        id: 'create-ticket',
        title: 'Creating a Ticket',
        description: 'Step-by-step ticket creation process',
        completed: false,
        content: `
**Creating a New Ticket:**
1. Click "Create Ticket" from dashboard or sidebar
2. Fill in required information:
   - **Title**: Clear, descriptive summary
   - **Description**: Detailed explanation of the issue
   - **Category**: Select appropriate category (Hardware, Software, Network, etc.)
   - **Priority**: Choose urgency level (Low, Medium, High, Critical)
3. Attach files if needed (screenshots, documents)
4. Submit the ticket

**Best Practices:**
- Use clear, specific titles
- Include steps to reproduce the issue
- Attach relevant screenshots or error messages
- Select appropriate priority level
        `
      },
      {
        id: 'track-tickets',
        title: 'Tracking Tickets',
        description: 'Monitor ticket status and updates',
        completed: false,
        content: `
**Ticket Status Types:**
- **Open**: Newly created, awaiting assignment
- **In Progress**: Being worked on by IT staff
- **Resolved**: Issue fixed, pending user confirmation
- **Closed**: Completed and confirmed by user

**Tracking Features:**
- View all your tickets on the dashboard
- Filter by status, priority, or date
- Receive notifications for status updates
- Add comments or additional information
        `
      },
      {
        id: 'resolution',
        title: 'Ticket Resolution',
        description: 'Understanding the resolution process',
        completed: false,
        content: `
**Resolution Process:**
1. **Assignment**: Ticket assigned to appropriate resolver
2. **Investigation**: IT staff analyzes and diagnoses the issue
3. **Action**: Problem is addressed or solution implemented
4. **Testing**: Solution is verified to work correctly
5. **Closure**: User confirms issue is resolved

**User Actions:**
- Provide additional information when requested
- Test proposed solutions
- Confirm when issue is resolved
- Rate the support experience
        `
      }
    ]
  },
  {
    id: 'user-roles',
    title: 'User Roles & Permissions',
    icon: Users,
    description: 'Understand different user types and their capabilities',
    steps: [
      {
        id: 'student-role',
        title: 'Student Role',
        description: 'Student user capabilities and limitations',
        completed: false,
        content: `
**Student Permissions:**
- Create new support tickets
- View and track own tickets
- Add comments to own tickets
- Upload attachments
- Update profile information

**Student Dashboard Features:**
- Personal ticket statistics
- Recent ticket activity
- Quick ticket creation
- FAQ and help resources

**Limitations:**
- Cannot view other users' tickets
- Cannot access admin functions
- Cannot resolve tickets
        `
      },
      {
        id: 'resolver-role',
        title: 'Resolver Role',
        description: 'IT staff resolver capabilities',
        completed: false,
        content: `
**Resolver Permissions:**
- View all open tickets
- Update ticket status
- Add resolution comments
- Assign tickets to themselves
- Access user information for support

**Resolver Tools:**
- Ticket queue management
- Priority-based filtering
- User communication tools
- Resolution tracking
- Performance metrics

**Responsibilities:**
- Respond to tickets promptly
- Provide clear solutions
- Update ticket status accurately
- Maintain professional communication
        `
      },
      {
        id: 'admin-role',
        title: 'Admin Role',
        description: 'Administrative functions and system management',
        completed: false,
        content: `
**Admin Permissions:**
- Full system access
- User management (create, edit, delete)
- System configuration
- View all tickets and users
- Access system logs and analytics

**Admin Features:**
- User role assignment
- System monitoring
- Report generation
- Backup and maintenance
- Security settings

**Admin Dashboard:**
- System-wide statistics
- User activity monitoring
- Performance metrics
- Alert management
        `
      }
    ]
  },
  {
    id: 'system-features',
    title: 'Advanced Features',
    icon: Settings,
    description: 'Explore advanced system capabilities and integrations',
    steps: [
      {
        id: 'notifications',
        title: 'Notification System',
        description: 'Stay updated with real-time notifications',
        completed: false,
        content: `
**Notification Types:**
- Ticket status updates
- New ticket assignments (for resolvers)
- System announcements
- Deadline reminders

**Notification Channels:**
- In-app notifications (bell icon)
- Email notifications
- Dashboard alerts
- Mobile push notifications (if enabled)

**Managing Notifications:**
- Toggle notification types in settings
- Set quiet hours
- Configure email preferences
- Mark notifications as read
        `
      },
      {
        id: 'file-upload',
        title: 'File Upload & Management',
        description: 'Handle attachments and file sharing',
        completed: false,
        content: `
**Supported File Types:**
- Images: JPG, PNG, GIF, BMP
- Documents: PDF, DOC, DOCX, TXT
- Archives: ZIP, RAR
- Logs: LOG, TXT files

**Upload Guidelines:**
- Maximum file size: 10MB per file
- Maximum 5 files per ticket
- Use descriptive filenames
- Compress large files when possible

**File Security:**
- All uploads are scanned for malware
- Files are encrypted during storage
- Access restricted to authorized users
- Automatic deletion after ticket closure (optional)
        `
      },
      {
        id: 'search-filter',
        title: 'Search & Filtering',
        description: 'Find information quickly and efficiently',
        completed: false,
        content: `
**Search Capabilities:**
- Global search across tickets, users, and content
- Advanced filtering options
- Saved search queries
- Quick filters for common searches

**Filter Options:**
- By date range
- By ticket status
- By priority level
- By category
- By assigned user

**Search Tips:**
- Use keywords from ticket titles or descriptions
- Combine multiple filters for precise results
- Save frequently used filter combinations
- Use wildcards (*) for partial matches
        `
      }
    ]
  }
];

const techStackInfo = {
  frontend: {
    title: "Frontend Technologies",
    icon: Code,
    items: [
      { name: "React 18", description: "Modern JavaScript library for building user interfaces" },
      { name: "TypeScript", description: "Type-safe JavaScript for better development experience" },
      { name: "Vite", description: "Fast build tool and development server" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework for styling" },
      { name: "Shadcn/ui", description: "High-quality React components built on Radix UI" },
      { name: "React Router", description: "Client-side routing for single-page applications" },
      { name: "React Query", description: "Data fetching and caching library" },
      { name: "React Hook Form", description: "Performant forms with easy validation" }
    ]
  },
  backend: {
    title: "Backend Integration",
    icon: Database,
    items: [
      { name: "Supabase Ready", description: "Prepared for Supabase backend integration" },
      { name: "RESTful API", description: "Standard HTTP API endpoints for data operations" },
      { name: "Real-time Updates", description: "WebSocket connections for live notifications" },
      { name: "File Storage", description: "Secure file upload and management system" },
      { name: "Authentication", description: "JWT-based user authentication system" },
      { name: "Database Schema", description: "PostgreSQL database with proper relationships" }
    ]
  },
  security: {
    title: "Security Features",
    icon: Shield,
    items: [
      { name: "Role-based Access", description: "Multi-level user permissions system" },
      { name: "Input Validation", description: "Client and server-side data validation" },
      { name: "File Security", description: "Malware scanning and file type validation" },
      { name: "HTTPS Only", description: "Encrypted communication in production" },
      { name: "XSS Protection", description: "Cross-site scripting prevention" },
      { name: "CSRF Protection", description: "Cross-site request forgery prevention" }
    ]
  },
  deployment: {
    title: "Deployment & DevOps",
    icon: Zap,
    items: [
      { name: "Docker Ready", description: "Containerized application for easy deployment" },
      { name: "Environment Config", description: "Separate configurations for dev/staging/prod" },
      { name: "CI/CD Pipeline", description: "Automated testing and deployment workflows" },
      { name: "Health Monitoring", description: "Application performance monitoring" },
      { name: "Error Logging", description: "Comprehensive error tracking and reporting" },
      { name: "Backup Strategy", description: "Automated database and file backups" }
    ]
  }
};

export default function Tutorial() {
  const [activeSection, setActiveSection] = useState(tutorialSections[0].id);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const currentSection = tutorialSections.find(section => section.id === activeSection);
  const totalSteps = tutorialSections.reduce((acc, section) => acc + section.steps.length, 0);
  const completedCount = completedSteps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Tutorial & Documentation</h1>
        <p className="text-muted-foreground">Complete guide for using the IT support system</p>
        
        <div className="mt-4 p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{totalSteps} steps completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {tutorialSections.map((section) => {
            const Icon = section.icon;
            const sectionCompleted = section.steps.filter(step => completedSteps.includes(step.id)).length;
            return (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {sectionCompleted}/{section.steps.length}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tutorialSections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Steps List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <section.icon className="h-5 w-5" />
                      {section.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.steps.map((step, index) => (
                        <Card 
                          key={step.id}
                          className={`p-3 cursor-pointer transition-colors ${
                            completedSteps.includes(step.id) 
                              ? 'bg-success/10 border-success' 
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => toggleStepCompletion(step.id)}
                        >
                          <div className="flex items-start gap-3">
                            {completedSteps.includes(step.id) ? (
                              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-muted-foreground mt-0.5 flex items-center justify-center">
                                <span className="text-xs">{index + 1}</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{step.title}</h4>
                              <p className="text-xs text-muted-foreground">{step.description}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step Content */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] overflow-hidden">
                  <CardHeader>
                    <CardTitle>Tutorial Content</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-auto">
                    {currentSection && (
                      <div className="space-y-6">
                        {currentSection.steps.map((step) => (
                          <div key={step.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-center gap-2 mb-3">
                              {completedSteps.includes(step.id) ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center">
                                  <span className="text-xs">
                                    {currentSection.steps.findIndex(s => s.id === step.id) + 1}
                                  </span>
                                </div>
                              )}
                              <h3 className="text-lg font-semibold">{step.title}</h3>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-accent p-4 rounded-lg">
                                {step.content}
                              </pre>
                            </div>
                            <Button
                              variant={completedSteps.includes(step.id) ? "default" : "outline"}
                              size="sm"
                              className="mt-3"
                              onClick={() => toggleStepCompletion(step.id)}
                            >
                              {completedSteps.includes(step.id) ? "Completed" : "Mark as Complete"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Tech Stack Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Technical Stack & Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(techStackInfo).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {info.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}