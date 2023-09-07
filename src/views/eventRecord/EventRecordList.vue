<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div style="float: left;margin-left: 20px">
            <el-select v-model="dataSourceId" placeholder="数据源">
                <el-option
                        v-for="item in dataSourceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </div>

        <div style="float: left;margin-left: 100px">
            <el-select v-model="typeValue" placeholder="类型">
                <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>

        <div class="block" style="float: left;margin-left: 50px">
            <!--<span class="demonstration">时间范围</span>-->
            <el-date-picker
                    v-model="timeValue"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
            </el-date-picker>
        </div>

        <el-button @click="getEventRecordList">查询</el-button>

        <div class="table_container">
            <el-table
                :data="eventRecordList"
                highlight-current-row
                style="width: 100%"
                 size="small">
                <el-table-column property="id" width="80"> </el-table-column>
               <!-- <el-table-column property="binLogFileName" label="binlog文件名" ></el-table-column>-->
                <el-table-column property="databaseName" label="数据库" ></el-table-column>
                <el-table-column property="tableName" label="表名" ></el-table-column>
                <el-table-column property="pos" label="开始位置"></el-table-column>
                <el-table-column property="endLogPos" label="结束位置"></el-table-column>
                <el-table-column property="eventType" label="事件类型"></el-table-column>
                <!--<el-table-column property="step" label="业务步骤" ></el-table-column>-->
                <el-table-column property="state" label="状态"></el-table-column>
                <el-table-column property="eventTimestamp" width="0" label="语句执行时间"></el-table-column>
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
    import {getList} from '@/api/getEventRecord'
    import {getDataSourceList} from '@/api/dataSourceApi'
    import {baseUrl} from "@/config/env";
    export default {
        data(){
            return {
                eventRecordList: [],
                count: 0,
                currentPage: 1,
                pageSize: 20,

                //类型选择器
                typeOptions: [{
                    value: 'EXT_WRITE_ROWS',
                    label: '插入事件'
                }, {
                    value: 'EXT_DELETE_ROWS',
                    label: '删除事件'
                }, {
                    value: 'EXT_UPDATE_ROWS',
                    label: '更新事件'
                }, {
                    value: 'QUERY',
                    label: 'QUERY'
                }, {
                    value: 'TABLE_MAP',
                    label: 'TABLE_MAP'
                }],
                typeValue: '',
                dataSourceId: '',
                dataSourceList:[],

                // 日期范围选择器
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 60 * 1000 * 60);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                        {
                            text: '最近一月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                //timeValue: [new Date(00, 10, 10, 10, 10), new Date(00, 10, 11, 10, 10)],
                timeValue: [],
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
                await this.getAllDataSource();
                await this.getEventRecordList();
            },

            async getAllDataSource(){
                let resp = await getDataSourceList({size: -1});
                if (resp.status == 0) {
                    this.dataSourceList = resp.data.records;
                    if(this.dataSourceList.length > 0) {
                        this.dataSourceId = this.dataSourceList[0].id;
                    }

                }
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getEventRecordList()
            },
            async getEventRecordList() {

                // axios

/*                this.$axios.post(baseUrl + '/eventRecord/getList', {
                    current: this.currentPage,
                    size: this.pageSize,
                    eventType: this.typeValue,
                    timeRange: {
                        startTime: this.timeValue[0],
                        endTime: this.timeValue[1]
                    }
                }).then(resp => {
                    if (resp.data.status == 0) {
                        this.count = resp.data.data.total;
                        this.eventRecordList = resp.data.data.records;
                    }
                    }).catch(error => {
                    this.$message.error('获取数据失败！');
                });*/

                if(this.dataSourceId && this.dataSourceId.length > 0) {
                    let resp = await getList({
                        current: this.currentPage,
                        size: this.pageSize,
                        dataSourceId: this.dataSourceId,
                        eventType: this.typeValue,
                        timeRange: {
                            startTime: this.timeValue[0],
                            endTime: this.timeValue[1]
                        }
                    });
                    if (resp.status == 0) {
                        this.count = resp.data.total;
                        this.eventRecordList = resp.data.records;
                    }
                }
            },
            /**
             * 跳转到事件详情
             */
            toDetail(id) {
                let _dataSourceId = this.dataSourceId;
                this.$router.push({
                    path: `/eventRecordDetail/${_dataSourceId}/${id}`,
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
</style>
