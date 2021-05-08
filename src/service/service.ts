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
        const res = await request.get('/user/getInfo', {params: query});
        return res.data;
    },
    async getSuppliers(query) {
        const res = await request.get('/supplier', {params: query});
        const data = res.data.list?.map((item, index) => ({...item, order: (query.pageIndex -1) * query.pageSize + index+1, key: item.supplierId, operate: ['编辑','删除']}));
        return {
            data,
            total: res.data.total
        }
    },
    async deleteSupplier(body) {
        const res = await request.post('/supplier/deleteSupplier', body);
        return res;
    },
    async addSupplier(body) {
        const res = await request.post('/supplier/addSupplier', body);
        return res;
    },
    async updateSupplier(body) {
        const res = await request.put('/supplier/updateSupplier', body);
        return res;
    },
    async addRequest(body) {
        const res = await request.post('/request/addRequest', body);
        return res;
    },
    async deleteRequest(body) {
        const res = await request.post('/request/deleteRequest', body);
        return res;
    },
    async getWillApplyList(query) {
        const res = await request.get('/request/willApplyList', {params:query});
        const data = res.data.list?.map((item, index) => ({...item, lbpName: item.Lbpinfo?.name,standard:item.Lbpinfo?.standard,img: 'http://localhost:3000/uploads/'+item.Lbpinfo?.img, order: (query.pageIndex -1) * query.pageSize + index+1, key: item.requestId, operate: ['申请','删除']}));
        return {
            data,
            total: res.data.total
        }
    },
    async updateRequest(body) {
        const res = await request.post('/request/update', body);
        return res;
    }
}