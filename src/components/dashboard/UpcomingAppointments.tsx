import { useAppSelector } from '@/store/hooks';
import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
  scheduled: 'bg-info/10 text-info',
  confirmed: 'bg-success/10 text-success',
  'in-progress': 'bg-warning/10 text-warning',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
  'no-show': 'bg-destructive/10 text-destructive',
};

export function UpcomingAppointments() {
  const { appointments } = useAppSelector((state) => state.appointments);
  
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed')
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Appointments</h3>
        <a href="/appointments" className="text-sm text-primary hover:underline">View all</a>
      </div>

      <div className="space-y-4">
        {upcomingAppointments.map((appointment, index) => (
          <div 
            key={appointment.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{appointment.patientName}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {appointment.time}
                </span>
              </div>
            </div>
            <span className={cn("badge capitalize", statusColors[appointment.status])}>
              {appointment.status}
            </span>
          </div>
        ))}

        {upcomingAppointments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No upcoming appointments</p>
        )}
      </div>
    </div>
  );
}
