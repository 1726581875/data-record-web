<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive"
						 class="el-menu-vertical-demo"
						 style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-document"></i>数据备份</template>
						<el-menu-item index="1-1" route="/dataSourceList">数据源列表</el-menu-item>
						<el-menu-item index="2-1" route="/eventRecordList">事件列表</el-menu-item>
						<el-menu-item index="2-1" route="/syncRecordList">同步记录</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-document"></i>元数据管理</template>
						<el-menu-item index="3-1" route="/schemaList">数据库列表</el-menu-item>
						<el-menu-item index="3-2" route="/tableList">表列表</el-menu-item>
						<el-menu-item index="3-3" route="/columnList">字段列表</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{

	}
</style>
