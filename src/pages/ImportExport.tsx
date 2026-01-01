import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Upload, Download, FileText, Users, Calendar, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DataType = 'patients' | 'appointments';
type ActionType = 'import' | 'export';

export default function ImportExport() {
  const [selectedDataType, setSelectedDataType] = useState<DataType>('patients');
  const [actionType, setActionType] = useState<ActionType>('import');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      toast.success(`${selectedDataType === 'patients' ? 'Patients' : 'Appointments'} imported successfully`);
      setTimeout(() => {
        setShowSuccess(false);
        setFile(null);
      }, 2000);
    }, 1500);
  };

  const handleExport = () => {
    setIsProcessing(true);
    // Simulate export
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`${selectedDataType === 'patients' ? 'Patients' : 'Appointments'} exported successfully`);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Import / Export</h1>
        <p className="text-muted-foreground">Import or export patient and appointment data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Options Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Data Type Selection */}
          <div className="bg-card rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Select Data Type</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedDataType('patients')}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200",
                  selectedDataType === 'patients'
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/30 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  selectedDataType === 'patients' ? "bg-primary/10" : "bg-muted"
                )}>
                  <Users className={cn(
                    "w-6 h-6",
                    selectedDataType === 'patients' ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Patients</p>
                  <p className="text-sm text-muted-foreground">Patient records and information</p>
                </div>
                {selectedDataType === 'patients' && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </button>

              <button
                onClick={() => setSelectedDataType('appointments')}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200",
                  selectedDataType === 'appointments'
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/30 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  selectedDataType === 'appointments' ? "bg-primary/10" : "bg-muted"
                )}>
                  <Calendar className={cn(
                    "w-6 h-6",
                    selectedDataType === 'appointments' ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Appointments</p>
                  <p className="text-sm text-muted-foreground">Appointment schedules and history</p>
                </div>
                {selectedDataType === 'appointments' && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </button>
            </div>
          </div>

          {/* Action Type Selection */}
          <div className="bg-card rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Select Action</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActionType('import')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  actionType === 'import'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={() => setActionType('export')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  actionType === 'export'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Format Info */}
          <div className="bg-card rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Supported Formats</h3>
            <div className="space-y-3">
              {['CSV', 'Excel (XLSX)', 'JSON'].map((format) => (
                <div key={format} className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{format}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Action Panel */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {actionType === 'import' ? 'Import' : 'Export'} {selectedDataType === 'patients' ? 'Patients' : 'Appointments'}
            </h3>

            {actionType === 'import' ? (
              <div className="space-y-6">
                {/* File Upload Zone */}
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                    file ? "border-success bg-success/5" : "border-border hover:border-primary/50 hover:bg-muted/20",
                    showSuccess && "border-success bg-success/10"
                  )}
                >
                  {showSuccess ? (
                    <div className="animate-scale-in">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-success" />
                      </div>
                      <p className="text-lg font-medium text-success mb-1">Import Successful!</p>
                      <p className="text-sm text-muted-foreground">Your data has been imported successfully</p>
                    </div>
                  ) : file ? (
                    <div>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground mb-1">{file.name}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <button 
                        onClick={() => setFile(null)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports CSV, Excel, and JSON files
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Import Options */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Import Options</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-border" defaultChecked />
                      <span className="text-sm text-foreground">Skip duplicate records</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-border" defaultChecked />
                      <span className="text-sm text-foreground">Validate data before import</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-border" />
                      <span className="text-sm text-foreground">Overwrite existing records</span>
                    </label>
                  </div>
                </div>

                {/* Import Button */}
                <button
                  onClick={handleImport}
                  disabled={!file || isProcessing}
                  className={cn(
                    "w-full action-button-primary py-3 gap-2",
                    (!file || isProcessing) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import {selectedDataType === 'patients' ? 'Patients' : 'Appointments'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Export Preview */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3 border-b border-border">
                    <p className="font-medium text-foreground">Export Preview</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Records to export</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selectedDataType === 'patients' ? '6' : '8'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Estimated file size</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selectedDataType === 'patients' ? '2.4 KB' : '1.8 KB'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-2">Columns included:</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedDataType === 'patients' 
                          ? ['ID', 'Name', 'Email', 'Phone', 'Insurance', 'Status']
                          : ['ID', 'Patient', 'Date', 'Time', 'Type', 'Status']
                        ).map((col) => (
                          <span key={col} className="badge-primary">{col}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Format */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Export Format</h4>
                  <div className="flex gap-2">
                    {['CSV', 'Excel', 'JSON'].map((format) => (
                      <button
                        key={format}
                        className="flex-1 py-2 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className={cn(
                    "w-full action-button-primary py-3 gap-2",
                    isProcessing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export {selectedDataType === 'patients' ? 'Patients' : 'Appointments'}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="bg-info/5 border border-info/20 rounded-xl p-4 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">Tips for {actionType === 'import' ? 'importing' : 'exporting'} data</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {actionType === 'import' ? (
                    <>
                      <li>• Ensure your file has the correct column headers</li>
                      <li>• Date format should be YYYY-MM-DD</li>
                      <li>• Phone numbers should include country code</li>
                    </>
                  ) : (
                    <>
                      <li>• CSV format is best for spreadsheet applications</li>
                      <li>• JSON format preserves all data types</li>
                      <li>• Excel format includes formatting options</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
