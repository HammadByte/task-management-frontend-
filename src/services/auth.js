import api from '../api/axios'
export const login = (d)=> api.post('/user/login', d).then(r=>r.data)
export const register = (d)=> api.post('/user/register', d).then(r=>r.data)
export const getProfile = ()=> api.get('/user/profile').then(r=>r.data)
export const updateProfile = (d)=> api.put('/user/profile', d).then(r=>r.data)
export const logout = ()=> api.post('/user/logout').then(r=>r.data)