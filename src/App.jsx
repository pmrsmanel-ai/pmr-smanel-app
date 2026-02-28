import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, UserCheck, Wallet, Users, LogOut, Search, Filter, AlertCircle, CheckCircle2, 
  Clock, Loader2, History, Save, ShieldCheck, ClipboardList, Lock, User as UserIcon, Eye, EyeOff, 
  Settings, Edit2, X, PlusCircle, TrendingDown, TrendingUp, Receipt, Menu, Coins, Trash2, CheckSquare, Calendar, ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// URL API Google Apps Script 
const API_URL = "https://script.google.com/macros/s/AKfycbydQdPuZ3p5b85NphI4xWnfc0SjWZo85ZdZ3uxkHTTKmDvSZ8xzXj8ZjdMkh4-48ts_xQ/exec";

// === KONFIGURASI LOGO ===
const LOGO_URL = "https://i.ibb.co/KjMWMJMf/Tim-lkp-IV.jpg";

const ROLES = { ADMIN: 'Admin', SEKRETARIS: 'Sekretaris', BENDAHARA: 'Bendahara' };
const STATUS_OPTIONS = [
  { id: 'Hadir', color: 'bg-green-100 text-green-800 border-green-200', alias: 'H' },
  { id: 'Sakit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', alias: 'S' },
  { id: 'Izin', color: 'bg-blue-100 text-blue-800 border-blue-200', alias: 'I' },
  { id: 'Alpha', color: 'bg-red-100 text-red-800 border-red-200', alias: 'A' },
  { id: 'Terlambat', color: 'bg-orange-100 text-orange-800 border-orange-200', alias: 'T' },
];
const CHART_COLORS = ['#0d6efd', '#dc3545', '#ffc107', '#198754']; 

// --- UTILITY ---
const formatTime = (dateString) => {
  if (!dateString) return '-';
  if (typeof dateString === 'string') {
    if (dateString.includes('1899-12-30')) return dateString.split('T')[1].substring(0, 5);
    if (dateString.includes('T')) {
      const d = new Date(dateString);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');
    }
  }
  return dateString;
};

// --- KOMPONEN LOGO PINTAR ---
function AppLogo({ className, fallbackSize = 24 }) {
  const [imgError, setImgError] = useState(false);
  if (imgError || !LOGO_URL) {
    return <ShieldCheck size={fallbackSize} className={`text-red-600 ${className.replace(/border[^ ]*/g, '').replace(/shadow[^ ]*/g, '')}`} />;
  }
  return (
    <img src={LOGO_URL} alt="Logo PMR" className={className} onError={() => setImgError(true)} referrerPolicy="no-referrer" />
  );
}

