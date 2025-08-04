
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

const GENDER_OPTIONS = ['Male', 'Female', 'Others'];
const EDUCATION_OPTIONS = [
  'No Formal Education',
  'Primary School',
  'Diploma/Certificate',
  'Undergraduate Degree',
  'Postgraduate Degree',
  'Doctoral/Research Level',
];

export default function AddEmployeeForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
  const [form, setForm] = useState<any>({});
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      const [des, mgr, ast] = await Promise.all([
        supabase.from('designations').select('id, name'),
        supabase.from('employee_master').select('id, name'),
        supabase.from('company_assets').select('id, name'),
      ]);
      setDesignations(des.data || []);
      setManagers(mgr.data || []);
      setAssets(ast.data || []);
      setFetching(false);
    }
    fetchOptions();
  }, []);

  if (fetching) return <div className="p-4">Loading fields...</div>;

  // Helper for multiselect assets
  const handleAssetChange = (id: string) => {
    setForm((f: any) => {
      const arr = Array.isArray(f.company_assets) ? f.company_assets : [];
      return {
        ...f,
        company_assets: arr.includes(id)
          ? arr.filter((a: string) => a !== id)
          : [...arr, id],
      };
    });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <DialogHeader>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogDescription>Fill in the details to add a new employee.</DialogDescription>
      </DialogHeader>
      {/* Name */}
      <Input placeholder="Name" value={form.name || ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} required />
      {/* Employee ID */}
      <Input placeholder="Employee ID" value={form.employee_id || ''} onChange={e => setForm((f: any) => ({ ...f, employee_id: e.target.value }))} required />
      {/* Date of Joining */}
      <Input type="date" placeholder="Date of Joining" value={form.date_of_joining || ''} onChange={e => setForm((f: any) => ({ ...f, date_of_joining: e.target.value }))} required />
      {/* Mobile Number */}
      <Input placeholder="Mobile Number" value={form.mobile_number || ''} onChange={e => setForm((f: any) => ({ ...f, mobile_number: e.target.value }))} />
      {/* Personal Mail ID */}
      <Input placeholder="Personal Mail ID" value={form.personal_mail_id || ''} onChange={e => setForm((f: any) => ({ ...f, personal_mail_id: e.target.value }))} />
      {/* Official Mail ID */}
      <Input placeholder="Official Mail ID" value={form.official_mail_id || ''} onChange={e => setForm((f: any) => ({ ...f, official_mail_id: e.target.value }))} />
      {/* Designation */}
      <Select value={form.designation_id || ''} onValueChange={val => setForm((f: any) => ({ ...f, designation_id: val }))}>
        <SelectTrigger><SelectValue placeholder="Designation" /></SelectTrigger>
        <SelectContent>
          {designations.map((d: any) => (
            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Reporting Manager */}
      <Select value={form.reporting_manager_id || ''} onValueChange={val => setForm((f: any) => ({ ...f, reporting_manager_id: val }))}>
        <SelectTrigger><SelectValue placeholder="Reporting Manager" /></SelectTrigger>
        <SelectContent>
          {managers.map((m: any) => (
            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Gender */}
      <Select value={form.gender || ''} onValueChange={val => setForm((f: any) => ({ ...f, gender: val }))}>
        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
        <SelectContent>
          {GENDER_OPTIONS.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Date of Birth */}
      <Input type="date" placeholder="Date of Birth" value={form.date_of_birth || ''} onChange={e => setForm((f: any) => ({ ...f, date_of_birth: e.target.value }))} />
      {/* Blood Group */}
      <Input placeholder="Blood Group" value={form.blood_group || ''} onChange={e => setForm((f: any) => ({ ...f, blood_group: e.target.value }))} />
      {/* Aadhar Number */}
      <Input placeholder="Aadhar Number" value={form.aadhar_number || ''} onChange={e => setForm((f: any) => ({ ...f, aadhar_number: e.target.value }))} />
      {/* Pan Card */}
      <Input placeholder="Pan Card" value={form.pan_card || ''} onChange={e => setForm((f: any) => ({ ...f, pan_card: e.target.value }))} />
      {/* UAN Number */}
      <Input placeholder="UAN Number" value={form.uan_number || ''} onChange={e => setForm((f: any) => ({ ...f, uan_number: e.target.value }))} />
      {/* PF Number */}
      <Input placeholder="PF Number" value={form.pf_number || ''} onChange={e => setForm((f: any) => ({ ...f, pf_number: e.target.value }))} />
      {/* Bank Name */}
      <Input placeholder="Bank Name" value={form.bank_name || ''} onChange={e => setForm((f: any) => ({ ...f, bank_name: e.target.value }))} />
      {/* Branch Name */}
      <Input placeholder="Branch Name" value={form.branch_name || ''} onChange={e => setForm((f: any) => ({ ...f, branch_name: e.target.value }))} />
      {/* Account Number */}
      <Input placeholder="Account Number" value={form.account_number || ''} onChange={e => setForm((f: any) => ({ ...f, account_number: e.target.value }))} />
      {/* IFSC Code */}
      <Input placeholder="IFSC Code" value={form.ifsc_code || ''} onChange={e => setForm((f: any) => ({ ...f, ifsc_code: e.target.value }))} />
      {/* Shift */}
      <Input placeholder="Shift" value={form.shift || ''} onChange={e => setForm((f: any) => ({ ...f, shift: e.target.value }))} />
      {/* Emergency Contact Name */}
      <Input placeholder="Emergency Contact Name" value={form.emergency_contact_name || ''} onChange={e => setForm((f: any) => ({ ...f, emergency_contact_name: e.target.value }))} />
      {/* Emergency Contact Number */}
      <Input placeholder="Emergency Contact Number" value={form.emergency_contact_number || ''} onChange={e => setForm((f: any) => ({ ...f, emergency_contact_number: e.target.value }))} />
      {/* Father's Name */}
      <Input placeholder="Father's Name" value={form.father_name || ''} onChange={e => setForm((f: any) => ({ ...f, father_name: e.target.value }))} />
      {/* Mother's Name */}
      <Input placeholder="Mother's Name" value={form.mother_name || ''} onChange={e => setForm((f: any) => ({ ...f, mother_name: e.target.value }))} />
      {/* Any Phone Number */}
      <Input placeholder="Any Phone Number" value={form.any_phone_number || ''} onChange={e => setForm((f: any) => ({ ...f, any_phone_number: e.target.value }))} />
      {/* Spouse Name */}
      <Input placeholder="Spouse Name" value={form.spouse_name || ''} onChange={e => setForm((f: any) => ({ ...f, spouse_name: e.target.value }))} />
      {/* Spouse DOB */}
      <Input type="date" placeholder="Spouse DOB" value={form.spouse_dob || ''} onChange={e => setForm((f: any) => ({ ...f, spouse_dob: e.target.value }))} />
      {/* Spouse Number */}
      <Input placeholder="Spouse Number" value={form.spouse_number || ''} onChange={e => setForm((f: any) => ({ ...f, spouse_number: e.target.value }))} />
      {/* Child Name */}
      <Input placeholder="Child Name" value={form.child_name || ''} onChange={e => setForm((f: any) => ({ ...f, child_name: e.target.value }))} />
      {/* Child DOB */}
      <Input type="date" placeholder="Child DOB" value={form.child_dob || ''} onChange={e => setForm((f: any) => ({ ...f, child_dob: e.target.value }))} />
      {/* Highest Education */}
      <Select value={form.highest_education || ''} onValueChange={val => setForm((f: any) => ({ ...f, highest_education: val }))}>
        <SelectTrigger><SelectValue placeholder="Highest Education" /></SelectTrigger>
        <SelectContent>
          {EDUCATION_OPTIONS.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Current Address */}
      <Textarea placeholder="Current Address" value={form.current_address || ''} onChange={e => setForm((f: any) => ({ ...f, current_address: e.target.value }))} />
      {/* Permanent Address */}
      <Textarea placeholder="Permanent Address" value={form.permanent_address || ''} onChange={e => setForm((f: any) => ({ ...f, permanent_address: e.target.value }))} />
      {/* Linkedin Link */}
      <Input placeholder="Linkedin Link" value={form.linkedin_link || ''} onChange={e => setForm((f: any) => ({ ...f, linkedin_link: e.target.value }))} />
      {/* Company Assets (multiselect) */}
      <div>
        <div className="mb-1 font-medium">Company Assets</div>
        <div className="flex flex-wrap gap-2">
          {assets.map((a: any) => (
            <label key={a.id} className="flex items-center gap-1">
              <Checkbox checked={Array.isArray(form.company_assets) && form.company_assets.includes(a.id)} onCheckedChange={() => handleAssetChange(a.id)} />
              <span>{a.name}</span>
            </label>
          ))}
        </div>
      </div>
      {/* HR Checks (booleans) */}
      <div className="grid grid-cols-2 gap-2">
        <label><Checkbox checked={!!form.hr_id_card_issue} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_id_card_issue: v }))} /> ID Card Issue</label>
        <label><Checkbox checked={!!form.hr_photo} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_photo: v }))} /> Photo</label>
        <label><Checkbox checked={!!form.hr_offer_letter} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_offer_letter: v }))} /> Offer Letter</label>
        <label><Checkbox checked={!!form.hr_background_verf} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_background_verf: v }))} /> Background Verf.</label>
        <label><Checkbox checked={!!form.hr_laptop} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_laptop: v }))} /> Laptop</label>
        <label><Checkbox checked={!!form.hr_joining_kit} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_joining_kit: v }))} /> Joining Kit</label>
        <label><Checkbox checked={!!form.hr_biomatrix} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_biomatrix: v }))} /> Biomatrix</label>
        <label><Checkbox checked={!!form.hr_all_documents} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_all_documents: v }))} /> All Documents</label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
          {loading ? 'Adding...' : 'Add Employee'}
        </Button>
      </DialogFooter>
    </form>
  );
}
