<template>
  <div class="users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addUsers"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 展示用户列表区 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="userInfoEdit(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户分配"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                @click="showSetRole(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deletUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 增加用户功能 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 表单主题 -->
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户功能 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <!-- 表单主题 -->
      <span>
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="70px"
          @close="editDialogClose"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户分配 -->
    <el-dialog title="用户" :visible.sync="setRoleDialogVisible" width="50%" @close='setRoleClear'>
      <span
        ><div>
          <p>当前用户:{{ userInfo.username }}</p>
          <p>当前角色:{{ userInfo.role_name }}</p>
          <p>
            分配新角色：
            <el-select v-model="selectRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p></div
      ></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 校验邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) return callback();

      callback(new Error("请输入合法邮箱"));
    };
    // 校验手机
    var checkMobile = (rule, value, callback) => {
      const regmobile = /^1[0-9]{10}$/;
      if (regmobile.test(value)) {
        return callback();
      }

      callback(new Error("请输入合法手机号"));
    };
    return {
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制对话框出现和隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      // 添加用户信息
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户信息验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail },
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { validator: checkMobile },
        ],
      },
      //保存编辑查询信息
      editForm: {},
      //角色信息
      userInfo: {},
      //角色列表
      roleList: [],
      selectRoleId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    getUserList() {
      this.$http.get("users", { params: this.queryInfo }).then((res) => {
        if (res.status !== 200) return this.$message.error("获取用户信息失败");
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
        console.log(this.userList);
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
    // 同步用户信息更改
    userStateChange(userinfo) {
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          if (res.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error("更新用户状态失败");
          }
          console.log(res);
          this.$message.success("更新用户状态成功");
        });
    },
    addUsers() {
      this.addDialogVisible = true;
    },
    // 对话框关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //提交表单前预校验
    addUserData() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.$http.post("users", this.addForm).then((res) => {
          if (res.data.meta.status != 201) {
            this.$message.error("添加失败");
          }
          this.$message.success("添加成功");
          this.addDialogVisible = false;
          this.getUserList();
        });
      });
    },
    editUserData() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.$http
          .put("users/" + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          .then((res) => {
            if (res.data.meta.status != 200) {
              this.$message.error("修改失败");
            }
            this.$message.success("修改成功");
            this.editDialogVisible = false;
            this.getUserList();
          });
      });
    },
    //展示编辑用户对话框
    userInfoEdit(id) {
      this.$http.get("users/" + id).then((res) => {
        if (res.status != 200) return this.$message.error("查询失败");

        this.editForm = res.data.data;
        console.log(this.editForm);
        this.editDialogVisible = true;
      });
    },
    //根据id删除用户信息
    deletUser(id) {
      //弹框询问是否删除

      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete("users/" + id).then((res) => {
            if (res.data.meta.status == 200) {
              this.getUserList();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //展示角色分配对话框
    showSetRole(info) {
      this.userInfo = info;

      //获取角色列表
      this.$http.get("roles").then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取角色列表失败");
        this.roleList = res.data.data;
        console.log(this.roleList);
      });

      this.setRoleDialogVisible = true;
    },
    //分配角色
    saveRoleInfo(){
      if(!this.selectRoleId) return this.$message.error('请选择角色')

      this.$http.put(`users/${this.userInfo.id }/role`,{rid:this.selectRoleId}).then(res=>{
        if(res.data.meta.status !== 200 ) {
          console.log(res);
          return this.$message.error('更新信息失败')}

        this.$message.success('分配角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    },
    //清空原本数据
    setRoleClear(){
this.selectRoleId = ''
this.userInfo = ''
    }
  },
};
</script>

<style scoped>
</style>