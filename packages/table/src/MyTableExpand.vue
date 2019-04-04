<template>
    <yl-dialog title="表格设置" @submit="submit" :show.sync="shows" width="960px" classx="custom-table-expand">
        <div slot="content">
            <el-row :gutter="10">
                <el-col :span="21">
                    <el-table :data="list" style="width: 100%" border ref="tableRow" :max-height="maxHeight" stripe header-row-class-name="table-header">
                        <el-table-column label="选择" width="60" align="center">
                            <template slot-scope="scope">
                                <el-radio :disabled="scope.row.fixed || !scope.row.isShow" v-model="currentIndex" :label="scope.row.index"></el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="列名"></el-table-column>
                        <el-table-column label="显示名称">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="显示" width="80" align="center">
                            <template slot-scope="scope">
                                <!-- isMastShow 是否强制显示 -->
                                <el-switch v-if="scope.row.isMastShow" v-model="scope.row.isShow" disabled size="small"></el-switch>
                                <el-switch v-else v-model="scope.row.isShow" :disabled="scope.row.totalRow" size="small"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="锁列" width="70" align="center">
                            <template slot-scope="scope">
                                <el-radio v-model="fixed" @change="changeFixed" :disabled="!scope.row.isShow" :label="scope.row.index"></el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="合计列" width="80" align="center" v-if="isShowTotalRow">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.totalRow" :disabled="!scope.row.isShow" v-if="scope.row.isShowTotal"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="3">
                    <div class="right-btn">
                        <p class="text-center">
                            <el-button size="mini" @click="up">上移</el-button>
                        </p>
                        <p class="text-center">
                            <el-button size="mini" @click="down">下移</el-button>
                        </p>
                        <p class="text-center">
                            <el-button size="mini" @click="reset">还原默认值</el-button>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
    </yl-dialog>
</template>
<script>
    export default {
        data () {
            return {
                maxHeight: null,
                fixed: -1,
                currentIndex: null,
                list: []
            };
        },
        props: {
            isShow: {
                type: Boolean,
                required: true
            },
            isShowTotalRow: {
                type: Boolean,
                required: true
            },
            // 远程保存的col， 如果远程没保存，就用页面的col 数据
            columns: {
                type: Array,
                required: true
            },
            // 页面定义的col 数据
            sourceColumns: {
                type: Array,
                required: true
            },
            name: { // 使用组件名称
                type: String,
                required: true
            }
        },
        created () {
            let list = this.initColumns(this.columns);
            this.$set(this, 'list', list);
            this.setHeigth();
        },
        methods: {
            initColumns (list) {
                let res = [], i = 0;
                list.forEach((item, index) => {
                    if (!item.unSave) {
                        item.index = i; // 编号
                        item.sourceIndex = typeof item.sourceIndex === 'number' ? item.sourceIndex : i;// 源编号.方便重置
                        item.name = item.name || item.label; // 名称
                        item.fixed && (this.fixed = index); // 锁列
                        item.isShow = !item.isHide; // 是否显示
                        res.push(item);
                        i++;
                    }
                });
                return JSON.parse(JSON.stringify(res));
            },
            setHeigth () {
                let height = window.innerHeight,
                    maxH;
                if (height > 900) {
                    maxH = 600;
                } else if (height > 800) {
                    maxH = 500;
                } else if (height > 700) {
                    maxH = 400;
                } else {
                    maxH = 350;
                }
                this.maxHeight = maxH;
            },
            // 锁列改变
            changeFixed () {
                this.list.forEach(item => {
                    item.fixed = this.fixed >= 0 && item.index <= this.fixed;
                });
            },
            submit () {
                this.list.forEach(item => {
                    item.isHide = !item.isShow;
                    delete item.isShow;
                    item.fixed = this.fixed >= 0 && item.index <= this.fixed;
                });
                let unsetList = this.columns.filter(item => item.unSave);
                this.$emit('change', [...unsetList, ...this.list], this.list);
            },
            // 逻辑： 已经锁列的是不能上下移动的
            up () {
                if (this.currentIndex > 0 && this.currentIndex > this.fixed + 1) {
                    let target = this.currentIndex - 1;
                    this.list[target].index = target + 1;
                    this.list[target + 1].index = target;
                    this.list[target] = this.list.splice(target + 1, 1, this.list[target])[0];
                    this.currentIndex = target;
                }
            },
            down () {
                if (this.currentIndex < this.list.length - 1 && this.currentIndex > this.fixed) {
                    let target = this.currentIndex + 1;
                    this.list[target].index = target - 1;
                    this.list[target - 1].index = target;
                    this.list[target] = this.list.splice(target - 1, 1, this.list[target])[0];
                    this.currentIndex = target;
                }
            },
            reset () {
                let columns = this.initColumns(this.sourceColumns);
                columns.sort((a, b) => a.sourceIndex - b.sourceIndex);
                columns.forEach(item => {
                    item.isShow = true;
                });
                this.list = columns;
                this.list.forEach((item, index) => {
                    item.label = item.name;
                    item.index = index;
                });
                this.currentIndex = null;
                this.fixed = -1;
            }
        },
        computed: {
            shows: {
                get () {
                    return this.isShow;
                },
                set (newValue) {
                    this.$emit('update:isShow', newValue); // 更新父组件shows
                }
            }
        }
    };

</script>

<style lang="scss" scoped>
    .custom-table-expand {
        .right-btn {
            height: 200px;
            margin-top: 100px;
            p.text-center {
                text-align: center;
                margin-bottom: 10px;
            }
        }
        .el-radio {
            /deep/ .el-radio__label {
                display: none; //隐藏radio ladel
            }
        }
    }
</style>