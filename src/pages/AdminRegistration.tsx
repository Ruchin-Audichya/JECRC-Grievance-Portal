import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AdminRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Admin registration code (in production, this should be configurable)
  const ADMIN_REGISTRATION_CODE = 'JECRC2024ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.adminCode !== ADMIN_REGISTRATION_CODE) {
      toast({
        title: "Invalid Admin Code",
        description: "The admin registration code is incorrect",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.name
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create admin profile with special permissions
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            name: formData.name,
            role: 'admin',
            department: 'Administration'
          });

        if (profileError) throw profileError;

        toast({
          title: "Admin Account Created",
          description: "Your admin account has been created successfully. Please check your email for verification.",
        });

        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          adminCode: ''
        });

        // Redirect to login after short delay
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || 'Failed to create admin account',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Admin Registration
          </CardTitle>
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This page is for authorized JECRC IT administrators only. 
              Unauthorized access is prohibited.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Full Name</Label>
              <Input
                id="admin-name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Official Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@jecrcu.edu.in"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-code">Admin Registration Code</Label>
              <Input
                id="admin-code"
                type="password"
                placeholder="Enter admin registration code"
                value={formData.adminCode}
                onChange={(e) => setFormData(prev => ({ ...prev, adminCode: e.target.value }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Contact IT department for the registration code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-confirm-password">Confirm Password</Label>
              <Input
                id="admin-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                minLength={8}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.email ||
                !formData.adminCode ||
                !formData.password ||
                !formData.confirmPassword ||
                formData.password !== formData.confirmPassword
              }
            >
              {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-sm"
            >
              ← Back to Login
            </Button>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Admin Code:</strong> JECRC2024ADMIN<br />
              (For demo purposes only)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}