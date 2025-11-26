import api from '../api/axios'
export const getTeam = ()=> api.get('/user/get-team').then(r=>r.data)