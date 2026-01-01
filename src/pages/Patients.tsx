import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSearchQuery, setFilterStatus, deletePatient, setSelectedPatient, Patient } from '@/store/slices/patientsSlice';
import { Search, Plus, Filter, Eye, Edit, Trash2, X, User, Phone, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Patients() {
  const dispatch = useAppDispatch();
  const { patients, searchQuery, filterStatus, selectedPatient } = useAppSelector((state) => state.patients);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleView = (patient: Patient) => {
    dispatch(setSelectedPatient(patient));
    setModalMode('view');
    setShowPatientModal(true);
  };

  const handleEdit = (patient: Patient) => {
    dispatch(setSelectedPatient(patient));
    setModalMode('edit');
    setShowPatientModal(true);
  };

  const handleAdd = () => {
    dispatch(setSelectedPatient(null));
    setModalMode('add');
    setShowPatientModal(true);
  };

  const handleDelete = (patientId: string) => {
    dispatch(deletePatient(patientId));
    toast.success('Patient deleted successfully');
  };

  const closeModal = () => {
    setShowPatientModal(false);
    dispatch(setSelectedPatient(null));
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Patients</h1>
            <p className="text-muted-foreground">Manage your patient records and information</p>
          </div>
          <button 
            onClick={handleAdd}
            className="action-button-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => dispatch(setFilterStatus(e.target.value as 'all' | 'active' | 'inactive'))}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th className="hidden md:table-cell">Contact</th>
                <th className="hidden lg:table-cell">Insurance</th>
                <th className="hidden sm:table-cell">Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr 
                  key={patient.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium text-sm">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-muted-foreground md:hidden">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <p className="text-foreground">{patient.email}</p>
                    <p className="text-sm text-muted-foreground">{patient.phone}</p>
                  </td>
                  <td className="hidden lg:table-cell">
                    <p className="text-foreground">{patient.insuranceProvider}</p>
                    <p className="text-sm text-muted-foreground">{patient.insuranceId}</p>
                  </td>
                  <td className="hidden sm:table-cell">
                    <p className="text-foreground">
                      {new Date(patient.lastVisit).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </td>
                  <td>
                    <span className={cn(
                      "badge capitalize",
                      patient.status === 'active' ? "badge-success" : "badge-destructive"
                    )}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleView(patient)}
                        className="action-button-ghost p-2"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(patient)}
                        className="action-button-ghost p-2"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="action-button-ghost p-2 text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No patients found</p>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {modalMode === 'view' ? 'Patient Details' : modalMode === 'edit' ? 'Edit Patient' : 'Add Patient'}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {selectedPatient && (modalMode === 'view' || modalMode === 'edit') ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-xl">
                        {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h3>
                      <span className={cn(
                        "badge capitalize mt-1",
                        selectedPatient.status === 'active' ? "badge-success" : "badge-destructive"
                      )}>
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium text-foreground">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date of Birth</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="text-sm font-medium text-foreground capitalize">{selectedPatient.gender}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Address</p>
                      <p className="text-sm text-foreground">{selectedPatient.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Insurance</p>
                      <p className="text-sm text-foreground">
                        {selectedPatient.insuranceProvider} ({selectedPatient.insuranceId})
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-foreground">{selectedPatient.notes}</p>
                    </div>
                  </div>

                  {modalMode === 'edit' && (
                    <div className="flex gap-3 pt-4">
                      <button onClick={closeModal} className="flex-1 action-button-secondary">
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          toast.success('Patient updated successfully');
                          closeModal();
                        }} 
                        className="flex-1 action-button-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">First Name</label>
                      <input type="text" className="input-field" placeholder="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Last Name</label>
                      <input type="text" className="input-field" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                    <input type="email" className="input-field" placeholder="john.doe@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                    <input type="tel" className="input-field" placeholder="(555) 123-4567" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={closeModal} className="flex-1 action-button-secondary">
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        toast.success('Patient added successfully');
                        closeModal();
                      }} 
                      className="flex-1 action-button-primary"
                    >
                      Add Patient
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
