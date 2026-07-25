import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    LabelList, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// ═══════════════════════════════════════
// API SERVICE
// ═══════════════════════════════════════
const api = axios.create({ baseURL: '/api/v1' });
const getDashboardSummary = (d = '') => api.get('/dashboard/summary', { params: { district_id: d } });
const getQuarterlyGrowth  = ()       => api.get('/dashboard/quarterly-growth');
const getUpazilaWise      = (p = {}) => api.get('/water-sources/upazila-wise', { params: p });
const getChemicalTests    = (p = {}) => api.get('/chemical-tests', { params: p });
const getDistricts        = ()       => api.get('/locations/districts');
const getUpazilas         = (d = '') => api.get('/locations/upazilas', { params: { district_id: d } });
const getUnions           = (u = '') => api.get('/locations/unions',   { params: { upazila_id: u } });

// ═══════════════════════════════════════
// SHARED STYLES
// ═══════════════════════════════════════
const card = {
    background: 'white', borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)', padding: 20,
};
const selectStyle = {
    border: '1px solid #ccc', borderRadius: 4,
    padding: '6px 10px', fontSize: 13, width: '100%',
    background: 'white', color: '#333',
};
const labelStyle = {
    fontSize: 11, color: '#999', fontWeight: 600,
    letterSpacing: 0.5, marginBottom: 4, display: 'block', textTransform: 'uppercase',
};

// ═══════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════
function StatCard({ bg, title, value, sub1, sub2, sub3, icon }) {
    return (
        <div style={{ background: bg, color: 'white', borderRadius: 8, padding: '22px 24px', position: 'relative', overflow: 'hidden', minHeight: 120 }}>
            <div style={{ fontSize: 38, fontWeight: 700 }}>{Number(value).toLocaleString()}</div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 2, marginBottom: 8 }}>{title}</div>
            {sub1 && <div style={{ fontSize: 13, opacity: 0.9 }}>{sub1}</div>}
            {sub2 && <div style={{ fontSize: 13, opacity: 0.9 }}>{sub2}</div>}
            {sub3 && <div style={{ fontSize: 13, opacity: 0.9 }}>{sub3}</div>}
            <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 52, opacity: 0.25 }}>{icon}</div>
        </div>
    );
}

