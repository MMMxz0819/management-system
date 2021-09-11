<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <div class="title">
          <img src="@/assets/homehead.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 合并按钮 -->
          <div class="toggle-bottom" @click="hidden">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409fee"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router = true
            :default-active="activePath"
          >  
          <!-- 
          :router->开启以index为跳转路由的router模式
          :collapse->是否折叠菜单 
          -->
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in MenuList"
              :key="item.id"
            >
              <!-- 一级模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="itemIcon[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+child.path"
                v-for="child in item.children"
                :key="child.id"
                @click="savePath('/'+child.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ child.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <!-- 显示子组件 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      MenuList: [],
      isCollapse: false,
      itemIcon: {
        125: "el-icon-user",
        103: "el-icon-lock",
        101: "el-icon-shopping-bag-1",
        102: "el-icon-shopping-cart-2",
        145: "el-icon-s-data",
      },
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有菜单
    getMenuList() {
      this.$http.get("menus").then((res) => {
        if (res.status !== 200) return this.$message.error(res.meta.msg);
        this.MenuList = res.data.data;

      });
    },
    // 点击按钮收起/展开菜单
    hidden() {
      this.isCollapse = !this.isCollapse;
    },
    //保存连接激活状态
    savePath(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  },
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.title {
  display: flex;
  align-items: center;
}
.title span {
  padding-left: 10px;
}
.title img {
  height: 60px;
  width: 60px;
}
.el-aside {
  background-color: #333744;
}
.toggle-bottom {
  background-color: #4a5064;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-menu {
  border: none;
}
.el-main {
  background-color: #ddd;
}
</style>