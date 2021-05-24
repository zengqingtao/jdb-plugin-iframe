<template>
  <div class="queryFlow">
    <div class="content">
      <div class="options">
        <span>统计维度：</span>
        <el-radio-group v-model="dimension">
          <el-radio-button label="2">单品</el-radio-button>
          <el-radio-button label="1">店铺</el-radio-button>
          <el-radio-button label="0">行业</el-radio-button>
        </el-radio-group>
        <span class="sku-label">SKU：</span>
        <el-input
          placeholder="请输入SKU查询"
          size="small"
          clearable
          v-model="skuId"
          @keyup.enter.native="queryFlow"
        ></el-input>
        <el-button
          type="primary"
          class="search-btn"
          @click="queryFlow"
          :loading="searchBtnLoading"
          onfocus="this.blur()"
          >查询</el-button
        >
        <el-button
          type="text"
          class="score-btn"
          @click="scoringModalVisible = true"
          >评分</el-button
        >
      </div>
      <div class="charts-box" v-if="!initEntry">
        <ve-pie
          :data="chartData7"
          :legend-visible="false"
          :settings="chartSettings"
          :extend="chartExtend"
          :colors="colors"
          :data-empty="dataEmpty"
          width="100%"
          height="100%"
        ></ve-pie>
        <ve-pie
          :data="chartData15"
          :legend-visible="false"
          :settings="chartSettings"
          :extend="chartExtend"
          :colors="colors"
          :data-empty="dataEmpty"
          width="100%"
          height="100%"
        ></ve-pie>
        <ve-pie
          :data="chartData30"
          :legend-visible="false"
          :settings="chartSettings"
          :extend="chartExtend"
          :colors="colors"
          :data-empty="dataEmpty"
          width="100%"
          height="100%"
        ></ve-pie>
        <div class="title-and-tip">
          <div class="title" :title="description">{{ description }}</div>
          <div class="tip-box">
            <span class="color1"></span>
            <span>搜索流量</span>
          </div>
          <div class="tip-box">
            <span class="color2"></span>
            <span>非搜索流量</span>
          </div>
        </div>
        <div class="charts-day">
          <div>近7天</div>
          <div>近15天</div>
          <div>近30天</div>
        </div>
      </div>
      <el-table :data="tableData" v-if="!initEntry">
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="totalFlow" label="总流量" align="center">
          <template slot-scope="scope">
            {{ scope.row.totalFlow + "人" }}
          </template>
        </el-table-column>
        <el-table-column prop="searchFlow" label="搜索流量" align="center">
          <template slot-scope="scope">
            {{ scope.row.searchFlow + "人" }}
          </template>
        </el-table-column>
        <el-table-column prop="proportion1" label="占比" align="center">
          <template slot-scope="scope">
            {{scope.row.searchFlow===0?0:(((scope.row.searchFlow / scope.row.totalFlow) * 100).toFixed(2))}}%
          </template>
        </el-table-column>
        <el-table-column prop="otherFlow" label="非搜索流量" align="center">
          <template slot-scope="scope">
            {{ scope.row.otherFlow + "人" }}
          </template>
        </el-table-column>
        <el-table-column prop="proportion2" label="占比" align="center">
          <template slot-scope="scope">
            {{scope.row.otherFlow===0?0:((scope.row.otherFlow / scope.row.totalFlow) * 100).toFixed(2)}}%
          </template>
        </el-table-column>
      </el-table>
      <scoring-modal
        v-if="scoringModalVisible"
        type="3"
        :token="token"
        @closeModal="scoringModalVisible = false"
      />
    </div>
  </div>
</template>

<script>
import { searchProductDmpFlow } from "../../../api/jdFunction";
import { skuReg } from "../../../utils/common";
import scoringModal from "../../dialog/scoring";
import { mapState } from "vuex";
import { addCookie, getCookie } from "../../../utils/cookie";

