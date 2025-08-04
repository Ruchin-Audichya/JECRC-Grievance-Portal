import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Search, Clock, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-muted to-background py-12">
      <div className="container mx-auto px-4">
        {/* Hero Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-foreground mb-4">
            Welcome to <span className="jecrc-text-gradient">JECRC SolveIt</span>
          </h1>
          <p className="text-xl font-lato text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your one-stop solution for university grievances and support requests. 
            Fast, efficient, and transparent issue resolution.
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/demo">
              <Button size="lg" className="font-poppins jecrc-gradient hover:opacity-90 text-white shadow-lg px-8">
                <Plus className="mr-2 h-5 w-5" />
                Try Demo Portal
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="font-poppins border-primary text-primary hover:bg-primary hover:text-white px-8">
                <Search className="mr-2 h-5 w-5" />
                Sign Up / Sign In
              </Button>
            </Link>
          </div>

          {/* Admin Access */}
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground mb-2">
              JECRC IT Administrator?
            </p>
            <Link to="/admin-register">
              <Button variant="secondary" size="sm" className="font-poppins jecrc-btn-secondary">
                Admin Registration
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-foreground mb-2">1,245</h3>
              <p className="font-lato text-muted-foreground">Tickets Resolved</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-foreground mb-2">2.5 hrs</h3>
              <p className="font-lato text-muted-foreground">Avg Response Time</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">98</span>
                </div>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-foreground mb-2">98%</h3>
              <p className="font-lato text-muted-foreground">Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-poppins font-semibold text-foreground">
                Recent Activity
              </h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  id: "#JECRC-2024-001",
                  title: "Wi-Fi connectivity issue in Block A",
                  department: "IT Support",
                  status: "resolved",
                  time: "2 mins ago"
                },
                {
                  id: "#JECRC-2024-002", 
                  title: "Hostel room AC not working",
                  department: "Maintenance",
                  status: "in-progress",
                  time: "15 mins ago"
                },
                {
                  id: "#JECRC-2024-003",
                  title: "Library book renewal request",
                  department: "Library",
                  status: "open",
                  time: "1 hour ago"
                }
              ].map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-poppins font-medium text-sm text-muted-foreground">
                        {ticket.id}
                      </span>
                      <Badge 
                        variant={
                          ticket.status === 'resolved' ? 'default' : 
                          ticket.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                        className={`
                          ${ticket.status === 'resolved' ? 'bg-success text-white' : ''}
                          ${ticket.status === 'in-progress' ? 'bg-warning text-white' : ''}
                          ${ticket.status === 'open' ? 'bg-error text-white' : ''}
                        `}
                      >
                        {ticket.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <h4 className="font-lato font-medium text-foreground mb-1">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {ticket.department} • {ticket.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;