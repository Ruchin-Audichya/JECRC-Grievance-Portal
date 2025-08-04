import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: 'student' | 'resolver' | 'admin';
  department?: string;
  created_at: string;
  updated_at: string;
}

export function useUsers() {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchUsers();
    } else {
      setUsers([]);
      setIsLoading(false);
    }
  }, [user, profile]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error loading users",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUsers(data || []);
      }
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error loading users",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([userData])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating user",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'create',
        p_resource_type: 'user',
        p_resource_id: data.id,
        p_details: { name: data.name, role: data.role }
      });

      setUsers(prev => [data, ...prev]);
      toast({
        title: "User created successfully",
        description: `User "${data.name}" has been created.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        toast({
          title: "Error updating user",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'update',
        p_resource_type: 'user',
        p_resource_id: userId,
        p_details: updates
      });

      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, ...updates }
            : user
        )
      );

      toast({
        title: "User updated",
        description: "User has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        toast({
          title: "Error deleting user",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'delete',
        p_resource_type: 'user',
        p_resource_id: userId
      });

      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
    }
  };

  // Helper functions
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: UserProfile['role']) => {
    return users.filter(user => user.role === role);
  };

  const getUsersByDepartment = (department: string) => {
    return users.filter(user => user.department === department);
  };

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
    getUsersByDepartment,
  };
}