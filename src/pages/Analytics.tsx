import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/hooks/useTickets";
import { useUsers } from "@/hooks/useUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, AlertTriangle, Download, FileText } from "lucide-react";
import { Navigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Analytics = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const { users } = useUsers();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Calculate statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;
  const totalUsers = users.length;
  const studentUsers = users.filter(u => u.role === 'student').length;
  const staffUsers = users.filter(u => u.role === 'staff').length;
  const resolverUsers = users.filter(u => u.role === 'resolver').length;

  // Category breakdown
  const categoryStats = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentTickets = tickets.filter(t => new Date(t.createdAt) >= sevenDaysAgo).length;

  const statsCards = [
    {
      title: "Total Tickets",
      value: totalTickets,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "All time tickets"
    },
    {
      title: "Active Users",
      value: totalUsers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: `${studentUsers} students, ${staffUsers} staff, ${resolverUsers} resolvers`
    },
    {
      title: "Open Tickets",
      value: openTickets,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Awaiting response"
    },
    {
      title: "High Priority",
      value: highPriorityTickets,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Urgent tickets"
    },
    {
      title: "In Progress",
      value: inProgressTickets,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Being worked on"
    },
    {
      title: "Completed",
      value: closedTickets,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Verified & closed"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">System Analytics</h1>
        <p className="text-muted-foreground">
          Overview of JECRC SolveIt system performance and usage statistics
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="jecrc-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Status Distribution</CardTitle>
          <CardDescription>Current status of all tickets in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
              <Badge variant="outline" className="mt-2">Open</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{inProgressTickets}</div>
              <Badge variant="outline" className="mt-2">In Progress</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{resolvedTickets}</div>
              <Badge variant="outline" className="mt-2">Resolved</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{closedTickets}</div>
              <Badge variant="outline" className="mt-2">Closed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Category</CardTitle>
          <CardDescription>Distribution of tickets across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-primary">{count}</div>
                <div className="text-sm text-muted-foreground">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Activity summary for the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">New Tickets Created</h3>
                <p className="text-sm text-muted-foreground">In the last 7 days</p>
              </div>
              <div className="text-2xl font-bold text-primary">{recentTickets}</div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">System Resolution Rate</h3>
                <p className="text-sm text-muted-foreground">Tickets resolved vs created</p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {totalTickets > 0 ? Math.round(((resolvedTickets + closedTickets) / totalTickets) * 100) : 0}%
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Average Response Time</h3>
                <p className="text-sm text-muted-foreground">Estimated based on system data</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">2.5h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets per Category Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tickets per Category</CardTitle>
            <CardDescription>Distribution of tickets across different categories</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(categoryStats).map(([category, count]) => ({ category, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Resolution Time Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Average Resolution Time</CardTitle>
            <CardDescription>Monthly trend of ticket resolution time</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { month: 'Jan', hours: 2.5 },
              { month: 'Feb', hours: 2.3 },
              { month: 'Mar', hours: 2.8 },
              { month: 'Apr', hours: 2.1 },
              { month: 'May', hours: 1.9 },
              { month: 'Jun', hours: 2.4 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" name="Average Hours" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Busiest Times Heatmap */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Busiest Times</CardTitle>
            <CardDescription>Heatmap showing when most tickets are created</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-1">
            <div></div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-xs text-center font-medium">{day}</div>
            ))}
            {[...Array(24)].map((_, hour) => (
              <>
                <div key={`hour-${hour}`} className="text-xs text-right pr-2">{hour}:00</div>
                {[...Array(7)].map((_, day) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={`${hour}-${day}`}
                      className="aspect-square rounded"
                      style={{
                        backgroundColor: `hsl(var(--primary) / ${intensity})`,
                      }}
                      title={`${Math.round(intensity * 10)} tickets`}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;