<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div>
            <el-input v-model="tableNameInput" placeholder="表名" class="handle-input"></el-input>
            <el-button @click="getAllBakTables">查询</el-button>
        </div>


        <div class="table_container">
            <el-table
                    :data="bakTableList"
                    highlight-current-row
                    style="width: 100%"
                    size="small">
                <el-table-column property="id" label="ID"> </el-table-column>
                <el-table-column property="tableName" label="表名" ></el-table-column>
                <el-table-column property="createTime" label="创建时间"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                                   @click="toDetail(scope.row.tableName)">查看详情</el-button>
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
    import {getAllBakTables} from '@/api/getBakTableApi'
    export default {
        data(){
            return {
                bakTableList: [],
                count: 0,
                currentPage: 1,
                pageSize: 20,
                tableNameInput: '',
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
                await this.getAllBakTables();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            async getAllBakTables() {
                let resp = await getAllBakTables({
                    tableName: this.tableNameInput
                });
                if (resp.status == 0) {
                    this.bakTableList = resp.data;
                    this.count = resp.data.length;
                }
            },
            /**
             * 跳转到详情
             */
            toDetail(tableName) {
                this.$router.push({
                    path: `/bakTableData/${tableName}`,
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
</style>
