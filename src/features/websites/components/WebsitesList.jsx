import { useState, useEffect } from 'react';
import { websitesAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WebsitesList() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const response = await websitesAPI.getWebsites();
      if (response.success) {
        setWebsites(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await websitesAPI.deleteWebsite(id);
      setWebsites(websites.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete website:', error);
    }
  };

  if (loading) return <div>Loading websites...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Websites</h2>
      {websites.map((website) => (
        <Card key={website.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {website.host}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(website.id)}
              >
                Delete
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <div>URL: {website.url}</div>
              <div>Added: {new Date(website.createdAt).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}