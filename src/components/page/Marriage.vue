<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>组建家庭</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button size="small" @click="handleAdd()">新增</el-button>
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="名称"  width="150">
                </el-table-column>
                <el-table-column prop="member" label="伴侣"  width="150">
                </el-table-column>
                <!-- <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1">
                </el-pagination>
            </div>
        </div>

  <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="家庭名称">
                     <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="对方账号">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="对方密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                addVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    member: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                var dataArray=[];
                dataArray.push(this.tableData);
                return dataArray;
            }
        },
        methods: {
             handleAdd() {
            this.form = {
                name: "",
                tel: "",
                password: "",
            };
            this.addVisible = true;
    },
     async saveAdd() {
      var params = this.form;
      this.addVisible = false;
      const result = await postHttp({ url: "/record/marriage/buildFamily", params });
      if (!result) {
        return;
      }
      this.getData();
      this.$message.success(`组建成功，请退出重新登录`);
      this.$router.push("/");
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
                url: "/record/marriage/list",
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
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
    }

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
