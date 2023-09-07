<template>
    <div class="fillcontain">
        <head-top></head-top>

<!--        <div>
            <el-input v-model="dbNameInput" placeholder="数据库名" class="handle-input"></el-input>
            <el-input v-model="tableNameInput" placeholder="表名" class="handle-input"></el-input>
            <el-input v-model="columnNameInput" placeholder="字段名" class="handle-input"></el-input>
            <el-button @click="getColumnList">查询</el-button>
        </div>-->

        <el-button
                icon="el-icon-plus"
                class="handle-add mr10"
                size="small"
                @click="handleAdd"
        >新增
        </el-button>


        <el-card class="box-card" v-for="(item,i) in dataSourceList">
            <div slot="header" class="clearfix">
                <!--<span>{{item.name}}</span>-->
                <el-button style="float: right;" type="text" @click="toTenantTablesPage(item.id)">查看</el-button>
                <el-button style="float: right;" type="text" @click="handleEdit(item)">编辑</el-button>
                <el-button style="float: right;" type="text" @click="handleDelete(item.id)">删除</el-button>
                <el-button style="float: right;" type="text" @click="syncDataSource(item.id)">同步</el-button>
                <el-button style="float: right;" type="text" @click="ping(item, i)" v-loading="item.pingLoading">ping</el-button>
                <el-button v-if="!item.isListen || item.isListen == '0'" style="float: right;" type="text" @click="listenBinlog(item, i)" v-loading="item.pingLoading">订阅binlog</el-button>
                <el-button v-if="item.isListen == '1'" style="float: right;" type="text" @click="cancelListen(item, i)" v-loading="item.pingLoading">取消订阅</el-button>
                <el-button style="float: right;" type="text" @click="handleEdit(item)">定时</el-button>
            </div>
            <div class="text item">
                <span>{{item.name}}</span>
            </div>
            <div class="text item">
                {{item.hostname}}:{{item.serverPort}}/{{item.schemaName}}@{{item.schemaName}}
            </div>
