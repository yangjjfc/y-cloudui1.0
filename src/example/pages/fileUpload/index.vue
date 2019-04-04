<template>
    <section class="container_setion">
        <markdown :content="md"></markdown>
        <!---->
        <h3>实例</h3>
        <yl-file-upload v-model="list" :readonly="true"></yl-file-upload>

        <ul>
            <li v-for="item in list">
                <span v-text="item"></span>
            </li>
        </ul>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="证照图片：" prop="list2">
                <yl-file-upload v-model="form.list2" :max="maxLength"  @on-success="success"></yl-file-upload>
                <div slot="tip" class="el-upload__tip">支持jpg,bmp,gif,png,pdf,文件大小不超过5MB</div>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submit">立即注册</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>
<script>
    import md from  './index.md';
    const URL = {
        test: 'ddc.ecs.enterpriseShippingAddress.get.json'
    };
    export default {
        data() {
            return {
                md,
                form:{
                    list2: 's3/M00/00/1B/rB4r9VxAN7KAcXjcAADa1VNZWEQ117.pdf',
                },
                maxLength: 5,
                rules: {
                    list2: [
                        {
                            required: true, message: '请上传证照', trigger: 'change'
                        }
                    ]
                },
                list: ['s2/M00/25/FB/rB4r9VwtnY-AB3WEAABYcGdbiu4587.jpg']
            };
        },
        methods: {
            getList(){
                this.Http(URL.test,{
                    id: 3000
                }).then(result =>{
                }).finally(t =>{
                    this.form.list2 = '';
                })
            },
            show() {
                //this.$message.info(this.list);
            },
            // 注册
            submit () {
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.$message.success('验证通过');
                    }
                });
            },
            success(val){
                this.$message.success('上传完成，返回地址为：' + val );
            }
        },
        components:{
        },
        mounted() {
            this.getList();
        }
    };

</script>

<style lang="scss">

</style>