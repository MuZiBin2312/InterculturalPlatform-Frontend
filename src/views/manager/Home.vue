<template>
  <div style="height: 100vh; display: flex; flex-direction: column; padding: 15px; box-sizing: border-box;">

    <!-- 顶部4个统计卡片 -->
    <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
      <div class="card item">
        <div style="flex: 1; text-align: center">
          <img src="@/assets/imgs/新闻.png" alt="" style="width: 60px; height: 60px" />
        </div>
        <div style="flex: 1; font-size: 20px">
          <div style="margin-bottom: 5px">资讯总数</div>
          <div style="font-weight: bold">{{ count.newsCount }}</div>
        </div>
      </div>

      <div class="card item">
        <div style="flex: 1; text-align: center">
          <img src="@/assets/imgs/问答.png" alt="" style="width: 60px; height: 60px" />
        </div>
        <div style="flex: 1; font-size: 20px">
          <div style="margin-bottom: 5px">问题总数</div>
          <div style="font-weight: bold">{{ count.questionCount }}</div>
        </div>
      </div>
      <div class="card item">
        <div style="flex: 1; text-align: center">
          <img src="@/assets/imgs/反馈.png" alt="" style="width: 60px; height: 60px" />
        </div>
        <div style="flex: 1; font-size: 20px">
          <div style="margin-bottom: 5px">反馈总数</div>
          <div style="font-weight: bold">{{ count.feedbackCount }}</div>
        </div>
      </div>
      <div class="card item">
        <div style="flex: 1; text-align: center">
          <img src="@/assets/imgs/用户.png" alt="" style="width: 60px; height: 60px" />
        </div>
        <div style="flex: 1; font-size: 20px">
          <div style="margin-bottom: 5px">用户总数</div>
          <div style="font-weight: bold">{{ count.userCount }}</div>
        </div>
      </div>
    </div>

    <!-- 中下图表部分 -->
    <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
      <!-- 折线图 & 饼图 -->
      <div style="flex: 1; display: flex; gap: 15px;">
        <div class="card" id="trendChart" style="flex: 1;"></div>

        <div class="card" id="point" style="flex: 1;"></div>

      </div>

      <!-- 趋势图 & 横柱图 -->
      <div style="flex: 1; display: flex; gap: 15px;">
        <!-- 左边趋势图占剩余空间 -->
        <div class="card" id="line" style="flex: 1;"></div>

        <!-- 右边两个横柱图，固定宽度60% -->
        <div style="width: 60%; display: flex; flex-direction: row; gap: 15px;">
          <div class="card" id="pie" style="flex: 1;"></div>

          <div class="card" id="bar1" style="flex: 1;"></div>

        </div>
      </div>
    </div>

  </div>
