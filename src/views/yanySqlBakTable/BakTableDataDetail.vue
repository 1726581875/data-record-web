<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-table :data="dataObjList"
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
    import {getBakTableDataList} from '@/api/getBakTableApi'
    export default {
        data(){
            return {
                dataObjList:[],
                columnNameList: [],
                dataValueList: [],
                count: 0,
                currentPage: 1,
                pageSize: 15,

                operatorValueObjectList: [],

                columnValue: '',
                columnOptions: [],

                operatorValue: '',
                operatorOptions: [{
                    value: '=',
                    label: '='
                }, {
                    value: '!=',
                    label: '!='
                },{
                    value: '<',
                    label: '<'
                },{
                    value: '<=',
                    label: '<='
                },{
                    value: '>',
                    label: '>'
                },{
                    value: '>=',
                    label: '>='
                }, {
                    value: 'in',
                    label: 'in'
                }, {
                    value: 'not in',
                    label: 'not in'
                }, {
                    value: 'like',
                    label: 'like'
                }],

                value: '',
                input: '',

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
                await this.getBakTableDataList(tableName);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                let tableName = this.$route.params.tableName;
                this.getBakTableDataList(tableName)
            },
            getBakTableDataList: async function (tableName) {
                let resp = await getBakTableDataList({
                    current: this.currentPage,
                    size: this.pageSize,
                    tableName: tableName
                });
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    let columnNameList = resp.data.columnNameList;
                    this.columnNameList = columnNameList;

                    // 初始化选择框可选列字段名
                    let columnOptions = [];
                    for (let i = 0; i < columnNameList.length; i++) {
                        columnOptions.push({value: columnNameList[i],label: columnNameList[i]})
                    }
                    this.columnOptions = columnOptions;

                    let dataValueList = resp.data.valueList;
                    // 结果对象转换
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
            addCondition() {
                this.operatorValueObjectList.push({column:'', operator: '', value: ''})
            },

            queryDataList() {
                console.log(this.operatorValueObjectList);
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
