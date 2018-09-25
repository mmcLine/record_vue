<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 登录日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="user_name" label="用户名"  width="150">
                </el-table-column>
                 <el-table-column prop="create_time" label="登录时间"  width="150">
                </el-table-column>
                 <el-table-column prop="ip" label="ip地址"  width="150">
                </el-table-column>
                 <el-table-column prop="browser" label="浏览器"  width="150">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total=this.totalPageSize>
                </el-pagination>
            </div>
        </div>

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
      totalPageSize: 1,
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      form: {
        mensDate: "",
        cycle: ""
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
          if (true) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    handleAdd() {
      this.form = {
        typeName: "",
      };
      this.addVisible = true;
    },
         //新增数据
    async saveAdd() {
      var params = this.form;
      this.addVisible = false;
      const result = await postHttp({ url: "/record/tradeType/save", params });
      if (!result) {
        return;
      }
      this.getData();
      this.$message.success(`新增成功`);
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
          url: "/record/loginlog/list",
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
        typeName: item.type_name,
      };
      this.editVisible = true;
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
      var params = { pkeys: pkeys, className: "Menstruation" };
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
      this.$set(this.tableData, this.idx, this.form);
      var params = this.form;
      const result = await postHttp({
        url: "/record/tradeType/save",
        params
      });
      if (!result) {
        return;
      }
      this.getData();
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    async deleteRow() {
      var row = this.tableData.splice(this.idx, 1);
      var params = { pkeys: row[0].pkey, className: "Menstruation" };
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
</style>