// === 1. HALAMAN DASHBOARD PUBLIK ===
function PublicDashboard({ data, onLoginClick, loading }) {
  const stats = useMemo(() => {
    const incList = data.finance.filter(f => f.Status === 'Lunas');
    const debtList = data.finance.filter(f => f.Status === 'Belum Lunas');
    const inc = incList.reduce((a,b) => a+Number(b.Nominal), 0);
    const exp = data.expenses.reduce((a,b) => a+Number(b.Nominal), 0);
    return { 
      inc, exp, bal: inc - exp, 
      incCount: incList.length, 
      debtCount: debtList.length, 
      expCount: data.expenses.length 
    };
  }, [data.finance, data.expenses]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col text-gray-800">
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-600">
            <AppLogo className="h-9 w-9 object-cover rounded-full shadow-sm border border-red-100 bg-white" fallbackSize={28} />
            <span className="text-sm md:text-lg font-bold tracking-tight uppercase">PMR SMANEL MANAGEMENT SYSTEM</span>
          </div>
          <button onClick={onLoginClick} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:ring-4 focus:ring-blue-200 transition-colors text-sm font-medium flex items-center gap-2 border border-blue-700">
            <Lock size={16}/> Login Pengurus
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <AppLogo className="h-24 w-24 mx-auto object-cover rounded-full shadow-md border-4 border-white bg-white mb-4" fallbackSize={64} />
          <h1 className="text-3xl font-bold text-gray-800 uppercase">
            Laporan Publik <span className="text-red-600">PMR SMANEL</span>
          </h1>
          <p className="text-gray-600 text-base">
            Portal transparansi informasi kehadiran anggota dan ringkasan arus kas organisasi secara real-time.
          </p>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={40}/>
             <p className="text-gray-500 font-medium text-sm">Menghubungkan ke server...</p>
           </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-300 rounded shadow-sm">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 flex justify-between">
                  Saldo Kas <Wallet size={18} className="text-gray-500"/>
                </div>
                <div className="p-5">
                  <h2 className="text-3xl font-bold text-gray-800">Rp {stats.bal.toLocaleString('id-ID')}</h2>
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded shadow-sm">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 flex justify-between">
                  Pemasukan <TrendingUp size={18} className="text-green-600"/>
                </div>
                <div className="p-5">
                  <h2 className="text-3xl font-bold text-green-600">Rp {stats.inc.toLocaleString('id-ID')}</h2>
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded shadow-sm">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 flex justify-between">
                  Pengeluaran <TrendingDown size={18} className="text-red-600"/>
                </div>
                <div className="p-5">
                  <h2 className="text-3xl font-bold text-red-600">Rp {stats.exp.toLocaleString('id-ID')}</h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-300 rounded shadow-sm flex flex-col">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold flex justify-between items-center">
                  <div className="flex items-center gap-2"><ClipboardList size={18} className="text-gray-600"/> Aktivitas Presensi Terbaru</div>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">{data.students.length} Anggota</span>
                </div>
                <div className="p-0 overflow-y-auto h-80">
                  <ul className="divide-y divide-gray-200 m-0">
                    {data.history.slice(0, 10).map((h, i) => (
                      <li key={i} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-2">
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{h.NamaSiswa}</p>
                          <p className="text-xs text-gray-500">{h.Tanggal} • {h.Kegiatan}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${h.Status === 'Hadir' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{h.Status}</span>
                      </li>
                    ))}
                    {data.history.length === 0 && <li className="p-8 text-center text-gray-500 text-sm">Belum ada kegiatan tercatat.</li>}
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-gray-300 rounded shadow-sm flex flex-col">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold flex items-center gap-2">
                  <Receipt size={18} className="text-gray-600"/> Rincian Total Transaksi
                </div>
                <div className="p-4 flex-1">
                   <p className="text-sm text-gray-600 mb-4">Berikut adalah rincian jumlah aktivitas pencatatan keuangan yang terjadi di dalam sistem berdasarkan kategorinya:</p>
                   <ul className="list-none border border-gray-200 rounded p-0 m-0">
                      <li className="border-b border-gray-200 px-4 py-3 flex justify-between items-center bg-gray-50">
                        <span className="font-medium text-gray-700">Dana Masuk (Telah Lunas)</span>
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">{stats.incCount} Record</span>
                      </li>
                      <li className="border-b border-gray-200 px-4 py-3 flex justify-between items-center bg-white">
                        <span className="font-medium text-gray-700">Tunggakan Kas / Denda</span>
                        <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">{stats.debtCount} Record</span>
                      </li>
                      <li className="px-4 py-3 flex justify-between items-center bg-gray-50">
                        <span className="font-medium text-gray-700">Log Pengeluaran Organisasi</span>
                        <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">{stats.expCount} Record</span>
                      </li>
                   </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-4 border-t border-gray-300 text-center bg-white mt-auto">
        <p className="text-sm text-gray-500">© 2026 PMR SMANEL. All rights reserved.</p>
      </footer>
    </div>
  );
}

// === 2. HELPER COMPONENTS ===

function LoginScreen({ onLogin, onBack, loginError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <button onClick={onBack} className="absolute top-4 left-4 md:top-6 md:left-6 btn btn-light flex items-center gap-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors text-sm font-semibold shadow-sm">
        <ArrowLeft size={16} /> Beranda
      </button>

      <div className="max-w-md w-full bg-white rounded border border-gray-300 shadow-sm overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-gray-300 bg-gray-50 text-center">
          <AppLogo className="w-20 h-20 object-cover rounded-full mx-auto mb-4 shadow-md border-2 border-white bg-white" fallbackSize={64} />
          <h2 className="text-2xl font-bold text-gray-800">Login Sistem</h2>
          <p className="text-gray-500 text-sm mt-1 mb-2">Gunakan kredensial pengurus PMR</p>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs py-2 px-3 rounded font-semibold animate-fade-in mt-3">
              {loginError}
            </div>
          )}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Ketik username..." className="w-full pl-10 pr-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Ketik password..." className="w-full pl-10 pr-12 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded focus:ring-4 focus:ring-blue-200 border border-blue-700 transition-all mt-2">Masuk</button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, val, color, icon }) {
  const colors = { 
    green: 'border-green-500 text-green-700', 
    red: 'border-red-500 text-red-700', 
    blue: 'border-blue-500 text-blue-700', 
    orange: 'border-yellow-500 text-yellow-700' 
  };
  return (
    <div className={`bg-white rounded border border-gray-300 shadow-sm p-4 border-l-4 ${colors[color]}`}>
      <div className="flex justify-between items-start mb-2"><p className="text-xs font-semibold text-gray-500 uppercase">{label}</p><div>{icon}</div></div>
      <h2 className="text-xl font-bold text-gray-800">Rp {val.toLocaleString('id-ID')}</h2>
    </div>
  );
}

