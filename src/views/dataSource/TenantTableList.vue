<template>
    <div class="fillcontain">
        <head-top></head-top>

<!--        <div>
            <el-input v-model="dbNameInput" placeholder="数据库名" class="handle-input"></el-input>
            <el-input v-model="tableNameInput" placeholder="表名" class="handle-input"></el-input>
            <el-input v-model="columnNameInput" placeholder="字段名" class="handle-input"></el-input>
            <el-button @click="getColumnList">查询</el-button>
        </div>-->


        <el-card class="box-card" v-for="item in tenantTableList">
            <div slot="header" class="clearfix">
                <span>{{item.tableName}}</span>
                <el-button style="float: right; padding: 3px 0" type="text">查看</el-button>
            </div>
            <div class="text item">
                {{item.createTime}}
            </div>
            <div class="text item">
                {{item.updateTime}}
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
    import {getTenantTableList} from '@/api/dataSourceApi'
    export default {
        data(){
            return {
                tenantTableList: [],
                count: 0,
                currentPage: 1,
                pageSize: 12,

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
                let id = this.$route.params.id;
                await this.getColumnList(id);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                let id = this.$route.params.id;
                this.getColumnList(id)
            },
            async getColumnList(id) {
                let resp = await getTenantTableList({
                    current: this.currentPage,
                    size: this.pageSize,
                    dataSourceId: id
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.tenantTableList = resp.data.records;
                }
            },
            /**
             * 跳转到事件详情
             */
            toDetail(id) {
/*                this.$router.push({
                    path: `/eventRecordDetail/${id}`,
                });*/
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
