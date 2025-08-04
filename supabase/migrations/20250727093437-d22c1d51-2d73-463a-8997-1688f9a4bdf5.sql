-- Phase 1: Create comprehensive database schema with security

-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student', 'resolver', 'admin');

-- Create ticket status enum  
CREATE TYPE public.ticket_status AS ENUM ('open', 'in-progress', 'resolved', 'closed');

-- Create ticket priority enum
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high');

-- Create ticket category enum
CREATE TYPE public.ticket_category AS ENUM ('IT', 'Housekeeping', 'Academic', 'Infrastructure', 'Transport', 'Other');

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category ticket_category NOT NULL,
    priority ticket_priority NOT NULL DEFAULT 'medium',
    status ticket_status NOT NULL DEFAULT 'open',
    location TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    attachments TEXT[]
);

-- Create ticket messages table
CREATE TABLE public.ticket_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    attachments TEXT[]
);

-- Create activity logs table for audit trail
CREATE TABLE public.activity_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE user_id = user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if user is resolver or admin
CREATE OR REPLACE FUNCTION public.is_resolver_or_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE user_id = user_uuid) IN ('resolver', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Only admins can delete profiles" ON public.profiles
    FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for tickets
CREATE POLICY "Users can view their own tickets and resolvers can view assigned tickets" ON public.tickets
    FOR SELECT USING (
        auth.uid() = created_by OR 
        auth.uid() = assigned_to OR 
        public.is_resolver_or_admin(auth.uid())
    );

CREATE POLICY "Authenticated users can create tickets" ON public.tickets
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Resolvers and admins can update tickets" ON public.tickets
    FOR UPDATE USING (
        public.is_resolver_or_admin(auth.uid()) OR 
        auth.uid() = created_by
    );

CREATE POLICY "Only admins can delete tickets" ON public.tickets
    FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for ticket messages
CREATE POLICY "Users can view messages for their tickets" ON public.ticket_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tickets t 
            WHERE t.id = ticket_id AND (
                t.created_by = auth.uid() OR 
                t.assigned_to = auth.uid() OR 
                public.is_resolver_or_admin(auth.uid())
            )
        )
    );

CREATE POLICY "Users can add messages to their tickets" ON public.ticket_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tickets t 
            WHERE t.id = ticket_id AND (
                t.created_by = auth.uid() OR 
                t.assigned_to = auth.uid() OR 
                public.is_resolver_or_admin(auth.uid())
            )
        ) AND auth.uid() = user_id
    );

-- RLS Policies for activity logs
CREATE POLICY "Only admins can view activity logs" ON public.activity_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name, role)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email), 
        'student'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (auth.uid(), p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'ticket-attachments',
    'ticket-attachments',
    false,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies for ticket attachments
CREATE POLICY "Authenticated users can upload attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ticket-attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view attachments for their tickets" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'ticket-attachments' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            public.is_resolver_or_admin(auth.uid())
        )
    );

CREATE POLICY "Users can update their own attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'ticket-attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'ticket-attachments' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            public.is_admin(auth.uid())
        )
    );