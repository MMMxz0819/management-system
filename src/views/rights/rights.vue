<template>
  <div class="right">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 展示用户列表区 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      //权限列表类型
      type: "list",
      rightsList: [],
      
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    getRightsList() {
      this.$http.get("rights/" + this.type).then((res) => {
        console.log(res);
        if (res.data.meta.status != 200)
          return this.$message.error("fail to get rightsList");
        this.rightsList = res.data.data;
      });
    },
    //底部页码栏功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
  },
};
</script>

<style scoped>
</style>