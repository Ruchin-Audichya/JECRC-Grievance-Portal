import { supabase } from '@/integrations/supabase/client';

export const createSampleTickets = async (userId: string, userRole: string) => {
  try {
    const sampleTickets = [
      {
        title: 'WiFi Connection Issues in Library',
        description: 'The WiFi connection is very slow and keeps disconnecting in the main library building. Students are unable to access online resources for their research work.',
        category: 'IT' as const,
        priority: 'high' as const,
        status: 'open' as const,
        location: 'Main Library - Ground Floor',
        created_by: userId,
      },
      {
        title: 'Broken Chair in Classroom 301',
        description: 'One of the chairs in classroom 301 is broken and needs immediate replacement. It poses a safety risk to students.',
        category: 'Infrastructure' as const,
        priority: 'medium' as const,
        status: 'in-progress' as const,
        location: 'Academic Block A - Room 301',
        created_by: userId,
      },
      {
        title: 'Air Conditioning Not Working',
        description: 'The air conditioning unit in the computer lab is not functioning properly. The room temperature is affecting the performance of computers and student comfort.',
        category: 'Housekeeping' as const,
        priority: 'high' as const,
        status: 'resolved' as const,
        location: 'Computer Lab - Block B',
        created_by: userId,
      },
      {
        title: 'Projector Display Issues',
        description: 'The projector in lecture hall 205 is showing blurry images and has connectivity issues with laptops.',
        category: 'IT' as const,
        priority: 'medium' as const,
        status: 'open' as const,
        location: 'Lecture Hall 205',
        created_by: userId,
      }
    ];

    // Only create tickets for student, resolver, and admin roles
    if (userRole === 'student' || userRole === 'resolver' || userRole === 'admin') {
      const { data, error } = await supabase
        .from('tickets')
        .insert(sampleTickets.slice(0, userRole === 'admin' ? 4 : 2))
        .select();

      if (error) {
        console.error('Error creating sample tickets:', error);
        return { success: false, error };
      }

      // Add sample messages to tickets
      if (data && data.length > 0) {
        const sampleMessages = [
          {
            ticket_id: data[0].id,
            user_id: userId,
            message: 'I have reported this issue to the network team. They will investigate the connectivity problems.',
            is_internal: false,
          },
          {
            ticket_id: data[1]?.id,
            user_id: userId,
            message: 'Maintenance team has been notified. They will replace the chair by tomorrow.',
            is_internal: false,
          }
        ];

        await supabase
          .from('ticket_messages')
          .insert(sampleMessages.filter(msg => msg.ticket_id));
      }

      return { success: true, tickets: data };
    }

    return { success: true, tickets: [] };
  } catch (error) {
    console.error('Error in createSampleTickets:', error);
    return { success: false, error };
  }
};

export const setupDemoEnvironment = async (userId: string, userRole: string) => {
  try {
    // Create sample tickets
    const ticketResult = await createSampleTickets(userId, userRole);
    
    if (!ticketResult.success) {
      console.error('Failed to create sample tickets:', ticketResult.error);
    }

    // Log the demo setup
    await supabase.rpc('log_activity', {
      p_action: 'demo_setup',
      p_resource_type: 'user',
      p_resource_id: userId,
      p_details: { role: userRole, tickets_created: ticketResult.tickets?.length || 0 }
    });

    return { success: true };
  } catch (error) {
    console.error('Error setting up demo environment:', error);
    return { success: false, error };
  }
};