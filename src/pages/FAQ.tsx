import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, MessageSquare, Clock, CheckCircle, User, Shield } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: User,
      color: "bg-blue-500",
      questions: [
        {
          q: "How do I create my first ticket?",
          a: "Click the 'Create Ticket' button in the header or dashboard. Fill in the details including title, description, category, priority, and location. You can also attach files if needed."
        },
        {
          q: "What's the difference between Student and Staff accounts?",
          a: "Both Student and Staff accounts have identical permissions - they can create tickets, track progress, and verify resolutions. The only difference is in the signup form fields (Roll Number vs Employee ID)."
        },
        {
          q: "How do I track my ticket status?",
          a: "Go to your Dashboard to see all your tickets. Each ticket shows its current status: Open, In Progress, Resolved, or Closed. You'll see updates in real-time."
        }
      ]
    },
    {
      title: "Ticket Management",
      icon: CheckCircle,
      color: "bg-green-500",
      questions: [
        {
          q: "What are the different ticket statuses?",
          a: "Open (newly created), In Progress (being worked on), Resolved (fixed by resolver), and Closed (verified and completed by you)."
        },
        {
          q: "How do I close a resolved ticket?",
          a: "When a resolver marks your ticket as 'Resolved', you'll see a 'Verify & Close Ticket' button. Click it to confirm the issue is fixed and close the ticket."
        },
        {
          q: "Can I add comments to my tickets?",
          a: "Yes! Go to the ticket details page and use the message section to communicate with resolvers and add updates."
        },
        {
          q: "What file types can I upload?",
          a: "You can upload images (JPG, PNG), documents (PDF, DOC, DOCX), and other common file types up to 10MB per file."
        }
      ]
    },
    {
      title: "Categories & Priorities",
      icon: Shield,
      color: "bg-purple-500",
      questions: [
        {
          q: "What categories are available?",
          a: "IT Support, Housekeeping, Academic, Infrastructure, Transport, and Other. Choose the category that best matches your issue."
        },
        {
          q: "How do I set the right priority?",
          a: "Low: Minor issues, Medium: Standard requests, High: Urgent problems affecting daily activities or safety."
        },
        {
          q: "Who handles different types of tickets?",
          a: "Tickets are automatically routed to the appropriate department based on category. Each department has dedicated resolvers."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: MessageSquare,
      color: "bg-orange-500",
      questions: [
        {
          q: "Why can't I see the Create Ticket button?",
          a: "Make sure you're logged in as a Student, Staff member, or Admin. Resolvers don't see this button as they handle tickets rather than create them."
        },
        {
          q: "My ticket isn't showing up. What should I do?",
          a: "Try refreshing the page using the Refresh button on your dashboard. If it still doesn't appear, contact IT support."
        },
        {
          q: "How do I reset my password?",
          a: "Use the 'Forgot Password' link on the login page. You'll receive an email with reset instructions."
        },
        {
          q: "Can I use this system on mobile?",
          a: "Yes! JECRC SolveIt is fully responsive and works perfectly on smartphones and tablets."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find quick answers to common questions about JECRC SolveIt
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create-ticket">
            <Button className="jecrc-btn-primary px-6">
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </Link>
          <Link to="/faq-chat">
            <Button variant="outline" className="px-6">
              <MessageSquare className="mr-2 h-4 w-4" />
              Live Chat Support
            </Button>
          </Link>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="grid gap-8">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="jecrc-card-hover">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{category.title}</CardTitle>
                  <CardDescription>
                    {category.questions.length} questions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {category.questions.map((faq, questionIndex) => (
                  <div key={questionIndex} className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Need More Help?</h2>
            <p className="text-muted-foreground">
              Our support team is here to help you with any questions not covered in the FAQ
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Quick Response</h3>
                <p className="text-sm text-muted-foreground">Average 2.5 hour response time</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">High Success Rate</h3>
                <p className="text-sm text-muted-foreground">98% satisfaction rate</p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Always here when you need us</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;