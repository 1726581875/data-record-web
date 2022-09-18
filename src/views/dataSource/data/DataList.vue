<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container">

            <el-table
                    :data="dataObjList"
                    highlight-current-row
                    style="width: 100%"
                    size="small">
                <el-table-column  v-for="column in columnNameList" :property="column" :label="column" ></el-table-column>
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
    import headTop from '@/components/headTop'
    import {getDataList} from '@/api/dataSourceApi'
    export default {
        data(){
            return {
                dataObjList:[],
                columnNameList: [],
                dataValueList: [],
                count: 0,
                currentPage: 1,
                pageSize: 15,

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
                let tableName = this.$route.params.tableName;
                await this.getDataList(tableName);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                let tableName = this.$route.params.tableName;
                this.getDataList(tableName)
            },
            getDataList: async function (tableName) {
                let resp = await getDataList({
                    current: this.currentPage,
                    size: this.pageSize,
                    tableName: tableName
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    let columnNameList = resp.data.columnNameList;
                    this.columnNameList = columnNameList;
                    let dataValueList = resp.data.valueList;

                    let dataObjList = [];
                    for(let i = 0; i < dataValueList.length; i++) {
                        let rowValues = dataValueList[i];
                        let rowObj = {};
                        for (let j = 0; j < rowValues.length; j++) {
                            rowObj[columnNameList[j]] = rowValues[j];
                        }
                        dataObjList.push(rowObj);
                    }

                    this.dataObjList = dataObjList;

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
	@import '../../../style/mixin';
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
