layui.use(['layer', 'form'], function () {
    var layer = layui.layer
        , form = layui.form;
    var vm = new Vue({
        el: '#app',
        data: {
            fullscreenLoading: false,
            /*加载动画*/
            loading: true,
            /*产品档次*/
            page: 1,//页码
            pageSize: 10,//行数
            total: 0,//总记录数
            recordList: [],//展示的数据
            record: {//查询的条件
                productName: "",//产品名称
                registerTime: ""//建档时间
            },
        },
        methods: {
            /*分页条件查询*/
            findPage() {
                axios.post(api1 + "/design_record/findPagerecycle?page=" + this.page + "&pageSize=" + this.pageSize, this.record).then(res => {
                    this.total = res.data.total;
                    this.recordList = res.data.data;
                    this.loading = false;
                }).catch(err => {
                    vm.$message({//异常
                        showClose: true,
                        message: "获取超时，请检查网络",
                        type: 'error'
                    });
                })
            },
            /*设置行数*/
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            /*获取页码*/
            handleCurrentChange(page) {
                this.page = page;
                this.findPage();
            },
            /*全选*/
            toggleSelection(rows) {//全选选中
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            /*获取复选框选中的值 集合*/
            handleSelectionChange(value) {
                this.deleterecords = value;
            },
            /*恢复档案*/
            recover(value) {
                this.fullscreenLoading = true;
                layer.confirm('确定恢复吗?', {icon: 3, title: '提示'}, function (index) {
                    axios.post(api1 + "design_record/recordrecover", value).then(res => {
                        if (res.data.success) {
                            vm.$message({//恢复成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });

                            vm.findPage();
                            vm.fullscreenLoading = false;
                        } else {
                            vm.$message({//恢复失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                            vm.fullscreenLoading = false;
                        }
                        vm.fullscreenLoading = false;
                    }).catch(err => {
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.fullscreenLoading = false;
                    })
                    layer.close(index);
                },function () {//取消
                    vm.fullscreenLoading = false;
                });

            },
            /*档案永久删除*/
            deleteperpetual(value){
                vm.fullscreenLoading = true;
                var record={
                    productId:value.productId
                }
                layer.confirm('确定永久删除吗?', {icon: 3, title: '提示'}, function (index) {
                    axios.post(api1+"/design_record/deleteperpetual",record).then(res=>{
                        if (res.data.success) {
                            vm.$message({//恢复成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });

                            vm.findPage();
                            vm.fullscreenLoading = false;
                        } else {
                            vm.$message({//恢复失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                            vm.fullscreenLoading = false;
                        }
                        vm.fullscreenLoading = false;
                    }).catch(err => {
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.fullscreenLoading = false;
                    })
                    layer.close(index);
                },function () {//取消
                    vm.fullscreenLoading = false;
                });

            }
        },
        created() {
            /*页面加载*/
            this.findPage();
        }
    });
});
