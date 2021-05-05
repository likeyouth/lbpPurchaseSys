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
    },
    async addUser(body) {
        const res = await request.post('/user/addUser', body);
        return  res;
    },
    async getUser(query) {
        const res = await request.get('/user', {params: query});
        const data = res.data.list?.map((item, index) => ({...item, order: (query.pageIndex -1) * query.pageSize + index+1, key: item.userId, operate: ['编辑','删除']}));
        return {
            data,
            total: res.data.total
        }
    },
    async deleteUser(body) {
        const res = request.post('/user/deleteUser', body);
        return res;
    },
    async updateUser(body) {
        const res = request.put('/user/updateUser', body);
        return res;
    },
    async getUserInfo(query) {
        console.log(query);
        const res = await request.get('/user/getInfo', {params: query});
        return res.data;
    }
}