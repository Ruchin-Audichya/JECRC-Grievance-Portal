import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast({
        title: 'Welcome to JECRC SolveIt',
        description: 'You have been successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome to JECRC SolveIt
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@jecrcu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <p><strong>Student:</strong> student@jecrcu.edu.in</p>
                <p><strong>Resolver:</strong> resolver@jecrcu.edu.in</p>
                <p><strong>Admin:</strong> admin@jecrcu.edu.in</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => navigate('/demo')} className="flex-1">
                Demo Portal
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')} className="flex-1">
                New Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}