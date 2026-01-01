import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SetupAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();

  const createAdminUser = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user');

      if (error) {
        console.error('Error invoking function:', error);
        setResult({ success: false, message: error.message });
        toast.error('Failed to create admin user');
        return;
      }

      console.log('Function response:', data);
      setResult({ success: data.success, message: data.message || data.error });

      if (data.success) {
        toast.success('Admin user created successfully!');
      } else if (data.message?.includes('already exists')) {
        toast.info('Admin user already exists');
      } else {
        toast.error(data.error || 'Failed to create admin user');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({ success: false, message: errorMessage });
      toast.error('Failed to create admin user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Setup Admin User</CardTitle>
          <CardDescription>
            Create the Super Admin account for Dental AI CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Email:</strong> admin@versoniq.com</p>
            <p><strong>Password:</strong> admin@123</p>
          </div>

          {result && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              result.success 
                ? 'bg-green-500/10 text-green-600' 
                : result.message?.includes('already exists')
                  ? 'bg-blue-500/10 text-blue-600'
                  : 'bg-destructive/10 text-destructive'
            }`}>
              {result.success || result.message?.includes('already exists') ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm">{result.message}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              onClick={createAdminUser} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Admin User'
              )}
            </Button>

            {(result?.success || result?.message?.includes('already exists')) && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin;
