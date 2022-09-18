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


        <el-card class="box-card" v-for="item in dataSourceList">
            <div slot="header" class="clearfix">
                <span>{{item.name}}</span>
                <el-button style="float: right;" type="text" @click="toTenantTablesPage(item.id)">查看</el-button>
                <el-button style="float: right;" type="text" @click="handleEdit(item)">编辑</el-button>
                <el-button style="float: right;" type="text" @click="handleDelete(item.id)">删除</el-button>
                <el-button style="float: right;" type="text" @click="syncDataSource(item.id)">同步</el-button>
            </div>
            <div class="text item">
                {{item.hostname}}
            </div>
            <div class="text item">
                {{item.serverPort}}
            </div>
            <div class="text item">
                {{item.username}}
            </div>
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
    import {getDataSourceList,saveDataSource,deleteDataSourceById,dataMigration} from '@/api/dataSourceApi'
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
                await this.getColumnList();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getColumnList()
            },
            async getColumnList() {
                let resp = await getDataSourceList({
                    current: this.currentPage,
                    size: this.pageSize,
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.dataSourceList = resp.data.records;
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
                this.category = {};
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
</style>
