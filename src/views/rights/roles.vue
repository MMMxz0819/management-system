<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <!-- 展示用户列表区 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              :class="['bdbottom ', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 嵌套二级权限 -->
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  :class="['bdbottom ', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作" width="380px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editUsers(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-star-off"
              @click="showRight(scope.row)"
              >分配权限</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deletRole(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 增加角色功能 -->
    <el-dialog
      title="添加角色"
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
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色功能 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 表单主题 -->
      <span>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRefs"
          label-width="70px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showRightdialogVisible"
      width="50%"
      @close="setDialogClear"
    >
      <span>
        <el-tree
          ref="treeRef"
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      showRightdialogVisible: false,
      roleId: "",
      //创建角色表单及验证规则
      addForm: {},
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [{ required: false }],
      },

      // 修改角色表单
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [{ required: false }],
      },
      editId: 0,

      //分配权限数据
      rightList: [],
      // 树形控件属性绑定
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中节点id值
      defKeys: [],
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      this.$http.get("roles").then((res) => {
        console.log(res);
        if (res.data.meta.status != 200)
          return this.$message.error("获取角色列表失败");
        this.rightsList = res.data.data;
      });
    },
    //添加角色
    addRoles() {
      this.addDialogVisible = true;
    },
    addRolesData() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.$http.post("roles", this.addForm).then((res) => {
          if (res.data.meta.status != 201)
            return this.$message.error("fail to add");
          this.$message.success("添加成功");
          this.addDialogVisible = false;
          this.getRolesList();
        });
      });
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    //编辑角色
    editUsers(id) {
      this.editDialogVisible = true;
      this.editId = id;
    },
    editDialogClose() {
      this.$refs.editFormRefs.resetFields();
    },
    editUserData() {
      this.$refs.editFormRefs.validate((valid) => {
        if (!valid) return;
        this.$http.put("roles/" + this.editId, this.editForm).then((res) => {
          if (res.data.meta.status != 200)
            return this.$message.error("添加失败");
          this.editDialogVisible = false;
          this.getRolesList();
          this.$message.success("修改成功");
        });
      });
    },
    //删除角色
    deletRole(id) {
      //弹框询问是否删除

      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete("roles/" + id).then((res) => {
            if (res.data.meta.status == 200) {
              this.getRolesList();
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
    //删除角色权限
    async removeRight(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }

      // this.getRolesList()
      role.children = res.data;
    },
    //展示分配权限对话框
    async showRight(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status != 200) return this.$message.error("获取权限失败");

      this.rightsList = res.data;
      ////获取所有三级权限
      this.getLeafKeys(role, this.defKeys);
      this.showRightdialogVisible = true;
    },
    //获取所有三级权限
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 清空原先列表
    setDialogClear() {
      this.defKeys = [];
    },
    //提交分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        "roles/" + this.roleId + "/rights",
        { rids: idStr }
      );

      if (res.meta.status !== 200) return this.$message.error("更新权限失败");

      this.$message.success("success");
      this.getRolesList();
      this.showRightdialogVisible = false;
    },
  },
};
</script>

<style scope>
.el-tag {
  margin: 7px;
}
/* .bdbottom :first-child {
  border-top: 1px solid #eee;
} */
.bdbottom {
  padding: 10px 30px;
  border-bottom: 1px solid #eee;
}
.bdbottom:last-child {
  border: none;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>