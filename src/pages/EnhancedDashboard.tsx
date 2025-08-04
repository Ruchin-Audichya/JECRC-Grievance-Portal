import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/hooks/useTickets';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown,
  Calendar,
  User,
  Ticket as TicketIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Plus,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types';
import { useSidebar } from '@/components/ui/sidebar';

export default function EnhancedDashboard() {
  const { user, profile } = useAuth();
  const { tickets, getTicketsByUser, getTicketsByAssignee, getTicketsByStatus, isLoading, fetchTickets } = useTickets();
  const { getUserById } = useUsers();
  const { toggleSidebar } = useSidebar();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'priority'>('created');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get tickets based on user role - Single source of truth for live data
  const getUserTickets = () => {
    if (!user?.id) return [];
    
    switch (user?.role) {
      case 'admin':
        // Admin: Fetch all tickets from database
        return tickets;
      case 'resolver':
        // Resolver: Fetch assigned tickets OR unassigned tickets matching department
        return tickets.filter(ticket => 
          ticket.assignedTo === user.id || 
          (ticket.assignedTo === null && ticket.category === profile?.department)
        );
      case 'student':
      case 'staff':
        // Student/Staff: Fetch only tickets where createdBy matches user ID
        return tickets.filter(ticket => ticket.createdBy === user.id);
      default:
        return [];
    }
  };

  // Apply filters and search
  const filteredTickets = getUserTickets()
    .filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'submitted': return 'destructive';
      case 'under-review': return 'default';
      case 'action-taken': return 'secondary';
      case 'resolved': return 'outline';
      case 'appealed': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'submitted': return <AlertCircle className="h-4 w-4" />;
      case 'under-review': return <Clock className="h-4 w-4" />;
      case 'action-taken': return <CheckCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'appealed': return <AlertCircle className="h-4 w-4" />;
      default: return <TicketIcon className="h-4 w-4" />;
    }
  };

  // Statistics
  const userTickets = getUserTickets();
  const stats = {
    total: userTickets.length,
    submitted: userTickets.filter(t => t.status === 'submitted').length,
    underReview: userTickets.filter(t => t.status === 'under-review').length,
    actionTaken: userTickets.filter(t => t.status === 'action-taken').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length,
    appealed: userTickets.filter(t => t.status === 'appealed').length,
  };

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Sidebar Toggle Button */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleSidebar}
              className="shrink-0"
              title="Toggle Sidebar Navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <TicketIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>
                {user?.role === 'admin' && 'System Overview'}
                {user?.role === 'resolver' && 'My Assignments'}
                {(user?.role === 'student' || user?.role === 'staff') && 'My Tickets'}
              </span>
              <span className="text-primary">•</span>
              <span className="text-xl text-primary font-poppins">JECRC SolveIt</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Grievance Dashboard for {profile?.name || user?.email} • {
                profile?.role === 'admin' ? 'System Administrator' : 
                profile?.role === 'resolver' ? `${profile.department} Resolver` : 
                'Student'
              }
            </p>
            {user?.role === 'resolver' && (
              <p className="text-sm text-muted-foreground mt-2">
                🎯 Your ticket queue • {userTickets.filter(t => !t.assignedTo).length} unassigned • {userTickets.filter(t => t.assignedTo === user.id).length} assigned to you
              </p>
            )}
            </div>
          </div>
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" className="gap-2">
                  Admin Portal
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {user?.role === 'resolver' && (
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Queue ({userTickets.filter(t => !t.assignedTo).length})
                </Button>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  My Tasks ({userTickets.filter(t => t.assignedTo === user.id).length})
                </Button>
              </div>
            )}
            {(user?.role === 'student' || user?.role === 'staff' || user?.role === 'admin') && (
              <Link to="/create-ticket">
                <Button className="gap-2 jecrc-gradient hover:opacity-90 text-white shadow-lg font-semibold">
                  <Plus className="h-4 w-4" />
                  Create New Ticket
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Create Ticket Call-to-Action for Students/Staff */}
        {(user?.role === 'student' || user?.role === 'staff') && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold text-foreground mb-2">Need Help with Something?</h2>
                  <p className="text-muted-foreground">
                    Create a new ticket to get assistance from our support team. We're here to help!
                  </p>
                </div>
                <Link to="/create-ticket">
                  <Button className="jecrc-gradient hover:opacity-90 text-white shadow-lg font-semibold px-8 py-3 text-base">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Ticket
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card className="bg-blue-50 border-blue-200 mb-4">
          <CardContent className="p-4">
            <div className="text-sm text-blue-800">
              <strong>Debug Info:</strong> User: {user?.email} | Role: {user?.role} | Tickets: {userTickets.length} | Profile: {profile?.name || 'Loading...'}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Status Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Connected to Live Database • {userTickets.length} tickets loaded • 
            {user?.role === 'admin' && 'All system tickets'}
            {user?.role === 'resolver' && 'Your department queue'}
            {(user?.role === 'student' || user?.role === 'staff') && 'Your submitted tickets'}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => fetchTickets()}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Quick Access Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(user?.role === 'student' || user?.role === 'staff' || user?.role === 'admin') && (
                <Link to="/create-ticket">
                  <Button className="w-full h-20 flex-col gap-2 jecrc-btn-primary text-white shadow-lg">
                    <Plus className="h-6 w-6" />
                    Create Ticket
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 jecrc-border-accent hover:bg-primary/5">
                  <TicketIcon className="h-6 w-6" />
                  My Tickets
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 jecrc-border-accent hover:bg-primary/5">
                  <TicketIcon className="h-6 w-6" />
                  FAQ
                </Button>
              </Link>
              <Link to="/faq-chat">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 jecrc-border-accent hover:bg-primary/5">
                  <User className="h-6 w-6" />
                  Live Chat
                </Button>
              </Link>
              <Link to="/tutorial">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 jecrc-border-accent hover:bg-primary/5">
                  <Calendar className="h-6 w-6" />
                  Help
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All tickets</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.submitted}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.underReview}</div>
              <p className="text-xs text-muted-foreground">Being investigated</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Ready to close</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Taken</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.actionTaken}</div>
              <p className="text-xs text-muted-foreground">Action completed</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appealed</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.appealed}</div>
              <p className="text-xs text-muted-foreground">Under appeal</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as TicketCategory | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="IT">IT Support</SelectItem>
                  <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'created' | 'updated' | 'priority')}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Tickets ({filteredTickets.length})
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <TicketIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your filters or search query.'
                    : 'No tickets match your current view.'}
                </p>
                {(user?.role === 'student' || user?.role === 'staff') && (
                  <Link to="/create-ticket">
                    <Button className="gap-2 jecrc-btn-primary px-6 py-3 text-base">
                      <Plus className="h-5 w-5" />
                      Create Your First Ticket
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const creator = getUserById(ticket.createdBy);
                  const assignee = ticket.assignedTo ? getUserById(ticket.assignedTo) : null;
                  
                  // Resolver view with action buttons
                  if (user?.role === 'resolver') {
                    return (
                      <Card key={ticket.id} className="jecrc-card-hover jecrc-border-accent">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(ticket.status)}
                                  <h3 className="font-semibold text-foreground text-lg">
                                    {ticket.title}
                                  </h3>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={getStatusColor(ticket.status)}>
                                    {ticket.status}
                                  </Badge>
                                  <Badge variant={getPriorityColor(ticket.priority)}>
                                    {ticket.priority}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                {ticket.description}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <TicketIcon className="h-3 w-3" />
                                  <span>#{ticket.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{creator?.name || 'Unknown User'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>📍 {ticket.location}</span>
                                </div>
                              </div>

                              {/* Resolver Action Buttons */}
                              <div className="flex gap-2">
                                <Link to={`/ticket/${ticket.id}`}>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </Link>
                                {!ticket.assignedTo && (
                                  <Button size="sm" variant="default">
                                    Claim Ticket
                                  </Button>
                                )}
                                {ticket.assignedTo === user.id && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                  <Button size="sm" variant="secondary">
                                    Update Status
                                  </Button>
                                )}
                                {ticket.assignedTo === user.id && ticket.status === 'in-progress' && (
                                  <Button size="sm" variant="default">
                                    Mark Resolved
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  
                  // Standard view for students, staff, and admin
                  return (
                    <Link key={ticket.id} to={`/ticket/${ticket.id}`}>
                      <Card className="jecrc-card-hover cursor-pointer jecrc-border-accent hover:bg-accent/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(ticket.status)}
                                  <h3 className="font-semibold text-foreground text-lg">
                                    {ticket.title}
                                  </h3>
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                {ticket.description}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <TicketIcon className="h-3 w-3" />
                                  <span>#{ticket.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{creator?.name || 'Unknown User'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                                <span>📍 {ticket.location}</span>
                                {assignee && (
                                  <span>👤 Assigned to {assignee.name}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-6 items-end">
                              <Badge variant={getStatusColor(ticket.status)} className="flex items-center gap-1">
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace('-', ' ')}
                              </Badge>
                              <Badge variant={getPriorityColor(ticket.priority)}>
                                {ticket.priority} priority
                              </Badge>
                              <Badge variant="outline">
                                {ticket.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground mt-2">
                                Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}