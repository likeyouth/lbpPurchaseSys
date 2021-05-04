import { request } from 'ice';

export default {
    async login(body) {
        const res:any= await request.post('/login', body);
        return res.data;
    },
    async getLbplist(query) {
        const res:any = await request.get('/goods', {params: query});
        return res.data;
    },
    async getCategory(query?) {
        const res:any = await request.get('/category', {params:query});
        return res.data;
    },
    async addCategory(body) {
        const res = await request.post('/category/addGoods', body);
        return res;
    },
    async addLbp(body) {
        const res = await request.post('/goods/addGoods', body, {
            headers: {'Content-Type': 'multipart/form-data'}});
        return res;
    },
    async deleteLbp(body) {
        const res = await request.post('/goods/deleteGoods', body);
        return res;
    }
}