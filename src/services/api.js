// Centralized API helpers with graceful fallback/mocking
// Base can point to NestJS or PHP endpoints. Prefer env override.
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000'; // Nest default

async function safeFetch(url, options = {}, { mock, transform } = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return transform ? transform(data) : data;
  } catch (err) {
    console.warn('API fallback for', url, err.message);
    return typeof mock === 'function' ? mock() : mock ?? null;
  }
}

// Users (NestJS user-management module)
export const getUsers = () => safeFetch(`${BASE}/user-management`, {}, {
  mock: () => [],
  transform: arr => arr.map(u => ({
    id: String(u.id),
    uid: u.uid || String(u.id),
    surname: u.surname,
    name: u.name,
    email: u.email,
    course: u.course || '',
    dateCreated: (u.date_registered || u.date_created || '').split('T')[0]?.replace(/-/g,'/'),
    points: u.total_points ?? u.points ?? 0
  }))
});

export const updateUser = (id, payload) => safeFetch(`${BASE}/user-management/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type':'application/json' },
  body: JSON.stringify(payload)
}, { mock: () => ({ success: true }) });

export const deleteUser = (id) => safeFetch(`${BASE}/user-management/${id}`, { method:'DELETE' }, { mock: () => ({ success:true }) });

export const createUser = (payload) => safeFetch(`${BASE}/user-management`, {
  method:'POST',
  headers:{ 'Content-Type':'application/json' },
  body: JSON.stringify(payload)
}, { mock: () => ({ id: Date.now(), ...payload }) });

// Biowaste disposals
export const getDisposals = () => safeFetch(`${BASE}/biowaste`, {}, {
  mock: () => [],
  transform: arr => arr.map(d => ({
    id: d.disposal_id || d.id,
    userId: d.user_id,
    uid: d.uid,
    kg: Number(d.kilogram),
    pointsEarned: d.points_earned,
    createdAt: d.created_at
  }))
});

// Transactions / Rewards
export const getTransactions = () => safeFetch(`${BASE}/transactions`, {}, {
  mock: () => [],
  transform: arr => arr.map(t => ({
    id: t.transaction_id || t.reference_id || t.id,
    userId: t.user_id,
    rewardName: t.reward_name || t.reward,
    pointsUsed: t.points_used,
    date: t.transaction_date || t.date_created,
    status: t.status || 'Completed'
  }))
});

export const getRewards = () => safeFetch(`${BASE}/rewards`, {}, {
  mock: () => [
    { id:1, name:'Eco Bag', points:50, stock:10, available:true, thumbnail:'' },
    { id:2, name:'Water Bottle', points:120, stock:5, available:true, thumbnail:'' }
  ]
});

export const createReward = (payload) => safeFetch(`${BASE}/rewards`, {
  method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload)
}, { mock: () => ({ id: Date.now(), ...payload }) });
export const updateReward = (id, payload) => safeFetch(`${BASE}/rewards/${id}`, {
  method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload)
}, { mock: () => ({ id, ...payload }) });
export const deleteReward = (id) => safeFetch(`${BASE}/rewards/${id}`, { method:'DELETE' }, { mock: () => ({ success:true }) });

export const redeemReward = (payload) => safeFetch(`${BASE}/transactions`, {
  method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload)
}, { mock: () => ({ id: Date.now(), ...payload, status:'Completed', date:new Date().toISOString() }) });

// Aggregated dashboard stats
export const getDashboardStats = () => safeFetch(`${BASE}/stats`, {}, {
  mock: () => ({
    userCount: 0,
    totalPoints: 0,
    disposalKgWeek: [
      { day:'M', waste:0 }, { day:'T', waste:0 }, { day:'W', waste:0 },
      { day:'T', waste:0 }, { day:'F', waste:0 }, { day:'S', waste:0 }, { day:'S', waste:0 }
    ],
    wasteStatus: { fullPercent: 0 }
  }),
  transform: d => ({
    userCount: d.userCount ?? d.users ?? 0,
    totalPoints: d.totalPoints ?? 0,
    disposalKgWeek: d.disposalKgWeek || [],
    wasteStatus: d.wasteStatus || { fullPercent: 0 }
  })
});

const api = {
  getUsers, updateUser, deleteUser, createUser,
  getDisposals, getTransactions, getRewards,
  createReward, updateReward, deleteReward, redeemReward,
  getDashboardStats
};

export default api;
