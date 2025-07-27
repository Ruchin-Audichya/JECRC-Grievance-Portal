import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket } from '@/types';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { tickets, isLoading } = useTickets();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userTickets = user?.role === 'admin' 
    ? tickets 
    : tickets.filter(ticket => 
        (user?.role === 'student' || user?.role === 'staff') 
          ? ticket.createdBy === user.id
          : ticket.assignedTo === user.id || !ticket.assignedTo
      );

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'submitted': return 'destructive';
      case 'under-review': return 'default';
      case 'action-taken': return 'secondary';
      case 'resolved': return 'outline';
      case 'appealed': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'open').length,
    inProgress: userTickets.filter(t => t.status === 'in-progress').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.name || user?.email}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.role === 'admin' && 'Manage all tickets and system overview'}
              {user?.role === 'resolver' && 'Review and resolve assigned tickets'}
              {(user?.role === 'student' || user?.role === 'staff') && 'Track your submitted tickets and create new ones'}
            </p>
          </div>
                      {(user?.role === 'student' || user?.role === 'staff' || user?.role === 'admin') && (
            <Link to="/create-ticket">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Ticket
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>
              {user?.role === 'admin' && 'All Tickets'}
              {user?.role === 'resolver' && 'Assigned Tickets'}
              {(user?.role === 'student' || user?.role === 'staff') && 'My Tickets'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tickets found.</p>
                {(user?.role === 'student' || user?.role === 'staff') && (
                  <Link to="/create-ticket">
                    <Button className="mt-4" variant="outline">
                      Create Your First Ticket
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {userTickets.slice(0, 10).map((ticket) => (
                  <Link key={ticket.id} to={`/ticket/${ticket.id}`}>
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">
                              {ticket.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {ticket.description.length > 100
                                ? `${ticket.description.substring(0, 100)}...`
                                : ticket.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{ticket.location}</span>
                              <span>•</span>
                              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Badge variant={getStatusColor(ticket.status)}>
                              {ticket.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant={getPriorityColor(ticket.priority)}>
                              {ticket.priority} priority
                            </Badge>
                            <Badge variant="outline">
                              {ticket.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}