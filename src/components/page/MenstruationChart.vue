<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 大姨妈折线图</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div id="menstruation_detail_chart" style="width:100%;height:20em">

            </div>
        </div>

    </div>
</template>

<script>
import { postHttp, httpHost } from "@/http";
export default {
  name: "basetable",
  data() {
    return {};
  },
  created() {
    // this.getData();
    
  },
  mounted(){
    this.drawLine();
  },
  computed: {},
  methods: {
    async drawLine() {
      var echart_mens =this.$echarts.init(
        document.getElementById("menstruation_detail_chart")
      );
      var option = {
        title: {
          text: "大姨妈折线图"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["时间间隔"]
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
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value",
          min: 20,
          max: 40,
          interval: 5
        },
        series: []
      };

      echart_mens.setOption(option);

      var dates = []; 
      var cycles = [];
      const result = await postHttp({ url: "/record/menstruation/lineChart" });
      result.inner.forEach(element => {
        dates.push(element.mens_date);
        cycles.push(element.cycle);
      });

          echart_mens.setOption({
            //加载数据图
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: dates
            },
            series: [
              {
                // 根据名字对应到相应的系列
                stack: "总量",
                type: "line",
                name: "时间间隔", //显示在上部的标题
                data: cycles
              }
            ]
          });
    },
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
      }
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
