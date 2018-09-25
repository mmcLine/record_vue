<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="static/img/img.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">上次登录时间：<span>{{loginTime}}</span></div>
                            <div class="user-info-list">上次登录Ip：<span>{{loginIp}}</span></div>
                        </el-card>
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>查询范围</span>
                            </div>
                            <!-- Vue
                            <el-progress :percentage="57.2" color="#42b983"></el-progress>
                            JavaScript
                            <el-progress :percentage="29.8" color="#f1e05a"></el-progress>
                            CSS
                            <el-progress :percentage="11.9"></el-progress>
                            HTML
                            <el-progress :percentage="1.1" color="#f56c6c"></el-progress> -->
                            <template>
                              <el-radio v-for="item in userscope" :label="item.label" :key="item.label"
                              :value="item.label" v-model="checkeduser"
                              @change="changeRadio">
                                {{item.labelName}}</el-radio>
                            </template>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalAmt}}</div>
                                    <div>总交易额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalNum}}</div>
                                    <div>总交易笔数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{monthAmt}}</div>
                                    <div>当月交易额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" :style="{width:'100%',height:'380px'}" id="tpl-echarts-A">
                    <!-- <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table> -->
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>
<script>
import { postHttp, httpHost } from "@/http";
export default {
  name: "dashboard",
  data() {
    return {
      name: localStorage.getItem("username"),
      checkeduser: parseInt(localStorage.getItem("userid")),
      userscope: [],
      totalAmt: 0,
      totalNum: 0,
      monthAmt: 0,
      loginTime: "",
      loginIp: "",
      todoList: [
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: true
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: true
        }
      ]
    };
  },
  mounted() {
    this.drawChart();
    this.Calculation();
    this.loginRecord();
    this.getUserScope();
    this.getCheckedUser();
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  methods: {
    async changeRadio(value) {
      var params = {
        user: value
      };
      const result = await postHttp({
        url: "/record/home/updateScope",
        params
      });
      if (result) {
        this.drawChart();
    this.Calculation();
    this.loginRecord();
        this.$message({
          message: "修改查询范围成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "修改查询范围失败",
          type: "error"
        });
      }
    },
    async getUserScope() {
      const result = await postHttp({ url: "/record/home/scopList" });
      if (result) {
        this.userscope = result.inner;
      }
    },
      async getCheckedUser() {
      const result = await postHttp({ url: "/record/home/getCheckedUser" });
      if (result) {
        this.checkeduser = result.inner;
      }
    },
    async Calculation() {
      const result = await postHttp({ url: "/record/home/calculation" });
      if (result) {
        this.monthAmt = result.inner.monthamt==null?0:result.inner.monthamt;
        this.totalAmt = result.inner.totalamt==null?0:result.inner.totalamt;
        this.totalNum = result.inner.totalcount;
      }
    },
    async loginRecord() {
      const result = await postHttp({ url: "/record/home/logininfo" });
      if (result && result.inner) {
        this.loginIp = result.inner[0].ip;
        this.loginTime = result.inner[0].create_time;
      }
    },
    drawChart() {
      this.$api.getMonthData().then(res => {
        var echartsA = this.$echarts.init(
          document.getElementById("tpl-echarts-A")
        );
        var optionA = {
          title: {
            text: "消费月统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: res.data.data.names
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: true,
            data: res.data.data.months
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "",
              type: "line",
              // stack: "总量",
              data: []
            }
            // {
            //   name: "联盟广告",
            //   type: "line",
            //   stack: "总量",
            //   data: [220, 182, 191, 234, 290, 330, 310]
            // },
            // {
            //   name: "视频广告",
            //   type: "line",
            //   stack: "总量",
            //   data: [150, 232, 201, 154, 190, 330, 410]
            // },
            // {
            //   name: "直接访问",
            //   type: "line",
            //   stack: "总量",
            //   data: [320, 332, 301, 334, 390, 330, 320]
            // },
            // {
            //   name: "搜索引擎",
            //   type: "line",
            //   stack: "总量",
            //   data: [820, 932, 901, 934, 1290, 1330, 1320]
            // }
          ]
        };
        echartsA.setOption(optionA);
        const items = [];
        for (var i = 0; i < res.data.data.names.length; i++) {
          var name = res.data.data.names[i];
          var item = {
            name: name,
            type: "line",
            // stack: "总量",
            data: res.data.data.amts[i]
          };
          items.push(item);
        }

        echartsA.setOption({
          series: items
        });
      });
    }
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
</style>
