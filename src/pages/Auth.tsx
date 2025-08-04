import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { user, isLoading, signIn, signUp } = useAuth();
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    rollNumber: '',
    course: '',
    year: '',
    role: 'student' as 'student' | 'staff'
  });
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Redirect if already authenticated
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      if (!error) {
        // Auth context will handle the redirect
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      return;
    }
    
    setSignUpLoading(true);
    
    try {
      const { error } = await signUp({
        email: signUpData.email,
        password: signUpData.password,
        name: signUpData.name,
        role: signUpData.role,
        rollNumber: signUpData.rollNumber,
        course: signUpData.course,
        year: signUpData.year
      });
      if (!error) {
        // Clear form and switch to sign in tab
        setSignUpData({
          email: '',
          password: '',
          name: '',
          confirmPassword: '',
          rollNumber: '',
          course: '',
          year: '',
          role: 'student' as 'student' | 'staff'
        });
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">JECRC SolveIt</CardTitle>
          <CardDescription>
            Secure authentication for the university support system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <Button variant="outline" onClick={() => navigate('/demo')} className="mb-4">
              🚀 Quick Demo Access
            </Button>
          </div>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your JECRC email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signInLoading || !signInData.email || !signInData.password}
                >
                  {signInLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-role">I am a</Label>
                  <Select value={signUpData.role} onValueChange={(value: 'student' | 'staff') => setSignUpData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Faculty/Staff Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-roll">{signUpData.role === 'student' ? 'JECRC University Roll Number' : 'Employee ID'}</Label>
                  <Input
                    id="signup-roll"
                    type="text"
                    placeholder={signUpData.role === 'student' ? 'e.g., 22UCS001' : 'e.g., EMP001'}
                    value={signUpData.rollNumber}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, rollNumber: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-course">{signUpData.role === 'student' ? 'Course' : 'Department'}</Label>
                  <Select value={signUpData.course} onValueChange={(value) => setSignUpData(prev => ({ ...prev, course: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={signUpData.role === 'student' ? 'Select your course' : 'Select your department'} />
                    </SelectTrigger>
                    <SelectContent>
                      {signUpData.role === 'student' ? (
                        <>
                          <SelectItem value="B.Tech CSE">B.Tech Computer Science</SelectItem>
                          <SelectItem value="B.Tech ECE">B.Tech Electronics & Communication</SelectItem>
                          <SelectItem value="B.Tech ME">B.Tech Mechanical Engineering</SelectItem>
                          <SelectItem value="B.Tech CE">B.Tech Civil Engineering</SelectItem>
                          <SelectItem value="BBA">Bachelor of Business Administration</SelectItem>
                          <SelectItem value="BCA">Bachelor of Computer Applications</SelectItem>
                          <SelectItem value="M.Tech">M.Tech</SelectItem>
                          <SelectItem value="MBA">Master of Business Administration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Computer Science">Computer Science Department</SelectItem>
                          <SelectItem value="Electronics">Electronics & Communication Department</SelectItem>
                          <SelectItem value="Mechanical">Mechanical Engineering Department</SelectItem>
                          <SelectItem value="Civil">Civil Engineering Department</SelectItem>
                          <SelectItem value="Management">Management Department</SelectItem>
                          <SelectItem value="IT">IT Department</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Library">Library</SelectItem>
                          <SelectItem value="Hostel">Hostel Management</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {signUpData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-year">Student Year</Label>
                    <Select value={signUpData.year} onValueChange={(value) => setSignUpData(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="postgrad">Post Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your JECRC email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                  {signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    signUpLoading || 
                    !signUpData.email || 
                    !signUpData.password || 
                    !signUpData.name ||
                    !signUpData.rollNumber ||
                    !signUpData.course ||
                    !signUpData.year ||
                    !signUpData.confirmPassword ||
                    signUpData.password !== signUpData.confirmPassword
                  }
                >
                  {signUpLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}