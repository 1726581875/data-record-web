<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div>
            <el-input v-model="dbNameInput" placeholder="数据库名" class="handle-input"></el-input>
            <el-button @click="getColumnList">查询</el-button>
        </div>


        <div class="table_container">
            <el-table
                :data="schemaList"
                highlight-current-row
                style="width: 100%"
                 size="small">
                <el-table-column property="id" width="80"> </el-table-column>
                <el-table-column property="catalogName" label="目录名" ></el-table-column>
                <el-table-column property="schemaName" label="数据库名" ></el-table-column>
                <el-table-column property="defaultCharacterSetName" label="默认字符集"></el-table-column>
                <el-table-column property="defaultCollationName" label="默认排序规则"></el-table-column>
                <el-table-column property="sqlPath" label="sql路径"></el-table-column>
                <el-table-column property="updateTime" label="同步时间"></el-table-column>
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
    import {getSchemaList} from '@/api/getMatedata'
    export default {
        data(){
            return {
                schemaList: [],
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
                let resp = await getSchemaList({
                    current: this.currentPage,
                    size: this.pageSize,
                    dbName: this.dbNameInput
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.schemaList = resp.data.records;
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
