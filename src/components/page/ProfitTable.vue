<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 盈利记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button size="small" @click="handleAdd()">新增</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-date-picker
                v-model="tradeDatePeriod"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" 
             show-summary
            @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="事项" sortable width="150">
                </el-table-column>
                <el-table-column prop="trade_date" label="交易日期" width="120">
                </el-table-column>
                <el-table-column prop="amt" label="交易金额" width="120">
                </el-table-column>
                <el-table-column prop="remarks" label="备注" style="color:red">
                </el-table-column>
                <el-table-column prop="user_name" label="用户" style="color:red" >
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total=totalPageSize :pageSize=pageSizeNumber >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                 <el-form-item label="事项">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.tradeDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="金额">
                    <el-input v-model="form.amt"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remarks"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">


            <el-form ref="form" :model="form" label-width="50px">
              <!-- yuancheng -->
                <el-form-item label="事项">
                   <el-autocomplete
                      popper-class="my-autocomplete"
                      v-model="form.name"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入消费事项"
                      @select="handleSelect">
                      <i
                        class="trade_autoinput"
                        slot="suffix"
                        @click="handleIconClick">
                      </i>
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                      </template>
                    </el-autocomplete>
                     </el-form-item>
                <el-form-item label="金额">
                    <el-input v-model="form.amt"></el-input>
                </el-form-item>
                  <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.tradeDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remarks"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
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
import axios from "axios";
export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      totalPageSize: 1,
      pageSizeNumber:20,
      tradeDatePeriod: "",
      tableData: [],
      typeOptions: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      form: {
        name: "",
        tradeDate: "",
        amt: "",
        remarks: ""
      },
      idx: -1,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
       restaurants: [],
    };
  },
  created() {
    this.getData();
  },
  mounted() {
     this.loadAll();
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
            d.remarks.indexOf(this.select_word) > -1
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    async getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      if (process.env.NODE_ENV === "development") {
        const params = {
          pageNo: this.cur_page
        };
        const result = await postHttp({ url: "/record/profit/list", params });
        if (!result) {
          return;
        }
        this.tableData = result.inner;
        this.totalPageSize = result.totalPageSize;
      }
    },
    async search() {
      this.is_search = true;
      var params = {
        startDate: this.tradeDatePeriod[0],
        endDate: this.tradeDatePeriod[1]
      };
      const result = await postHttp({ url: "/record/profit/datelist", params });
      this.tableData = result.inner;
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
        tradeDate: item.trade_date,
        amt: item.amt,
        remarks: item.remarks
      };
      this.editVisible = true;
    },
    handleAdd() {
      this.form = {
        name: "",
        tradeDate: new Date(
          Date.UTC(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          )
        )
          .toISOString()
          .slice(0, 10),
        amt: "",
        remarks: ""
      };
      this.addVisible = true;
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
        str += this.multipleSelection[i].name + " ";
        pkeys += this.multipleSelection[i].pkey + ",";
      }
      var params = { pkeys: pkeys, className: "Order" };
      this.delVisible = false;
      const result = await postHttp({ url: "record/del", params });
      if (!result) {
        return;
      }
      this.getData();
      this.$message.success("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //新增数据
    async saveAdd() {
      var params = this.form;
      this.addVisible = false;
      const result = await postHttp({ url: "/record/profit/save", params });
      if (!result) {
        return;
      }
      this.getData();
      this.$message.success(`新增成功`);
    },
    // 保存编辑
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      var params = this.form;
      this.editVisible = false;
      const result = await postHttp({ url: "/record/profit/save", params });
      if (!result) {
        return;
      }
      this.getData();
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    async deleteRow() {
      var row = this.tableData.splice(this.idx, 1);
      var params = { pkeys: row[0].pkey, className: "Profit" };
      const result = await postHttp({ url: "record/del", params });
      if (!result) {
        return;
      }

      this.$message.success("删除成功");
      this.delVisible = false;
    },
     querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
     async loadAll() {
         const result =await postHttp({ url: "/record/profit/names" });
        if (!result) {
          return;
        }
       this.restaurants=result.inner;
      },
      handleSelect(item) {
        this.form.name=item.name;
      },
      handleIconClick(ev) {
        console.log(ev);
      }
  }
};
</script>
<style lang="less">
.el-upload--text {
  width: 80px;
  height: 40px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  //vertical-align:text-top;
  margin-bottom: -10px;
}
</style>

<style scoped>
.tradeTableImport {
  width: 80px;
  height: 40px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  margin-top: 0px;
}
.handle-box {
  margin-bottom: 20px;
  display: inline-block;
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
<style>
.el-autocomplete{
  width: 100%;
}
</style>

