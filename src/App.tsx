

// === Status helpers

// === Controlled Modals: Add Property / Add Door ===
type NewProperty = { propertyId: string; address: string; rooms: number; state?: string };
type NewDoor = { name: string; lockType: 'Standard' | 'Eufy' | 'Sifely'; lockCode?: string; selfCloserInstalled?: boolean; lockboxInstalled?: boolean; lockboxCode?: string };

export function ControlledAddPropertyModal({
  isOpen, onClose, onSubmit
}: { isOpen: boolean; onClose: () => void; onSubmit: (p: NewProperty) => void; }) {
  const [form, setForm] = React.useState<NewProperty>({ propertyId: '', address: '', rooms: 1, state: 'GA' });
  React.useEffect(() => { if (!isOpen) setForm({ propertyId: '', address: '', rooms: 1, state: 'GA' }); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Property</h2>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="block mb-1">Property ID</span>
            <input className="w-full border rounded px-3 py-2" value={form.propertyId} onChange={e=>setForm({...form, propertyId:e.target.value})} />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">Address</span>
            <input className="w-full border rounded px-3 py-2" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">Rooms</span>
            <input type="number" min={0} className="w-full border rounded px-3 py-2" value={form.rooms} onChange={e=>setForm({...form, rooms:Number(e.target.value)||0})} />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">State</span>
            <input className="w-full border rounded px-3 py-2" value={form.state || ''} onChange={e=>setForm({...form, state:e.target.value})} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>onSubmit(form)}>Add</button>
        </div>
      </div>
    </div>
  );
}

export function ControlledAddDoorModal({
  isOpen, onClose, onSubmit
}: { isOpen: boolean; onClose: () => void; onSubmit: (d: NewDoor) => void; }) {
  const [form, setForm] = React.useState<NewDoor>({ name: '', lockType: 'Sifely', lockCode: '', selfCloserInstalled:false, lockboxInstalled:false, lockboxCode:'' });
  React.useEffect(() => { if (!isOpen) setForm({ name: '', lockType: 'Sifely', lockCode: '', selfCloserInstalled:false, lockboxInstalled:false, lockboxCode:'' }); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Door</h2>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="block mb-1">Door Name</span>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">Lock Type</span>
            <select className="w-full border rounded px-3 py-2" value={form.lockType} onChange={e=>setForm({...form, lockType:e.target.value as any})}>
              <option>Standard</option>
              <option>Eufy</option>
              <option>Sifely</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="block mb-1">Lock Code</span>
            <input className="w-full border rounded px-3 py-2" value={form.lockCode || ''} onChange={e=>setForm({...form, lockCode:e.target.value})} />
          </label>
          <div className="flex items-center gap-2">
            <input id="selfCloser" type="checkbox" checked={!!form.selfCloserInstalled} onChange={e=>setForm({...form, selfCloserInstalled:e.target.checked})} />
            <label htmlFor="selfCloser">Self Closer Installed</label>
          </div>
          <div className="flex items-center gap-2">
            <input id="lockboxInstalled" type="checkbox" checked={!!form.lockboxInstalled} onChange={e=>setForm({...form, lockboxInstalled:e.target.checked})} />
            <label htmlFor="lockboxInstalled">Lockbox Installed</label>
          </div>
          <label className="block text-sm">
            <span className="block mb-1">Lockbox Code</span>
            <input className="w-full border rounded px-3 py-2" value={form.lockboxCode || ''} onChange={e=>setForm({...form, lockboxCode:e.target.value})} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>onSubmit(form)}>Add Door</button>
        </div>
      </div>
    </div>
  );
}
 (safe, pure) ===
type DoorStatus = 'complete' | 'in_progress' | 'not_started';

const doorStatus = (d: any): DoorStatus => {
  if (!d) return 'not_started';
  if (d.lockType !== 'Sifely') return 'not_started';
  if (d.lockboxInstalled && d.selfCloserInstalled) return 'complete';
  return 'in_progress';
};

const computePropertyProgress = (doors: Record<string, any>) => {
  const arr = doors ? Object.values(doors) : [];
  if (arr.length === 0) return { completed: 0, total: 0, status: 'not_started' as DoorStatus };
  const completed = arr.filter(d => doorStatus(d) === 'complete').length;
  const inProg = arr.filter(d => doorStatus(d) === 'in_progress').length;
  const status: DoorStatus =
    completed === arr.length ? 'complete'
    : (completed > 0 || inProg > 0) ? 'in_progress'
    : 'not_started';
  return { completed, total: arr.length, status };
};

  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await firebaseService.signIn(email, password);
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Smart Lock Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your properties
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
            <p className="font-medium">Demo Accounts:</p>
            <p>Admin: admin@company.com / admin123</p>
            <p>Tech: tech1@company.com / tech123</p>
            <p>Owner: owner@property.com / owner123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Filter Chips Component