function WpCard({ label, value }) {
    return (
        <div style={{ ...card, textAlign: 'center', padding: '18px 12px' }}>
            <div style={{ color: '#38bcd4', fontSize: 24, marginBottom: 6 }}>〰️</div>
            <div style={{ color: '#38bcd4', fontSize: 12, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
        </div>
    );
}

function AlertCard({ label, value }) {
    return (
        <div style={{ ...card, textAlign: 'center', padding: '14px 10px' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>❗</div>
            <div style={{ color: '#e53935', fontSize: 11, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
        </div>
    );
}

function SectionCard({ title, badge, badgeColor, legend, children, filters }) {
    return (
        <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#333' }}>{title}</h3>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {legend && (
                        <>
                            <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} /> Within Standard
                            </span>
                            <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%', display: 'inline-block' }} /> Exceeds Standard
                            </span>
                        </>
                    )}
                    {badge && (
                        <span style={{ background: badgeColor || '#3b82f6', color: 'white', padding: '3px 12px', borderRadius: 4, fontSize: 13, fontWeight: 600 }}>
                            {badge}
                        </span>
                    )}
                </div>
            </div>
            {filters && <div style={{ marginBottom: 16 }}>{filters}</div>}
            {children}
        </div>
    );
}

// Cascading location filter
function LocationFilter({ onChange }) {
    const [districts, setDistricts] = useState([]);
    const [upazilas,  setUpazilas]  = useState([]);
    const [unions,    setUnions]    = useState([]);
    const [sel, setSel] = useState({ district_id: '', upazila_id: '', union_id: '' });

    useEffect(() => { getDistricts().then(r => setDistricts(r.data)); }, []);

    const onDistrict = e => {
        const v = e.target.value;
        const next = { district_id: v, upazila_id: '', union_id: '' };
        setSel(next); setUpazilas([]); setUnions([]);
        if (v) getUpazilas(v).then(r => setUpazilas(r.data));
        onChange(next);
    };
    const onUpazila = e => {
        const v = e.target.value;
        const next = { ...sel, upazila_id: v, union_id: '' };
        setSel(next); setUnions([]);
        if (v) getUnions(v).then(r => setUnions(r.data));
        onChange(next);
    };
    const onUnion = e => {
        const next = { ...sel, union_id: e.target.value };
        setSel(next); onChange(next);
    };
    const reset = () => {
        const next = { district_id: '', upazila_id: '', union_id: '' };
        setSel(next); setUpazilas([]); setUnions([]); onChange(next);
    };

    const col = { flex: 1 };
    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={col}>
                <span style={labelStyle}>District</span>
                <select style={selectStyle} value={sel.district_id} onChange={onDistrict}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
            <div style={col}>
                <span style={labelStyle}>Upazila</span>
                <select style={selectStyle} value={sel.upazila_id} onChange={onUpazila}>
                    <option value="">Select District</option>
                    {upazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>
            <div style={col}>
                <span style={labelStyle}>Union</span>
                <select style={selectStyle} value={sel.union_id} onChange={onUnion}>
                    <option value="">Select Upazila</option>
                    {unions.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>
            <button onClick={reset} style={{ padding: '7px 18px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', fontSize: 13, height: 36 }}>
                Reset
            </button>
        </div>
    );
}

// ═══════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════
function DashboardPage() {
    const [summary,   setSummary]   = useState(null);
    const [quarterly, setQuarterly] = useState([]);
    const [upazilas,  setUpazilas]  = useState([]);
    const [instType,  setInstType]  = useState('');
    const [wpFilters, setWpFilters] = useState({});

    useEffect(() => {
        getDashboardSummary().then(r => setSummary(r.data));
        getQuarterlyGrowth().then(r => setQuarterly(r.data));
        getUpazilaWise().then(r => setUpazilas(r.data));
    }, []);

    const reloadWp = (f) => getUpazilaWise(f).then(r => setUpazilas(r.data));
    const reloadQg = (t) => getQuarterlyGrowth(t).then(r => setQuarterly(r.data));

    if (!summary) return <div style={{ padding: 40, color: '#888' }}>Loading...</div>;
    const { students, water_points, alerts } = summary;

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 26, fontWeight: 700 }}>Dashboard</h2>

            {/* ── Top Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                <StatCard bg="#1a9ab0" icon="🏛️" title="INSTITUTIONS" value={summary.total_institutions} />
                <StatCard bg="#22a05a" icon="🎓" title="STUDENTS"     value={students.total}
                    sub1={`Girls - ${students.girls.toLocaleString()}`}
                    sub2={`Boys - ${students.boys.toLocaleString()}`} />
                <StatCard bg="#d4a017" icon="💧" title="WATER POINTS" value={water_points.total}
                    sub1={`Schools - ${water_points.piped_water}`}
                    sub2="Healthcare Centers - 1"
                    sub3="Community - 0" />
            </div>

            {/* ── Water Point Type Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                <WpCard label="Shallow Tubewell"          value={water_points.shallow_tubewell} />
                <WpCard label="Piped Water"               value={water_points.piped_water} />
                <WpCard label="Rainwater Harvesting System" value={water_points.rainwater_harvesting} />
                <WpCard label="Reverse Osmosis"           value={water_points.reverse_osmosis} />
            </div>

            {/* ── Alert Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 24 }}>
                <AlertCard label="Inactive Institutions"              value={alerts.inactive_institutions} />
                <AlertCard label="Institutions with No Infrastructure" value={alerts.no_infrastructure} />
                <AlertCard label="No Functional Source"               value={alerts.no_functional_source} />
                <AlertCard label="No Drinking Source"                 value={alerts.no_drinking_source} />
                <AlertCard label="Under Construction"                 value={alerts.under_construction} />
                <AlertCard label="Institutions require Repair/Renovation" value={alerts.needs_repair} />
            </div>

            {/* ── Quarterly Growth Chart ── */}
            <div style={{ marginBottom: 20 }}>
                <SectionCard title="Water Points Added Over Time" filters={
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <span style={labelStyle}>Institution Type</span>
                            <select style={selectStyle} value={instType} onChange={e => { setInstType(e.target.value); reloadQg(e.target.value); }}>
                                <option value="">All</option>
                                <option value="school">School</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="community">Community</option>
                            </select>
                        </div>
                        <button onClick={() => { setInstType(''); reloadQg(''); }} style={{ padding: '7px 18px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', fontSize: 13, height: 36 }}>Reset</button>
                    </div>
                }>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={quarterly}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#3b82f6" radius={[3,3,0,0]}>
                                <LabelList dataKey="total" position="top" style={{ fontSize: 10 }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>
            </div>

            {/* ── Upazila Wise Chart ── */}
            <SectionCard title="Upazila Wise Water Sources" filters={
                <LocationFilter onChange={f => { setWpFilters(f); reloadWp(f); }} />
            }>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={upazilas}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="upazila" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#3b82f6" radius={[3,3,0,0]}>
                            <LabelList dataKey="total" position="top" style={{ fontSize: 11 }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </SectionCard>
        </div>
    );
}

// ═══════════════════════════════════════
// CHARTS & ANALYSIS PAGE
// ═══════════════════════════════════════
const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

function ChartsPage() {
    const [summary,   setSummary]   = useState(null);
    const [chemical,  setChemical]  = useState([]);
    const [quarterly, setQuarterly] = useState([]);
    const [upazilas,  setUpazilas]  = useState([]);
    const [instTypes, setInstTypes] = useState({ total: 0, breakdown: [] });
    const [wpTypes2,  setWpTypes2]  = useState({ total: 0, breakdown: [] });

    useEffect(() => {
        getDashboardSummary().then(r => setSummary(r.data));
        getChemicalTests().then(r    => setChemical(r.data));
        getQuarterlyGrowth().then(r  => setQuarterly(r.data));
        getUpazilaWise().then(r      => setUpazilas(r.data));
        api.get('/charts/institution-types').then(r => setInstTypes(r.data));
        api.get('/charts/waterpoint-types').then(r  => setWpTypes2(r.data));
    }, []);

    if (!summary) return <div style={{ padding: 40, color: '#888' }}>Loading...</div>;
    const { students, water_points } = summary;

    const COLORS  = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
    const renderLabel = ({ percent }) => `${(percent*100).toFixed(0)}%`;

    // Format type labels
    const formatType = (t) => t.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase());

    // Split institution types into school vs hcf
    const schoolTypes = (instTypes.breakdown || []).filter(d =>
        ['primary_school','secondary_school','madrasa'].includes(d.type)
    );
    const hcfTypes = (instTypes.breakdown || []).filter(d =>
        ['community_clinic','health_family_planning'].includes(d.type)
    );
    const schoolTotal = schoolTypes.reduce((s,d) => s + d.count, 0);
    const hcfTotal    = hcfTypes.reduce((s,d) => s + d.count, 0);

    const genderData = [
        { name: 'Male',   value: students.boys  },
        { name: 'Female', value: students.girls },
    ];

    const wpBreakdown = (wpTypes2.breakdown || []).map(d => ({
        name: formatType(d.type), value: d.count
    }));

    const renderLegend = (data, total) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
            {data.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i], flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ flex: 1 }}>{d.name || formatType(d.type)}</span>
                    <span style={{ color: '#555', minWidth: 50, textAlign: 'right' }}>{(d.value || d.count).toLocaleString()}</span>
                    <span style={{ color: '#999', minWidth: 40, textAlign: 'right' }}>
                        {(((d.value || d.count) / total) * 100).toFixed(1)}%
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 26, fontWeight: 700 }}>Charts & Analysis</h2>

            {/* ── Row 1: Institution Types + Students by Gender ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* Institutions by Type */}
                <SectionCard title="Institutions by Type"
                    badge={schoolTotal.toLocaleString()} badgeColor="#3b82f6"
                    filters={<LocationFilter onChange={f =>
                        api.get('/charts/institution-types', {params:f}).then(r => setInstTypes(r.data))
                    } />}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <PieChart width={180} height={220}>
                            <Pie data={schoolTypes.map(d=>({name:formatType(d.type),value:d.count}))}
                                cx={85} cy={110} innerRadius={55} outerRadius={85}
                                dataKey="value" label={renderLabel} labelLine={false}>
                                {schoolTypes.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div style={{ flex: 1 }}>
                            {renderLegend(schoolTypes.map(d=>({name:formatType(d.type),value:d.count})), schoolTotal)}
                        </div>
                    </div>
                </SectionCard>

                {/* Students by Gender */}
                <SectionCard title="Students by Gender"
                    badge={students.total.toLocaleString()} badgeColor="#22a05a"
                    filters={<LocationFilter onChange={() => {}} />}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <PieChart width={180} height={220}>
                            <Pie data={genderData} cx={85} cy={110}
                                outerRadius={85} dataKey="value"
                                label={renderLabel} labelLine={false}>
                                {genderData.map((_,i) => <Cell key={i} fill={['#3b82f6','#22c55e'][i]} />)}
                            </Pie>
                            <Tooltip formatter={v => v.toLocaleString()} />
                        </PieChart>
                        <div style={{ flex: 1 }}>
                            {renderLegend(genderData, students.total)}
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* ── Row 2: HCF Summary + Waterpoints by Type ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* HCF Summary */}
                <SectionCard title="HCF Summary"
                    badge={hcfTotal.toLocaleString()} badgeColor="#d4a017"
                    filters={<LocationFilter onChange={f =>
                        api.get('/charts/institution-types', {params:f}).then(r => setInstTypes(r.data))
                    } />}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <PieChart width={180} height={220}>
                            <Pie data={hcfTypes.map(d=>({name:formatType(d.type),value:d.count}))}
                                cx={85} cy={110} innerRadius={55} outerRadius={85}
                                dataKey="value" label={renderLabel} labelLine={false}>
                                {hcfTypes.map((_,i) => <Cell key={i} fill={['#3b82f6','#22c55e'][i]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div style={{ flex: 1 }}>
                            {renderLegend(hcfTypes.map(d=>({name:formatType(d.type),value:d.count})), hcfTotal)}
                        </div>
                    </div>
                </SectionCard>

                {/* Waterpoints by Type */}
                <SectionCard title="Waterpoints by Type"
                    badge={wpTypes2.total?.toLocaleString()} badgeColor="#d4a017"
                    filters={<LocationFilter onChange={f =>
                        api.get('/charts/waterpoint-types', {params:f}).then(r => setWpTypes2(r.data))
                    } />}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <PieChart width={180} height={220}>
                            <Pie data={wpBreakdown} cx={85} cy={110}
                                outerRadius={85} dataKey="value"
                                label={renderLabel} labelLine={false}>
                                {wpBreakdown.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div style={{ flex: 1 }}>
                            {renderLegend(wpBreakdown, wpTypes2.total || 1)}
                        </div>
                    </div>
                </SectionCard>
            </div>
            {/* ── Quarterly Growth ── */}
<div style={{ marginBottom: 20 }}>
    <SectionCard title="Water Points Growth Over Time (Quarterly)" filters={
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ flex: 1 }}>
                <span style={labelStyle}>Institution Type</span>
                <select style={selectStyle} onChange={e => getQuarterlyGrowth(e.target.value).then(r => setQuarterly(r.data))}>
                    <option value="">All</option>
                    <option value="primary_school">Primary School</option>
                    <option value="secondary_school">Secondary School</option>
                    <option value="community_clinic">Community Clinic</option>
                </select>
            </div>
            <button onClick={() => getQuarterlyGrowth().then(r => setQuarterly(r.data))}
                style={{ padding: '7px 18px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', fontSize: 13, height: 36 }}>
                Reset
            </button>
        </div>
    }>
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[3,3,0,0]}>
                    <LabelList dataKey="total" position="top" style={{ fontSize: 10 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </SectionCard>
</div>

{/* ── Upazila Wise ── */}
<div style={{ marginBottom: 20 }}>
    <SectionCard title="Upazila Wise Water Sources" filters={
        <LocationFilter onChange={f => getUpazilaWise(f).then(r => setUpazilas(r.data))} />
    }>
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={upazilas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="upazila" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[3,3,0,0]}>
                    <LabelList dataKey="total" position="top" style={{ fontSize: 11 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </SectionCard>
</div>
            {/* ── Chemical Testing ── */}
            <SectionCard title="Chemical Testing" legend filters={
                <LocationFilter onChange={f => getChemicalTests(f).then(r => setChemical(r.data))} />
            }>
                {chemical.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chemical}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="parameter" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="within"  name="Within Standard"  fill="#22c55e" radius={[3,3,0,0]}>
                                <LabelList dataKey="within"  position="top" style={{ fontSize: 11 }} />
                            </Bar>
                            <Bar dataKey="exceeds" name="Exceeds Standard" fill="#ef4444" radius={[3,3,0,0]}>
                                <LabelList dataKey="exceeds" position="top" style={{ fontSize: 11 }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
                        Run ChemicalTestSeeder to populate this chart.
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
// ═══════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════
const NAV = [
    { label: 'Dashboard',          icon: '🏠' },
    { label: 'All Data',           icon: '🗄️' },
    { label: 'Charts & Analysis',  icon: '📊' },
    { label: 'Mobile App Reports', icon: '📱' },
    { label: 'Progress Reports',   icon: '📋' },
    { label: 'Sending Message',    icon: '✉️' },
    { label: 'Where We Work',      icon: '📍' },
    { label: 'Data Downloads',     icon: '⬇️' },
];

function Sidebar({ active, setActive }) {
    return (
        <div style={{
            width: 260, minHeight: '100vh', background: '#343a40',
            color: 'white', display: 'flex', flexDirection: 'column',
            position: 'fixed', top: 0, left: 0, zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #495057' }}>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1.5 }}>SAFEPANI MODEL</div>
            </div>
            {/* User */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #495057', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: '#8fbc8f',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>DA</div>
                <span style={{ fontSize: 14 }}>Dip Ahammed</span>
            </div>
            {/* Nav Items */}
            <nav style={{ flex: 1, padding: '8px 0' }}>
                {NAV.map(item => (
                    <button key={item.label} onClick={() => setActive(item.label)} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: 'calc(100% - 16px)', margin: '1px 8px',
                        padding: '10px 14px', border: 'none', cursor: 'pointer',
                        borderRadius: 5, fontSize: 14, textAlign: 'left',
                        background: active === item.label ? '#e9837a' : 'transparent',
                        color:      active === item.label ? 'white'   : '#adb5bd',
                        fontWeight: active === item.label ? 600       : 400,
                        transition: 'background 0.15s',
                    }}>
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
function App() {
    const [activePage, setActivePage] = useState('Dashboard');

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            <Sidebar active={activePage} setActive={setActivePage} />

            <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Top Bar */}
                <div style={{
                    background: 'white', padding: '12px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 50,
                }}>
                    <span style={{ fontSize: 13, color: '#888' }}>{activePage}</span>
                    <span style={{ fontSize: 14, color: '#555' }}>
                        Welcome <strong>safepani_dip</strong>
                    </span>
                </div>

                {/* Page */}
                <div style={{ flex: 1 }}>
                    {activePage === 'Dashboard'         && <DashboardPage />}
                    {activePage === 'Charts & Analysis' && <ChartsPage />}
                    {!['Dashboard', 'Charts & Analysis'].includes(activePage) && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#aaa' }}>
                            <div style={{ fontSize: 56, marginBottom: 16 }}>🚧</div>
                            <div style={{ fontSize: 20, fontWeight: 600 }}>{activePage}</div>
                            <div style={{ fontSize: 14, marginTop: 8 }}>Coming soon</div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 24px', borderTop: '1px solid #e0e0e0', background: 'white', fontSize: 13, color: '#999' }}>
                    <strong style={{ color: '#555' }}>SafePani Model</strong> © 2026
                </div>
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);