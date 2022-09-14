<template>
    <div class="fillcontain">
        <head-top></head-top>

<!--        <div>
            <el-input v-model="dbNameInput" placeholder="数据库名" class="handle-input"></el-input>
            <el-input v-model="tableNameInput" placeholder="表名" class="handle-input"></el-input>
            <el-input v-model="columnNameInput" placeholder="字段名" class="handle-input"></el-input>
            <el-button @click="getColumnList">查询</el-button>
        </div>-->


        <el-card class="box-card" v-for="item in dataSourceList">
            <div slot="header" class="clearfix">
                <span>{{item.name}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toTenantTablesPage(item.id)">查看</el-button>
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
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {getDataSourceList} from '@/api/dataSourceApi'
    export default {
        data(){
            return {
                dataSourceList: [],
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
