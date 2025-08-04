import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { useTickets } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { UserRole, TicketCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Ticket, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAutoAssignment } from '@/hooks/useAutoAssignment';

export default function AdminPortal() {
  const { user, profile } = useAuth();
  const { users, createUser, updateUser, deleteUser, getUsersByRole, isLoading } = useUsers();
  const { tickets } = useTickets();
  const { assignTicketAutomatically, reassignTicket, isAssigning } = useAutoAssignment();
  const { toast } = useToast();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  
  // Form states
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: '' as UserRole | '',
    department: '',
  });
  
  // Bulk action states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [bulkUserAction, setBulkUserAction] = useState<string>('');
  const [bulkTicketAction, setBulkTicketAction] = useState<string>('');

  // Redirect if not admin
  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Analytics calculations
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  const studentCount = getUsersByRole('student').length;
  const staffCount = getUsersByRole('staff').length;
  const resolverCount = getUsersByRole('resolver').length;
  const adminCount = getUsersByRole('admin').length;

  // Ticket distribution by category
  const ticketsByCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<TicketCategory, number>);

  const handleCreateUser = () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      createUser({
        user_id: '', // This will need to be handled by the actual auth system
        name: newUserForm.name,
        role: newUserForm.role as UserRole,
        department: newUserForm.department || undefined,
      });

      toast({
        title: 'User Created',
        description: `${newUserForm.name} has been successfully created.`,
      });

      setNewUserForm({ name: '', email: '', role: '', department: '' });
      setIsCreateUserOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    updateUser(selectedUser.id, selectedUser);
    toast({
      title: 'User Updated',
      description: `${selectedUser.name} has been successfully updated.`,
    });
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    deleteUser(userId);
    toast({
      title: 'User Deleted',
      description: `${userName} has been removed from the system.`,
    });
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'resolver': return 'default';
      case 'student': return 'secondary';
      case 'staff': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Admin Portal
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, tickets, and system analytics
            </p>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
            <TabsTrigger value="escalation">Escalation Rules</TabsTrigger>
            <TabsTrigger value="routing">Routing Rules</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {studentCount} students, {staffCount} staff, {resolverCount} resolvers, {adminCount} admins
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTickets}</div>
                  <p className="text-xs text-muted-foreground">
                    {openTickets} open, {resolvedTickets} resolved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalTickets > 0 ? Math.round(((resolvedTickets + closedTickets) / totalTickets) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {resolvedTickets + closedTickets} resolved/closed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-xs text-muted-foreground">
                    Average first response time
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ticket Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span>Open</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-destructive"
                            style={{ width: `${totalTickets > 0 ? (openTickets / totalTickets) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{openTickets}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-warning" />
                        <span>In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-warning"
                            style={{ width: `${totalTickets > 0 ? (inProgressTickets / totalTickets) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{inProgressTickets}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Resolved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success"
                            style={{ width: `${totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{resolvedTickets}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tickets by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(ticketsByCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${totalTickets > 0 ? (count / totalTickets) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@jecrcu.edu.in"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Select 
                        value={newUserForm.role} 
                        onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value as UserRole }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="resolver">Resolver</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newUserForm.role === 'resolver' && (
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select 
                          value={newUserForm.department} 
                          onValueChange={(value) => setNewUserForm(prev => ({ ...prev, department: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IT">IT Support</SelectItem>
                            <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateUserOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser} className="flex-1">
                        Create User
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Bulk Actions for Users */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-4 mb-4 p-4 bg-accent rounded-lg">
                <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
                <Select value={bulkUserAction} onValueChange={setBulkUserAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                    <SelectItem value="change-role">Change Role</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
                {bulkUserAction && (
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Bulk Action",
                        description: `${bulkUserAction} action would be performed on ${selectedUsers.length} users`,
                      });
                      setSelectedUsers([]);
                      setBulkUserAction('');
                    }}
                  >
                    Apply
                  </Button>
                )}
              </div>
            )}

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(users.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(userData.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, userData.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== userData.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{userData.name}</TableCell>
                        <TableCell>{userData.user_id}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleColor(userData.role)}>
                            {userData.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{userData.department || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>{new Date(userData.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(userData);
                                setIsEditUserOpen(true);
                              }}
                              title="Edit User"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" title="Reset Password">
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reset Password</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to send a password reset email to {userData.name}?</p>
                                <div className="flex gap-2 justify-end mt-4">
                                  <Button variant="outline">Cancel</Button>
                                  <Button>Send Reset Email</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="outline"
                              title="Toggle Status"
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                            {userData.id !== user.id && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" title="Impersonate User">
                                      <User className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Impersonate User</DialogTitle>
                                    </DialogHeader>
                                    <p>You are about to log in as {userData.name}. Do you want to continue?</p>
                                    <div className="flex gap-2 justify-end mt-4">
                                      <Button variant="outline">Cancel</Button>
                                      <Button variant="destructive">Impersonate</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteUser(userData.id, userData.name)}
                                  title="Delete User"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ticket Management Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ticket Management</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    const unassignedTickets = tickets.filter(t => !t.assignedTo && t.status === 'open');
                    for (const ticket of unassignedTickets) {
                      await assignTicketAutomatically(ticket.id, ticket.category);
                    }
                  }}
                  disabled={isAssigning}
                >
                  <Zap className="h-4 w-4" />
                  {isAssigning ? 'Auto-Assigning...' : 'Auto-Assign All'}
                </Button>
              </div>
            </div>

            {/* Bulk Actions for Tickets */}
            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-4 mb-4 p-4 bg-accent rounded-lg">
                <span className="text-sm font-medium">{selectedTickets.length} tickets selected</span>
                <Select value={bulkTicketAction} onValueChange={setBulkTicketAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="change-status">Change Status</SelectItem>
                    <SelectItem value="assign">Assign to Resolver</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
                {bulkTicketAction && (
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Bulk Action",
                        description: `${bulkTicketAction} action would be performed on ${selectedTickets.length} tickets`,
                      });
                      setSelectedTickets([]);
                      setBulkTicketAction('');
                    }}
                  >
                    Apply
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTickets([...selectedTickets, ticket.id]);
                          } else {
                            setSelectedTickets(selectedTickets.filter(id => id !== ticket.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">
                          {ticket.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {ticket.description.length > 150
                            ? `${ticket.description.substring(0, 150)}...`
                            : ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Ticket #{ticket.id}</span>
                          <span>Created by User #{ticket.createdBy}</span>
                          <span>{ticket.location}</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          {ticket.assignedTo && (
                            <span>Assigned to: {users.find(u => u.user_id === ticket.assignedTo)?.name || 'Unknown'}</span>
                          )}
                        </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-2">
                          <Badge variant={ticket.status === 'open' ? 'destructive' : ticket.status === 'resolved' ? 'secondary' : 'default'}>
                            {ticket.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant={ticket.priority === 'high' ? 'destructive' : 'default'}>
                            {ticket.priority} priority
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {ticket.category}
                        </Badge>
                            <div className="flex gap-1 mt-2">
                          {!ticket.assignedTo && ticket.status === 'open' && (
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={() => assignTicketAutomatically(ticket.id, ticket.category)}
                              disabled={isAssigning}
                            >
                              <Zap className="h-3 w-3" />
                              Auto-Assign
                            </Button>
                          )}
                          {ticket.assignedTo && (
                            <Select
                              value=""
                              onValueChange={(resolverId) => {
                                if (resolverId !== ticket.assignedTo) {
                                  reassignTicket(ticket.id, ticket.assignedTo!, resolverId);
                                }
                              }}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Reassign" />
                              </SelectTrigger>
                              <SelectContent>
                                {getUsersByRole('resolver').map((resolver) => (
                                  <SelectItem key={resolver.user_id} value={resolver.user_id}>
                                    {resolver.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Escalation Rules Tab */}
          <TabsContent value="escalation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Escalation Rules</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define automatic escalation rules for high-priority tickets
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Create Rule Form */}
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Rule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Rule Name</Label>
                          <Input placeholder="e.g., Critical IT Issue Escalation" />
                        </div>
                        <div className="space-y-2">
                          <Label>Ticket Priority</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Time to Escalate (minutes)</Label>
                          <Input type="number" placeholder="15" />
                        </div>
                        <div className="space-y-2">
                          <Label>Escalation Action</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notify-admin">Notify Admin</SelectItem>
                              <SelectItem value="sms-alert">Send SMS Alert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="mt-4">Create Rule</Button>
                    </CardContent>
                  </Card>

                  {/* Rules Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Active Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rule Name</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Time to Escalate</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Critical IT Issue Escalation</TableCell>
                            <TableCell>
                              <Badge variant="destructive">Critical</Badge>
                            </TableCell>
                            <TableCell>15 minutes</TableCell>
                            <TableCell>Notify Admin</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="destructive">Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>High Priority Follow-up</TableCell>
                            <TableCell>
                              <Badge variant="default">High</Badge>
                            </TableCell>
                            <TableCell>30 minutes</TableCell>
                            <TableCell>Send SMS Alert</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="destructive">Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routing Rules Tab */}
          <TabsContent value="routing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Routing Rules</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Map ticket categories to specific resolver departments
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Create Rule Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Routing Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Routing Rule</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Ticket Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT">IT Support</SelectItem>
                              <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                              <SelectItem value="Academic">Academic</SelectItem>
                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="Transport">Transport</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Resolver Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT">IT Department</SelectItem>
                              <SelectItem value="Housekeeping">Housekeeping Department</SelectItem>
                              <SelectItem value="Academic">Academic Affairs</SelectItem>
                              <SelectItem value="Infrastructure">Infrastructure & Maintenance</SelectItem>
                              <SelectItem value="Transport">Transport Services</SelectItem>
                              <SelectItem value="General">General Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Create Rule</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Rules Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Active Routing Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Assigned Department</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>IT Support</TableCell>
                            <TableCell>IT Department</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="destructive">Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Housekeeping</TableCell>
                            <TableCell>Housekeeping Department</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="destructive">Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Academic</TableCell>
                            <TableCell>Academic Affairs</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="destructive">Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure system-wide settings and preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Admin Registration Code */}
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Registration Code</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      This code is required for new admin registrations
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input 
                        type="password" 
                        value="JECRC-ADMIN-2024" 
                        readOnly 
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ticket Categories */}
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Ticket Categories</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage available ticket categories
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['IT', 'Housekeeping', 'Academic', 'Infrastructure', 'Transport', 'Other'].map((category) => (
                        <div key={category} className="flex items-center gap-2">
                          <Input value={category} readOnly className="flex-1" />
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button className="w-full mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Default Ticket Priority */}
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Default Ticket Priority</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Set the default priority for new tickets
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.user_id}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, user_id: e.target.value } : null)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value) => setSelectedUser(prev => prev ? { ...prev, role: value as UserRole } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Staff/Faculty</SelectItem>
                      <SelectItem value="resolver">Resolver</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedUser.role === 'resolver' && (
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={selectedUser.department || ''} 
                      onValueChange={(value) => setSelectedUser(prev => prev ? { ...prev, department: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT Support</SelectItem>
                        <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditUserOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateUser} className="flex-1">
                    Update User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}