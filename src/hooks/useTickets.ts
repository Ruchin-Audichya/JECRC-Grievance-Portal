import { useState, useEffect } from 'react';
import { Ticket, TicketMessage } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useTickets() {
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchTickets();
    } else {
      setTickets([]);
      setMessages([]);
      setIsLoading(false);
    }
  }, [user, profile]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: "Error loading tickets",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Transform the data to match the expected interface
        const transformedTickets = data?.map(ticket => ({
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          location: ticket.location,
          createdBy: ticket.created_by,
          assignedTo: ticket.assigned_to,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          attachments: ticket.attachments || [],
        })) || [];
        
        setTickets(transformedTickets);
      }
    } catch (error: any) {
      console.error('Error in fetchTickets:', error);
      toast({
        title: "Error loading tickets",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error loading messages",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      // Transform the data to match the expected interface
      const transformedMessages = data?.map(message => ({
        id: message.id,
        ticketId: message.ticket_id,
        userId: message.user_id,
        message: message.message,
        isInternal: message.is_internal,
        createdAt: message.created_at,
        attachments: message.attachments || [],
      })) || [];

      setMessages(prev => [
        ...prev.filter(msg => msg.ticketId !== ticketId),
        ...transformedMessages
      ]);

      return transformedMessages;
    } catch (error: any) {
      console.error('Error in fetchMessages:', error);
      toast({
        title: "Error loading messages",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return [];
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to create tickets');
      }

      // Transform the data to match database schema
      const dbTicketData = {
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        status: ticketData.status,
        location: ticketData.location,
        created_by: user.id,
        assigned_to: ticketData.assignedTo || null,
        attachments: ticketData.attachments || [],
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert([dbTicketData])
        .select()
        .single();

      if (error) {
        console.error('Error creating ticket:', error);
        toast({
          title: "Error creating ticket",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Transform back to interface format
      const newTicket: Ticket = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        location: data.location,
        createdBy: data.created_by,
        assignedTo: data.assigned_to,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        attachments: data.attachments || [],
      };

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'create',
        p_resource_type: 'ticket',
        p_resource_id: data.id,
        p_details: { title: data.title, category: data.category }
      });

      setTickets(prev => [newTicket, ...prev]);
      
      toast({
        title: "Ticket created successfully",
        description: `Ticket "${newTicket.title}" has been created.`,
      });

      return newTicket;
    } catch (error: any) {
      console.error('Error in createTicket:', error);
      throw error;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', ticketId);

      if (error) {
        console.error('Error updating ticket status:', error);
        toast({
          title: "Error updating ticket",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'update',
        p_resource_type: 'ticket',
        p_resource_id: ticketId,
        p_details: { status }
      });

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket
        )
      );

      toast({
        title: "Ticket updated",
        description: `Ticket status changed to ${status}.`,
      });
    } catch (error: any) {
      console.error('Error in updateTicketStatus:', error);
    }
  };

  const updateTicketPriority = async (ticketId: string, priority: Ticket['priority']) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ priority })
        .eq('id', ticketId);

      if (error) {
        console.error('Error updating ticket priority:', error);
        toast({
          title: "Error updating ticket",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'update',
        p_resource_type: 'ticket',
        p_resource_id: ticketId,
        p_details: { priority }
      });

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, priority, updatedAt: new Date().toISOString() }
            : ticket
        )
      );

      toast({
        title: "Ticket updated",
        description: `Ticket priority changed to ${priority}.`,
      });
    } catch (error: any) {
      console.error('Error in updateTicketPriority:', error);
    }
  };

  const assignTicket = async (ticketId: string, assignedTo: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ assigned_to: assignedTo })
        .eq('id', ticketId);

      if (error) {
        console.error('Error assigning ticket:', error);
        toast({
          title: "Error assigning ticket",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'update',
        p_resource_type: 'ticket',
        p_resource_id: ticketId,
        p_details: { assigned_to: assignedTo }
      });

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, assignedTo, updatedAt: new Date().toISOString() }
            : ticket
        )
      );

      toast({
        title: "Ticket assigned",
        description: "Ticket has been assigned successfully.",
      });
    } catch (error: any) {
      console.error('Error in assignTicket:', error);
    }
  };

  const addMessage = async (message: Omit<TicketMessage, 'id' | 'createdAt'>) => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to add messages');
      }

      // Transform the data to match database schema
      const dbMessageData = {
        ticket_id: message.ticketId,
        user_id: user.id,
        message: message.message,
        is_internal: message.isInternal,
        attachments: message.attachments || [],
      };

      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([dbMessageData])
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        toast({
          title: "Error adding message",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Transform back to interface format
      const newMessage: TicketMessage = {
        id: data.id,
        ticketId: data.ticket_id,
        userId: data.user_id,
        message: data.message,
        isInternal: data.is_internal,
        createdAt: data.created_at,
        attachments: data.attachments || [],
      };

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'create',
        p_resource_type: 'message',
        p_resource_id: data.id,
        p_details: { ticket_id: message.ticketId, is_internal: message.isInternal }
      });

      setMessages(prev => [...prev, newMessage]);

      toast({
        title: "Message added",
        description: "Your message has been added to the ticket.",
      });

      return newMessage;
    } catch (error: any) {
      console.error('Error in addMessage:', error);
      throw error;
    }
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId);

      if (error) {
        console.error('Error deleting ticket:', error);
        toast({
          title: "Error deleting ticket",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'delete',
        p_resource_type: 'ticket',
        p_resource_id: ticketId
      });

      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      setMessages(prev => prev.filter(message => message.ticketId !== ticketId));

      toast({
        title: "Ticket deleted",
        description: "Ticket has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error in deleteTicket:', error);
    }
  };

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const getTicketsByUser = (userId: string) => {
    return tickets.filter(ticket => ticket.createdBy === userId);
  };

  const getTicketsByAssignee = (userId: string) => {
    return tickets.filter(ticket => ticket.assignedTo === userId);
  };

  const getTicketsByStatus = (status: Ticket['status']) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getTicketsByCategory = (category: Ticket['category']) => {
    return tickets.filter(ticket => ticket.category === category);
  };

  const verifyAndCloseTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'closed' })
        .eq('id', ticketId);

      if (error) {
        console.error('Error closing ticket:', error);
        toast({
          title: "Error closing ticket",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'verify_and_close',
        p_resource_type: 'ticket',
        p_resource_id: ticketId,
        p_details: { status: 'closed' }
      });

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status: 'closed' as const, updatedAt: new Date().toISOString() }
            : ticket
        )
      );

      toast({
        title: "Ticket closed",
        description: "Ticket has been verified and closed successfully.",
      });
    } catch (error: any) {
      console.error('Error in verifyAndCloseTicket:', error);
    }
  };

  return {
    tickets,
    messages,
    isLoading,
    fetchTickets,
    fetchMessages,
    createTicket,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    addMessage,
    deleteTicket,
    verifyAndCloseTicket,
    getTicketById,
    getTicketsByUser,
    getTicketsByAssignee,
    getTicketsByStatus,
    getTicketsByCategory,
  };
}