function GenericTableInner({ headers, rows }) {
  if (rows.length === 0) return <div className="p-8 text-center text-sm text-gray-500">Data tidak tersedia.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300 text-gray-700">
            {headers.map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50 even:bg-gray-50/50">
              {headers.map((h, j) => {
                let val = r[h] || r[h.replace(/ /g,'')] || ''; 
                if (!val && h === 'Keterangan Kehadiran') val = r['Kategori'];
                if (!val && (h === 'Deskripsi' || h.includes('Sumber'))) val = r['NamaSiswa'];
                
                if (h === 'Nominal') val = `Rp ${Number(val).toLocaleString('id-ID')}`;
                
                if (h === 'Status') return <td key={j} className="px-4 py-2"><span className={`px-2 py-1 rounded text-xs font-medium border ${val==='Hadir'?'bg-green-100 text-green-800 border-green-200':'bg-red-100 text-red-800 border-red-200'}`}>{val}</span></td>;
                
                return <td key={j} className={`px-4 py-2 text-gray-700 ${h==='Nominal'?'font-medium text-right':''}`}>{val}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GenericTable({ title, headers, rows }) {
  const [q, setQ] = useState('');
  const filtered = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm flex flex-col">
      <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <input placeholder="Cari data..." className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500" value={q} onChange={e => setQ(e.target.value)}/>
      </div>
      <GenericTableInner headers={headers} rows={filtered} />
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded border border-gray-300 shadow-lg w-full max-w-sm overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-800">
          {title}
        </div>
        <div className="p-5 text-sm text-gray-600">
          {message}
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-300 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-sm transition-colors">Batal</button>
          <button onClick={onConfirm} className="px-4 py-1.5 bg-red-600 border border-red-700 hover:bg-red-700 text-white rounded text-sm focus:ring-4 focus:ring-red-200 transition-colors">Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  );
}

function ModalForm({ title, onClose, onSubmit, fields, inline }) {
  const handleSubmit = (e) => { e.preventDefault(); const d = new FormData(e.target); const p={}; fields.forEach(f => p[f.n] = f.t==='number'?Number(d.get(f.n)):d.get(f.n)); onSubmit(p); };
  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(f => (
        <div key={f.n} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">{f.l || f.n}</label>
          {f.t === 'select' ? <select name={f.n} className="w-full text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500">{f.o.map(o=><option key={o}>{o}</option>)}</select> : 
           <input name={f.n} type={f.t||'text'} required className="w-full text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500" defaultValue={f.t==='date'?new Date().toISOString().split('T')[0]:''} placeholder="..."/>}
        </div>
      ))}
      <button type="submit" className="w-full bg-blue-600 border border-blue-700 text-white py-2 rounded text-base font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors">Simpan Data</button>
    </form>
  );
  if (inline) return <FormContent />;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded border border-gray-300 shadow-lg w-full max-w-sm overflow-hidden">
        <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center font-semibold text-gray-800">{title}<button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={18}/></button></div>
        <div className="p-5"><FormContent /></div>
      </div>
    </div>
  );
}

function Input({ label, type='text', val, onChange }) {
  return <div className="space-y-1"><label className="block text-sm font-medium text-gray-700">{label}</label><input type={type} value={val} onChange={e=>onChange(e.target.value)} className="w-full text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"/></div>;
}

function SidebarLink({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
      <span className={active ? 'text-white' : 'text-gray-500'}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function AccessDenied() {
  return (
    <div className="bg-white p-12 md:p-24 rounded border border-gray-300 shadow-sm text-center flex flex-col items-center gap-6 animate-fade-in">
      <div className="bg-red-50 p-6 rounded-full text-red-600 shadow-sm border border-red-100">
        <AlertCircle size={64} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Akses Terbatas</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">Hubungi administrator untuk meminta izin mengakses modul sistem ini.</p>
      </div>
    </div>
  );
}

function getIcon(v){ const i={dashboard:<LayoutDashboard size={18}/>,finance:<Wallet size={18}/>,expenses:<Receipt size={18}/>,users:<Users size={18}/>,'attendance-recap':<History size={18}/>,'attendance-input':<ClipboardList size={18}/>,'income-input':<PlusCircle size={18}/>,'user-mgmt':<Settings size={18}/>}; return i[v]||<Settings size={18}/>; }
function getLabel(v){ const l={'attendance-recap':'Arsip','attendance-input':'Input Presensi','income-input':'Pemasukan','user-mgmt':'Admin Tools'}; return l[v] || v.replace('-',' ').toUpperCase(); }

// === 3. SUB-VIEWS PENGURUS ===

function AdminDashboardView({ data }) {
  const stats = useMemo(() => {
    const incList = data.finance.filter(f => f.Status === 'Lunas');
    const debtList = data.finance.filter(f => f.Status === 'Belum Lunas');
    const inc = incList.reduce((a,b) => a+Number(b.Nominal), 0);
    const exp = data.expenses.reduce((a,b) => a+Number(b.Nominal), 0);
    const debt = debtList.reduce((a,b) => a+Number(b.Nominal), 0);
    const chartData = [
      { name: 'Pemasukan', value: inc },
      { name: 'Pengeluaran', value: exp },
      { name: 'Piutang', value: debt }
    ];
    return { inc, exp, debt, bal: inc - exp, chartData, incCount: incList.length, debtCount: debtList.length, expCount: data.expenses.length };
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pemasukan" val={stats.inc} color="green" icon={<TrendingUp size={16}/>} />
        <StatCard label="Total Pengeluaran" val={stats.exp} color="red" icon={<TrendingDown size={16}/>} />
        <StatCard label="Saldo Kas Aktif" val={stats.bal} color="blue" icon={<Wallet size={16}/>} />
        <StatCard label="Piutang Terbuka" val={stats.debt} color="orange" icon={<AlertCircle size={16}/>} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded shadow-sm">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-700">Diagram Keuangan</div>
          <div className="h-64 w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={{stroke: '#ced4da'}} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} cursor={{fill: '#f8f9fa'}} contentStyle={{fontSize: '12px', borderRadius: '4px'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % 20]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded shadow-sm flex flex-col">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-700">Rincian Total Transaksi</div>
          <div className="p-4 flex-1">
             <ul className="list-none border border-gray-300 rounded p-0 m-0">
                <li className="border-b border-gray-300 px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
                  <span className="font-medium text-gray-700">Pemasukan Kas (Lunas)</span>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">{stats.incCount} Record</span>
                </li>
                <li className="border-b border-gray-300 px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
                  <span className="font-medium text-gray-700">Tunggakan (Belum Lunas)</span>
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">{stats.debtCount} Record</span>
                </li>
                <li className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
                  <span className="font-medium text-gray-700">Pengeluaran Operasional</span>
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">{stats.expCount} Record</span>
                </li>
             </ul>
             <div className="mt-4 pt-4 border-t border-gray-200">
               <p className="text-sm text-gray-600">Total Anggota Terdaftar: <span className="font-bold text-gray-800">{data.students.length} Siswa</span></p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceRecapView({ history, onPost }) {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [editModal, setEditModal] = useState({ show: false, record: null });

  const filteredRows = useMemo(() => {
    return history.filter(h => {
      const matchDate = !filterDate || h.Tanggal === filterDate;
      const matchStatus = filterStatus === 'Semua' || h.Status === filterStatus;
      return matchDate && matchStatus;
    });
  }, [history, filterDate, filterStatus]);

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const newStatus = new FormData(e.target).get('status');
    onPost('editAttendance', {
      tanggal: editModal.record.Tanggal,
      waktu: editModal.record.Waktu,
      namaSiswa: editModal.record.NamaSiswa,
      kegiatan: editModal.record.Kegiatan,
      oldStatus: editModal.record.Status,
      newStatus: newStatus
    }, "Status presensi berhasil diperbarui");
    setEditModal({ show: false, record: null });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        {/* Keterangan Status */}
        <div className="flex gap-2 mr-auto bg-white p-2 rounded border border-gray-300 shadow-sm text-xs">
           <span className="font-bold text-gray-500 mr-1">Keterangan:</span>
           {STATUS_OPTIONS.map(opt => (
             <span key={opt.id} className="flex items-center gap-1">
               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${opt.color}`}>{opt.alias}</span> = {opt.id}
             </span>
           ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-300 shadow-sm w-fit">
          <Calendar size={16} className="text-gray-500 ml-2" />
          <input type="date" className="text-sm text-gray-700 outline-none" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          {filterDate && <button onClick={() => setFilterDate('')} className="text-gray-500 hover:bg-gray-200 p-1 rounded"><X size={14} /></button>}
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-300 shadow-sm w-fit">
          <Filter size={16} className="text-gray-500 ml-2" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm text-gray-700 outline-none bg-white">
            <option value="Semua">Semua Status</option>
            {STATUS_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.id}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 flex justify-between items-center">
          <span>Arsip Presensi</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Total: {filteredRows.length} Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-gray-300 text-gray-700">
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Waktu</th>
                <th className="px-4 py-3 font-semibold">Kegiatan</th>
                <th className="px-4 py-3 font-semibold">Nama Anggota</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                {onPost && <th className="px-4 py-3 font-semibold text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRows.length > 0 ? filteredRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 even:bg-gray-50/50">
                  <td className="px-4 py-2 text-gray-600">{row.Tanggal}</td>
                  <td className="px-4 py-2 font-medium text-gray-800">{formatTime(row.Waktu)}</td>
                  <td className="px-4 py-2 text-gray-700">{row.Kegiatan}</td>
                  <td className="px-4 py-2 font-medium text-gray-800 uppercase">{row.NamaSiswa}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${row.Status === 'Hadir' ? 'bg-green-100 text-green-800 border-green-200' : row.Status === 'Alpha' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>{row.Status}</span>
                  </td>
                  {onPost && (
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => setEditModal({ show: true, record: row })} className="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded border border-blue-200" title="Edit Status"><Edit2 size={14} /></button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={onPost ? "6" : "5"} className="p-8 text-center text-gray-500 text-sm">Tidak ada data presensi yang sesuai.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Status */}
      {editModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded border border-gray-300 shadow-lg w-full max-w-sm overflow-hidden">
            <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center font-semibold text-gray-800">
              Edit Status Kehadiran
              <button onClick={() => setEditModal({ show: false, record: null })} className="text-gray-500 hover:text-gray-800"><X size={18}/></button>
            </div>
            <form onSubmit={handleUpdateStatus} className="p-5 space-y-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-500">Anggota: <span className="font-bold text-gray-800 uppercase">{editModal.record.NamaSiswa}</span></p>
                <p className="text-xs text-gray-500">Aktivitas: {editModal.record.Tanggal} • {editModal.record.Kegiatan}</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Ubah Status Menjadi:</label>
                <select name="status" defaultValue={editModal.record.Status} className="w-full text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
                  {STATUS_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.id}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 border border-blue-700 text-white py-2 rounded text-base font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FinanceView({ data, user, onPost }) {
  const [tab, setTab] = useState('billing');
  const [selected, setSelected] = useState([]);
  const [confirmMsg, setConfirmMsg] = useState(null); 
  
  const unpaid = useMemo(() => data.filter(f => f.Status === 'Belum Lunas'), [data]);
  const paid = useMemo(() => data.filter(f => f.Status === 'Lunas'), [data]);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelected(selected.length === unpaid.length && unpaid.length > 0 ? [] : unpaid.map(f => f.IDTransaksi));

  const handleBulkPay = () => {
    if (selected.length === 0) return;
    setConfirmMsg({
      title: "Konfirmasi Pelunasan",
      message: `Anda yakin ingin menandai ${selected.length} tagihan ini sebagai LUNAS?`,
      onConfirm: () => {
        onPost('bulkPayment', { ids: selected }, `${selected.length} tagihan berhasil dilunasi.`);
        setSelected([]);
        setConfirmMsg(null);
      }
    });
  };

  const handleClear = (target) => {
    const label = target === 'finance_bill' ? 'Tunggakan Aktif' : 'Riwayat Dana Masuk';
    setConfirmMsg({
      title: "Hapus Semua Data",
      message: `Anda yakin ingin menghapus semua data ${label}? Tindakan ini tidak bisa dibatalkan.`,
      onConfirm: () => {
        onPost('clearData', { target }, `Data ${label} berhasil dibersihkan.`);
        setConfirmMsg(null);
      }
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {confirmMsg && <ConfirmModal title={confirmMsg.title} message={confirmMsg.message} onConfirm={confirmMsg.onConfirm} onCancel={() => setConfirmMsg(null)} />}
      
      <ul className="flex border-b border-gray-300">
        <li className="-mb-px mr-1">
          <button onClick={() => setTab('billing')} className={`bg-white inline-block py-2 px-4 text-sm font-medium border-l border-t border-r rounded-t ${tab==='billing' ? 'border-gray-300 text-blue-600 bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Monitor Tunggakan</button>
        </li>
        <li className="mr-1">
          <button onClick={() => setTab('income')} className={`bg-white inline-block py-2 px-4 text-sm font-medium border-l border-t border-r rounded-t ${tab==='income' ? 'border-gray-300 text-blue-600 bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Log Pemasukan</button>
        </li>
      </ul>

      {tab === 'billing' && (
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
          <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Tagihan Aktif ({unpaid.length})</h3>
            {user.role === ROLES.BENDAHARA && (
              <div className="flex gap-2">
                {selected.length > 0 && (
                  <button onClick={handleBulkPay} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1 border border-green-700"><CheckSquare size={14}/> Bayar ({selected.length})</button>
                )}
                {unpaid.length > 0 && (
                  <button onClick={() => handleClear('finance_bill')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1 border border-red-700"><Trash2 size={14}/> Clear Data</button>
                )}
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead><tr className="bg-white border-b border-gray-300 text-gray-700">
                <th className="px-4 py-3 w-10 text-center"><input type="checkbox" checked={unpaid.length > 0 && selected.length === unpaid.length} onChange={toggleSelectAll} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"/></th>
                <th className="px-4 py-3 font-semibold">Anggota</th>
                <th className="px-4 py-3 font-semibold">Keterangan Kehadiran</th>
                <th className="px-4 py-3 text-right font-semibold">Nominal</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-200">
                {unpaid.map((f, i) => (
                  <tr key={i} className={`hover:bg-gray-50 transition-colors ${selected.includes(f.IDTransaksi) ? 'bg-blue-50/50' : 'even:bg-gray-50/50'}`}>
                    <td className="px-4 py-2 text-center"><input type="checkbox" checked={selected.includes(f.IDTransaksi)} onChange={() => toggleSelect(f.IDTransaksi)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"/></td>
                    <td className="px-4 py-2 font-medium text-gray-800">{f.NamaSiswa}<div className="text-xs text-gray-500 font-normal">{f.Tanggal}</div></td>
                    <td className="px-4 py-2"><span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded text-xs">{f.Kategori}</span></td>
                    <td className="px-4 py-2 font-medium text-right text-red-600">Rp {Number(f.Nominal).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-center"><span className="text-red-500 font-medium text-xs">Belum Lunas</span></td>
                  </tr>
                ))}
                {unpaid.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500 text-sm">Tidak ada tunggakan.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'income' && (
        <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
          <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Riwayat Dana Masuk</h3>
            {user.role === ROLES.BENDAHARA && paid.length > 0 && (
              <button onClick={() => handleClear('finance_in')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 border border-red-700"><Trash2 size={14}/> Hapus Semua</button>
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
  const [confirmMsg, setConfirmMsg] = useState(null);

  const handleClear = () => { 
    setConfirmMsg({
      title: "Hapus Log Pengeluaran",
      message: "Yakin ingin menghapus semua riwayat pengeluaran kas?",
      onConfirm: () => {
        onPost('clearData', {target:'expense'}, "Log pengeluaran dibersihkan."); 
        setConfirmMsg(null);
      }
    });
  };
  
  return (
    <div className="space-y-4">
      {confirmMsg && <ConfirmModal title={confirmMsg.title} message={confirmMsg.message} onConfirm={confirmMsg.onConfirm} onCancel={() => setConfirmMsg(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded border border-gray-300 shadow-sm p-5 border-l-4 border-l-red-500">
          <p className="text-sm font-semibold text-gray-500 mb-1">Total Pengeluaran</p>
          <h2 className="text-2xl font-bold text-gray-800">Rp {data.reduce((a,b)=>a+Number(b.Nominal),0).toLocaleString('id-ID')}</h2>
        </div>
        {user.role === ROLES.BENDAHARA && (
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(true)} className="flex-1 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center gap-2 text-blue-600 hover:bg-gray-50 font-medium text-sm transition-colors"><PlusCircle size={18}/> Catat Baru</button>
            <button onClick={handleClear} disabled={data.length === 0} className={`flex-1 rounded shadow-sm flex items-center justify-center gap-2 font-medium text-sm border transition-colors ${data.length === 0 ? 'bg-gray-50 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}><Trash2 size={18}/> Clear Log</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
        <div className="bg-gray-100 p-3 border-b border-gray-300"><h3 className="text-sm font-semibold text-gray-700">Audit Pengeluaran</h3></div>
        <GenericTableInner headers={['Tanggal','Deskripsi','Nominal']} rows={data} />
      </div>
      {showAdd && <ModalForm title="Input Pengeluaran" onClose={() => setShowAdd(false)} onSubmit={(d) => { onPost('addExpense', d, "Pengeluaran berhasil dicatat."); setShowAdd(false); }} fields={[{n:'tanggal',t:'date'},{n:'deskripsi',l:'Item'},{n:'kategori',t:'select',o:['Operasional','Logistik','Konsumsi','Lainnya']},{n:'nominal',t:'number'}]} />}
    </div>
  );
}

function AttendanceInputView({ students, onPost, showToast }) {
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split('T')[0], kegiatan: '', filter: 'Semua' });
  const [att, setAtt] = useState({});
  const filtered = students.filter(s => form.filter === 'Semua' || s.Kelas === form.filter);

  const handleSubmit = () => {
    if (!form.kegiatan) return showToast("Harap isi Judul/Nama Kegiatan!", "error");
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.',':');

    onPost('submitAttendance', {
      tanggal: form.tanggal,
      waktu: `${currentTime} WIB`, 
      kegiatan: form.kegiatan,
      siswa: filtered.map(s => ({ nama: s.NamaLengkap, status: att[s.NamaLengkap] || 'Hadir' }))
    }, "Data presensi berhasil dikirim");
    setForm({ ...form, kegiatan: '' }); setAtt({});
  };

  return (
    <div className="space-y-4">
      {/* Legenda Keterangan */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded border border-gray-300 shadow-sm text-xs w-fit">
         <span className="font-bold text-gray-500 mr-1">Keterangan Status:</span>
         {STATUS_OPTIONS.map(opt => (
           <span key={opt.id} className="flex items-center gap-1">
             <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${opt.color}`}>{opt.alias}</span> = {opt.id}
           </span>
         ))}
      </div>

      <div className="bg-white p-5 rounded border border-gray-300 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Tanggal" type="date" val={form.tanggal} onChange={v => setForm({...form, tanggal: v})} />
        <Input label="Kegiatan" val={form.kegiatan} onChange={v => setForm({...form, kegiatan: v})} />
      </div>
      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">Presensi ({filtered.length} Anggota)</h3>
          <select value={form.filter} onChange={e => setForm({...form, filter: e.target.value})} className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200"><option>Semua</option>{[...new Set(students.map(s => s.Kelas))].map(k => <option key={k}>{k}</option>)}</select>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
          {filtered.map((s, i) => (
            <div key={i} className="p-3 border border-gray-300 rounded hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center mb-3"><span className="font-semibold text-sm text-gray-800 truncate uppercase">{s.NamaLengkap}</span><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{s.Kelas}</span></div>
              <div className="flex gap-1">{STATUS_OPTIONS.map(o => <button key={o.id} onClick={() => setAtt({...att, [s.NamaLengkap]: o.id})} className={`flex-1 py-1 text-xs font-medium rounded border transition-colors ${att[s.NamaLengkap]===o.id || (!att[s.NamaLengkap]&&o.id==='Hadir') ? 'bg-blue-600 text-white border-blue-700 shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>{o.alias}</button>)}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-300 text-right"><button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium border border-blue-700 shadow-sm transition-colors focus:ring-4 focus:ring-blue-200">Kirim Data Presensi</button></div>
      </div>
    </div>
  );
}

function IncomeInputView({ onPost }) {
  const handleSubmit = (d) => onPost('addIncome', { ...d, kategori: 'Pemasukan Lain', status: 'Lunas', via: 'Tunai' }, "Pemasukan berhasil dicatat");
  return (
    <div className="max-w-md mx-auto bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
      <div className="bg-gray-100 p-3 border-b border-gray-300 font-semibold text-gray-700 flex items-center gap-2"><PlusCircle size={16} className="text-blue-600"/> Catat Pemasukan Manual</div>
      <div className="p-5"><ModalForm inline onSubmit={handleSubmit} fields={[{n:'tanggal',t:'date'},{n:'nama',l:'Sumber Dana'},{n:'nominal',t:'number'}]} /></div>
    </div>
  );
}

function StudentListView({ students, onPost }) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('Semua');
  const [editModal, setEditModal] = useState({ show: false, student: null });
  const [confirmMsg, setConfirmMsg] = useState(null);

  const classes = useMemo(() => ['Semua', ...new Set(students.map(s => s.Kelas))], [students]);
  const filtered = useMemo(() => students.filter(s => classFilter === 'Semua' || s.Kelas === classFilter).filter(s => s.NamaLengkap.toLowerCase().includes(search.toLowerCase())), [students, search, classFilter]);
  
  const handleUpdate = (e) => { 
    e.preventDefault(); 
    const formData = new FormData(e.target); 
    onPost('editStudent', {oldName: editModal.student.NamaLengkap, newName: formData.get('nama'), newClass: formData.get('kelas')}, "Profil anggota diperbarui"); 
    setEditModal({ show: false, student: null }); 
  };

  const handleDelete = (s) => {
    setConfirmMsg({
      title: "Hapus Data Anggota",
      message: `Hapus profil anggota atas nama ${s.NamaLengkap} dari database?`,
      onConfirm: () => {
        onPost('deleteStudent', { name: s.NamaLengkap }, "Anggota berhasil dihapus"); 
        setConfirmMsg(null);
      }
    });
  };

  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden flex flex-col">
      {confirmMsg && <ConfirmModal title={confirmMsg.title} message={confirmMsg.message} onConfirm={confirmMsg.onConfirm} onCancel={() => setConfirmMsg(null)} />}
      
      <div className="bg-gray-100 p-3 border-b border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-700">Daftar Anggota</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-48 text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-200" />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200">{classes.map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead><tr className="bg-white border-b border-gray-300 text-gray-700"><th className="px-4 py-3 font-semibold">Nama Lengkap</th><th className="px-4 py-3 font-semibold">Kelas</th><th className="px-4 py-3 font-semibold text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length > 0 ? filtered.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 even:bg-gray-50/50">
                <td className="px-4 py-2 font-medium text-gray-800 uppercase">{s.NamaLengkap}</td>
                <td className="px-4 py-2 text-gray-600">{s.Kelas}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button onClick={() => setEditModal({ show: true, student: s })} className="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded border border-blue-200"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(s)} className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded border border-red-200"><Trash2 size={14} /></button>
                </td>
              </tr>
            )) : (<tr><td colSpan="3" className="p-8 text-center text-gray-500 text-sm">Tidak ada data.</td></tr>)}
          </tbody>
        </table>
      </div>
      {editModal.show && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div className="bg-white rounded border border-gray-300 shadow-lg w-full max-w-sm overflow-hidden"><div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center font-semibold text-gray-800">Update Profil<button onClick={() => setEditModal({ show: false, student: null })} className="text-gray-500 hover:text-gray-800"><X size={18} /></button></div><form onSubmit={handleUpdate} className="p-5 space-y-4"><div className="space-y-1"><label className="block text-sm font-medium text-gray-700">Nama</label><input name="nama" type="text" defaultValue={editModal.student.NamaLengkap} required className="w-full text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200" /></div><div className="space-y-1"><label className="block text-sm font-medium text-gray-700">Kelas</label><input name="kelas" type="text" defaultValue={editModal.student.Kelas} required className="w-full text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200" /></div><button type="submit" className="w-full bg-blue-600 border border-blue-700 text-white py-2 rounded text-base font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200">Perbarui</button></form></div></div>)}
    </div>
  );
}

function UserManagementView({ users, onPost }) {
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ u: '', p: '' });
  const handleUpdate = (role, u, p) => { onPost('updateUser', { role, username: u, password: p }, "Otoritas akun diperbarui"); setEdit(null); };
  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm flex flex-col"><div className="bg-gray-100 p-3 border-b border-gray-300 flex items-center gap-2 font-semibold text-gray-700"><ShieldCheck size={18} className="text-blue-600" />Konfigurasi Otoritas Login</div><div className="divide-y divide-gray-200">{users.map(u => (<div key={u.Role} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50"><div className="text-center md:text-left"><p className="text-sm font-semibold text-gray-800">{u.Role}</p><p className="text-xs text-gray-500">@{u.Username}</p></div>{edit === u.Role ? (<div className="flex flex-wrap gap-2 justify-center w-full md:w-auto"><input type="text" value={form.u} onChange={e => setForm({...form, u: e.target.value})} className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-32" /><input type="text" value={form.p} onChange={e => setForm({...form, p: e.target.value})} className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-32" /><button onClick={() => handleUpdate(u.Role, form.u, form.p)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition-colors border border-blue-700">Simpan</button></div>) : (<button onClick={() => { setEdit(u.Role); setForm({ u: u.Username, p: u.Password }); }} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors">Ubah Kredensial</button>)}</div>))}</div></div>
  );
}

// === ROUTER KOMPONEN ===
function ContentRouter({ view, user, data, actions }) {
  const hasAccess = (required) => required.includes(user.role);
  switch (view) {
    case 'dashboard': return <AdminDashboardView data={data} />;
    case 'attendance-input': return hasAccess([ROLES.SEKRETARIS]) ? <AttendanceInputView students={data.students} onPost={actions.genericPost} showToast={actions.showToast} /> : <AccessDenied />;
    case 'income-input': return hasAccess([ROLES.BENDAHARA]) ? <IncomeInputView onPost={actions.genericPost} /> : <AccessDenied />;
    case 'finance': return hasAccess([ROLES.ADMIN, ROLES.BENDAHARA]) ? <FinanceView data={data.finance} user={user} onPost={actions.genericPost} /> : <AccessDenied />;
    case 'expenses': return hasAccess([ROLES.ADMIN, ROLES.BENDAHARA]) ? <ExpenseView data={data.expenses} user={user} onPost={actions.genericPost} /> : <AccessDenied />;
    case 'attendance-recap': return <AttendanceRecapView history={data.history} onPost={actions.genericPost} />;
    case 'users': return user.role === ROLES.ADMIN ? <StudentListView students={data.students} onPost={actions.genericPost} /> : <GenericTable title="Daftar Anggota" headers={['NamaLengkap','Kelas']} rows={data.students} />;
    case 'user-mgmt': return hasAccess([ROLES.ADMIN]) ? <UserManagementView users={data.appUsers} onPost={actions.genericPost} /> : <AccessDenied />;
    default: return <AdminDashboardView data={data} />;
  }
}

// === KOMPONEN UTAMA (APP) ===
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); 
  const [loginError, setLoginError] = useState(''); 

  const [students, setStudents] = useState([]);
  const [finance, setFinance] = useState([]);
  const [history, setHistory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => { 
    const init = async () => { 
      try { 
        const r = await fetch(`${API_URL}?action=getUsers&t=${Date.now()}`); 
        const d = await r.json(); 
        if(d && Array.isArray(d)) setAppUsers(d); 
      } catch(e){} 
    }; 
    init(); 
    fetchAllData(); 
  }, []);

  const showToast = (m, t='success') => { setToast({message:m, type:t}); setTimeout(()=>setToast(null),3000); };
  
  const fetchAllData = async () => { 
    setLoading(true); 
    try { 
      const t = Date.now(); 
      const [s,f,h,e] = await Promise.all([
        fetch(`${API_URL}?action=getStudents&t=${t}`).then(r=>r.json()), 
        fetch(`${API_URL}?action=getFinance&t=${t}`).then(r=>r.json()), 
        fetch(`${API_URL}?action=getHistory&t=${t}`).then(r=>r.json()), 
        fetch(`${API_URL}?action=getExpenses&t=${t}`).then(r=>r.json())
      ]); 
      setStudents(Array.isArray(s)?s:[]); 
      setFinance(Array.isArray(f)?f:[]); 
      setHistory(Array.isArray(h)?h:[]); 
      setExpenses(Array.isArray(e)?e:[]); 
    } catch(e){ 
      showToast("Gagal menyinkronkan data","error"); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  const handleLogin = (u, p) => { 
    setLoginError('');
    const v = appUsers.find(x => String(x.Username).toLowerCase()===String(u).toLowerCase() && String(x.Password)===String(p)); 
    if(v){ 
      setUser({role:v.Role, name:v.Username}); 
      setView(v.Role===ROLES.SEKRETARIS?'attendance-input':v.Role===ROLES.BENDAHARA?'finance':'dashboard'); 
      setShowLogin(false); 
      showToast(`Login Sukses, ${v.Role}`); 
    } else {
      setLoginError("Username atau kata sandi tidak cocok. Silakan coba lagi.");
      showToast("Akses ditolak: ID atau Sandi salah","error"); 
    }
  };

  const genericPost = async (a, p, m) => { 
    setLoading(true); 
    try { 
      await fetch(API_URL, {method:'POST', body:JSON.stringify({action:a, payload:p})}); 
      showToast(m); 
      await fetchAllData(); 
    } catch(e){ 
      showToast("Kesalahan Jaringan","error"); 
    } finally { 
      setLoading(false); 
    } 
  };

  if (!user && showLogin) {
    return <LoginScreen onLogin={handleLogin} onBack={() => setShowLogin(false)} loginError={loginError} />;
  }

  if (!user && !showLogin) {
    return <PublicDashboard data={{students, finance, history, expenses}} onLoginClick={() => setShowLogin(true)} loading={loading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {toast && <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded shadow-lg flex items-center gap-2 bg-white border-l-4 ${toast.type==='error'?'border-red-500 text-red-700':'border-green-500 text-green-700'}`}><AlertCircle size={16}/><span className="text-sm font-medium">{toast.message}</span></div>}
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-transparent"><Menu size={20}/></button>
            <div className="flex items-center gap-2 text-red-600"><AppLogo className="h-8 w-8 object-cover rounded-full border border-red-100 bg-white" fallbackSize={24} /><span className="text-sm md:text-lg font-bold tracking-tight uppercase truncate max-w-[200px] md:max-w-none">PMR SMANEL MANAGEMENT SYSTEM</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block"><p className="text-[10px] text-gray-500 font-semibold uppercase">{user.role}</p><p className="text-sm font-bold text-gray-800">@{user.name}</p></div>
            <button onClick={()=>{setUser(null);setView('dashboard');}} className="btn btn-sm btn-outline-danger flex items-center gap-1 text-sm bg-white border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded"><LogOut size={16}/> <span className="hidden md:inline">Logout</span></button>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col lg:flex-row container mx-auto w-full p-4 gap-6 relative">
        <aside className={`fixed inset-0 z-40 lg:relative lg:block w-64 bg-white border border-gray-300 rounded shadow-sm transition-transform ${isMenuOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
          <div className="p-3 border-b border-gray-300 bg-gray-100 flex justify-between items-center"><h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Navigasi Menu</h4><button className="lg:hidden text-gray-500" onClick={()=>setIsMenuOpen(false)}><X size={18}/></button></div>
          <div className="p-2 space-y-1 overflow-y-auto h-full">
            {user.role===ROLES.ADMIN && ['dashboard','attendance-recap','finance','expenses','users','user-mgmt'].map(v=><SidebarLink key={v} active={view===v} onClick={()=>{setView(v);setIsMenuOpen(false)}} icon={getIcon(v)} label={getLabel(v)}/>)}
            {user.role===ROLES.SEKRETARIS && ['attendance-input','attendance-recap','users'].map(v=><SidebarLink key={v} active={view===v} onClick={()=>{setView(v);setIsMenuOpen(false)}} icon={getIcon(v)} label={getLabel(v)}/>)}
            {user.role===ROLES.BENDAHARA && ['finance','income-input','expenses','dashboard'].map(v=><SidebarLink key={v} active={view===v} onClick={()=>{setView(v);setIsMenuOpen(false)}} icon={getIcon(v)} label={getLabel(v)}/>)}
          </div>
        </aside>
        <main className="flex-1 w-full overflow-hidden">
          {loading ? <div className="h-64 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600 mb-3" size={36}/><p className="text-sm font-medium text-gray-500">Memproses Data...</p></div> : <div className="animate-fade-in"><ContentRouter view={view} user={user} data={{students,finance,history,expenses,appUsers}} actions={{genericPost, showToast}}/></div>}
        </main>
      </div>
    </div>
  );
}