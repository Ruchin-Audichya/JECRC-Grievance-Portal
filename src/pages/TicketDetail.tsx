import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/hooks/useTickets';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Clock, User, MapPin, AlertCircle, MessageSquare, Send, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Ticket, TicketMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ActivityLogViewer from '@/components/ActivityLogViewer';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, messages, updateTicketStatus, assignTicket, addMessage, fetchMessages, verifyAndCloseTicket } = useTickets();
  const { getUserById } = useUsers();
  const { toast } = useToast();
  
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const ticket = tickets.find(t => t.id === id);
  const ticketMessages = messages.filter(m => m.ticketId === id);

  // Fetch messages when ticket ID changes
  useEffect(() => {
    if (id && ticket) {
      fetchMessages(id);
    }
  }, [id, ticket, fetchMessages]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ticket not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || 
    (user?.role === 'resolver' && ticket.assignedTo === user.id) ||
    (user?.role === 'student' && ticket.createdBy === user.id) ||
    (user?.role === 'staff' && ticket.createdBy === user.id);

  const handleStatusChange = async (newStatus: Ticket['status']) => {
    try {
      await updateTicketStatus(ticket.id, newStatus);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAssignToSelf = async () => {
    if (user && user.role === 'resolver') {
      try {
        await assignTicket(ticket.id, user.id);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await addMessage({
        ticketId: ticket.id,
        userId: user.id,
        message: newMessage,
        isInternal: isInternal && user.role !== 'student' && user.role !== 'staff',
      });

      setNewMessage('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleVerifyAndClose = async () => {
    try {
      await verifyAndCloseTicket(ticket.id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{ticket.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Ticket #{ticket.id}</span>
                      <span>•</span>
                      <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{ticket.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{ticket.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Resolution Confirmation */}
            {ticket.status === 'resolved' && ticket.createdBy === user?.id && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Ticket Resolution Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">
                    The resolver has marked this ticket as resolved. Is your issue fixed?
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleVerifyAndClose}
                      className="gap-2"
                      variant="default"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Yes, Close Ticket
                    </Button>
                    <Button 
                      onClick={async () => {
                        await updateTicketStatus(ticket.id, 'appealed');
                        await addMessage(ticket.id, 'I am appealing this resolution as the issue is not adequately addressed.', false, user.id);
                        toast({
                          title: "Grievance Appealed",
                          description: "Your appeal has been recorded and will be reviewed by higher authorities.",
                        });
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      No, Appeal Decision
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: If no action is taken within 3 days, this ticket will automatically close.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    ticketMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.isInternal 
                            ? 'bg-warning/10 border border-warning/20' 
                            : 'bg-accent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">User #{message.userId}</span>
                            {message.isInternal && (
                              <Badge variant="outline" className="text-xs">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Message */}
                {canEdit && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-between items-center">
                        {user?.role !== 'student' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="internal"
                              checked={isInternal}
                              onChange={(e) => setIsInternal(e.target.checked)}
                            />
                            <label htmlFor="internal" className="text-sm">
                              Internal message (not visible to student)
                            </label>
                          </div>
                        )}
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {(user?.role === 'admin' || user?.role === 'resolver') && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.role === 'resolver' && !ticket.assignedTo && (
                    <Button 
                      onClick={handleAssignToSelf}
                      className="w-full"
                      variant="outline"
                    >
                      Assign to Me
                    </Button>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Status</label>
                    <Select 
                      value={ticket.status} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="action-taken">Action Taken</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="appealed">Appealed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Create Knowledge Base Article Button */}
                  {ticket.status === 'resolved' && (
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Knowledge Base Article",
                          description: "This would open a form pre-filled with this ticket's information to create a knowledge base article.",
                        });
                      }}
                      variant="outline"
                      className="w-full mt-4 gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Create Knowledge Base Article
                    </Button>
                  )}
                  
                  {/* Escalation Section */}
                  {(user?.role === 'resolver' || user?.role === 'admin') && 
                   ticket.status !== 'resolved' && ticket.status !== 'appealed' && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-sm font-medium mb-3">Escalate Grievance To:</h3>
                      <div className="space-y-3">
                        <Select
                          onValueChange={async (value) => {
                            await addMessage(
                              ticket.id, 
                              `This grievance has been escalated to ${value} for review.`, 
                              true, 
                              user.id
                            );
                            toast({
                              title: "Grievance Escalated",
                              description: `The grievance has been escalated to ${value}.`,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select escalation level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dean of Student Affairs">Dean of Student Affairs</SelectItem>
                            <SelectItem value="Academic Council">Academic Council</SelectItem>
                            <SelectItem value="University Proctor">University Proctor</SelectItem>
                            <SelectItem value="Vice Chancellor">Vice Chancellor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Verify & Close Action for Ticket Creator */}
            {ticket.status === 'resolved' && ticket.createdBy === user?.id && (
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This ticket has been marked as resolved. Please verify that your issue has been completely addressed.
                  </p>
                  <Button 
                    onClick={handleVerifyAndClose}
                    className="w-full"
                    variant="default"
                  >
                    Verify & Close Ticket
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created by</label>
                  {ticket.createdBy === 'anonymous-user' ? (
                    <span className="text-sm text-muted-foreground">Anonymous Submission</span>
                  ) : (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => {
                        setSelectedUserId(ticket.createdBy);
                        setShowUserHistory(true);
                      }}
                    >
                                            {getUserById(ticket.createdBy)?.name || `User #${ticket.createdBy}`}
                    </Button>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned to</label>
                  <p className="text-sm">
                    {ticket.assignedTo ? `User #${ticket.assignedTo}` : 'Unassigned'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm">{ticket.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <p className="text-sm capitalize">{ticket.priority}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last updated</label>
                  <p className="text-sm">{new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <ActivityLogViewer ticketId={ticket.id} maxHeight="300px" />
          </div>
        </div>

        {/* User History Dialog */}
        <Dialog open={showUserHistory} onOpenChange={setShowUserHistory}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Profile & Ticket History</DialogTitle>
            </DialogHeader>
            {selectedUserId && (() => {
              const selectedUser = getUserById(selectedUserId);
              const userTickets = tickets.filter(t => t.createdBy === selectedUserId);
              
              return (
                <div className="space-y-6">
                  {/* User Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm">{selectedUser?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Role</label>
                          <Badge variant="outline">{selectedUser?.role || 'Unknown'}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Department</label>
                          <p className="text-sm">{selectedUser?.department || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Tickets</label>
                          <p className="text-sm font-semibold">{userTickets.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ticket History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userTickets.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No tickets found for this user.
                          </p>
                        ) : (
                          userTickets.map((userTicket) => (
                            <div 
                              key={userTicket.id}
                              className="border rounded-lg p-3 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                setShowUserHistory(false);
                                navigate(`/ticket/${userTicket.id}`);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{userTicket.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {userTicket.category} • {new Date(userTicket.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={getStatusColor(userTicket.status)} className="text-xs">
                                    {userTicket.status}
                                  </Badge>
                                  <Badge variant={getPriorityColor(userTicket.priority)} className="text-xs">
                                    {userTicket.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}