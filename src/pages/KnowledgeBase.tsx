import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, User, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  helpful: number;
  notHelpful: number;
  relatedTicketId?: string;
}

export default function KnowledgeBase() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  // Mock data - In production, this would come from Supabase
  const [articles] = useState<KnowledgeArticle[]>([
    {
      id: '1',
      title: 'How to Reset WiFi Password',
      content: `To reset your WiFi password, follow these steps:
1. Open your browser and go to 192.168.1.1
2. Login with admin credentials (usually on router sticker)
3. Navigate to Wireless Settings
4. Change the password in the Security section
5. Save and restart the router

If you're in a hostel, contact IT support for assistance.`,
      category: 'IT',
      tags: ['wifi', 'password', 'network'],
      createdBy: 'John Resolver',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      helpful: 45,
      notHelpful: 3,
      relatedTicketId: 'TICKET-123'
    },
    {
      id: '2',
      title: 'Hostel Room Maintenance Request Process',
      content: `For any maintenance issues in your hostel room:
1. Create a ticket with category "Housekeeping" or "Infrastructure"
2. Clearly describe the issue with room number
3. Attach photos if possible
4. Maintenance team will visit within 24-48 hours
5. You'll receive updates via the ticket system

Emergency issues (water leakage, electrical) - Call: 1234567890`,
      category: 'Housekeeping',
      tags: ['maintenance', 'hostel', 'room'],
      createdBy: 'Sarah Admin',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      helpful: 67,
      notHelpful: 5
    },
    {
      id: '3',
      title: 'Academic Document Request Procedure',
      content: `To request academic documents (transcripts, certificates):
1. Submit a ticket under "Academic" category
2. Specify the document type needed
3. Mention the purpose (job application, higher studies, etc.)
4. Processing time: 3-5 working days
5. Collection from Academic Office Room 201

Fee structure:
- Transcript: ₹500
- Duplicate Certificate: ₹1000
- Character Certificate: ₹200`,
      category: 'Academic',
      tags: ['documents', 'transcript', 'certificate'],
      createdBy: 'Academic Dept',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-08',
      helpful: 89,
      notHelpful: 2
    }
  ]);

  const categories = ['all', 'IT', 'Housekeeping', 'Academic', 'Infrastructure', 'Transport', 'Other'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateArticle = () => {
    if (!newArticle.title || !newArticle.content || !newArticle.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Article Created",
      description: "Knowledge base article has been created successfully"
    });
    setShowCreateDialog(false);
    setNewArticle({ title: '', content: '', category: '', tags: '' });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Find solutions to common issues and learn about university processes
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Article
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No articles found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map(article => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  {article.relatedTicketId && (
                    <Badge variant="secondary" className="text-xs">
                      From #{article.relatedTicketId}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <CardDescription className="text-xs">
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.createdBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {article.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-green-600">
                      <ThumbsUp className="h-3 w-3" />
                      {article.helpful}
                    </span>
                    <span className="flex items-center gap-1 text-red-600">
                      <ThumbsDown className="h-3 w-3" />
                      {article.notHelpful}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Article Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Knowledge Base Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newArticle.title}
                onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                placeholder="Enter article title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={newArticle.category} 
                onValueChange={(value) => setNewArticle({...newArticle, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newArticle.content}
                onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                placeholder="Enter article content..."
                className="min-h-[200px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={newArticle.tags}
                onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})}
                placeholder="e.g., wifi, password, network"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateArticle}>
                Create Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}