import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getQuarterlyGrowth, getUpazilaWiseSources } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, LabelList, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
    const [summary, setSummary]       = useState(null);
    const [quarterly, setQuarterly]   = useState([]);
    const [upazilas, setUpazilas]     = useState([]);

    useEffect(() => {
        getDashboardSummary().then(r => setSummary(r.data));
        getQuarterlyGrowth().then(r => setQuarterly(r.data));
        getUpazilaWiseSources().then(r => setUpazilas(r.data));
    }, []);

    if (!summary) return (
        <div style={{ padding: 40, fontSize: 18 }}>Loading...</div>
    );

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#0891b2', color: 'white', borderRadius: 8, padding: 20 }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold' }}>{summary.total_institutions.toLocaleString()}</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>INSTITUTIONS</div>
                </div>
                <div style={{ background: '#16a34a', color: 'white', borderRadius: 8, padding: 20 }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold' }}>{summary.students.total.toLocaleString()}</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>STUDENTS</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Girls - {summary.students.girls.toLocaleString()}</div>
                    <div style={{ fontSize: 12 }}>Boys - {summary.students.boys.toLocaleString()}</div>
                </div>
                <div style={{ background: '#ca8a04', color: 'white', borderRadius: 8, padding: 20 }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold' }}>{summary.water_points.total.toLocaleString()}</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>WATER POINTS</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Shallow Tubewell - {summary.water_points.shallow_tubewell}</div>
                    <div style={{ fontSize: 12 }}>Piped Water - {summary.water_points.piped_water}</div>
                    <div style={{ fontSize: 12 }}>Rainwater - {summary.water_points.rainwater_harvesting}</div>
                    <div style={{ fontSize: 12 }}>Reverse Osmosis - {summary.water_points.reverse_osmosis}</div>
                </div>
            </div>

            {/* Alert Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'Inactive Institutions',        value: summary.alerts.inactive_institutions },
                    { label: 'No Infrastructure',            value: summary.alerts.no_infrastructure },
                    { label: 'No Functional Source',         value: summary.alerts.no_functional_source },
                    { label: 'No Drinking Source',           value: summary.alerts.no_drinking_source },
                    { label: 'Under Construction',           value: summary.alerts.under_construction },
                    { label: 'Needs Repair',                 value: summary.alerts.needs_repair },
                ].map((item) => (
                    <div key={item.label} style={{ background: 'white', borderRadius: 8, padding: 16, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ color: 'red', fontSize: 20 }}>⚠️</div>
                        <div style={{ color: 'red', fontSize: 11, fontWeight: 600, margin: '6px 0' }}>{item.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Quarterly Growth Chart */}
            <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: 16 }}>Water Points Growth Over Time</h3>
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
            </div>

            {/* Upazila Wise Chart */}
            <div style={{ background: 'white', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: 16 }}>Upazila Wise Water Sources</h3>
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
            </div>
        </div>
    );
}