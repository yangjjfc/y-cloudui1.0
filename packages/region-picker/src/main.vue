<!--省市区三级联动插件
-- <RegionPicker v-model="myForm.regionName" :codes.sync="myForm.regionCode"></RegionPicker>
-->

<template>
    <myAddress :regions="chinaAddr" :province="province" :city="city" :district="district" @onchange="change" classx="Address" :disabled="disabled"></myAddress>
</template>
<script type="text/javascript">
    import myAddress from './address.vue';
    import emitter from '~/mixins/emitter';
    import REGION_DATA from './data.js'; // 元数据的文案要改，只能把数据文件本地化
    export default {
        name: 'yl-region-picker',
        mixins: [emitter],
        data () {
            return {
                chinaAddr: REGION_DATA,
                province: '',
                city: '',
                district: '',
                selectedData: null
            };
        },
        props: {
            // 省市区名称
            value: {
                type: String
            },
            // 省市区编码
            codes: {
                type: [String, Number],
                default: ''
            },
            validateEvent: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            codes (val) {
                this._initData(val);
            }
        },
        created () {
            this.codes && this._initData(this.codes);
        },
        methods: {
            // 初始化数据
            _initData (val) {
                if (val) {
                    let district = val.toString(),
                        province = district.slice(0, 2) + '0000',
                        city = district.slice(0, 4) + '00';
                        
                    this.province = this.chinaAddr[86][province];
                    this.city = this.chinaAddr[province][city] || '';
                    this.district = this.chinaAddr[city][district] || '';
                    this.selectedData = {
                        provinceName: this.province,
                        provinceCode: province,
                        cityName: this.city,
                        cityCode: city,
                        townName: this.district,
                        townCode: district
                    };
                } else {
                    this.province = '';
                    this.city = '';
                    this.district = '';
                }
            },
            change (msg) {
                let names = [msg.provinceName, msg.cityName, msg.townName].join('');
                let vals = msg.townCode;
                this.selectedData = msg;
                this.$emit('input', names);
                this.$emit('update:codes', vals);
                this.$emit('change', vals);
                if (this.validateEvent) {
                    this.dispatch('ElFormItem', 'el.form.change', names);
                }
            },
            getSelectedData () {
                return this.selectedData;
            }
        },
        components: {
            myAddress
        }
    };
</script>

