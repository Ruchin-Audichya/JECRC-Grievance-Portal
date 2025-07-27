export type UserRole = 'student' | 'staff' | 'resolver' | 'admin';

export type TicketStatus = 'submitted' | 'under-review' | 'action-taken' | 'resolved' | 'appealed';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketCategory = 'IT' | 'Housekeeping' | 'Academic' | 'Infrastructure' | 'Transport' | 'Other';

// Legacy User interface for compatibility
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  createdAt: string;
}

// New Profile interface for database
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  location: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
  attachments?: string[];
}

export interface AuthContextType {
  user: any | null; // Supabase User type
  session: any | null; // Supabase Session type
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}