<!--            <div class="text item">
                {{ item.pingLoading + '' }}
            </div>-->
        </el-card>


        <div class="Pagination" style="text-align: left;margin-top: 10px; float: right;display:block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="count">
            </el-pagination>
        </div>



        <!-- ==========================【修改/插入】 弹出框=======================   -->
        <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="40%">
            <el-form ref="category" :model="dataSource" label-width="70px">
                <el-form-item label="数据源名称">
                    <el-input v-model="dataSource.name"></el-input>
                </el-form-item>
                <el-form-item label="主机">
                    <el-input v-model="dataSource.hostname"></el-input>
                </el-form-item>
                <el-form-item label="端口">
                    <el-input v-model="dataSource.serverPort"></el-input>
                </el-form-item>
                <el-form-item label="数据库名">
                    <el-input v-model="dataSource.schemaName"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="dataSource.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="dataSource.password"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="buttonStatus.saveButtonDisabled" @click="saveDataSource">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {getDataSourceList,saveDataSource,deleteDataSourceById,dataMigration, ping, cancelListen, listenBinlog} from '@/api/dataSourceApi'
    export default {
        data(){
            return {
                dataSourceList: [],
                dataSource:{
                    name: '',
                    hostname:'',
                    serverPort:'',
                    schemaName:'',
                    username:'',
                    password:''
                },

                /* 控制弹出框 */
                editVisible: false,
                dialogTitle: '',
                /* 控制按钮状态 */
                buttonStatus: {
                    deleteMultipleButtonDisabled: false,
                    searchButtonDisabled: false,
                    saveButtonDisabled: false
                },

                count: 0,
                currentPage: 1,
                pageSize: 20,

                dbNameInput: '',
                tableNameInput: '',
                columnNameInput: ''
            }
        },
    	components: {
    		headTop,
    	},
        activated(){
            this.initData();
        },
        methods: {
            async initData(){
                await this.getDataSourceList();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDataSourceList()
            },
            async getDataSourceList() {
                let resp = await getDataSourceList({
                    current: this.currentPage,
                    size: this.pageSize,
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    if(resp.data.records.length > 0) {
                        let tmpList = [];
                        resp.data.records.forEach(item => tmpList.push({...item, pingLoading: false}));
                        this.dataSourceList = tmpList;
                    }
                }
            },
            /**
             * 跳转到租户table列表
             */
            toTenantTablesPage(id) {
                this.$router.push({
                    path: `/tenantTableList/${id}`,
                });
            },
            /**
             *  点击新增，展示新增框
             */
            handleAdd() {
                this.dialogTitle = '新增';
                this.dataSource = {};
                this.editVisible = true;
            },
            /**
             * 点击编辑按钮触发，展示编辑框
             */
            handleEdit(row) {
                this.dialogTitle = '修改';
                //为对象分配一个新地址，改变也不影响原来的值
                let newObj = JSON.parse(JSON.stringify(row));
                this.dataSource = newObj;
                // 展示编辑框
                this.editVisible = true;
            },

            /**
             *  点击删除按钮触发
             */
            handleDelete(id) {
                // 弹框，二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    // 点击确认删除
                    this.deleteDataSourceById(id);
                }).catch(() => {
                    // 点击取消
                    console.log("已取消");
                });
            },
            async deleteDataSourceById(id) {
                let resp = await deleteDataSourceById({id:id});
                if (resp.status == 0) {
                    this.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });

                    await this.initData();
                }
            },

            async saveDataSource() {
                //1、防刷控制
                this.buttonStatus.saveButtonDisabled = true;
                setTimeout(() => this.buttonStatus.saveButtonDisabled = false, 1000);

                //2、参数校验
                // ...

                this.editVisible = false;
                //3、发请求

                let resp = await saveDataSource(this.dataSource);
                if (resp.status == 0) {
                    this.$message({
                        showClose: true,
                        message: '保存成功',
                        type: 'success'
                    });

                    await this.initData();
                }

            },
            async syncDataSource(id) {
                let resp = await dataMigration({dataSourceId: id});
                if (resp.status == 0) {
                    this.$message({
                        showClose: true,
                        message: '执行成功',
                        type: 'success'
                    });

                    await this.initData();
                }
            },
             async ping(item, i) {
                 let id = item.id;
                  item.pingLoading = true;
                 //this.dataSourceList.splice(i, 1, {...this.dataSourceList[i], pingLoading: true})
                 console.log(JSON.stringify(item));

                 let resp = await ping({dataSourceId: id});
                 if (resp.status == 0) {
                     if (resp.data == true) {
                         this.$message({
                             showClose: true,
                             message: '正常连接',
                             type: 'success'
                         });
                     } else {
                         this.$message({
                             showClose: true,
                             message: 'ping不通',
                             type: 'warning'
                         });
                     }
                 } else {
                     this.$message.error('ping命令执行失败');
                 }
                 item.pingLoading = false;
             },

            async listenBinlog(item) {
                let id = item.id;
                item.pingLoading = true;
                let resp = await listenBinlog({dataSourceId: id});
                if (resp.status == 0) {
                    this.$message({
                        showClose: true,
                        message: '订阅成功',
                        type: 'success'
                    });
                    item.isListen = '1';
                } else {
                    this.$message.error('订阅失败');
                }
                item.pingLoading = false;
            },

            async cancelListen(item) {
                let id = item.id;
                item.pingLoading = true;
                //this.dataSourceList.splice(i, 1, {...this.dataSourceList[i], pingLoading: true})
                console.log(JSON.stringify(item));

                let resp = await cancelListen({dataSourceId: id});
                if (resp.status == 0) {
                    this.$message({
                        showClose: true,
                        message: '取消成功',
                        type: 'success'
                    });
                    item.isListen = '0';
                } else {
                    this.$message.error('取消失败');
                }
                item.pingLoading = false;
            },


        },
    }
</script>

<style lang="less">
	@import '../../style/mixin';
    .table_container{
        padding: 20px;
    }

    .handle-input {
        width: 300px;
        float: left;
        margin-left: 20px;
        display: inline-block;
    }


    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 270px;
        float: left;
        margin-left: 20px;
        margin-top: 10px;
    }

    .info-title {
        color: #19d3ea;
        font-size: 18px;
        width: 100%;   /*一定要设置宽度，或者元素内含的百分比*/
        overflow:hidden; /*溢出的部分隐藏*/
        white-space: nowrap; /*文本不换行*/
        text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
    }
</style>
