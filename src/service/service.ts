import { request } from 'ice';

const getOperate = (status) => {
    switch(status) {
        case 0: return ['申请', '删除']; // 待申请
        case 1: return ['删除']; // 已申请
        case 4: return ['删除']; // 已付款
        case 5: return ['删除']; // 已到货
        default: return ['重新申请', '取消订单','确认付款', '删除'] // 已审批
    }
}

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
        const data = res.data.list?.map((item, index) => ({...item, lbpName: item.Lbpinfo?.name,standard:item.Lbpinfo?.standard,img: 'http://localhost:3000/uploads/'+item.Lbpinfo?.img, createdAt: item.createdAt?.slice(0, 10), order: (query.pageIndex -1) * query.pageSize + index+1, key: item.requestId, operate: ['申请','删除']}));
        return {
            data,
            total: res.data.total
        }
    },
    async updateRequest(body) {
        const res = await request.post('/request/update', body);
        return res;
    },
    async getAppliedList(query) {
        const res = await request.get('/request/appliedList', {params: query});
        return {
            data: res.data.list,
            total: res.data.total
        }
    },
    async reApply(body) {
        const res = await request.post('/request/reApply', body);
        return res;
    },
    async getReply(query) {
        const res = await request.get('/requestReply/appliedList', {params: query});
        return {
            data: res.data.list,
            total: res.data.total
        }
    },
    async addReply(body) {
        const res = await request.post('/requestReply/add', body);
        return res;
    },
    async updateReply(body) {
        const res = await request.post('/requestReply/update', body);
        return res;
    },
    async changeArrival(body) {
        const res = await request.post('/requestReply/arrival', body);
        return res;
    },
    async getApprovalList(query) {
        const res = await request.get('/requestReply/approvalList', {params: query});
        return {
            data: res.data.list,
            total: res.data.total
        }
    },
    async addPlane(body) {
        const res = await request.post('/plane/add', body);
        return res;
    },
    async getPlan(query?) {
        const res = await request.get('/plane', {params: query});
        if(query) {
            const data = res.data.list?.map((item, index) => ({...item, order: (query.pageIndex -1) * query.pageSize + index+1, key: item.planeId, user: item.User.username, operate: ['生成订单', '删除']}));
            return {
                data: data,
                total: res.data.total
            }
        } else {
            return {
                data: res.data.list,
                total: res.data.total
            }
        }
    },
    async addOneReply(body) {
        const res = await request.post('/plane/addOne', body);
        return res;
    },
    async deletePlane(body) {
        const res = await request.post('/plane/delete', body);
        return res;
    },
    async addOrder(body) {
        const res = await request.post('/order/add', body);
        return res;
    },
    async getOrders(query) {
        const status = parseInt(query.status);
        const operate = getOperate(status);
        const res = await request.get('/order', {params: query});
        const data = res.data.list?.map((item, index) => ({...item, replyContent: item.replyContent || '无', applier: item.Applier.username, reason: item.reason || '无', supplier: item.Supplier.supplierName, approvaler: item.Approvaler ? item.Approvaler.username : '无', order: (query.pageIndex -1) * query.pageSize + index+1, key: item.orderId, operate: operate, createdAt: item.createdAt?.slice(0,10)}));
        return {
            data: data,
            total: res.data.total
        }
    },
    async deleteOrder(body) {
        const res = await request.post('/order/delete', body);
        return res;
    },
    async updateOrder(body) {
        const res = await request.post('/order/update', body);
        return res;
    },
    async getStatisticByMonth(query) {
        const res = await request.get('/order/statistic/getByMonth', {params: query});
        return res.data.list;
    },
    async getStatisticByYear() {
        const res = await request.get('/order/statistic/getByYear');
        return res.data.list;
    },
    async getStatisticBySupplier(query) {
        const res = await request.get('/order/statistic/getBySupplier', {params: query});
        return res.data;
    },
    async getOrderNum() {
        const res = await request.get('/order/statistic/getOrderNum');
        return res.data.list;
    },
    async getLbpNum(query) {
        const res = await request.get('/order/statistic/getLbpNum', {params:query});
        return res.data;
    },
    async getCategoryPrice() {
        const res = await request.get('/order/statistic/getCategoryPrice');
        return res.data.list;
    },
    async getEvaluation(query) {
        const res = await request.get('/evaluation/info', {params: query});
        return res.data;
    },
    async addEvaluation(body) {
        const res = await request.post('/evaluation/add', body);
        return res;
    },
    async getScore(query){
        const res = await request.get('/evaluation/score', {params: query});
        if(res.code === 200) {
            return res.data;
        }
        return res;
    },
    async addWeight(body) {
        const res = await request.post('/weight/add', body);
        return res;
    },
    async getWeight() {
        const res:any = await request.get('/weight');
        return res.data;
    },
    async getESuppliers() {
        const res = await request.get('/order/statistic/getEvaluation');
        return res.data;
    },
    async getIndexScore(query) {
        const res = await request.get('/order/statistic/getScore', {params: query});
        return res.data;
    },
    async getAllOrder(query) {
        const res = await request.get('/order/all', {params: query});
        const data = res.data.list?.map((item, index) => ({...item, replyContent: item.replyContent || '无', applier: item.Applier.username, reason: item.reason || '无', supplier: item.Supplier.supplierName, approvaler: item.Approvaler ? item.Approvaler.username : '无', order: (query.pageIndex -1) * query.pageSize + index+1, key: item.orderId, createdAt: item.createdAt?.slice(0,10)}));
        return {
            data: data,
            total: res.total
        };
    }
}