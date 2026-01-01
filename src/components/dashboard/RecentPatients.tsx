import { useAppSelector } from '@/store/hooks';
import { User, Phone, Mail } from 'lucide-react';

export function RecentPatients() {
  const { patients } = useAppSelector((state) => state.patients);
  
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Patients</h3>
        <a href="/patients" className="text-sm text-primary hover:underline">View all</a>
      </div>

      <div className="space-y-4">
        {recentPatients.map((patient, index) => (
          <div 
            key={patient.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
