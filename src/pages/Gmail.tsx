import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { connectGmail, disconnectGmail, setConnecting, filterSuggestedEmails } from '@/store/slices/gmailSlice';
import { Mail, Check, X, RefreshCw, Clock, AlertCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Gmail() {
  const dispatch = useAppDispatch();
  const { isConnected, email, lastSynced, isConnecting, suggestedEmails } = useAppSelector((state) => state.gmail);
  const [emailInput, setEmailInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [composeEmail, setComposeEmail] = useState({ to: '', subject: '', body: '' });

  const handleConnect = () => {
    dispatch(setConnecting(true));
    // Simulate connection delay
    setTimeout(() => {
      dispatch(connectGmail('clinic@dentacare.com'));
      toast.success('Gmail account connected successfully');
    }, 1500);
  };

  const handleDisconnect = () => {
    dispatch(disconnectGmail());
    toast.success('Gmail account disconnected');
  };

  const handleEmailInputChange = (value: string) => {
    setComposeEmail({ ...composeEmail, to: value });
    dispatch(filterSuggestedEmails(value));
    setShowSuggestions(value.length > 0);
  };

  const selectSuggestion = (email: string) => {
    setComposeEmail({ ...composeEmail, to: email });
    setShowSuggestions(false);
  };

  const handleSendEmail = () => {
    toast.success('Email sent successfully (mock)');
    setComposeEmail({ to: '', subject: '', body: '' });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Gmail Integration</h1>
        <p className="text-muted-foreground">Connect your Gmail account to send automated emails</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Status Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                isConnected ? "bg-success/10" : "bg-muted"
              )}>
                <Mail className={cn(
                  "w-7 h-7",
                  isConnected ? "text-success" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Gmail Account</h3>
                <p className={cn(
                  "text-sm",
                  isConnected ? "text-success" : "text-muted-foreground"
                )}>
                  {isConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            {isConnected ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Connected Account</span>
                  </div>
                  <p className="font-medium text-foreground">{email}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Last Synced</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {lastSynced ? new Date(lastSynced).toLocaleString() : 'Never'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => toast.success('Synced successfully')}
                    className="flex-1 action-button-secondary gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Sync
                  </button>
                  <button 
                    onClick={handleDisconnect}
                    className="flex-1 action-button gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <X className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-warning/10 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Not Connected</p>
                    <p className="text-sm text-muted-foreground">
                      Connect your Gmail account to enable email features
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full action-button-primary gap-2 py-3"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Connect Gmail Account
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Connection Benefits */}
          <div className="bg-card rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">What you can do</h3>
            <ul className="space-y-3">
              {[
                'Send appointment reminders',
                'Follow-up emails after visits',
                'Treatment plan notifications',
                'Birthday greetings',
                'Recall notifications'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Email Composer */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Compose Email</h3>
            
            <div className="space-y-4">
              {/* To field with auto-suggestions */}
              <div className="relative">
                <label className="text-sm font-medium text-foreground mb-1 block">To</label>
                <div className="relative">
                  <input
                    type="email"
                    value={composeEmail.to}
                    onChange={(e) => handleEmailInputChange(e.target.value)}
                    onFocus={() => setShowSuggestions(composeEmail.to.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Start typing to see suggestions..."
                    className="input-field"
                    disabled={!isConnected}
                  />
                  {showSuggestions && suggestedEmails.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {suggestedEmails.map((email, index) => (
                        <button
                          key={email}
                          onClick={() => selectSuggestion(email)}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted flex items-center gap-3 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-primary">
                              {email[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-foreground">{email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
                <input
                  type="text"
                  value={composeEmail.subject}
                  onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
                  placeholder="Enter email subject..."
                  className="input-field"
                  disabled={!isConnected}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                <textarea
                  value={composeEmail.body}
                  onChange={(e) => setComposeEmail({ ...composeEmail, body: e.target.value })}
                  placeholder="Write your message here..."
                  className="input-field h-48 resize-none"
                  disabled={!isConnected}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setComposeEmail({ to: '', subject: '', body: '' })}
                  className="action-button-secondary"
                  disabled={!isConnected}
                >
                  Clear
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="action-button-primary gap-2"
                  disabled={!isConnected || !composeEmail.to || !composeEmail.subject}
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>

            {!isConnected && (
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Connect your Gmail account to compose emails</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
