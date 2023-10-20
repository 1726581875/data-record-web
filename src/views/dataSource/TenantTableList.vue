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
                <span class="fixed-span" :title="item.tableName">{{item.tableName}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toDataListPage(item.tableName)">查看</el-button>
                <el-button style="float: right;  padding: 3px 0" type="text" @click="syncTable(item.sourceTableName)">同步</el-button>
            </div>
            <span class="text item">
                原表表名: {{item.sourceTableName}}
            </span>
            <span class="text item">
                表数据量: {{item.rowNum}}
            </span>
            <span class="text item">
                创建时间: {{item.createTime}}
            </span>
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
    import headTop from '@/components/headTop'
    import {dataMigration, getTenantTableList} from '@/api/dataSourceApi'
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
             * 跳转到数据列表
             */
            toDataListPage(tableName) {
                this.$router.push({
                    path: `/dataList/${tableName}`,
                });
            },
            async syncTable(tableName) {
                let dataSourceId = this.$route.params.id;
                let resp = await dataMigration({dataSourceId: dataSourceId, tableName: tableName});
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
        display: block;
        margin-bottom: 18px;
        text-align: left;
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
        height: 200px;
        float: left;
        margin-left: 20px;
        margin-top: 10px;
    }

    .fixed-span {
        display: inline-block;
        width: 150px; /* 设置固定宽度 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        //border: 1px solid black;
    }
</style>
