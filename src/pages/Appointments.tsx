import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setViewMode, setFilterStatus, Appointment } from '@/store/slices/appointmentsSlice';
import { Calendar, List, Plus, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors = {
  scheduled: 'bg-info/10 text-info border-info/30',
  confirmed: 'bg-success/10 text-success border-success/30',
  'in-progress': 'bg-warning/10 text-warning border-warning/30',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
  'no-show': 'bg-destructive/10 text-destructive border-destructive/30',
};

const typeColors = {
  checkup: 'bg-primary',
  cleaning: 'bg-success',
  filling: 'bg-warning',
  extraction: 'bg-destructive',
  'root-canal': 'bg-accent',
  crown: 'bg-info',
  other: 'bg-muted-foreground',
};

export default function Appointments() {
  const dispatch = useAppDispatch();
  const { appointments, viewMode, filterStatus } = useAppSelector((state) => state.appointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  }).sort((a, b) => 
    new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
  );

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Appointments</h1>
            <p className="text-muted-foreground">Schedule and manage patient appointments</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="action-button-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* View Toggle & Filters */}
      <div className="bg-card rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setViewMode('list'))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                viewMode === 'list' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => dispatch(setViewMode('calendar'))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                viewMode === 'calendar' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => dispatch(setFilterStatus(e.target.value as typeof filterStatus))}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-card rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th className="hidden md:table-cell">Type</th>
                  <th className="hidden lg:table-cell">Dentist</th>
                  <th>Status</th>
                  <th className="hidden sm:table-cell">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt, index) => (
                  <tr 
                    key={apt.id}
                    className="animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{apt.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(apt.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {apt.time}
                        </p>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", typeColors[apt.type])} />
                        <span className="capitalize text-foreground">{apt.type.replace('-', ' ')}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell text-foreground">{apt.dentist}</td>
                    <td>
                      <span className={cn("badge capitalize border", statusColors[apt.status])}>
                        {apt.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell text-muted-foreground">{apt.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments found</p>
            </div>
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-card rounded-xl shadow-md p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateMonth('prev')}
                className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Today
              </button>
              <button 
                onClick={() => navigateMonth('next')}
                className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = day?.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-24 p-2 rounded-lg border border-transparent transition-colors",
                    day ? "hover:border-border hover:bg-muted/20 cursor-pointer" : "",
                    isToday && "bg-primary/5 border-primary/30"
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm",
                        isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                      )}>
                        {day.getDate()}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayAppointments.slice(0, 2).map(apt => (
                          <div
                            key={apt.id}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded truncate",
                              typeColors[apt.type],
                              "text-white"
                            )}
                          >
                            {apt.time} {apt.patientName.split(' ')[0]}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-muted-foreground pl-1">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">New Appointment</h2>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Patient</label>
                <select className="input-field">
                  <option>Select a patient</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                  <option>Emily Rodriguez</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Date</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Time</label>
                  <input type="time" className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
                <select className="input-field">
                  <option value="checkup">Checkup</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="filling">Filling</option>
                  <option value="extraction">Extraction</option>
                  <option value="root-canal">Root Canal</option>
                  <option value="crown">Crown</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Dentist</label>
                <select className="input-field">
                  <option>Dr. Smith</option>
                  <option>Dr. Johnson</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
                <textarea className="input-field h-20 resize-none" placeholder="Additional notes..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 action-button-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Appointment created successfully');
                    setShowAddModal(false);
                  }}
                  className="flex-1 action-button-primary"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
