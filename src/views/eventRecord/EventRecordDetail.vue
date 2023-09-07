<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-descriptions title="基础信息">
                <el-descriptions-item label="ID">{{eventRecord.id}}</el-descriptions-item>
                <el-descriptions-item label="binlog文件名">{{eventRecord.binLogFileName}}</el-descriptions-item>
                <el-descriptions-item label="事件类型">{{eventRecord.eventType}}</el-descriptions-item>
                <el-descriptions-item label="开始位置">{{eventRecord.pos}}</el-descriptions-item>
                <el-descriptions-item label="结束位置">{{eventRecord.endLogPos}}</el-descriptions-item>
                <el-descriptions-item label="数据库名">{{eventRecord.databaseName}}</el-descriptions-item>
                <el-descriptions-item label="表名">{{eventRecord.tableName}}</el-descriptions-item>
                <el-descriptions-item label="包含列">{{eventRecord.includedColumns}}</el-descriptions-item>
                <el-descriptions-item label="包含列名">{{eventRecord.includedColumnNames}}</el-descriptions-item>
                <el-descriptions-item label="变更前列">{{eventRecord.includedColumnsBeforeUpdate}}</el-descriptions-item>
                <el-descriptions-item label="变更前列名">{{eventRecord.columnNamesBeforeUpdate}}</el-descriptions-item>
                <el-descriptions-item label="业务步骤">{{eventRecord.step}}</el-descriptions-item>
                <el-descriptions-item label="业务状态">{{eventRecord.state}}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{eventRecord.createTime}}</el-descriptions-item>
            </el-descriptions>

            <div>
                <el-descriptions title="扩展信息">
                    <el-descriptions-item label="SQL"  v-if="eventRecord.eventType == 'QUERY'">{{extraInfo.execSql}}</el-descriptions-item>
                </el-descriptions>
            </div>

            <!--  EXT_WRITE_ROWS类型事件，插入事件 -->
            <div style="width: 80%;margin-top: 20px">
                <dev style="float: left;color:#303133;font-size: 16px;font-weight: 700;">涉及数据变更</dev>
                <el-table v-if="eventRecord.eventType == 'EXT_WRITE_ROWS'"
                        :data="changeRows"
                        highlight-current-row
                        style="width: 100%">
                    <el-table-column property="id" label="ID" width="80px"></el-table-column>
                    <el-table-column property="row" label="插入行" min-width="600"></el-table-column>
                    <el-table-column property="createTime" label="创建时间" width="160px"></el-table-column>
                    <el-table-column  label="操作" width="80px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small"
                                       @click="seeDetail(scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--  EXT_DELETE_ROWS类型事件，删除事件 -->
                <el-table v-if="eventRecord.eventType == 'EXT_DELETE_ROWS'"
                          :data="changeRows"
                          highlight-current-row
                          style="width: 100%">
                    <el-table-column property="id" label="ID" width="80px"></el-table-column>
                    <el-table-column property="row" label="删除行" min-width="600"></el-table-column>
                    <el-table-column property="createTime" label="创建时间" width="160px"></el-table-column>
                    <el-table-column  label="操作" width="80px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small"
                                       @click="seeDetail(scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 查看详情弹框 -->
                <el-dialog title="详情" :visible.sync="seeDetailDialogVisible">
                    <el-descriptions title="详细信息">
                        <el-descriptions-item label="ID">{{changeDetail.id}}</el-descriptions-item>
                        <el-descriptions-item label="记录id">{{changeDetail.recordId}}</el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{changeDetail.createTime}}</el-descriptions-item>
                        <el-descriptions-item label="数据">{{changeDetail.row}}</el-descriptions-item>
                    </el-descriptions>
                </el-dialog>

                <!--  EXT_UPDATE_ROWS类型事件，更新事件 -->
                <el-table v-if="eventRecord.eventType == 'EXT_UPDATE_ROWS'"
                          :data="changeRows"
                          highlight-current-row
                          style="width: 100%">
                    <el-table-column property="id" label="ID" width="80px"></el-table-column>
                    <el-table-column property="beforeRow" label="更改前值" min-width="300px"></el-table-column>
                    <el-table-column property="afterRow" label="更改后值" min-width="300px"></el-table-column>
                    <el-table-column property="createTime" label="创建时间" width="160px"></el-table-column>
                    <el-table-column  label="操作" width="80px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small"
                                       @click="compareChange(scope.row)">对比变更</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 对比数据变更弹框 -->
                <el-dialog title="对比变更" :visible.sync="compareDialogVisible">
                    <el-table :data="compareResultData">
                        <el-table-column property="index" label="列" width="150"></el-table-column>
                        <el-table-column property="beforeColumn" label="更改前列"></el-table-column>
                        <el-table-column property="afterColumn" label="更改后列"></el-table-column>
                        <el-table-column property="before" label="变更前值" width="0"></el-table-column>
                        <el-table-column property="after" label="变更后值"></el-table-column>
                    </el-table>
                </el-dialog>


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
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {getById, getInsertRows,getDeleteRows,getUpdateRows} from '@/api/getEventRecord'
    export default {
        name: "EventRecordDetail",
        data(){
            return {
                eventRecord: {},
                extraInfo: {},
                changeRows:[],
                count: 0,
                currentPage: 1,
                pageSize: 20,
                // 对比弹框
                compareDialogVisible: false,
                compareResultData: [],
                // 查看详情弹框
                seeDetailDialogVisible: false,
                changeDetail:{},

                // 当前数据源id
                dataSourceId: ''
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
                let dataSourceId = this.$route.params.dataSourceId;
                this.dataSourceId = dataSourceId;
                await this.getEventRecordById(id, dataSourceId);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },

            async getEventRecordById(id, dataSourceId) {
                const resp = await getById({id: id, dataSourceId: dataSourceId});
                if (resp.status == 0) {
                    this.eventRecord = resp.data.eventRecord;
                    this.extraInfo = resp.data.extraInfo;
                    // 获取数据变更记录
                    if (this.eventRecord.eventType == 'EXT_WRITE_ROWS') {
                        await this.getInsertRowList(this.eventRecord.id);
                    } else if (this.eventRecord.eventType == 'EXT_DELETE_ROWS') {
                        await this.getDeleteRowList(this.eventRecord.id);
                    } else if (this.eventRecord.eventType == 'EXT_UPDATE_ROWS') {
                        await this.getUpdateRowList(this.eventRecord.id);
                    }

                }
            },

            async getInsertRowList(id) {
                const resp = await getInsertRows({current: this.currentPage, size: this.pageSize, recordId: id, dataSourceId: this.dataSourceId});
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.changeRows = resp.data.records;
                }
            },

            async getDeleteRowList(id) {
                const resp = await getDeleteRows({current: this.currentPage, size: this.pageSize, recordId: id, dataSourceId: this.dataSourceId});
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.changeRows = resp.data.records;
                }
            },

            async getUpdateRowList(id) {
                const resp = await getUpdateRows({current: this.currentPage, size: this.pageSize, recordId: id, dataSourceId: this.dataSourceId});
                if (resp.status == 0) {
                    this.count = resp.data.total;
                    this.changeRows = resp.data.records;
                }
            },

            compareChange(obj) {
                let compareData = [];
                let beforeArr = JSON.parse(obj.beforeRow);
                let afterArr = JSON.parse(obj.afterRow);

                let beforeColumnNames = JSON.parse(this.eventRecord.includedColumnNames);
                let afterColumnNames = JSON.parse(this.eventRecord.columnNamesBeforeUpdate);

                for (let i = 0; i < beforeArr.length; i++){
                    if(beforeArr[i] !== afterArr[i]) {
                        compareData.push({index: i, beforeColumn: beforeColumnNames[i], afterColumn: afterColumnNames[i],
                            before: beforeArr[i], after: afterArr[i]})
                    }
                }
                this.compareResultData = compareData;
                this.compareDialogVisible = true;
            },

            seeDetail(row) {
                this.changeDetail = row;
                this.seeDetailDialogVisible = true;
            },


            /**
             * 点击编辑按钮触发，展示编辑框
             */
            toDetail(id) {
                this.$router.push({
                    path: `/courseInfo/${id}`,
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
