# management-system
后台管理系统

## 登录功能
### 记录登录状态
#### 1、无跨域：使用cookie/session
#### 2、存在跨域问题：token
    验证登录、由服务器生成token值
    客户端储存token，发送请求时需要携带token
    验证token是否通过

#### 3、登录成功后保存token至sessionStorage中
    localStorage：永久化
    sessionStorage：会话期间
