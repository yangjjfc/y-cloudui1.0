// 下拉过滤
export const filters = 'BYELEMENTFILTERSTATUS'; // 状态
export default {
    data () {
        return {
            [filters]: {} 
        };
    },
    methods: {
        /**
         * 筛选
         * 传递发column-key 必须和发送的key保持一致
         * filter使用时table上需要加prop属性
         * @param {*} msg 
         */
        filterList (msg) {
            let _key = '';
            for (const key in msg) { _key = key; }
            this[filters] = {}; 
            this[filters][_key] = msg[_key][0] || '';
            this.getList(this.page.pageIndex, this.page.pageSize, this[filters]);
        } 
    }
};