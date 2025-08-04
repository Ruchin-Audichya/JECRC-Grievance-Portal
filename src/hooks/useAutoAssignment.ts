import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAutoAssignment() {
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const getAvailableResolvers = async () => {
    const { data: resolvers, error } = await supabase
      .from('profiles')
      .select('user_id, name')
      .eq('role', 'resolver');

    if (error) throw error;
    return resolvers;
  };

  const getResolverWorkload = async (resolverId: string) => {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('id')
      .eq('assigned_to', resolverId)
      .in('status', ['open', 'in-progress']);

    if (error) throw error;
    return tickets?.length || 0;
  };

  const assignTicketAutomatically = async (ticketId: string, category: string) => {
    try {
      setIsAssigning(true);

      // Get all available resolvers
      const resolvers = await getAvailableResolvers();
      
      if (!resolvers || resolvers.length === 0) {
        throw new Error('No resolvers available for assignment');
      }

      // Calculate workload for each resolver
      const resolversWithWorkload = await Promise.all(
        resolvers.map(async (resolver) => {
          const workload = await getResolverWorkload(resolver.user_id);
          return { ...resolver, workload };
        })
      );

      // Find resolver with least workload
      const selectedResolver = resolversWithWorkload.reduce((prev, current) =>
        prev.workload <= current.workload ? prev : current
      );

      // Assign ticket to selected resolver
      const { error: assignError } = await supabase
        .from('tickets')
        .update({
          assigned_to: selectedResolver.user_id,
          status: 'in-progress'
        })
        .eq('id', ticketId);

      if (assignError) throw assignError;

      // Create notification for the assigned resolver
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedResolver.user_id,
          ticket_id: ticketId,
          title: 'New Ticket Assigned',
          message: `You have been automatically assigned a new ${category} ticket`,
          type: 'assignment'
        });

      // Log the assignment activity
      await supabase.rpc('log_activity', {
        p_action: 'auto_assign_ticket',
        p_resource_type: 'ticket',
        p_resource_id: ticketId,
        p_details: {
          assigned_to: selectedResolver.user_id,
          assigned_to_name: selectedResolver.name,
          workload: selectedResolver.workload,
          category
        }
      });

      toast({
        title: "Ticket Auto-Assigned",
        description: `Ticket automatically assigned to ${selectedResolver.name}`,
      });

      return {
        success: true,
        assignedTo: selectedResolver
      };

    } catch (error: any) {
      toast({
        title: "Auto-Assignment Failed",
        description: error.message || 'Failed to auto-assign ticket',
        variant: "destructive",
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsAssigning(false);
    }
  };

  const reassignTicket = async (ticketId: string, fromResolverId: string, toResolverId: string) => {
    try {
      setIsAssigning(true);

      // Update ticket assignment
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ assigned_to: toResolverId })
        .eq('id', ticketId);

      if (updateError) throw updateError;

      // Get resolver names for notifications
      const { data: resolvers } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', [fromResolverId, toResolverId]);

      const fromResolver = resolvers?.find(r => r.user_id === fromResolverId);
      const toResolver = resolvers?.find(r => r.user_id === toResolverId);

      // Notify new assignee
      await supabase
        .from('notifications')
        .insert({
          user_id: toResolverId,
          ticket_id: ticketId,
          title: 'Ticket Reassigned to You',
          message: `A ticket has been reassigned to you from ${fromResolver?.name}`,
          type: 'reassignment'
        });

      // Log the reassignment
      await supabase.rpc('log_activity', {
        p_action: 'reassign_ticket',
        p_resource_type: 'ticket',
        p_resource_id: ticketId,
        p_details: {
          from_resolver: fromResolverId,
          to_resolver: toResolverId,
          from_name: fromResolver?.name,
          to_name: toResolver?.name
        }
      });

      toast({
        title: "Ticket Reassigned",
        description: `Ticket reassigned to ${toResolver?.name}`,
      });

      return { success: true };

    } catch (error: any) {
      toast({
        title: "Reassignment Failed",
        description: error.message || 'Failed to reassign ticket',
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    assignTicketAutomatically,
    reassignTicket,
    isAssigning
  };
}