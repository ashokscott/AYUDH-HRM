import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Settings2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function AdminTools() {
  const [fields, setFields] = useState([
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'status', label: 'Status', type: 'text' },
    { name: 'joinDate', label: 'Join Date', type: 'date' },
    { name: 'avatar', label: 'Avatar URL', type: 'text' },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });
  const [saving, setSaving] = useState(false);

  // TODO: Replace with Supabase fetch/save for real DB sync
  const handleAddField = async () => {
    setSaving(true);
    // Here you would call Supabase to ALTER TABLE and add the column
    setFields([...fields, newField]);
    setAddOpen(false);
    setNewField({ name: '', label: '', type: 'text' });
    setSaving(false);
    // Show toast or notification for success/failure
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          <CardTitle>Employee Master Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={e => { e.preventDefault(); handleAddField(); }} className="space-y-4">
                  <Input placeholder="Field Name (e.g. phone)" value={newField.name} onChange={e => setNewField(f => ({ ...f, name: e.target.value }))} required />
                  <Input placeholder="Label (e.g. Phone Number)" value={newField.label} onChange={e => setNewField(f => ({ ...f, label: e.target.value }))} required />
                  <select className="w-full border rounded p-2" value={newField.type} onChange={e => setNewField(f => ({ ...f, type: e.target.value }))}>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                    <option value="number">Number</option>
                  </select>
                  <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    {saving ? 'Adding...' : 'Add Field'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div key={idx} className="flex items-center gap-4 border rounded p-2">
                <span className="font-medium w-32">{field.label}</span>
                <span className="text-muted-foreground">{field.name}</span>
                <span className="text-xs bg-muted rounded px-2 py-1 ml-auto">{field.type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
