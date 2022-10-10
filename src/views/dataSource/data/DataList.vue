<template>
    <div class="fillcontain">
        <head-top></head-top>


        <div style="display: block; float: left" v-for="operatorObj in operatorValueObjectList">
            <el-select v-model="operatorObj.column" style="float: left" size="mini" clearable placeholder="请选择">
                <el-option
                        v-for="item in columnOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="operatorObj.operator" style="float: left" size="mini" clearable placeholder="请选择">
                <el-option
                        v-for="item in operatorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <div style="float: left; display:inline-block; width: 200px">
                <el-input
                        placeholder="请输入内容"
                        size="mini"
                        v-model="operatorObj.value"
                        clearable>
                </el-input>
            </div>

        </div>

<!--        <el-button @click="addCondition">新增条件</el-button>
        <el-button @click="queryDataList">查询</el-button>-->

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
