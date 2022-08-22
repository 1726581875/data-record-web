<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div>
            <el-input v-model="dbNameInput" placeholder="数据库名" class="handle-input"></el-input>
            <el-input v-model="tableNameInput" placeholder="表名" class="handle-input"></el-input>
            <el-button @click="getColumnList">查询</el-button>
        </div>


        <div class="table_container">
            <el-table
                :data="tableList"
                highlight-current-row
                style="width: 100%"
                 size="small">
                <el-table-column property="id" width="80"> </el-table-column>
                <el-table-column property="tableSchema" label="数据库" ></el-table-column>
                <el-table-column property="tableName" label="表名" ></el-table-column>
                <el-table-column property="engine" label="存储引擎"></el-table-column>
                <el-table-column property="createTime" label="表创建时间"></el-table-column>
                <el-table-column property="tableComment" label="表注释"></el-table-column>
                <el-table-column property="dateUpdateTime" label="同步时间"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="toDetail(scope.row.id)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px; float: right">
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
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {getTableList} from '@/api/getMatedata'
    export default {
        data(){
            return {
                tableList: [],
                count: 0,
                currentPage: 1,
                pageSize: 20,

                dbNameInput: '',
                tableNameInput: ''
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
                let resp = await getTableList({
                    current: this.currentPage,
                    size: this.pageSize,
                    dbName: this.dbNameInput,
                    tableName: this.tableNameInput
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.tableList = resp.data.records;
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
</style>
