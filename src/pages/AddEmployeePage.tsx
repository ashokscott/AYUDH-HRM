import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Phone, Mail, MapPin, Calendar, User, Users, Briefcase, UserCheck, Image as ImageIcon } from 'lucide-react';
import { useEmployeeFields } from '@/hooks/use-employee-fields';

const GENDER_OPTIONS = ['Male', 'Female', 'Others'];
const EDUCATION_OPTIONS = [
  'No Formal Education',
  'Primary School',
  'Diploma/Certificate',
  'Undergraduate Degree',
  'Postgraduate Degree',
  'Doctoral/Research Level',
];


export default function AddEmployeePage() {
  // ...existing state and handlers...
  const [form, setForm] = useState<any>({});
  // Get dynamic fields (for future-proofing, but we will use all employee_master fields below)
  const { fields: dynamicFields } = useEmployeeFields();
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [employeeTypes, setEmployeeTypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchOptions() {
      const [des, mgr, ast, etypes, depts] = await Promise.all([
        supabase.from('designations').select('id, name'),
        supabase.from('employee_master').select('id, name'),
        supabase.from('company_assets').select('id, name'),
        supabase.from('employee_type').select('id, name, image_url'),
        supabase.from('departments').select('id, name'),
      ]);
      setDesignations(des.data || []);
      setManagers(mgr.data || []);
      setAssets(ast.data || []);
      setEmployeeTypes(etypes.data || []);
      setDepartments(depts.data || []);
      setFetching(false);
    }
    fetchOptions();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setForm((f: any) => ({ ...f, image: file }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let image_url = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('employee-images').upload(fileName, imageFile);
      if (error) {
        alert('Image upload failed: ' + error.message);
        return;
      }
      image_url = data?.path ? supabase.storage.from('employee-images').getPublicUrl(data.path).data.publicUrl : null;
    }
    const insertData = {
      name: form.name,
      employee_id: form.employee_id,
      date_of_birth: form.date_of_birth,
      mobile_number: form.mobile_number,
      personal_mail_id: form.personal_mail_id,
      official_mail_id: form.official_mail_id,
      current_address: form.current_address,
      permanent_address: form.permanent_address,
      emergency_contact_name: form.emergency_contact_name,
      emergency_contact_number: form.emergency_contact_number,
      gender: form.gender,
      highest_education: form.highest_education,
      employee_type_id: form.employee_type_id,
      date_of_joining: form.date_of_joining,
      department_id: form.department_id,
      branch_name: form.branch_name,
      designation_id: form.designation_id,
      reporting_manager_id: form.reporting_manager_id,
      shift_from: form.shift_from,
      shift_to: form.shift_to,
      account_name: form.account_name,
      account_number: form.account_number,
      bank_name: form.bank_name,
      ifsc_code: form.ifsc_code,
      hr_id_card_issue: form.hr_id_card_issue,
      hr_photo: form.hr_photo,
      hr_offer_letter: form.hr_offer_letter,
      hr_background_verf: form.hr_background_verf,
      hr_biomatrix: form.hr_biomatrix,
      hr_all_documents: form.hr_all_documents,
      image: image_url,
      company_assets: form.company_assets || null,
    };
    const { error } = await supabase.from('employee_master').insert(insertData);
    if (error) {
      alert('Failed to add employee: ' + error.message);
      return;
    }
    alert('Employee added!');
    setForm({});
    setImageFile(null);
    setImageUrl(null);
  };

  if (fetching) return <div className="p-4">Loading fields...</div>;


  // --- UI Layout ---
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="secondary" className="flex items-center gap-2" type="button" onClick={() => window.history.back()}>
          <span className="text-lg">&#8592;</span> Back to Employees
        </Button>
        <Button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded flex items-center gap-2" type="submit" form="add-employee-form">
          <UserCheck className="h-4 w-4" /> Add Employee
        </Button>
      </div>
      <Card className="p-8 shadow-xl">
        <form id="add-employee-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Image, Name, Emp ID, DOB | Contact Information side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Image, Name, Emp ID, DOB */}
            <div className="flex flex-col gap-4 w-full min-w-[320px] max-w-[500px] mx-auto items-stretch justify-start">
              <div className="relative flex items-center justify-center w-full">
                {/* Collar icon to the left, vertically centered */}
                {form.employee_type_id && (() => {
                  const selected = employeeTypes.find((et: any) => et.id === form.employee_type_id);
                  return (
                    <div className="absolute left-0 flex items-center h-full">
                      {selected?.image_url ? (
                        <img src={selected.image_url} alt={selected.name} style={{ maxWidth: 48, maxHeight: 48, borderRadius: '50%', border: '2px solid #f59e42', background: '#fff', boxShadow: '0 2px 8px #f59e4222' }} />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-gray-300" style={{ borderRadius: '50%', border: '2px solid #f59e42', background: '#fff' }} />
                      )}
                    </div>
                  );
                })()}
                <div className="flex justify-center w-full">
                  <Avatar className="h-48 w-48 mb-4 shadow-lg">
                    {imageUrl ? (
                      <AvatarImage src={imageUrl} />
                    ) : (
                      <AvatarFallback className="text-6xl bg-muted">IMG</AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full">Upload Image</Button>
              <Input className="text-2xl font-bold text-blue-900 uppercase tracking-wide text-center mt-2" placeholder="Name" value={form.name || ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} required />
              <Input className="text-center" placeholder="Employee ID" value={form.employee_id || ''} onChange={e => setForm((f: any) => ({ ...f, employee_id: e.target.value }))} />
              <div className="w-full text-left">
                <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                <Input type="date" value={form.date_of_birth || ''} onChange={e => setForm((f: any) => ({ ...f, date_of_birth: e.target.value }))} />
              </div>
            </div>
            {/* Right: Contact Information */}
            <div className="flex flex-col gap-4 w-full min-w-[320px] max-w-[500px] mx-auto items-stretch justify-start">
              <div className="font-bold text-lg text-blue-900 mb-2">Contact Information</div>
              <Input placeholder="Mobile Number" value={form.mobile_number || ''} onChange={e => setForm((f: any) => ({ ...f, mobile_number: e.target.value }))} />
              <Input placeholder="Personal Mail ID" value={form.personal_mail_id || ''} onChange={e => setForm((f: any) => ({ ...f, personal_mail_id: e.target.value }))} />
              <Input placeholder="Official Mail ID" value={form.official_mail_id || ''} onChange={e => setForm((f: any) => ({ ...f, official_mail_id: e.target.value }))} />
              <Textarea placeholder="Current Address" value={form.current_address || ''} onChange={e => setForm((f: any) => ({ ...f, current_address: e.target.value }))} />
              <Textarea placeholder="Permanent Address" value={form.permanent_address || ''} onChange={e => setForm((f: any) => ({ ...f, permanent_address: e.target.value }))} />
            </div>
          </div>
          {/* All lower sections in a single two-column grid, each section only once, moved up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Left column */}
            <div className="flex flex-col gap-8">
              {/* Emergency Contact */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-blue-900 mb-2">Emergency Contact</div>
                <Input placeholder="Emergency Contact Name" value={form.emergency_contact_name || ''} onChange={e => setForm((f: any) => ({ ...f, emergency_contact_name: e.target.value }))} />
                <Input placeholder="Emergency Contact Number" value={form.emergency_contact_number || ''} onChange={e => setForm((f: any) => ({ ...f, emergency_contact_number: e.target.value }))} />
                <Input placeholder="Relation" value={form.emergency_contact_relation || ''} onChange={e => setForm((f: any) => ({ ...f, emergency_contact_relation: e.target.value }))} />
              </div>
              {/* Statutory Details */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-blue-900 mb-2">Statutory Details</div>
                <Input placeholder="PAN" value={form.pan_card || ''} onChange={e => setForm((f: any) => ({ ...f, pan_card: e.target.value }))} />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">PAN Upload</label>
                  <Input type="file" accept="image/*,application/pdf" onChange={e => setForm((f: any) => ({ ...f, pan_image: e.target.files?.[0] }))} />
                </div>
                <Input placeholder="Aadhar" value={form.aadhar_number || ''} onChange={e => setForm((f: any) => ({ ...f, aadhar_number: e.target.value }))} />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Aadhar Upload</label>
                  <Input type="file" accept="image/*,application/pdf" onChange={e => setForm((f: any) => ({ ...f, aadhar_image: e.target.files?.[0] }))} />
                </div>
                <Input placeholder="PF" value={form.pf_number || ''} onChange={e => setForm((f: any) => ({ ...f, pf_number: e.target.value }))} />
                <Input placeholder="ESI" value={form.esi_number || ''} onChange={e => setForm((f: any) => ({ ...f, esi_number: e.target.value }))} />
              </div>
              {/* Company Assets */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-blue-900 mb-2">Company Assets</div>
                <Input placeholder="Laptop Model" value={form.laptop_model || ''} onChange={e => setForm((f: any) => ({ ...f, laptop_model: e.target.value }))} />
                <Input placeholder="Laptop Serial Number" value={form.laptop_serial || ''} onChange={e => setForm((f: any) => ({ ...f, laptop_serial: e.target.value }))} />
                <Input placeholder="Mobile Model" value={form.mobile_model || ''} onChange={e => setForm((f: any) => ({ ...f, mobile_model: e.target.value }))} />
                <Input placeholder="Mobile Serial Number" value={form.mobile_serial || ''} onChange={e => setForm((f: any) => ({ ...f, mobile_serial: e.target.value }))} />
                <Input placeholder="Sim" value={form.sim || ''} onChange={e => setForm((f: any) => ({ ...f, sim: e.target.value }))} />
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.mouse} onCheckedChange={v => setForm((f: any) => ({ ...f, mouse: v }))} /> Mouse
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.keyboard} onCheckedChange={v => setForm((f: any) => ({ ...f, keyboard: v }))} /> Keyboard
                  </label>
                </div>
              </div>
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-8">
              {/* Employment Details */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-blue-900 mb-2">Employment Details</div>
                {/* Employee Type icon selection */}
                <div className="mb-2">
                  <div className="mb-1 font-medium">Employee Type</div>
                  <div className="flex flex-wrap gap-4">
                    {employeeTypes.map((et: any) => (
                      <div
                        key={et.id}
                        className={`flex flex-col items-center cursor-pointer border rounded p-2 ${form.employee_type_id === et.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                        onClick={() => setForm((f: any) => ({ ...f, employee_type_id: et.id }))}
                        style={{ minWidth: 80 }}
                      >
                        {et.image_url ? (
                          <img src={et.image_url} alt={et.name} style={{ maxWidth: 48, maxHeight: 48 }} />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                        )}
                        <span className="text-xs mt-1">{et.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full text-left">
                  <label className="block text-xs text-gray-500 mb-1">Date of Joining</label>
                  <Input type="date" value={form.date_of_joining || ''} onChange={e => setForm((f: any) => ({ ...f, date_of_joining: e.target.value }))} />
                </div>
                <Select value={form.department_id || ''} onValueChange={val => setForm((f: any) => ({ ...f, department_id: val }))}>
                  <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Branch" value={form.branch_name || ''} onChange={e => setForm((f: any) => ({ ...f, branch_name: e.target.value }))} />
                <Select value={form.designation_id || ''} onValueChange={val => setForm((f: any) => ({ ...f, designation_id: val }))}>
                  <SelectTrigger><SelectValue placeholder="Designation" /></SelectTrigger>
                  <SelectContent>
                    {designations.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.reporting_manager_id || ''} onValueChange={val => setForm((f: any) => ({ ...f, reporting_manager_id: val }))}>
                  <SelectTrigger><SelectValue placeholder="Reporting Manager" /></SelectTrigger>
                  <SelectContent>
                    {managers.map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Shift From</span>
                    <Input
                      type="time"
                      value={form.shift_from || ''}
                      onChange={e => setForm((f: any) => ({ ...f, shift_from: e.target.value }))}
                      step="60"
                    />
                  </div>
                  <span className="mx-2">to</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Shift To</span>
                    <Input
                      type="time"
                      value={form.shift_to || ''}
                      onChange={e => setForm((f: any) => ({ ...f, shift_to: e.target.value }))}
                      step="60"
                    />
                  </div>
                </div>
              </div>
              {/* Bank Details */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-blue-900 mb-2">Bank Details</div>
                <Input placeholder="Account Name" value={form.account_name || ''} onChange={e => setForm((f: any) => ({ ...f, account_name: e.target.value }))} />
                <Input placeholder="Account Number" value={form.account_number || ''} onChange={e => setForm((f: any) => ({ ...f, account_number: e.target.value }))} />
                <Input placeholder="Bank Name" value={form.bank_name || ''} onChange={e => setForm((f: any) => ({ ...f, bank_name: e.target.value }))} />
                <Input placeholder="IFSC" value={form.ifsc_code || ''} onChange={e => setForm((f: any) => ({ ...f, ifsc_code: e.target.value }))} />
              </div>
              {/* HR Checks */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-blue-900 mb-2">HR Checks</div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.hr_id_card_issue} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_id_card_issue: v }))} /> ID Card Issued
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.hr_photo} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_photo: v }))} /> Photo
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.hr_offer_letter} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_offer_letter: v }))} /> Offer Letter
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.hr_background_verf} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_background_verf: v }))} /> Background Verification
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.hr_biomatrix} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_biomatrix: v }))} /> Biometric
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={!!form.hr_all_documents} onCheckedChange={v => setForm((f: any) => ({ ...f, hr_all_documents: v }))} /> All Documents
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
