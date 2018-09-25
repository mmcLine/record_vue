<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button size="small" @click="handleAdd()">新增</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="tel" label="手机号" width="150">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="150">
                </el-table-column>
                <el-table-column prop="head_portrait" label="头像" width="150">
                </el-table-column>
                <el-table-column label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" @click="updatePasswd(scope.$index, scope.row)">修改密码</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

         <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" placeholder="请输入您的昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.tel" maxlength="11" placeholder="请输入手机号"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱">
                    <el-input v-model="form.email" type="email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                 <el-form-item label="头像">
                    <el-input v-model="form.headPortrait" placeholder="请输入头像地址"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password1" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                 <el-form-item label="确认密码">
                    <el-input v-model="form.password2" type="password" placeholder="请再次输入密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" placeholder="请输入您的昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.tel" maxlength="11" placeholder="请输入手机号"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱">
                    <el-input v-model="form.email" type="email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                 <el-form-item label="头像">
                    <el-input v-model="form.headPortrait" placeholder="请输入头像地址"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 密码修改框 -->
         <el-dialog title="编辑" :visible.sync="updPasswdVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="旧密码">
                    <el-input v-model="form.oldPasswd"  type="password" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="form.newPasswd" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                 <el-form-item label="确认密码">
                    <el-input v-model="form.newPasswd2" type="password" placeholder="确认密码"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updPasswdVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUpdPasswd">确 定</el-button>
          </span>
                </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { postHttp, httpHost } from "@/http";
export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      updPasswdVisible:false,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      form: {
        name: "",
        date: "",
        address: ""
      },
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.name.indexOf(this.select_word) > -1 ||
            d.tel.indexOf(this.select_word) > -1 ||
            d.email.indexOf(this.select_word) > -1
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    async saveAdd() {
      if (!this.form.name) {
        this.$message.error("请输入昵称");
        return;
      }
      //验证手机
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (!this.form.tel) {
        this.$message.error("请输入手机号码");
        return;
      } else if (!reg.test(this.form.tel)) {
        this.$message.error("手机格式不正确");
        return;
      }
      //验证邮箱
      var regEmail =/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
      if (!this.form.email) {
        this.$message.error("请输入邮箱");
        return;
      } else if (!regEmail.test(this.form.email)) {
        this.$message.error("邮箱格式不正确");
        return;
      }
      //验证密码
      if (!this.form.password1) {
        this.$message.error("请输入密码");
        return;
      } else if (this.form.password1.length < 6) {
        this.$message.error("密码至少输入6位");
        return;
      } else if (this.form.password1 == "123456") {
        this.$message.error("密码太过简单，请重新输入");
        return;
      } else if (this.form.password1 != this.form.password2) {
        this.$message.error("两次输入密码不一致，请重新输入");
        return;
      }
      this.form.password = this.form.password1;
      //提交数据库
      var params = this.form;
      this.addVisible = false;
      const result = await postHttp({ url: "/record/user/regist", params });
      if (!result) {
        return;
      }
       this.$message.success(`新增用户成功！！！`);
    },
    handleAdd() {
      this.form = {
        name: "",
        tel: "",
        email: "",
        headPortrait: "",
        password1: "",
        password2: "",
        password: ""
      };
      this.addVisible = true;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    async getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      if (process.env.NODE_ENV === "development") {
        const params = {
          pageNo: this.cur_page
        };
        const result = await postHttp({
          url: "/record/user/list",
          params
        });
        if (!result) {
          return;
        }
        this.tableData = result.inner;
        this.totalPageSize = result.totalPageSize;
      }
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        pkey: item.pkey,
        name: item.name,
        tel: item.tel,
        email: item.email,
        headPortrait: item.head_portrait
      };
      this.editVisible = true;
    },
    updatePasswd(index, row){
      const item = this.tableData[index];
      this.form = {
        user: item.pkey,
        oldPasswd: "",
        newPasswd:"",
        newPasswd2: "",
      };
      this.updPasswdVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
     async delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      let pkeys = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].study_content + " ";
        pkeys += this.multipleSelection[i].pkey + ",";
      }
      var params = { pkeys: pkeys, className: "User" };
      this.delVisible = false;
      const result = await postHttp({ url: "record/del", params });
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    async saveEdit() {
      if (!this.form.name) {
        this.$message.error("请输入昵称");
        return;
      }
      //验证手机
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (!this.form.tel) {
        this.$message.error("请输入手机号码");
      } else if (!reg.test(this.form.tel)) {
        this.$message.error("手机格式不正确");
      }
      //验证邮箱
      var regEmail = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
      if (!this.form.email) {
        this.$message.error("请输入邮箱");
      } else if (!regEmail.test(this.form.email)) {
        this.$message.error("邮箱格式不正确");
      }
      var params = this.form;
      const result = await postHttp({
        url: "/record/user/regist",
        params
      });
      if (!result) {
        return;
      }
      this.getData();
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    //保存密码修改
    async saveUpdPasswd(){
      if(!this.form.oldPasswd){
         this.$message.error("请输入旧密码");
         return;
      }
      if(this.form.newPasswd.length<6||this.form.newPasswd=="123456"){
        this.$message.error("密码不能小于6位，并且不能设置123456");
        return;
      }
      else if(this.form.newPasswd!=this.form.newPasswd2){
        this.$message.error("两次输入的密码不一致");
        return;
      }
       var params = this.form;
      const result = await postHttp({
        url: "/record/user/updpasswd",
        params
      });
      if(!result){
        this.$message.error(`修改密码失败`);
        return;
      }
      this.updPasswdVisible = false;
      this.$message.success(`修改密码成功`);
    },
    // 确定删除
   async deleteRow() {
      var row = this.tableData.splice(this.idx, 1);
      var params = { pkeys: row[0].pkey, className: "User" };
      const result = await postHttp({ url: "record/del", params });
      if (!result) {
        return;
      }
      this.$message.success("删除成功");
      this.delVisible = false;
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.require {
  color: red;
}
</style>