const FilterChips: React.FC<{
  activeFilters: { status: DoorStatus | 'all'; lockType: LockType | 'all' };
  onFilterChange: (filters: { status: DoorStatus | 'all'; lockType: LockType | 'all' }) => void;
}> = ({ activeFilters, onFilterChange }) => {
  const statusOptions: Array<{ value: DoorStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Status' },
    { value: 'complete', label: 'Complete' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'not_started', label: 'Not Started' }
  ];

  const lockTypeOptions: Array<{ value: LockType | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'Sifely', label: 'Sifely' },
    { value: 'Eufy', label: 'Eufy' },
    { value: 'Standard', label: 'Standard' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange({ ...activeFilters, status: option.value })}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeFilters.status === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {lockTypeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange({ ...activeFilters, lockType: option.value })}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeFilters.lockType === option.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Door View Component
const DoorView: React.FC<{
  property: Property;
  door: Door;
  onBack: () => void;
  onUpdate: (doorId: string, updates: Partial<Door>) => void;
  canEdit: boolean;
}> = ({ property, door, onBack, onUpdate, canEdit }) => {
  const [editedDoor, setEditedDoor] = useState<Door>({ ...door });
  const [hasChanges, setHasChanges] = useState(false);
  const { toasts, addToast } = useToast();
  
  const status = doorStatus(door);
  const classes = statusToClasses[status];

  useEffect(() => {
    setEditedDoor({ ...door });
    setHasChanges(false);
  }, [door]);

  const handleFieldChange = (field: keyof Door, value: any) => {
    if (!canEdit) return;
    
    setEditedDoor(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(door.id, editedDoor);
      setHasChanges(false);
      addToast('Door updated successfully');
    } catch (error) {
      addToast('Failed to update door', 'error');
    }
  };

  const handleCancel = () => {
    setEditedDoor({ ...door });
    setHasChanges(false);
  };

  const handleCopyCode = async (code: string, type: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      addToast(`${type} copied to clipboard`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            aria-label="Go back to property view"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{door.name}</h1>
            <p className="text-gray-600">{property.address}</p>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Door Configuration</h2>
            
            <div className="space-y-6">
              {/* Door Name */}
              <div>
                <label htmlFor="doorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Door Name
                </label>
                <input
                  id="doorName"
                  type="text"
                  value={editedDoor.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  readOnly={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Lock Type */}
              <div>
                <label htmlFor="lockType" className="block text-sm font-medium text-gray-700 mb-2">
                  Lock Type
                </label>
                <select
                  id="lockType"
                  value={editedDoor.lockType}
                  onChange={(e) => handleFieldChange('lockType', e.target.value as LockType)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="Standard">Standard</option>
                  <option value="Eufy">Eufy</option>
                  <option value="Sifely">Sifely</option>
                </select>
              </div>

              {/* Lock Code */}
              <div>
                <label htmlFor="lockCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Lock Code
                </label>
                <PasswordField
                  value={editedDoor.lockCode}
                  placeholder="Enter lock code"
                  onChange={(value) => handleFieldChange('lockCode', value)}
                  readOnly={!canEdit}
                  canCopy={!!editedDoor.lockCode}
                  onCopy={() => handleCopyCode(editedDoor.lockCode, 'Lock code')}
                  label="Lock code"
                />
              </div>

              {/* Lockbox Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="lockboxInstalled"
                    type="checkbox"
                    checked={editedDoor.lockboxInstalled}
                    onChange={(e) => handleFieldChange('lockboxInstalled', e.target.checked)}
                    disabled={!canEdit}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="lockboxInstalled" className="ml-2 block text-sm font-medium text-gray-700">
                    Lockbox Installed
                  </label>
                </div>

                {editedDoor.lockboxInstalled && (
                  <div>
                    <label htmlFor="lockboxCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Lockbox Code
                    </label>
                    <PasswordField
                      value={editedDoor.lockboxCode || ''}
                      placeholder="Enter lockbox code"
                      onChange={(value) => handleFieldChange('lockboxCode', value)}
                      readOnly={!canEdit}
                      canCopy={!!editedDoor.lockboxCode}
                      onCopy={() => handleCopyCode(editedDoor.lockboxCode || '', 'Lockbox code')}
                      label="Lockbox code"
                    />
                  </div>
                )}
              </div>

              {/* Self Closer */}
              <div>
                <div className="flex items-center">
                  <input
                    id="selfCloserInstalled"
                    type="checkbox"
                    checked={editedDoor.selfCloserInstalled}
                    onChange={(e) => handleFieldChange('selfCloserInstalled', e.target.checked)}
                    disabled={!canEdit}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="selfCloserInstalled" className="ml-2 block text-sm font-medium text-gray-700">
                    Self-closer Installed
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="doorNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="doorNotes"
                  rows={4}
                  value={editedDoor.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  readOnly={!canEdit}
                  placeholder="Add any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-vertical"
                />
              </div>

              {/* Save/Cancel Buttons */}
              {canEdit && hasChanges && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary Sidebar */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className={`${classes.card} ${classes.border} border-l-4 rounded-lg p-4`}>
            <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
            <StatusPill status={status} />
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lock Type:</span>
                <span className="font-medium">{door.lockType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lockbox:</span>
                <span className={`font-medium ${door.lockboxInstalled ? 'text-green-600' : 'text-red-600'}`}>
                  {door.lockboxInstalled ? 'Installed' : 'Not Installed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Self-closer:</span>
                <span className={`font-medium ${door.selfCloserInstalled ? 'text-green-600' : 'text-red-600'}`}>
                  {door.selfCloserInstalled ? 'Installed' : 'Not Installed'}
                </span>
              </div>
            </div>
          </div>

          {/* Requirements for Complete Status */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Completion Requirements</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {door.lockType === 'Sifely' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <span className={door.lockType === 'Sifely' ? 'text-green-600' : 'text-red-600'}>
                  Sifely lock type
                </span>
              </div>
              <div className="flex items-center gap-2">
                {door.lockboxInstalled ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <span className={door.lockboxInstalled ? 'text-green-600' : 'text-red-600'}>
                  Lockbox installed
                </span>
              </div>
              <div className="flex items-center gap-2">
                {door.selfCloserInstalled ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <span className={door.selfCloserInstalled ? 'text-green-600' : 'text-red-600'}>
                  Self-closer installed
                </span>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Property Info</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Property ID:</span>
                <div className="font-medium">{property.propertyId}</div>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <div className="font-medium">{property.address}</div>
              </div>
              <div>
                <span className="text-gray-600">Rooms:</span>
                <div className="font-medium">{property.rooms}</div>
              </div>
              <div>
                <span className="text-gray-600">State:</span>
                <div className="font-medium">{property.state}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
};

// Main App Component
export default function SmartLockTracker() {

// Controlled modal state (injected)
const [isAddPropertyOpen, setIsAddPropertyOpen] = React.useState(false);
const [isAddDoorOpen, setIsAddDoorOpen] = React.useState(false);
const [newPropertyDraft, setNewPropertyDraft] = React.useState<NewProperty>({ propertyId:'', address:'', rooms:1, state:'GA' });
const [newDoorDraft, setNewDoorDraft] = React.useState<NewDoor>({ name:'', lockType:'Sifely', lockCode:'', selfCloserInstalled:false, lockboxInstalled:false, lockboxCode:'' });

// Use these callbacks to replace any document.getElementById reads:
const submitNewProperty = () => {
  if (!newPropertyDraft.propertyId || !newPropertyDraft.address) return;
  if (typeof handleAddProperty === 'function') {
    // Prefer existing handler if it accepts payload:
    try { (handleAddProperty as any)(newPropertyDraft); } catch { /* no-op */ }
  }
  if (typeof addProperty === 'function') {
    (addProperty as any)(newPropertyDraft);
  }
  setIsAddPropertyOpen(false);
};
const submitNewDoor = () => {
  if (!newDoorDraft.name) return;
  if (typeof handleAddDoor === 'function') { try { (handleAddDoor as any)(newDoorDraft); } catch {} }
  if (typeof addDoor === 'function') { (addDoor as any)(newDoorDraft); }
  setIsAddDoorOpen(false);
};


  const [data, setData] = useState<{ properties: Record<string, Property>; users: Record<string, User> } | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  // TODO: debounce search updates if necessary
const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ status: DoorStatus | 'all'; lockType: LockType | 'all' }>({
    status: 'all',
    lockType: 'all'
  });
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddDoor, setShowAddDoor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'property' | 'door'; id: string; name: string } | null>(null);
  const { toasts, addToast } = useToast();

  const selectedProperty = useMemo(
    () => selectedPropertyId && data ? data.properties[selectedPropertyId] : null,
    [selectedPropertyId, data]
  );

  const selectedDoor = useMemo(
    () => (selectedProperty && selectedDoorId) ? selectedProperty.doors[selectedDoorId] : null,
    [selectedProperty, selectedDoorId]
  );

  // Authentication effect
  useEffect(() => {
    const user = firebaseService.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const unsubscribe = firebaseService.onSnapshot((newData) => {
        setData(newData);
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    if (!data) return [];
    
    return Object.values(data.properties).filter(property => {
      const matchesSearch = searchTerm === '' || 
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(property.doors).some(door => 
          door.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          door.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (filters.status === 'all' && filters.lockType === 'all') return true;

      const doors = Object.values(property.doors);
      
      if (filters.status !== 'all') {
        const progress = computePropertyProgress(property.doors);
        if (progress.status !== filters.status) return false;
      }

      if (filters.lockType !== 'all') {
        const hasMatchingLockType = doors.some(door => door.lockType === filters.lockType);
        if (!hasMatchingLockType) return false;
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  // Filtered doors for property view
  const filteredDoors = useMemo(() => {
    if (!selectedProperty) return [];
    
    return Object.values(selectedProperty.doors).filter(door => {
      const matchesSearch = searchTerm === '' ||
        door.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        door.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filters.status !== 'all') {
        const status = doorStatus(door);
        if (status !== filters.status) return false;
      }

      if (filters.lockType !== 'all') {
        if (door.lockType !== filters.lockType) return false;
      }

      return true;
    });
  }, [selectedProperty, searchTerm, filters]);

  const handleLogin = () => {
    const user = firebaseService.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await firebaseService.signOut();
    setCurrentUser(null);
    setSelectedPropertyId(null);
    setSelectedDoorId(null);
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedDoorId(null);
  };

  const handleDoorSelect = (doorId: string) => {
    setSelectedDoorId(doorId);
  };

  const handleBack = () => {
    if (selectedDoorId) {
      setSelectedDoorId(null);
    } else {
      setSelectedPropertyId(null);
    }
  };

  const handleUpdateProperty = async (propertyId: string, updates: Partial<Property>) => {
    try {
      await firebaseService.updateProperty(propertyId, updates);
      addToast('Property updated successfully');
    } catch (error) {
      addToast('Failed to update property', 'error');
    }
  };

  const handleUpdateDoor = async (doorId: string, updates: Partial<Door>) => {
    if (!selectedPropertyId) return;
    
    try {
      await firebaseService.updateDoor(selectedPropertyId, doorId, updates);
      addToast('Door updated successfully');
    } catch (error) {
      addToast('Failed to update door', 'error');
    }
  };

  const handleAddProperty = async (property: Omit<Property, 'id' | 'createdBy' | 'lastUpdated' | 'doors'>) => {
    try {
      await firebaseService.addProperty(property);
      setShowAddProperty(false);
      addToast('Property added successfully');
    } catch (error) {
      addToast('Failed to add property', 'error');
    }
  };

  const handleAddDoor = async (door: Omit<Door, 'id' | 'lockType' | 'lockCode' | 'lockboxInstalled' | 'lockboxCode' | 'selfCloserInstalled' | 'notes'>) => {
    if (!selectedPropertyId) return;
    
    try {
      await firebaseService.addDoor(selectedPropertyId, door);
      setShowAddDoor(false);
      addToast('Door added successfully');
    } catch (error) {
      addToast('Failed to add door', 'error');
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
      if (showDeleteConfirm.type === 'property') {
        await firebaseService.deleteProperty(showDeleteConfirm.id);
        if (selectedPropertyId === showDeleteConfirm.id) {
          setSelectedPropertyId(null);
          setSelectedDoorId(null);
        }
        addToast('Property deleted successfully');
      } else {
        if (selectedPropertyId) {
          await firebaseService.deleteDoor(selectedPropertyId, showDeleteConfirm.id);
          if (selectedDoorId === showDeleteConfirm.id) {
            setSelectedDoorId(null);
          }
          addToast('Door deleted successfully');
        }
      }
    } catch (error) {
      addToast(`Failed to delete ${showDeleteConfirm.type}`, 'error');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const canEdit = hasPermission(currentUser, 'edit');
  const canDelete = hasPermission(currentUser, 'delete');
  const canCreate = hasPermission(currentUser, 'create');

  // Login screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Door detail view
  if (selectedProperty && selectedDoor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Smart Lock Tracker</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{currentUser.role}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                aria-label="Go back to properties"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProperty.propertyId}</h1>
                <p className="text-gray-600">{selectedProperty.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusPill status={doorStatus(selectedDoor)} />
              {canCreate && (
                <button
                  onClick={() => setShowAddDoor(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Door
                </button>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property ID
                    </label>
                    <input
                      type="text"
                      value={selectedProperty.propertyId}
                      onChange={(e) => handleUpdateProperty(selectedProperty.id, { propertyId: e.target.value })}
                      readOnly={!canEdit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rooms
                    </label>
                    <input
                      type="number"
                      value={selectedProperty.rooms}
                      onChange={(e) => handleUpdateProperty(selectedProperty.id, { rooms: parseInt(e.target.value) || 0 })}
                      readOnly={!canEdit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={selectedProperty.address}
                      onChange={(e) => handleUpdateProperty(selectedProperty.id, { address: e.target.value })}
                      readOnly={!canEdit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={selectedProperty.state}
                      onChange={(e) => handleUpdateProperty(selectedProperty.id, { state: e.target.value })}
                      readOnly={!canEdit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* WiFi & Account Section */}
                {currentUser?.role === 'admin' && (
                  <div className="mt-8 space-y-6">
                    <h3 className="text-md font-semibold text-gray-900">Network & Account Information</h3>
                    
                    {/* Main WiFi */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        Main WiFi
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">SSID</label>
                          <input
                            type="text"
                            value={selectedProperty.mainWifi?.ssid || ''}
                            onChange={(e) => handleUpdateProperty(selectedProperty.id, {
                              mainWifi: { ...selectedProperty.mainWifi, ssid: e.target.value }
                            })}
                            readOnly={!canEdit}
                            placeholder="Network name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                          <PasswordField
                            value={selectedProperty.mainWifi?.password || ''}
                            placeholder="WiFi password"
                            onChange={(value) => handleUpdateProperty(selectedProperty.id, {
                              mainWifi: { ...selectedProperty.mainWifi, password: value }
                            })}
                            readOnly={!canEdit}
                            canCopy={!!selectedProperty.mainWifi?.password}
                            onCopy={() => addToast('Main WiFi password copied')}
                            label="Main WiFi password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Locks WiFi */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        Locks WiFi
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">SSID</label>
                          <input
                            type="text"
                            value={selectedProperty.locksWifi?.ssid || ''}
                            onChange={(e) => handleUpdateProperty(selectedProperty.id, {
                              locksWifi: { ...selectedProperty.locksWifi, ssid: e.target.value }
                            })}
                            readOnly={!canEdit}
                            placeholder="Network name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                          <PasswordField
                            value={selectedProperty.locksWifi?.password || ''}
                            placeholder="WiFi password"
                            onChange={(value) => handleUpdateProperty(selectedProperty.id, {
                              locksWifi: { ...selectedProperty.locksWifi, password: value }
                            })}
                            readOnly={!canEdit}
                            canCopy={!!selectedProperty.locksWifi?.password}
                            onCopy={() => addToast('Locks WiFi password copied')}
                            label="Locks WiFi password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sifely Account */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Sifely Account
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                          <input
                            type="email"
                            value={selectedProperty.sifelyAccount?.email || ''}
                            onChange={(e) => handleUpdateProperty(selectedProperty.id, {
                              sifelyAccount: { ...selectedProperty.sifelyAccount, email: e.target.value }
                            })}
                            readOnly={!canEdit}
                            placeholder="account@sifely.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                          <PasswordField
                            value={selectedProperty.sifelyAccount?.password || ''}
                            placeholder="Account password"
                            onChange={(value) => handleUpdateProperty(selectedProperty.id, {
                              sifelyAccount: { ...selectedProperty.sifelyAccount, password: value }
                            })}
                            readOnly={!canEdit}
                            canCopy={!!selectedProperty.sifelyAccount?.password}
                            onCopy={() => addToast('Sifely password copied')}
                            label="Sifely account password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Property Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Notes
                  </label>
                  <textarea
                    rows={3}
                    value={selectedProperty.notes || ''}
                    onChange={(e) => handleUpdateProperty(selectedProperty.id, { notes: e.target.value })}
                    readOnly={!canEdit}
                    placeholder="Add any property-specific notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-vertical"
                  />
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Progress Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="text-sm font-medium">{progress.completed}/{progress.total}</span>
                    </div>
                    <ProgressBar completed={progress.completed} total={progress.total} />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <StatusPill status={doorStatus(selectedDoor)} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Property Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Doors:</span>
                    <span className="font-medium">{progress.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">{progress.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-red-600">{progress.total - progress.completed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doors Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Doors</h2>
                <span className="text-sm text-gray-600">{filteredDoors.length} doors</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search doors..."
                  />
                </div>
              </div>
              
              <FilterChips activeFilters={filters} onFilterChange={setFilters} />
            </div>

            <div className="p-6">
              {filteredDoors.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No doors found</p>
                  {canCreate && (
                    <button
                      onClick={() => setShowAddDoor(true)}
                      className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Door
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDoors.map((door) => (
                    <DoorCard
                      key={door.id}
                      door={door}
                      onClick={() => handleDoorSelect(door.id)}
                      onDelete={canDelete ? () => setShowDeleteConfirm({ type: 'door', id: door.id, name: door.name }) : undefined}
                      canDelete={canDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Properties list view
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Smart Lock Tracker</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{currentUser.role}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
              <p className="text-gray-600">Manage smart lock installations across all properties</p>
            </div>
            {canCreate && (
              <button
                onClick={() => setShowAddProperty(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search properties..."
              />
            </div>
          </div>

          <FilterChips activeFilters={filters} onFilterChange={setFilters} />
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No properties found</p>
            <p className="text-gray-400 mb-6">Get started by adding your first property</p>
            {canCreate && (
              <button
                onClick={() => setShowAddProperty(true)}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
                Add First Property
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const progress = computePropertyProgress(property.doors);
              return (
                <PropertyCard
                  key={property.id}
                  property={property}
                  progress={progress}
                  onClick={() => handlePropertySelect(property.id)}
                  onDelete={canDelete ? () => setShowDeleteConfirm({ type: 'property', id: property.id, name: property.propertyId }) : undefined}
                  canDelete={canDelete}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Property</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPropertyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Property ID
                </label>
                <input
                  id="newPropertyId"
                  type="text"
                  placeholder="P-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="newAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="newAddress"
                  type="text"
                  placeholder="123 Main St, City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="newRooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rooms
                </label>
                <input
                  id="newRooms"
                  type="number"
                  min="1"
                  placeholder="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="newState" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  id="newState"
                  type="text"
                  placeholder="GA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  const propertyId = (document.getElementById('newPropertyId') as HTMLInputElement)?.value;
                  const address = (document.getElementById('newAddress') as HTMLInputElement)?.value;
                  const rooms = parseInt((document.getElementById('newRooms') as HTMLInputElement)?.value) || 1;
                  const state = (document.getElementById('newState') as HTMLInputElement)?.value;
                  
                  if (propertyId && address && state) {
                    handleAddProperty({ propertyId, address, rooms, state });
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Property
              </button>
              <button
                onClick={() => setShowAddProperty(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Door Modal */}
      {showAddDoor && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Door</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="newDoorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Door Name
                </label>
                <input
                  id="newDoorName"
                  type="text"
                  placeholder="Front Door"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  const name = (document.getElementById('newDoorName') as HTMLInputElement)?.value;
                  
                  if (name) {
                    handleAddDoor({ name });
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Door
              </button>
              <button
                onClick={() => setShowAddDoor(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {showDeleteConfirm.type} "{showDeleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}" />
                <span className="text-xl font-bold text-gray-900">Smart Lock Tracker</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{currentUser.role}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DoorView
            property={selectedProperty}
            door={selectedDoor}
            onBack={handleBack}
            onUpdate={handleUpdateDoor}
            canEdit={canEdit}
          />
        </main>
      </div>
    );
  }

  // Property detail view
  if (selectedProperty) {
    const progress = computePropertyProgress(selectedProperty.doors);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

// Render controlled modals at document body level
try { ReactDOM.createPortal((


{/* Controlled Modals (injected) */}
<ControlledAddPropertyModal
  isOpen={isAddPropertyOpen}
  onClose={() => setIsAddPropertyOpen(false)}
  onSubmit={(p) => { setNewPropertyDraft(p); submitNewProperty(); }}
/>
<ControlledAddDoorModal
  isOpen={isAddDoorOpen}
  onClose={() => setIsAddDoorOpen(false)}
  onSubmit={(d) => { setNewDoorDraft(d); submitNewDoor(); }}
/>

), document.body); } catch {}