</template>
<script>
const pointOption = {
  title: {
    text: '点击量 vs 时间',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} 点击量'
  },
  xAxis: {
    type: 'category',
    name: '时间',
    data: [] // 时间数组，将动态加载
  },
  yAxis: {
    type: 'value',
    name: '点击量'
  },
  series: [{
    name: '点击量',
    type: 'scatter',  // 使用散点图
    symbolSize: 10,   // 控制点的大小
    data: [] // 点击量数据
  }]
};
const trendOption = {
  title: {
    text: '近期内容发布趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['资讯', '视频'],
    top: '30'
  },
  xAxis: {
    type: 'category',
    data: []  // 日期数组
  },
  yAxis: {
    type: 'value'
  },
  // dataZoom: [
  //   {
  //     type: 'slider',     // 显示底部缩放条
  //     start: 0,          // 从中间（第6天）开始展示
  //     end: 100            // 到最后（第10天）
  //   },
  //   {
  //     type: 'inside',     // 支持鼠标滚轮缩放
  //     start: 100,
  //     end: 100
  //   }
  // ],
  series: [
    {
      name: '资讯',
      type: 'line',
      smooth: true,
      data: []  // 对应资讯数量
    },
    {
      name: '视频',
      type: 'line',
      smooth: true,
      data: []  // 对应视频数量
    }
  ]
}
const lineOption = {
  title: {
    text: '用户回答统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  // dataZoom: [
  //   {
  //     type: 'slider',     // 显示底部缩放条
  //     start: 0,          // 从中间（第6天）开始展示
  //     end: 100            // 到最后（第10天）
  //   },
  //   {
  //     type: 'inside',     // 支持鼠标滚轮缩放
  //     start: 50,
  //     end: 100
  //   }
  // ],
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    },
  ]
}
const pieOption = {
  title: {
    text: '资讯分类统计',
    // subtext: '比例图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },

  series: [
    {
      type: 'pie',
      center: ['50%', '60%'],
      radius: '50%',
      data: [],
      label: {
        show: true,
        formatter(param) {
          return param.name + ' (' + param.percent + '%)';
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

import * as echarts from 'echarts'

export default {
  name: 'Home',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      count: {}

    }
  },
  mounted() {
    this.$request.get('/selectClickTrendDataByHour').then(res => {
      const data = res.data || {};  // 确保data是一个对象而不是数组
      console.log(res.data);

      // 解析返回的数据，假设newsClickData是点击量，hours是时间
      const times = data.hours || [];  // 获取时间数据
      const clickCounts = data.newsClickData.map(item => item.value);  // 获取新闻点击量

      // 格式化时间为 "几日几时" 形式
      const formattedTimes = times.map(time => {
        const [date, hour] = time.split(' '); // 分离日期和小时
        const day = date.split('-')[2]; // 获取日期中的日
        return `${day}日 ${hour}时`; // 返回格式化后的字符串
      });

      // 更新散点图的数据
      pointOption.xAxis.data = formattedTimes;  // 横轴是时间
      pointOption.series[0].data = clickCounts.map((count, index) => [formattedTimes[index], count]);  // 散点图的数据，时间和点击量配对

      // 初始化并渲染散点图
      const pointDom = document.getElementById('point');
      const pointChart = echarts.init(pointDom);
      pointChart.setOption(pointOption);
    });

    let bar1Dom = document.getElementById('bar1');
    let barOne = echarts.init(bar1Dom);
    this.$request.get('/selectTopReads').then(res => {
      const data = res.data || {};

      // 确保是数组
      this.newsBarData = Array.isArray(data.news) ? data.news : [];
      this.videoBarData = Array.isArray(data.video) ? data.video : [];

      // 截取前10条数据
      this.newsBarData = this.newsBarData.slice(0, 10);
      this.videoBarData = this.videoBarData.slice(0, 10);


      // 合并数据
      const combinedData = [
        ...this.newsBarData.map(item => ({
          name: item.name,
          clickCount: item.value,
          type: '新闻',
        })),
        ...this.videoBarData.map(item => ({
          name: item.name,
          clickCount: item.value,
          type: '视频',
        })),
      ];

      // 确保合并后的数据正常
      if (combinedData.some(item => item.name === undefined || item.clickCount === undefined)) {
        console.error('合并数据中存在未定义的值');
        return;
      }

      // 按点击量排序
      const sortedData = combinedData.sort((a, b) => a.clickCount - b.clickCount);
      // 提取排序后的名称和点击量
      const names = sortedData.map(item => item.name);
      const clickCounts = sortedData.map(item => item.clickCount);
      const types = sortedData.map(item => item.type);



      // 设置图表的 option
      const option = {
        title: {
          text:'内容点击量排行',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['视频', '文章'], // ✅改为“文章”

        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: names, // 确保y轴显示所有标题
          axisLabel: {
            interval: 0, // 确保标签不重叠
            rotate: 0  // 可选：防止标签重叠
          }
        },
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: 0, // 针对 y 轴
            start: 100,
            end: 50, // 初始显示前 50%（可按实际条数调整）
            handleSize: 10
          }
        ],
        series: [
          {
            name: '视频',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: '#5470C6' // 视频颜色
            },
            data: clickCounts.map((count, index) => types[index] === '视频' ? count : 0) // 仅显示视频的点击量
          },
          {
            name: '文章',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: '#91CC75' // 新闻颜色
            },
            data: clickCounts.map((count, index) => types[index] === '新闻' ? count : 0) // 仅显示新闻的点击量
          }
        ]
      };


      // 设置图表选项
      this.$nextTick(() => {
        barOne.setOption(option);
      });
    });    // 折线图
    let linetDom = document.getElementById('line');
    let lineChart = echarts.init(linetDom);

    // 饼图
    let pieDom = document.getElementById('pie');
    let pieChart = echarts.init(pieDom);

    // 趋势图
    const trendDom = document.getElementById('trendChart');
    const trendChart = echarts.init(trendDom);

    this.$request.get('/selectLine').then(res => {
      lineOption.xAxis.data = res.data?.map(v => v.name) || []
      lineOption.series[0].data = res.data?.map(v => v.value) || []
      lineChart.setOption(lineOption)
    })

    this.$request.get('/selectPie').then(res => {
      pieOption.series[0].data = res.data || []
      pieChart.setOption(pieOption)
    })

    this.$request.get('/selectTrendData').then(res => {
      const data = res.data
      const newsData = data.news || []
      const videoData = data.video || []
      const dates = data.dates || []

      trendOption.xAxis.data = dates
      trendOption.series[0].data = newsData.map(item => item.value)
      trendOption.series[1].data = videoData.map(item => item.value)

      trendChart.setOption(trendOption)
    })
    window.addEventListener('resize', chart.resize)

  },
  created() {
    this.$request.get('/count').then(res => {
      this.count = res.data || {}
    })
  }
}
</script>

<style scoped>
.item {
  flex: 1;
  display: flex;
  align-items: center;
}
</style>
