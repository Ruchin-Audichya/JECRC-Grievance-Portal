import { useActivityLogs } from '@/hooks/useActivityLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Search, Clock, Filter } from 'lucide-react';
import { ActivityLog } from '@/hooks/useActivityLogs';

interface ActivityLogViewerProps {
  ticketId?: string;
  showFilters?: boolean;
  maxHeight?: string;
  limit?: number;
}

export default function ActivityLogViewer({ 
  ticketId, 
  showFilters = true, 
  maxHeight = "400px",
  limit 
}: ActivityLogViewerProps) {
  const { 
    logs, 
    isLoading, 
    getLogsByTicket, 
    getActionIcon, 
    getActionColor 
  } = useActivityLogs();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading activity logs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get relevant logs
  const relevantLogs = ticketId ? getLogsByTicket(ticketId) : logs;
  
  // Apply filters
  const filteredLogs = relevantLogs
    .filter(log => {
      const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
      
      return matchesSearch && matchesAction && matchesEntity;
    })
    .slice(0, limit);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getUniqueActions = () => {
    const actions = [...new Set(relevantLogs.map(log => log.action))];
    return actions;
  };

  const getUniqueEntityTypes = () => {
    const entityTypes = [...new Set(relevantLogs.map(log => log.entityType))];
    return entityTypes;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Log
          <Badge variant="secondary" className="ml-auto">
            {filteredLogs.length} entries
          </Badge>
        </CardTitle>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {getUniqueActions().map(action => (
                  <SelectItem key={action} value={action}>
                    {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueEntityTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          {filteredLogs.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No activity logs found</p>
              <p className="text-xs mt-1">
                {searchQuery || actionFilter !== 'all' || entityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Activity will appear here as actions are performed'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log, index) => (
                <div key={log.id} className="p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span className="text-lg" title={log.action}>
                        {getActionIcon(log.action)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">
                          {log.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {log.entityType}
                        </Badge>
                      </div>
                      
                      {/* Show before/after values if available */}
                      {log.metadata?.old && log.metadata?.new && (
                        <div className="mt-1 mb-2 text-sm">
                          <span className="text-muted-foreground">Changed from </span>
                          <Badge variant="outline" className="text-xs">{log.metadata.old}</Badge>
                          <span className="text-muted-foreground"> to </span>
                          <Badge variant="secondary" className="text-xs">{log.metadata.new}</Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          👤 {log.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          🕒 {formatTimeAgo(log.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {log.metadata?.ipAddress || '127.0.0.1'}
                        </span>
                        {log.ticketId && (
                          <span className="flex items-center gap-1">
                            🎫 Ticket #{log.ticketId}
                          </span>
                        )}
                      </div>
                      
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              <strong>{key}:</strong> {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}