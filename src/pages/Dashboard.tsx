import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { RecentPatients } from '@/components/dashboard/RecentPatients';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { AppointmentTypesChart } from '@/components/dashboard/AppointmentTypesChart';
import { useAppSelector } from '@/store/hooks';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { patients } = useAppSelector((state) => state.patients);
  const { appointments } = useAppSelector((state) => state.appointments);

  const activePatients = patients.filter(p => p.status === 'active').length;
  const todayAppointments = appointments.filter(a => 
    a.date === new Date().toISOString().split('T')[0]
  ).length;
  const monthlyRevenue = 58400;
  const growthRate = 12.5;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={patients.length.toLocaleString()}
          change="+45 this month"
          changeType="positive"
          icon={<Users className="w-6 h-6" />}
          gradient="primary"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments}
          change="3 confirmed"
          changeType="neutral"
          icon={<Calendar className="w-6 h-6" />}
          gradient="accent"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          change="+8.2%"
          changeType="positive"
          icon={<DollarSign className="w-6 h-6" />}
          gradient="success"
        />
        <StatCard
          title="Growth Rate"
          value={`${growthRate}%`}
          change="vs last month"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6" />}
          gradient="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <AppointmentTypesChart />
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointments />
        <RecentPatients />
      </div>
    </DashboardLayout>
  );
}
