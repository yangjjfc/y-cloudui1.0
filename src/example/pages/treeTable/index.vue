<template>
    <section class="container_setion">
        <markdown :content="md"></markdown>
        <!---->
        <h3 class="mgb10">demo</h3>
        <yl-tree-table :data="data" :columns="columns" border :height="height">
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="edit(scope.row)">点击</el-button>
                </template>
            </el-table-column>
        </yl-tree-table>
    </section>
</template>
<script>
    import md from './index.md';
    export default {
        data() {
            return {
                md,
                height: 300,
                columns: [
                    {
                        text: '事件',
                        value: 'event',
                        width: 200
                    },
                    {
                        text: 'ID',
                        value: 'id'
                    },
                    {
                        text: '时间线',
                        value: 'timeLine'
                    },
                    {
                        text: '备注',
                        value: 'comment'
                    }
                ],
                data: [
                    {
                        id: 0,
                        event: '事件1',
                        timeLine: 50,
                        comment: '无'
                    },
                    {
                        id: 1,
                        event: '事件1',
                        timeLine: 100,
                        comment: '无',
                        children: [
                            {
                                id: 2,
                                event: '事件2',
                                timeLine: 10,
                                comment: '无'
                            },
                            {
                                id: 3,
                                event: '事件3',
                                timeLine: 90,
                                comment: '无',
                                children: [
                                    {
                                        id: 4,
                                        event: '事件4',
                                        timeLine: 5,
                                        comment: '无'
                                    },
                                    {
                                        id: 5,
                                        event: '事件5',
                                        timeLine: 10,
                                        comment: '无'
                                    },
                                    {
                                        id: 6,
                                        event: '事件6',
                                        timeLine: 75,
                                        comment: '无',
                                        children: [
                                            {
                                                id: 7,
                                                event: '事件7',
                                                timeLine: 50,
                                                comment: '无',
                                                children: [
                                                    {
                                                        id: 71,
                                                        event: '事件71',
                                                        timeLine: 25,
                                                        comment: 'xx'
                                                    },
                                                    {
                                                        id: 72,
                                                        event: '事件72',
                                                        timeLine: 5,
                                                        comment: 'xx'
                                                    },
                                                    {
                                                        id: 73,
                                                        event: '事件73',
                                                        timeLine: 20,
                                                        comment: 'xx'
                                                    }
                                                ]
                                            },
                                            {
                                                id: 8,
                                                event: '事件8',
                                                timeLine: 25,
                                                comment: '无'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        },
        components:{
        },
        methods: {
            //模拟接口返回数据
            getList() {

            },
            edit(row){
                console.log(row)
            }
        },
        mounted() {
            this.getList();
        }
    };

</script>

<style lang="scss">

</style>