export default {
  data() {
    (this.chartSettings = {
      radius: 50,
      offsetY: 190,
      label: {
        color: "#333",
      },
    }),
      (this.chartExtend = {
        tooltip: {
          trigger: "item",
          formatter: "{b} :<br /> {c} ({d}%)",
        },
      }),
      (this.colors = ["#F1A02D", "#FF7C00"]);
    return {
      _token: "",
      skuId: "",
      dimension: "2",
      searchBtnLoading: false,
      initEntry: true,
      description: "",
      chartData7: {
        columns: ["name", "value"],
        rows: [],
      },
      chartData15: {
        columns: ["name", "value"],
        rows: [],
      },
      chartData30: {
        columns: ["name", "value"],
        rows: [],
      },
      dataEmpty: false,
      tableData: [],
      scoringModalVisible: false,
    };
  },
  computed: {
    ...mapState(["_token", "_skuId"]),
  },
  components: { scoringModal },
  mounted() {
    this.token = this.$route.query.token || this._token;
    this.skuId = this.$route.query.skuId || this._skuId;
  },
  methods: {
    async queryFlow() {
      if (this.skuId === "") {
        return this.$message.error("请输入SKU");
      } else if (!skuReg(this.skuId)) {
        return this.$message.error("SKU输入有误");
      }
      this.$store.commit("CHANGE_SKUID", this.skuId);
      let params = {
        skuId: this.skuId,
        type: this.dimension,
      };
      this.searchBtnLoading = true;
      let { data: res } = await searchProductDmpFlow({
        params,
        token: this.token,
      });
      this.searchBtnLoading = false;
      if (res.code === 200) {
        this.initEntry = false;
        this.description = res.data.description;
        let res7 = res.data.last7Result;
        let res15 = res.data.last15Result;
        let res30 = res.data.last30Result;

        if (res7.visitor) {
          this.dataEmpty = false;
          this.tableData = res.data.list;
          this.chartData7.rows = res7.visitor.pieChart.valueList;
          this.chartData15.rows = res15.visitor.pieChart.valueList;
          this.chartData30.rows = res30.visitor.pieChart.valueList;
        } else {
          this.dataEmpty = true;
          this.tableData = [];
          this.chartData7.rows = [];
          this.chartData15.rows = [];
          this.chartData30.rows = [];
        }
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style>
/* 折线图没有数据时用到 */
@import "v-charts/lib/style.css";
</style>

<style lang="scss" scoped>
.queryFlow {
  height: 100%;

  .content {
    height: 100%;
    padding: 0 20px 0 10px;

    .options {
      height: 49px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 21px;
      color: #333;
      font-size: 14px;

      /deep/ .el-radio-button {
        width: 86px;
        height: 28px;

        .el-radio-button__inner {
          width: 86px;
          height: 28px;
          line-height: 28px;
          border-radius: 4px;
          padding: 0;
        }
      }

      /deep/ .el-radio-button + .el-radio-button {
        margin-left: 10px;
      }

      .sku-label {
        margin-left: 39px;
      }

      /deep/ .el-input,
      /deep/ .el-input__inner {
        width: 163px;
        height: 28px;
      }

      /deep/ .el-input__suffix{
          display: flex;
          align-items: center;
      }

      .search-btn {
        width: 86px;
        height: 28px;
        padding: 0;
        margin-left: 10px;
      }

      .score-btn {
        margin-left: 20px;
      }
    }

    .charts-box {
      width: 100%;
      height: 288px;
      border: 1px solid #eeeeee;
      border-radius: 6px;
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      position: relative;

      .title-and-tip {
        position: absolute;
        top: 20px;
        left: 20px;

        .title {
          width: 275px;
          height: 14px;
          line-height: 15px;
          color: #333333;
          font-size: 14px;
          display: -webkit-box;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 1;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .tip-box {
          font-size: 14px;
          color: #333;
          margin-top: 10px;
          display: flex;
          align-items: center;

          span:first-child {
            width: 28px;
            height: 16px;
            border-radius: 2px;
            margin-right: 6px;
          }
          .color1 {
            background: #f1a02d;
          }

          .color2 {
            background: #ff7c00;
          }
        }
      }

      .charts-day {
        width: 100%;
        position: absolute;
        bottom: 21px;
        display: flex;
        color: #666;
        font-size: 12px;

        & > div {
          width: 33.34%;
          text-align: center;
        }
      }
    }

    /deep/ .el-table {
      margin-top: 20px;
      border: 1px solid #eee;
      border-bottom: 0;
      border-radius: 10px;
    }
  }
}
</style>