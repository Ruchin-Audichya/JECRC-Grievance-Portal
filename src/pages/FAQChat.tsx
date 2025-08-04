import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, HelpCircle, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I create a new ticket?",
    answer: "To create a new ticket, go to 'Create Ticket' from the dashboard, fill in the required details like title, description, category, and priority level, then submit.",
    category: "Tickets"
  },
  {
    question: "What are the different ticket priorities?",
    answer: "We have 4 priority levels: Low (non-urgent issues), Medium (standard issues), High (important issues affecting work), and Critical (system-down emergencies).",
    category: "Tickets"
  },
  {
    question: "How can I track my ticket status?",
    answer: "You can view all your tickets on the dashboard. Each ticket shows its current status: Open, In Progress, Resolved, or Closed.",
    category: "Tracking"
  },
  {
    question: "Who can resolve tickets?",
    answer: "Tickets are resolved by IT staff members who have 'resolver' role. Admins can also manage and resolve all tickets.",
    category: "Roles"
  },
  {
    question: "Can I attach files to my ticket?",
    answer: "Yes! You can attach screenshots, documents, or any relevant files while creating a ticket to help explain your issue better.",
    category: "Files"
  },
  {
    question: "How do I change my password?",
    answer: "Currently, password changes need to be requested through the admin. Contact your system administrator for password reset assistance.",
    category: "Account"
  },
  {
    question: "What if my issue is urgent?",
    answer: "For urgent issues, set the priority to 'High' or 'Critical' when creating your ticket. Critical issues are handled immediately by the IT team.",
    category: "Emergency"
  },
  {
    question: "How do I view system logs?",
    answer: "System logs are available for admin users only. Go to 'System Logs' from the admin portal to view detailed activity logs.",
    category: "Admin"
  }
];

const chatbotResponses = {
  greeting: [
    "Hello! I'm your IT support assistant. How can I help you today?",
    "Hi there! I'm here to help with your IT questions. What would you like to know?",
    "Welcome! I can help you with ticket creation, system navigation, and troubleshooting. What's on your mind?"
  ],
  default: [
    "I'm not sure about that specific question, but I can help you with ticket management, system navigation, and general IT support. Try asking about creating tickets or checking ticket status.",
    "That's a great question! While I might not have that exact information, I can definitely help with ticket-related queries, system usage, and troubleshooting tips.",
    "Let me help you with that! I specialize in IT support topics like ticket management, system features, and user guidance. What specific aspect would you like to know about?"
  ],
  thanks: [
    "You're welcome! Feel free to ask if you have any other questions.",
    "Happy to help! Is there anything else you'd like to know about the system?",
    "Glad I could assist! Don't hesitate to reach out if you need more help."
  ]
};

export default function FAQChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your IT support assistant. How can I help you today?",
      type: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
      return chatbotResponses.greeting[Math.floor(Math.random() * chatbotResponses.greeting.length)];
    }
    
    // Check for thanks
    if (lowercaseMessage.includes('thank') || lowercaseMessage.includes('thanks')) {
      return chatbotResponses.thanks[Math.floor(Math.random() * chatbotResponses.thanks.length)];
    }
    
    // Search for relevant FAQs
    const relevantFAQ = faqs.find(faq => 
      faq.question.toLowerCase().includes(lowercaseMessage) ||
      lowercaseMessage.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
      faq.answer.toLowerCase().includes(lowercaseMessage)
    );
    
    if (relevantFAQ) {
      return relevantFAQ.answer;
    }
    
    // Check for specific keywords
    if (lowercaseMessage.includes('ticket')) {
      return "For ticket-related questions: You can create tickets from the dashboard, track their status, and attach files. What specific aspect of ticket management would you like to know about?";
    }
    
    if (lowercaseMessage.includes('priority')) {
      return "We have 4 priority levels: Low (non-urgent), Medium (standard), High (important), and Critical (emergencies). Choose the appropriate level when creating your ticket.";
    }
    
    if (lowercaseMessage.includes('admin') || lowercaseMessage.includes('administrator')) {
      return "Admin users have additional privileges including viewing all tickets, managing users, and accessing system logs. Contact your system administrator for admin-related requests.";
    }
    
    // Default response
    return chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue),
        type: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (faq: FAQ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: faq.question,
      type: 'user',
      timestamp: new Date()
    };

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: faq.answer,
      type: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">FAQ & Chat Support</h1>
        <p className="text-muted-foreground">Get instant help with our AI assistant or browse frequently asked questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                IT Support Chat
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          {message.type === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question here..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <ScrollArea className="h-[480px]">
                  <div className="space-y-2">
                    {filteredFAQs.map((faq, index) => (
                      <Card
                        key={index}
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleQuickQuestion(faq)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{faq.question}</p>
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {faq.answer}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}