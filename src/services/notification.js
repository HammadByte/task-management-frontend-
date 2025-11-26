import api from '../api/axios'
export const getNotifications = ()=> api.get('/user/notifications').then(r=>r.data)
export const markAllRead = ()=> api.put('/user/read-noti').then(r=>r.data)