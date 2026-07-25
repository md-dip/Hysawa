import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
});

export const getDashboardSummary = (districtId = '') =>
    api.get('/dashboard/summary', { params: { district_id: districtId } });

export const getQuarterlyGrowth = () =>
    api.get('/dashboard/quarterly-growth');

export const getUpazilaWiseSources = (params = {}) =>
    api.get('/water-sources/upazila-wise', { params });

export const getChemicalTests = (params = {}) =>
    api.get('/chemical-tests', { params });

export const getDistricts = () =>
    api.get('/locations/districts');