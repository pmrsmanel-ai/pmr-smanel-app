import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, UserCheck, Wallet, Users, LogOut, Search, Filter, AlertCircle, CheckCircle2, 
  Clock, Loader2, History, Save, ShieldCheck, ClipboardList, Lock, User as UserIcon, Eye, EyeOff, 
  Settings, Edit2, X, PlusCircle, TrendingDown, TrendingUp, Receipt, Menu, Coins, Trash2, CheckSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// URL API Google Apps Script (v4.0)
const API_URL = "https://script.google.com/macros/s/AKfycbz1QJJ8jAFvc6vF0CzF0gOIT2BuOQBZw01Aj_P8DocTFaZ1cLYoq7o-XE-H_6SU5_fCwQ/exec";

const ROLES = { ADMIN: 'Admin', SEKRETARIS: 'Sekretaris', BENDAHARA: 'Bendahara' };
const STATUS_OPTIONS = [
  { id: 'Hadir', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'Sakit', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'Izin', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Alpha', color: 'bg-red-50 text-red-700 border-red-100' },
  { id: 'Terlambat', color: 'bg-orange-50 text-orange-700 border-orange-200' },
];
const CHART_COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

// --- HELPER COMPONENTS ---

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 text-center bg-gray-50/50">
          <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100"><ShieldCheck size={32} /></div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">PMR SMANEL</h2>
          <p className="text-[10px] text-red-600 font-extrabold tracking-[0.3em] uppercase mt-2">MANAGEMENT SYSTEM</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }} className="p-8 space-y-6">
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Username</label><div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="User" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none" /></div></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Sandi" className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
          <button type="submit" className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 uppercase tracking-widest transition-all">Masuk</button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, val, color, icon, dark }) {
  const colors = { green: 'border-green-500 text-green-600', red: 'border-red-500 text-red-600', blue: 'border-blue-500 text-blue-400', orange: 'border-orange-500 text-orange-600' };
  return (
    <div className={`rounded-lg border shadow-sm p-5 border-l-4 ${dark ? 'bg-gray-800 text-white border-blue-500' : 'bg-white ' + colors[color]}`}>
      <div className="flex justify-between items-start mb-3"><p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p><div>{icon}</div></div>
      <h2 className="text-xl font-bold tracking-tighter">Rp {val.toLocaleString('id-ID')}</h2>
    </div>
  );
}

