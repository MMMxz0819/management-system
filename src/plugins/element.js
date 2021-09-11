import Vue from 'vue'
import {
    Button, Form
    , FormItem, Message, Input, Header
    , Container, Aside, Main, Submenu, MenuItem, Menu, MenuItemGroup
    , Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Row,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui'



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Input)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

Vue.prototype.$message = Message  //挂载弹框
Vue.prototype.$confirm = MessageBox.confirm  //挂载弹框
