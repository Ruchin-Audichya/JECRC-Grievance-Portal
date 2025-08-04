import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setupDemoEnvironment } from '@/utils/demoData';

export default function Demo() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'Student',
      email: 'student@jecrcu.edu.in',
      description: 'Create and track tickets, view assigned tickets',
      color: 'bg-blue-500',
      features: ['Submit tickets', 'Track status', 'View responses']
    },
    {
      role: 'Staff',
      email: 'staff@jecrcu.edu.in',
      description: 'Create and track tickets, same as student role',
      color: 'bg-cyan-500',
      features: ['Submit tickets', 'Track status', 'Verify resolutions']
    },
    {
      role: 'Resolver',
      email: 'resolver@jecrcu.edu.in', 
      description: 'Resolve tickets, manage assigned cases',
      color: 'bg-green-500',
      features: ['View assigned tickets', 'Update status', 'Add responses']
    },
    {
      role: 'Admin',
      email: 'admin@jecrcu.edu.in',
      description: 'Full system access, user management, analytics',
      color: 'bg-purple-500',
      features: ['User management', 'System analytics', 'All permissions']
    }
  ];

  const createDemoAccount = async (email: string, role: string) => {
    try {
      // Create the demo account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password123',
        options: {
          data: {
            name: `Demo ${role}`,
          }
        }
      });

      if (signUpError) {
        // If account already exists, that's fine
        if (signUpError.message.includes('already registered')) {
          return { success: true, accountExists: true };
        }
        throw signUpError;
      }

      return { success: true, accountExists: false };
    } catch (error) {
      console.error('Error creating demo account:', error);
      return { success: false, error };
    }
  };

  const handleDemoLogin = async (email: string, role: string) => {
    setIsLoading(email);
    
    try {
      // Try to sign in first
      const { error } = await signIn(email, 'password123');
      
      if (error && error.message.includes('Invalid login credentials')) {
        // Account doesn't exist, create it
        toast({
          title: 'Setting up Demo Account',
          description: 'Creating demo account for you...',
        });

        const result = await createDemoAccount(email, role);
        if (!result.success) {
          throw new Error('Failed to create demo account');
        }

        if (!result.accountExists) {
          toast({
            title: 'Demo Account Created',
            description: 'Please check your email to verify your account, then try logging in again.',
            variant: 'default',
          });
          return;
        }

        // Try signing in again if account existed
        const { error: retryError } = await signIn(email, 'password123');
        if (retryError) {
          throw retryError;
        }
      } else if (error) {
        throw error;
      }
      
      // Set up demo environment with sample data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await setupDemoEnvironment(user.id, role.toLowerCase());
      }

      toast({
        title: `Welcome to ${role} Portal`,
        description: 'Demo login successful! Sample tickets have been created for you to explore.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Demo Login Failed',
        description: error.message || 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            JECRC SolveIt Demo Portal
          </h1>
          <p className="text-muted-foreground mb-4">
            Test different user roles and features
          </p>
          <div className="space-y-2 mb-6">
            <Badge variant="secondary">
              All accounts use password: password123
            </Badge>
            <div className="text-sm text-muted-foreground">
              <p>Demo accounts will be created automatically on first use.</p>
              <p>If email verification is required, check your email inbox.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {demoAccounts.map((account) => (
            <Card key={account.email} className="jecrc-card-hover jecrc-border-accent">
              <CardHeader className="text-center">
                <div className={`mx-auto mb-3 w-12 h-12 ${account.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">
                    {account.role.charAt(0)}
                  </span>
                </div>
                <CardTitle className="text-xl">{account.role} Portal</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {account.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {account.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => handleDemoLogin(account.email, account.role)}
                  disabled={isLoading === account.email}
                  className="w-full jecrc-btn-primary font-semibold"
                >
                  {isLoading === account.email ? 'Logging in...' : `Test ${account.role} Portal`}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {account.email}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Manual Demo Account Setup</h3>
            <p className="text-sm text-muted-foreground mb-3">
              IT Team: You can also create accounts manually with these credentials
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div>
                <strong>Student:</strong> student@jecrcu.edu.in
              </div>
              <div>
                <strong>Staff:</strong> staff@jecrcu.edu.in
              </div>
              <div>
                <strong>Resolver:</strong> resolver@jecrcu.edu.in
              </div>
              <div>
                <strong>Admin:</strong> admin@jecrcu.edu.in
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Password for all: password123
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Manual Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/auth?mode=signin')}
            >
              Manual Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}