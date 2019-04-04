<template>
    <div class="block">
        <div >
            <el-date-picker 
                    v-model="value_sta" 
                    :type="type" 
                    placeholder="开始日期" 
                    :picker-options="pickerOptions_sta" 
                    :readonly="readonly" 
                    :editable="editable" 
                    @change="dateChangeTime_sta"
                    ref="startTime" 
                    size="small"
                    value-format="yyyy-MM-dd"
                    popper-class="popper-class"
                    :class="classx">
            </el-date-picker>
            <slot name="between"></slot>
            <el-date-picker 
                    v-model="value_end" 
                    :type="type" 
                    placeholder="结束日期" 
                    :picker-options="pickerOptions_end" 
                    :readonly="readonly" 
                    :editable="editable" 
                    @change="dateChangeTime_end"
                    ref="endTime"
                    value-format="yyyy-MM-dd"
                    popper-class="popper-class"
                    size="small" 
                    :class="classx">
            </el-date-picker>
        </div>
    </div>
</template>
<script>
// return time.getTime() < Date.now() - 8.64e7; 只能选今天之后的时间
export default {
    name: 'DatePicker',
    data () {
        return {
            pickerOptions_sta: {}, // 开始时间
            pickerOptions_end: {}, // 结束时间
            disabledDate_sta: '', // 开始禁用区域
            disabledDate_end: '' // 结束禁用区域
        };
    },
    props: {
        readonly: { // 只读
            type: Boolean,
            default: false
        },
        editable: { // 是否可编辑
            type: Boolean,
            default: false
        },
        type: { // 日期类型
            type: String,
            default: 'date'
        },
        startTime: [String, Number, Date],
        endTime: [String, Number, Date],
        classx: String, // 自定义class
        'popper-class': String // DatePicker 下拉框的类名
    },
    computed: {
        value_sta: { // 开始值
            get () { 
                return this.startTime;
            }, 
            set (val) {
                this.$emit('update:startTime', val);
            }
        },
        value_end: {  // 结束值
            get () {
                return this.endTime;
            },
            set (val) {
                this.$emit('update:endTime', val);
            }
        }
    },
    watch: {
        // 开始禁用区域
        disabledDate_sta (val) {
            if (!val) { // 当结束日期清空时给个虚拟 hack
                val = '1495900800000000000000000000';
            } 
            this.pickerOptions_sta = {
                disabledDate (time) {
                    return time.getTime() > val;
                }
            };
        },
        // 结束禁用区域
        disabledDate_end (val) {
            this.pickerOptions_end = {
                disabledDate (time) {
                    return time.getTime() < val;
                }
            };
        }
    },
    methods: {
        // 开始
        dateChangeTime_sta (val) {
            this.disabledDate_end = this.$refs.startTime.value;
            this.value_sta = val;
            this.$emit('changeTime_sta', val);
        },
        // 结束
        dateChangeTime_end (val) {
            this.disabledDate_sta = this.$refs.endTime.value;
            this.value_end = val;
            this.$emit('changeTime_end', val);
        }
    }
};
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.stateTime,.endTime{
    width:80%;
    margin: 0 auto;
}
.editTime{
    width:100%;
}
.long{
    position: absolute;
    top: 7px;
    right: -60px;
}
</style>