function DashboardView({ data }) {
  const stats = useMemo(() => {
    const inc = data.finance.filter(f => f.Status === 'Lunas').reduce((a,b) => a+Number(b.Nominal), 0);
    const exp = data.expenses.reduce((a,b) => a+Number(b.Nominal), 0);
    const debt = data.finance.filter(f => f.Status === 'Belum Lunas').reduce((a,b) => a+Number(b.Nominal), 0);
    const chartData = [
      { name: 'Pemasukan', value: inc },
      { name: 'Pengeluaran', value: exp },
      { name: 'Piutang', value: debt }
    ];
    return { inc, exp, debt, bal: inc - exp, chartData };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pemasukan" val={stats.inc} color="green" icon={<TrendingUp size={16}/>} />
        <StatCard label="Total Pengeluaran" val={stats.exp} color="red" icon={<TrendingDown size={16}/>} />
        <StatCard label="Saldo Kas" val={stats.bal} color="blue" icon={<Wallet size={16}/>} dark />
        <StatCard label="Piutang Anggota" val={stats.debt} color="orange" icon={<AlertCircle size={16}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xs font-bold text-gray-700 uppercase mb-6 tracking-widest">Analitik Keuangan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % 20]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-gray-700 uppercase mb-4 tracking-widest">Ringkasan Data</h3>
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Siswa</span>
              <span className="text-lg font-bold text-gray-900">{data.students.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaksi Keuangan</span>
              <span className="text-lg font-bold text-gray-900">{data.finance.length + data.expenses.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Log Presensi</span>
              <span className="text-lg font-bold text-gray-900">{data.history.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericTable({ title, headers, rows }) {
  const [q, setQ] = useState('');
  const filtered = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</h3><input placeholder="Cari..." className="text-xs border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-red-500" value={q} onChange={e => setQ(e.target.value)}/></div>
      <GenericTableInner headers={headers} rows={filtered} />
    </div>
  );
}

function GenericTableInner({ headers, rows }) {
  if (rows.length === 0) return <div className="p-12 text-center text-xs text-gray-400 italic font-bold uppercase tracking-widest opacity-50">Data Kosong</div>;
  return (
    <div className="overflow-x-auto"><table className="w-full text-left text-xs">
      <thead><tr className="bg-gray-50 border-b text-gray-500 uppercase">
        {headers.map(h => <th key={h} className="px-5 py-3 font-bold tracking-wider">{h}</th>)}
      </tr></thead>
      <tbody className="divide-y">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {headers.map((h, j) => {
              let val = r[h] || r[h.replace(/ /g,'')] || ''; 
              if (!val && h === 'Keterangan Kehadiran') val = r['Kategori'];
              if (!val && (h === 'Deskripsi' || h.includes('Sumber'))) val = r['NamaSiswa'];
              if (h === 'Nominal') val = `Rp ${Number(val).toLocaleString('id-ID')}`;
              if (h === 'Status') return <td key={j} className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-widest ${val==='Hadir'?'bg-green-50 text-green-700 border-green-200':'bg-red-50 text-red-700 border-red-100'}`}>{val}</span></td>;
              return <td key={j} className={`px-5 py-3 font-bold text-gray-700 ${h==='Nominal'?'text-red-600 text-right':''}`}>{val}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table></div>
  );
}

function FinanceView({ data, user, onPost }) {
  const [tab, setTab] = useState('billing');
  const [selected, setSelected] = useState([]);
  
  const unpaid = useMemo(() => data.filter(f => f.Status === 'Belum Lunas'), [data]);
  const paid = useMemo(() => data.filter(f => f.Status === 'Lunas'), [data]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkPay = () => {
    if (selected.length === 0) return;
    if (window.confirm(`Lunasi ${selected.length} tagihan terpilih?`)) {
      onPost('bulkPayment', { ids: selected }, "Tagihan berhasil dilunasi.");
      setSelected([]);
    }
  };

  const handleClear = (target) => {
    if (window.confirm("Yakin ingin menghapus semua data ini?")) {
      onPost('clearData', { target }, "Data berhasil dibersihkan.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-lg border shadow-sm gap-1">
        <button onClick={() => setTab('billing')} className={`flex-1 py-2 text-xs font-bold uppercase rounded tracking-widest ${tab==='billing'?'bg-gray-900 text-white':'text-gray-500 hover:bg-gray-50'}`}>Monitor Tunggakan</button>
        <button onClick={() => setTab('income')} className={`flex-1 py-2 text-xs font-bold uppercase rounded tracking-widest ${tab==='income'?'bg-gray-900 text-white':'text-gray-500 hover:bg-gray-50'}`}>Log Pemasukan</button>
      </div>

      {tab === 'billing' && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-gray-700 tracking-widest">Tagihan Aktif ({unpaid.length})</h3>
            {user.role === ROLES.BENDAHARA && (
              <div className="flex gap-2">
                {selected.length > 0 && (
                  <button onClick={handleBulkPay} className="bg-green-600 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-green-700 transition-colors flex items-center gap-1">
                    <CheckSquare size={14}/> Bayar ({selected.length})
                  </button>
                )}
                <button onClick={() => handleClear('finance_bill')} className="bg-red-600 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-red-700 transition-colors flex items-center gap-1">
                  <Trash2 size={14}/> Clear Data
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-gray-50 text-gray-500 border-b uppercase">
                <th className="px-4 py-3 w-10 text-center">#</th>
                <th className="px-4 py-3 font-bold tracking-wider">Anggota</th>
                <th className="px-4 py-3 font-bold tracking-wider">Keterangan Kehadiran</th>
                <th className="px-4 py-3 text-right font-bold tracking-wider">Nominal</th>
                <th className="px-4 py-3 text-center font-bold tracking-wider">Status</th>
              </tr></thead>
              <tbody className="divide-y">
                {unpaid.map((f, i) => (
                  <tr key={i} className={`hover:bg-gray-50 ${selected.includes(f.IDTransaksi) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={selected.includes(f.IDTransaksi)} onChange={() => toggleSelect(f.IDTransaksi)} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">{f.NamaSiswa}<div className="text-[9px] text-gray-400 font-normal">{f.Tanggal}</div></td>
                    <td className="px-4 py-3"><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-bold border border-amber-200 uppercase tracking-widest">{f.Kategori}</span></td>
                    <td className="px-4 py-3 font-bold text-right tracking-tighter">Rp {Number(f.Nominal).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-center"><span className="text-red-400 font-bold text-[9px] italic uppercase tracking-widest">Belum Lunas</span></td>
                  </tr>
                ))}
                {unpaid.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic text-[10px] font-bold uppercase tracking-widest opacity-50">Tidak ada tunggakan.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'income' && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-gray-700 tracking-widest">Riwayat Dana Masuk</h3>
            {user.role === ROLES.BENDAHARA && (
              <button onClick={() => handleClear('finance_in')} className="bg-red-600 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-red-700 flex items-center gap-1">
                <Trash2 size={14}/> Hapus Semua
              </button>
            )}
          </div>
          <GenericTableInner headers={['Tanggal','Sumber / Deskripsi','Kategori','Nominal']} rows={paid} />
        </div>
      )}
    </div>
  );
}

function ExpenseView({ data, user, onPost }) {
  const [showAdd, setShowAdd] = useState(false);
  const handleClear = () => { if(window.confirm("Hapus semua log pengeluaran?")) onPost('clearData', {target:'expense'}, "Log pengeluaran dibersihkan."); };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-lg p-6 shadow text-white border-l-4 border-red-500">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Total Pengeluaran</p>
          <h2 className="text-2xl font-bold tracking-tighter">Rp {data.reduce((a,b)=>a+Number(b.Nominal),0).toLocaleString('id-ID')}</h2>
        </div>
        {user.role === ROLES.BENDAHARA && (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowAdd(true)} className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-red-500 hover:text-red-600 font-bold text-xs uppercase tracking-widest"><PlusCircle className="mb-1"/> Catat Baru</button>
            <button onClick={handleClear} className="bg-red-50 border-2 border-red-100 rounded-lg flex flex-col items-center justify-center text-red-600 hover:bg-red-100 font-bold text-xs uppercase tracking-widest"><Trash2 className="mb-1"/> Clear Log</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50"><h3 className="text-xs font-bold uppercase text-gray-700 tracking-widest">Audit Pengeluaran</h3></div>
        <GenericTableInner headers={['Tanggal','Deskripsi','Nominal']} rows={data} isExpense />
      </div>
      {showAdd && <ModalForm title="Input Pengeluaran" onClose={() => setShowAdd(false)} onSubmit={(d) => { onPost('addExpense', d, "Tersimpan"); setShowAdd(false); }} fields={[{n:'tanggal',t:'date'},{n:'deskripsi',l:'Item'},{n:'kategori',t:'select',o:['Operasional','Logistik','Konsumsi','Lainnya']},{n:'nominal',t:'number'}]} />}
    </div>
  );
}

function AttendanceInputView({ students, onPost }) {
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split('T')[0], kegiatan: '', filter: 'Semua' });
  const [att, setAtt] = useState({});
  const filtered = students.filter(s => form.filter === 'Semua' || s.Kelas === form.filter);

  const handleSubmit = () => {
    if (!form.kegiatan) return alert("Isi Kegiatan!");
    onPost('submitAttendance', {
      tanggal: form.tanggal,
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.',':'), 
      kegiatan: form.kegiatan,
      siswa: filtered.map(s => ({ nama: s.NamaLengkap, status: att[s.NamaLengkap] || 'Hadir' }))
    }, "Absensi terkirim");
    setForm({ ...form, kegiatan: '' }); setAtt({});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Tanggal" type="date" val={form.tanggal} onChange={v => setForm({...form, tanggal: v})} />
        <Input label="Kegiatan" val={form.kegiatan} onChange={v => setForm({...form, kegiatan: v})} />
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest">Presensi ({filtered.length})</h3>
          <select value={form.filter} onChange={e => setForm({...form, filter: e.target.value})} className="text-xs border rounded p-1 font-bold"><option>Semua</option>{[...new Set(students.map(s => s.Kelas))].map(k => <option key={k}>{k}</option>)}</select>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
          {filtered.map((s, i) => (
            <div key={i} className="p-3 border rounded bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between"><span className="font-bold text-sm truncate uppercase">{s.NamaLengkap}</span><span className="text-[10px] bg-white border px-2 rounded font-bold uppercase">{s.Kelas}</span></div>
              <div className="flex gap-1">{STATUS_OPTIONS.map(o => <button key={o.id} onClick={() => setAtt({...att, [s.NamaLengkap]: o.id})} className={`flex-1 py-1 text-[9px] font-bold rounded border uppercase tracking-widest ${att[s.NamaLengkap]===o.id || (!att[s.NamaLengkap]&&o.id==='Hadir') ? 'bg-red-600 text-white' : 'bg-white text-gray-500'}`}>{o.id[0]}</button>)}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-gray-50 text-right"><button onClick={handleSubmit} className="bg-red-600 text-white px-6 py-2 rounded font-bold text-xs uppercase shadow-lg hover:bg-red-700 tracking-widest">Kirim Data</button></div>
      </div>
    </div>
  );
}

function IncomeInputView({ onPost }) {
  const handleSubmit = (d) => onPost('addIncome', { ...d, kategori: 'Pemasukan Lain', status: 'Lunas', via: 'Tunai' }, "Pemasukan dicatat");
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50 font-bold text-xs uppercase text-gray-700 flex items-center gap-2 tracking-widest"><PlusCircle size={16}/> Catat Pemasukan</div>
      <div className="p-6"><ModalForm inline onSubmit={handleSubmit} fields={[{n:'tanggal',t:'date'},{n:'nama',l:'Sumber Dana'},{n:'nominal',t:'number'}]} /></div>
    </div>
  );
}

function StudentListView({ students, onPost }) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('Semua');
  const [editModal, setEditModal] = useState({ show: false, student: null });
  const classes = useMemo(() => ['Semua', ...new Set(students.map(s => s.Kelas))], [students]);
  const filtered = useMemo(() => students.filter(s => classFilter === 'Semua' || s.Kelas === classFilter).filter(s => s.NamaLengkap.toLowerCase().includes(search.toLowerCase())), [students, search, classFilter]);
  
  const handleUpdate = (e) => { 
    e.preventDefault(); 
    const formData = new FormData(e.target); 
    onPost('editStudent', {oldName: editModal.student.NamaLengkap, newName: formData.get('nama'), newClass: formData.get('kelas')}, "Siswa diupdate"); 
    setEditModal({ show: false, student: null }); 
  };

  const handleDelete = (s) => {
    if(window.confirm(`Hapus siswa ${s.NamaLengkap}?`)) {
      onPost('deleteStudent', { name: s.NamaLengkap }, "Siswa dihapus"); // Note: Backend must support deleteStudent
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fade-in relative leading-none">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4 leading-none"><h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Database Anggota</h3><div className="flex gap-2 w-full md:w-auto leading-none"><div className="relative flex-1 leading-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} /><input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none w-full shadow-sm" /></div><select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-[10px] font-extrabold uppercase shadow-sm outline-none">{classes.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse min-w-[400px]"><thead><tr className="bg-gray-50 border-b border-gray-100">{['Nama Lengkap', 'Unit / Kelas', 'Opsi'].map(h => (<th key={h} className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>))}</tr></thead><tbody className="divide-y divide-gray-100">{filtered.length > 0 ? filtered.map((s, i) => (<tr key={i} className="hover:bg-gray-50 transition-colors leading-none"><td className="px-5 py-5 text-xs font-bold text-gray-800 uppercase leading-tight">{s.NamaLengkap}</td><td className="px-5 py-5 text-xs font-medium text-gray-500 uppercase">{s.Kelas}</td><td className="px-5 py-5 flex gap-2 justify-center"><button onClick={() => setEditModal({ show: true, student: s })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-100 shadow-sm leading-none"><Edit2 size={14} /></button><button onClick={() => handleDelete(s)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-gray-100 shadow-sm leading-none"><Trash2 size={14} /></button></td></tr>)) : (<tr><td colSpan="3" className="p-20 text-center text-gray-400 italic text-[10px] font-bold uppercase tracking-widest opacity-50">Belum ada data.</td></tr>)}</tbody></table></div>
      {editModal.show && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"><div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm overflow-hidden animate-scale-in"><div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center font-extrabold text-xs uppercase tracking-widest text-gray-700 leading-none">Update Profil<button onClick={() => setEditModal({ show: false, student: null })}><X size={20} /></button></div><form onSubmit={handleUpdate} className="p-8 space-y-6 leading-none"><div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama</label><input name="nama" type="text" defaultValue={editModal.student.NamaLengkap} required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none font-bold uppercase shadow-inner" /></div><div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kelas</label><input name="kelas" type="text" defaultValue={editModal.student.Kelas} required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none uppercase shadow-inner" /></div><button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-red-200">Perbarui</button></form></div></div>)}
    </div>
  );
}

function UserManagementView({ users, onPost }) {
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ u: '', p: '' });
  const handleUpdate = (role, u, p) => { onPost('updateUser', { role, username: u, password: p }, "User updated"); setEdit(null); };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fade-in leading-none"><div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex items-center gap-3 font-bold text-xs uppercase text-gray-700 tracking-[0.3em]"><ShieldCheck size={20} className="text-red-600" />Konfigurasi Otoritas</div><div className="divide-y divide-gray-100">{users.map(u => (<div key={u.Role} className="p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-gray-50/50 transition-colors leading-none"><div className="text-center md:text-left leading-none"><p className="text-sm font-bold text-gray-900 uppercase mb-3 tracking-tight">{u.Role}</p><p className="text-[10px] text-red-600 font-extrabold tracking-widest italic leading-none bg-red-50 px-2 py-1 rounded">IDENTITAS: @{u.Username}</p></div>{edit === u.Role ? (<div className="flex flex-wrap gap-2 justify-center w-full md:w-auto"><input type="text" value={form.u} onChange={e => setForm({...form, u: e.target.value})} className="px-4 py-2 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-red-500 font-bold w-32" /><input type="text" value={form.p} onChange={e => setForm({...form, p: e.target.value})} className="px-4 py-2 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-red-500 font-bold w-32" /><button onClick={() => handleUpdate(u.Role, form.u, form.p)} className="bg-red-600 text-white px-6 py-2 rounded text-[10px] font-bold uppercase shadow-md leading-none">Simpan</button></div>) : (<button onClick={() => { setEdit(u.Role); setForm({ u: u.Username, p: u.Password }); }} className="bg-white border border-gray-300 text-gray-600 px-10 py-3 rounded-lg text-[10px] font-extrabold uppercase tracking-widest hover:bg-gray-100 transition-all w-full md:w-auto shadow-sm">Ubah Otoritas</button>)}</div>))}</div></div>
  );
}

function AccessDenied() {
  return (
    <div className="bg-white p-24 rounded-lg border border-gray-200 shadow-sm text-center flex flex-col items-center gap-8 animate-fade-in"><div className="bg-red-50 p-8 rounded-3xl text-red-600 shadow-inner"><AlertCircle size={72} /></div><div><h3 className="text-2xl font-bold text-gray-900 uppercase tracking-widest mb-4">Akses Terbatas</h3><p className="text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">Hubungi administrator.</p></div></div>
  );
}

function Input({ label, type='text', val, onChange }) {
  return <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{label}</label><input type={type} value={val} onChange={e=>onChange(e.target.value)} className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 shadow-sm font-medium"/></div>;
}

function ModalForm({ title, onClose, onSubmit, fields, inline }) {
  const handleSubmit = (e) => { e.preventDefault(); const d = new FormData(e.target); const p={}; fields.forEach(f => p[f.n] = f.t==='number'?Number(d.get(f.n)):d.get(f.n)); onSubmit(p); };
  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(f => (
        <div key={f.n} className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{f.l || f.n}</label>
          {f.t === 'select' ? <select name={f.n} className="w-full text-sm border rounded px-3 py-2 outline-none">{f.o.map(o=><option key={o}>{o}</option>)}</select> : 
           <input name={f.n} type={f.t||'text'} required className="w-full text-sm border rounded px-3 py-2 outline-none focus:border-red-500 font-bold" defaultValue={f.t==='date'?new Date().toISOString().split('T')[0]:''} placeholder="..."/>}
        </div>
      ))}
      <button type="submit" className="w-full bg-red-600 text-white py-2.5 rounded text-xs font-bold uppercase shadow-lg hover:bg-red-700 tracking-widest">Simpan Data</button>
    </form>
  );
  if (inline) return <FormContent />;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center font-bold text-xs uppercase tracking-widest text-gray-700">{title}<button onClick={onClose}><X size={18}/></button></div>
        <div className="p-6"><FormContent /></div>
      </div>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${active ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-100 translate-x-1' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
      <span className={active ? 'text-white' : 'text-gray-400'}>{icon}</span>
      <span className="truncate font-medium">{label}</span>
    </button>
  );
}

function getIcon(v){ const i={dashboard:<LayoutDashboard size={18}/>,finance:<Wallet size={18}/>,expenses:<Receipt size={18}/>,users:<Users size={18}/>,'attendance-recap':<History size={18}/>,'attendance-input':<ClipboardList size={18}/>,'income-input':<PlusCircle size={18}/>,'user-mgmt':<Settings size={18}/>}; return i[v]||<Settings size={18}/>; }
function getLabel(v){ const l={'attendance-recap':'Arsip','attendance-input':'Input Presensi','income-input':'Pemasukan','user-mgmt':'Admin Tools'}; return l[v] || v.replace('-',' ').toUpperCase(); }

// --- MAIN APP ---
function ContentRouter({ view, user, data, actions }) {
  const hasAccess = (required) => required.includes(user.role);
  switch (view) {
    case 'dashboard': return <DashboardView data={data} />;
    case 'attendance-input': return hasAccess([ROLES.SEKRETARIS]) ? <AttendanceInputView students={data.students} onPost={actions.genericPost} /> : <AccessDenied />;
    case 'income-input': return hasAccess([ROLES.BENDAHARA]) ? <IncomeInputView onPost={actions.genericPost} /> : <AccessDenied />;
    case 'finance': return hasAccess([ROLES.ADMIN, ROLES.BENDAHARA]) ? <FinanceView data={data.finance} user={user} onPost={actions.genericPost} /> : <AccessDenied />;
    case 'expenses': return hasAccess([ROLES.ADMIN, ROLES.BENDAHARA]) ? <ExpenseView data={data.expenses} user={user} onPost={actions.genericPost} /> : <AccessDenied />;
    case 'attendance-recap': return <GenericTable title="Arsip Presensi (24H)" headers={['Tanggal','Waktu','Kegiatan','NamaSiswa','Status']} rows={data.history} />;
    case 'users': return user.role === ROLES.ADMIN ? <StudentListView students={data.students} onPost={actions.genericPost} /> : <GenericTable title="Data Anggota" headers={['NamaLengkap','Kelas']} rows={data.students} />;
    case 'user-mgmt': return hasAccess([ROLES.ADMIN]) ? <UserManagementView users={data.appUsers} onPost={actions.genericPost} /> : <AccessDenied />;
    default: return <DashboardView data={data} />;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [finance, setFinance] = useState([]);
  const [history, setHistory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [appUsers, setAppUsers] = useState([{ Role: 'Admin', Username: 'admin', Password: '123' }, { Role: 'Sekretaris', Username: 'sekretaris', Password: '123' }, { Role: 'Bendahara', Username: 'bendahara', Password: '123' }]);
  const [toast, setToast] = useState(null);

  useEffect(() => { const init = async () => { try { const r = await fetch(`${API_URL}?action=getUsers&t=${Date.now()}`); const d = await r.json(); if(d && Array.isArray(d)) setAppUsers(d); } catch(e){} }; init(); }, []);
  useEffect(() => { if(user) fetchAllData(); }, [user]);

  const showToast = (m, t='success') => { setToast({message:m, type:t}); setTimeout(()=>setToast(null),3000); };
  const fetchAllData = async () => { setLoading(true); try { const t = Date.now(); const [s,f,h,e] = await Promise.all([fetch(`${API_URL}?action=getStudents&t=${t}`).then(r=>r.json()), fetch(`${API_URL}?action=getFinance&t=${t}`).then(r=>r.json()), fetch(`${API_URL}?action=getHistory&t=${t}`).then(r=>r.json()), fetch(`${API_URL}?action=getExpenses&t=${t}`).then(r=>r.json())]); setStudents(Array.isArray(s)?s:[]); setFinance(Array.isArray(f)?f:[]); setHistory(Array.isArray(h)?h:[]); setExpenses(Array.isArray(e)?e:[]); } catch(e){ showToast("Error Sync","error"); } finally { setLoading(false); } };
  
  const handleLogin = (u, p) => { const v = appUsers.find(x => String(x.Username).toLowerCase()===String(u).toLowerCase() && String(x.Password)===String(p)); if(v){ setUser({role:v.Role, name:v.Username}); setView(v.Role===ROLES.SEKRETARIS?'attendance-input':v.Role===ROLES.BENDAHARA?'finance':'dashboard'); showToast(`Welcome ${v.Role}`); } else showToast("Gagal Masuk","error"); };
  const genericPost = async (a, p, m) => { setLoading(true); try { await fetch(API_URL, {method:'POST', body:JSON.stringify({action:a, payload:p})}); showToast(m); await fetchAllData(); } catch(e){ showToast("Gagal","error"); } finally { setLoading(false); } };

  if(!user) return <LoginScreen onLogin={handleLogin}/>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {toast && <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg border shadow-xl flex items-center gap-3 bg-white border-l-4 ${toast.type==='error'?'border-red-500 text-red-600':'border-green-500 text-green-600'}`}><AlertCircle size={18}/><span className="text-sm font-bold">{toast.message}</span></div>}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"><div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"><div className="flex items-center gap-3"><button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-md"><Menu size={20}/></button><div className="flex items-center gap-2"><ShieldCheck size={24} className="text-red-600"/><span className="text-lg font-bold tracking-tight uppercase">PMR SMANEL SYSTEM</span></div></div><div className="flex items-center gap-4"><div className="text-right hidden sm:block"><p className="text-[10px] text-gray-400 font-bold uppercase">{user.role}</p><p className="text-sm font-bold">@{user.name}</p></div><button onClick={()=>{setUser(null);setView('dashboard');}} className="text-gray-400 hover:text-red-600 p-2"><LogOut size={20}/></button></div></div></nav>
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-6 relative">
        <aside className={`fixed inset-0 z-40 lg:relative lg:block w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transition-transform ${isMenuOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}><div className="p-4 border-b flex justify-between items-center"><h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</h4><button className="lg:hidden" onClick={()=>setIsMenuOpen(false)}><X size={18}/></button></div><div className="p-2 space-y-1 overflow-y-auto h-full">{user.role===ROLES.ADMIN && ['dashboard','attendance-recap','finance','expenses','users','user-mgmt'].map(v=><SidebarLink key={v} active={view===v} onClick={()=>{setView(v);setIsMenuOpen(false)}} icon={getIcon(v)} label={getLabel(v)}/>)}{user.role===ROLES.SEKRETARIS && ['attendance-input','attendance-recap','users'].map(v=><SidebarLink key={v} active={view===v} onClick={()=>{setView(v);setIsMenuOpen(false)}} icon={getIcon(v)} label={getLabel(v)}/>)}{user.role===ROLES.BENDAHARA && ['finance','income-input','expenses','dashboard'].map(v=><SidebarLink key={v} active={view===v} onClick={()=>{setView(v);setIsMenuOpen(false)}} icon={getIcon(v)} label={getLabel(v)}/>)}</div></aside>
        <main className="flex-1 w-full overflow-hidden">{loading?<div className="h-64 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-red-600 mb-2"/><p className="text-xs font-bold text-gray-400 uppercase">Memuat Data...</p></div>:<div className="animate-fade-in"><ContentRouter view={view} user={user} data={{students,finance,history,expenses,appUsers}} actions={{genericPost}}/></div>}</main>
      </div>
    </div>
  );
}