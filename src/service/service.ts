import { request } from 'ice';

export default {
    async login(body) {
        const res:any= await request.post('/login', body);
        return res.data;
    }
}