<script lang="ts" setup>
import "@/styles/index.scss";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onActivated,
  onBeforeUnmount,
  computed,
  Ref,
} from "vue";
import { useUserStore } from "@/store/user.ts";
import storage from "@/utils/storage";
import { CountUp } from "countup.js";
import { useTemplateRefsList, useEventListener } from "@vueuse/core";
import { getBlogInfoList, getWeekVistorAndRegister } from "api/home.ts";
import { browsing } from "@/types/home.ts";
import * as echarts from "echarts";

const userInfo = useUserStore();
// 时间转换
function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  let state = ``;
  if (hours >= 0 && hours <= 10) {
    state = `早上好!`;
  } else if (hours > 10 && hours <= 14) {
    state = `中午好!`;
  } else if (hours > 14 && hours <= 18) {
    state = `下午好!`;
  } else if (hours > 18 && hours <= 24) {
    state = `晚上好!`;
  }
  return state;
}
let timeState = getTimeState();

const welcomeNote = ref(import.meta.env.VITE_APP_HOME_WELCOME_NOTE);

const d = new Date();

const state: {
  workingTimeFormat: string;
  pauseWork: boolean;
} = reactive({
  workingTimeFormat: "",
  pauseWork: false,
});

let workTimer: number;

const onChangeWorkState = () => {
  const time = parseInt((new Date().getTime() / 1000).toString());
  const workingTime = storage.get("WORKING_TIME");
  if (state.pauseWork) {
    // 继续工作
    workingTime.pauseTime += time - workingTime.startPauseTime;
    workingTime.startPauseTime = 0;
    storage.set("WORKING_TIME", workingTime);
    state.pauseWork = false;
    startWork();
  } else {
    // 暂停工作
    workingTime.startPauseTime = time;
    storage.set("WORKING_TIME", workingTime);
    clearInterval(workTimer);
    state.pauseWork = true;
  }
};

const startWork = () => {
  const workingTime = storage.get("WORKING_TIME") || {
    date: "",
    startTime: 0,
    pauseTime: 0,
    startPauseTime: 0,
  };
  const currentDate =
    d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  const time = parseInt((new Date().getTime() / 1000).toString());

  if (workingTime.date != currentDate) {
    workingTime.date = currentDate;
    workingTime.startTime = time;
    workingTime.pauseTime = workingTime.startPauseTime = 0;
    storage.set("WORKING_TIME", workingTime);
  }

  let startPauseTime = 0;
  if (workingTime.startPauseTime <= 0) {
    state.pauseWork = false;
    startPauseTime = 0;
  } else {
    state.pauseWork = true;
    startPauseTime = time - workingTime.startPauseTime; // 已暂停时间
  }

  let workingSeconds =
    time - workingTime.startTime - workingTime.pauseTime - startPauseTime;

  state.workingTimeFormat = formatSeconds(workingSeconds);
  if (!state.pauseWork) {
    workTimer = window.setInterval(() => {
      workingSeconds++;
      state.workingTimeFormat = formatSeconds(workingSeconds);
    }, 1000);
  }
};

const formatSeconds = (seconds: number) => {
  var secondTime = 0; // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  var dayTime = 0; // 天
  var result = "";

  if (seconds < 60) {
    secondTime = seconds;
  } else {
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(seconds / 60);
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(seconds % 60);
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime >= 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60);
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60);
      if (hourTime >= 24) {
        // 获取天数， 获取小时除以24，得到整数天
        dayTime = Math.floor(hourTime / 24);
        // 获取小时后取余小时，获取分钟除以24取余的分；
        hourTime = Math.floor(hourTime % 24);
      }
    }
  }

  result =
    hourTime +
    "小时" +
    ((minuteTime >= 10 ? minuteTime : "0" + minuteTime) +
      "分钟" +
      ((secondTime >= 10 ? secondTime : "0" + secondTime) + "秒"));
  if (dayTime > 0) {
    result = dayTime + "天" + result;
  }
  return result;
};

//
const BlogInfoList: Ref<browsing> | Ref = ref({});
// 获取博客浏览和用户信息
const getBlogInfoListAPI = async () => {
  const res = await getBlogInfoList();
  BlogInfoList.value = res.data.data;
  initCountUp();
  console.log(BlogInfoList.value);
};

// 自增数字动画
const countUpFun = (id: string) => {
  nextTick(() => {
    let value = document.getElementById(id)?.innerText;
    if (value) {
      new CountUp(id, parseInt(value), {
        startVal: 0,
        duration: 3,
      }).start();
    }
  });
};

// 自增函数集合
const initCountUp = () => {
  countUpFun("total_number");
  countUpFun("total_register");
  countUpFun("article_message");
  countUpFun("message_board");
};

// 获取所有的echarts的DOM元素
const refs = useTemplateRefsList<HTMLDivElement>();

// 获取所有的echarts,当视口宽度变化时,重新设置echarts表
const echartsControls: any[] = reactive([]);

// 用户增长情况echarts表
const initUserGrowthEcharts = () => {
  const userGrowthEcharts = echarts.init(refs.value[0]);
  // 用户增长情况echarts数据
  const option = {
    grid: {
      top: 0,
      right: 0,
      bottom: 20,
      left: 0,
    },
    xAxis: {
      data: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期天",
      ],
    },
    yAxis: {},
    legend: {
      data: ["访问量", "注册量"],
      textStyle: {
        color: "#73767a",
      },
    },
    series: [
      {
        name: "访问量",
        data: [100, 160, 280, 230, 190, 200, 480],
        type: "line",
        smooth: true,
        areaStyle: {
          color: "#8595F4",
        },
      },
      {
        name: "注册量",
        data: [45, 180, 146, 99, 210, 127, 288],
        type: "line",
        smooth: true,
        areaStyle: {
          color: "#F48595",
          opacity: 0.5,
        },
      },
    ],
  };
  userGrowthEcharts.setOption(option);
  // 将内容统一管理，当页面发生变化时重新加载
  echartsControls.push(userGrowthEcharts);
};
// 用户访问方式echarts表
const initUserSourceChart = () => {
  const UserSourceChart = echarts.init(refs.value[1] as HTMLElement);
  const pathSymbols = {
    reindeer:
      "path://M-22.788,24.521c2.08-0.986,3.611-3.905,4.984-5.892 c-2.686,2.782-5.047,5.884-9.102,7.312c-0.992,0.005-0.25-2.016,0.34-2.362l1.852-0.41c0.564-0.218,0.785-0.842,0.902-1.347 c2.133-0.727,4.91-4.129,6.031-6.194c1.748-0.7,4.443-0.679,5.734-2.293c1.176-1.468,0.393-3.992,1.215-6.557 c0.24-0.754,0.574-1.581,1.008-2.293c-0.611,0.011-1.348-0.061-1.959-0.608c-1.391-1.245-0.785-2.086-1.297-3.313 c1.684,0.744,2.5,2.584,4.426,2.586C-8.46,3.012-8.255,2.901-8.04,2.824c6.031-1.952,15.182-0.165,19.498-3.937 c1.15-3.933-1.24-9.846-1.229-9.938c0.008-0.062-1.314-0.004-1.803-0.258c-1.119-0.771-6.531-3.75-0.17-3.33 c0.314-0.045,0.943,0.259,1.439,0.435c-0.289-1.694-0.92-0.144-3.311-1.946c0,0-1.1-0.855-1.764-1.98 c-0.836-1.09-2.01-2.825-2.992-4.031c-1.523-2.476,1.367,0.709,1.816,1.108c1.768,1.704,1.844,3.281,3.232,3.983 c0.195,0.203,1.453,0.164,0.926-0.468c-0.525-0.632-1.367-1.278-1.775-2.341c-0.293-0.703-1.311-2.326-1.566-2.711 c-0.256-0.384-0.959-1.718-1.67-2.351c-1.047-1.187-0.268-0.902,0.521-0.07c0.789,0.834,1.537,1.821,1.672,2.023 c0.135,0.203,1.584,2.521,1.725,2.387c0.102-0.259-0.035-0.428-0.158-0.852c-0.125-0.423-0.912-2.032-0.961-2.083 c-0.357-0.852-0.566-1.908-0.598-3.333c0.4-2.375,0.648-2.486,0.549-0.705c0.014,1.143,0.031,2.215,0.602,3.247 c0.807,1.496,1.764,4.064,1.836,4.474c0.561,3.176,2.904,1.749,2.281-0.126c-0.068-0.446-0.109-2.014-0.287-2.862 c-0.18-0.849-0.219-1.688-0.113-3.056c0.066-1.389,0.232-2.055,0.277-2.299c0.285-1.023,0.4-1.088,0.408,0.135 c-0.059,0.399-0.131,1.687-0.125,2.655c0.064,0.642-0.043,1.768,0.172,2.486c0.654,1.928-0.027,3.496,1,3.514 c1.805-0.424,2.428-1.218,2.428-2.346c-0.086-0.704-0.121-0.843-0.031-1.193c0.221-0.568,0.359-0.67,0.312-0.076 c-0.055,0.287,0.031,0.533,0.082,0.794c0.264,1.197,0.912,0.114,1.283-0.782c0.15-0.238,0.539-2.154,0.545-2.522 c-0.023-0.617,0.285-0.645,0.309,0.01c0.064,0.422-0.248,2.646-0.205,2.334c-0.338,1.24-1.105,3.402-3.379,4.712 c-0.389,0.12-1.186,1.286-3.328,2.178c0,0,1.729,0.321,3.156,0.246c1.102-0.19,3.707-0.027,4.654,0.269 c1.752,0.494,1.531-0.053,4.084,0.164c2.26-0.4,2.154,2.391-1.496,3.68c-2.549,1.405-3.107,1.475-2.293,2.984 c3.484,7.906,2.865,13.183,2.193,16.466c2.41,0.271,5.732-0.62,7.301,0.725c0.506,0.333,0.648,1.866-0.457,2.86 c-4.105,2.745-9.283,7.022-13.904,7.662c-0.977-0.194,0.156-2.025,0.803-2.247l1.898-0.03c0.596-0.101,0.936-0.669,1.152-1.139 c3.16-0.404,5.045-3.775,8.246-4.818c-4.035-0.718-9.588,3.981-12.162,1.051c-5.043,1.423-11.449,1.84-15.895,1.111 c-3.105,2.687-7.934,4.021-12.115,5.866c-3.271,3.511-5.188,8.086-9.967,10.414c-0.986,0.119-0.48-1.974,0.066-2.385l1.795-0.618 C-22.995,25.682-22.849,25.035-22.788,24.521z",
    plane:
      "path://M1.112,32.559l2.998,1.205l-2.882,2.268l-2.215-0.012L1.112,32.559z M37.803,23.96 c0.158-0.838,0.5-1.509,0.961-1.904c-0.096-0.037-0.205-0.071-0.344-0.071c-0.777-0.005-2.068-0.009-3.047-0.009 c-0.633,0-1.217,0.066-1.754,0.18l2.199,1.804H37.803z M39.738,23.036c-0.111,0-0.377,0.325-0.537,0.924h1.076 C40.115,23.361,39.854,23.036,39.738,23.036z M39.934,39.867c-0.166,0-0.674,0.705-0.674,1.986s0.506,1.986,0.674,1.986 s0.672-0.705,0.672-1.986S40.102,39.867,39.934,39.867z M38.963,38.889c-0.098-0.038-0.209-0.07-0.348-0.073 c-0.082,0-0.174,0-0.268-0.001l-7.127,4.671c0.879,0.821,2.42,1.417,4.348,1.417c0.979,0,2.27-0.006,3.047-0.01 c0.139,0,0.25-0.034,0.348-0.072c-0.646-0.555-1.07-1.643-1.07-2.967C37.891,40.529,38.316,39.441,38.963,38.889z M32.713,23.96 l-12.37-10.116l-4.693-0.004c0,0,4,8.222,4.827,10.121H32.713z M59.311,32.374c-0.248,2.104-5.305,3.172-8.018,3.172H39.629 l-25.325,16.61L9.607,52.16c0,0,6.687-8.479,7.95-10.207c1.17-1.6,3.019-3.699,3.027-6.407h-2.138 c-5.839,0-13.816-3.789-18.472-5.583c-2.818-1.085-2.396-4.04-0.031-4.04h0.039l-3.299-11.371h3.617c0,0,4.352,5.696,5.846,7.5 c2,2.416,4.503,3.678,8.228,3.87h30.727c2.17,0,4.311,0.417,6.252,1.046c3.49,1.175,5.863,2.7,7.199,4.027 C59.145,31.584,59.352,32.025,59.311,32.374z M22.069,30.408c0-0.815-0.661-1.475-1.469-1.475c-0.812,0-1.471,0.66-1.471,1.475 s0.658,1.475,1.471,1.475C21.408,31.883,22.069,31.224,22.069,30.408z M27.06,30.408c0-0.815-0.656-1.478-1.466-1.478 c-0.812,0-1.471,0.662-1.471,1.478s0.658,1.477,1.471,1.477C26.404,31.885,27.06,31.224,27.06,30.408z M32.055,30.408 c0-0.815-0.66-1.475-1.469-1.475c-0.808,0-1.466,0.66-1.466,1.475s0.658,1.475,1.466,1.475 C31.398,31.883,32.055,31.224,32.055,30.408z M37.049,30.408c0-0.815-0.658-1.478-1.467-1.478c-0.812,0-1.469,0.662-1.469,1.478 s0.656,1.477,1.469,1.477C36.389,31.885,37.049,31.224,37.049,30.408z M42.039,30.408c0-0.815-0.656-1.478-1.465-1.478 c-0.811,0-1.469,0.662-1.469,1.478s0.658,1.477,1.469,1.477C41.383,31.885,42.039,31.224,42.039,30.408z M55.479,30.565 c-0.701-0.436-1.568-0.896-2.627-1.347c-0.613,0.289-1.551,0.476-2.73,0.476c-1.527,0-1.639,2.263,0.164,2.316 C52.389,32.074,54.627,31.373,55.479,30.565z",
    rocket:
      "path://M-244.396,44.399c0,0,0.47-2.931-2.427-6.512c2.819-8.221,3.21-15.709,3.21-15.709s5.795,1.383,5.795,7.325C-237.818,39.679-244.396,44.399-244.396,44.399z M-260.371,40.827c0,0-3.881-12.946-3.881-18.319c0-2.416,0.262-4.566,0.669-6.517h17.684c0.411,1.952,0.675,4.104,0.675,6.519c0,5.291-3.87,18.317-3.87,18.317H-260.371z M-254.745,18.951c-1.99,0-3.603,1.676-3.603,3.744c0,2.068,1.612,3.744,3.603,3.744c1.988,0,3.602-1.676,3.602-3.744S-252.757,18.951-254.745,18.951z M-255.521,2.228v-5.098h1.402v4.969c1.603,1.213,5.941,5.069,7.901,12.5h-17.05C-261.373,7.373-257.245,3.558-255.521,2.228zM-265.07,44.399c0,0-6.577-4.721-6.577-14.896c0-5.942,5.794-7.325,5.794-7.325s0.393,7.488,3.211,15.708C-265.539,41.469-265.07,44.399-265.07,44.399z M-252.36,45.15l-1.176-1.22L-254.789,48l-1.487-4.069l-1.019,2.116l-1.488-3.826h8.067L-252.36,45.15z",
    train:
      "path://M67.335,33.596L67.335,33.596c-0.002-1.39-1.153-3.183-3.328-4.218h-9.096v-2.07h5.371 c-4.939-2.07-11.199-4.141-14.89-4.141H19.72v12.421v5.176h38.373c4.033,0,8.457-1.035,9.142-5.176h-0.027 c0.076-0.367,0.129-0.751,0.129-1.165L67.335,33.596L67.335,33.596z M27.999,30.413h-3.105v-4.141h3.105V30.413z M35.245,30.413 h-3.104v-4.141h3.104V30.413z M42.491,30.413h-3.104v-4.141h3.104V30.413z M49.736,30.413h-3.104v-4.141h3.104V30.413z  M14.544,40.764c1.143,0,2.07-0.927,2.07-2.07V35.59V25.237c0-1.145-0.928-2.07-2.07-2.07H-9.265c-1.143,0-2.068,0.926-2.068,2.07 v10.351v3.105c0,1.144,0.926,2.07,2.068,2.07H14.544L14.544,40.764z M8.333,26.272h3.105v4.141H8.333V26.272z M1.087,26.272h3.105 v4.141H1.087V26.272z M-6.159,26.272h3.105v4.141h-3.105V26.272z M-9.265,41.798h69.352v1.035H-9.265V41.798z",
  };
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none",
      },
      formatter: function (params: any) {
        return params[0].name + ": " + params[0].value;
      },
    },
    xAxis: {
      data: ["百度", "直接访问", "梯子", "谷歌浏览器"],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#0000ff",
      },
    },
    yAxis: {
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
    },
    color: ["#0000ff"],
    series: [
      {
        name: "hill",
        type: "pictorialBar",
        barCategoryGap: "-130%",
        symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
        itemStyle: {
          opacity: 0.5,
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        data: [123, 60, 25, 80],
        z: 10,
      },
      {
        name: "glyph",
        type: "pictorialBar",
        barGap: "-100%",
        symbolPosition: "end",
        symbolSize: 50,
        symbolOffset: [0, "-120%"],
        data: [
          {
            value: 123,
            symbol: pathSymbols.reindeer,
            symbolSize: [60, 60],
          },
          {
            value: 60,
            symbol: pathSymbols.rocket,
            symbolSize: [50, 60],
          },
          {
            value: 25,
            symbol: pathSymbols.plane,
            symbolSize: [65, 35],
          },
          {
            value: 80,
            symbol: pathSymbols.train,
            symbolSize: [50, 30],
          },
        ],
      },
    ],
  };
  UserSourceChart.setOption(option);
  echartsControls.push(UserSourceChart);
};

// 最新注册用户列表
const newUserList = ref([
  {
    userId: 1,
    avatar: "http://localhost:4089/uploads/images/1703151708763.png",
    nickname: "张三",
    email: "1374144742@qq.com",
    createdAt: "2023-12-09 15:45:43",
  },
  {
    userId: 2,
    avatar: "http://localhost:4089/uploads/images/1703151708763.png",
    nickname: "张三",
    email: "1374144742@qq.com",
    createdAt: "2023-12-09 15:45:43",
  },
  {
    userId: 3,
    avatar: "http://localhost:4089/uploads/images/1703151708763.png",
    nickname: "张三",
    email: "1374144742@qq.com",
    createdAt: "2023-12-09 15:45:43",
  },
  {
    userId: 4,
    avatar: "http://localhost:4089/uploads/images/1703151708763.png",
    nickname: "张三",
    email: "1374144742@qq.com",
    createdAt: "2023-12-09 15:45:43",
  },
]);

// 控制是否加载更多状态
const loading = ref(false);

// 数据加载完毕
const noMore = computed(() => newUserList.value.length >= 10);

// 是否禁用无限滚动
const disabled = computed(() => loading.value || noMore.value);

// 加载更多
const load = () => {
  console.log("加载更多");
  loading.value = true;
  setTimeout(() => {
    newUserList.value = newUserList.value.concat([
      {
        userId: 5,
        avatar: "http://localhost:4089/uploads/images/1703151708763.png",
        nickname: "张三",
        email: "1374144742@qq.com",
        createdAt: "2023-12-09 15:45:43",
      },
      {
        userId: 6,
        avatar: "http://localhost:4089/uploads/images/1703151708763.png",
        nickname: "张三",
        email: "1374144742@qq.com",
        createdAt: "2023-12-09 15:45:43",
      },
    ]);
    loading.value = false;
  }, 2000);
};

// 当页面结构发生变化时重新加载echarts表
const echartsResize = () => {
  nextTick(() => {
    for (const key in echartsControls) {
      echartsControls[key].resize();
    }
  });
};

onActivated(() => {
  echartsResize();
});

onMounted(() => {
  startWork();
  getBlogInfoListAPI();
  initUserGrowthEcharts();
  initUserSourceChart();
  useEventListener(window, "resize", echartsResize);
});

onBeforeUnmount(() => {
  clearInterval(workTimer);
});
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="24" :lg="18">
        <div class="welcome suspension">
          <img
            style="height: 100px"
            src="../../assets/imgs/welcome.png"
            alt=""
          />
          <div class="ml20 welcome-text fz20 text-main">
            <div class="welcome-title fw700">
              {{ userInfo.LoginInfo.nickname }},{{ timeState }},欢迎到来!
            </div>
            <div class="welcome-note fz14">{{ welcomeNote }}</div>
          </div>
        </div>
      </el-col>
      <el-col :lg="6">
        <div class="flex column center working">
          <img class="work-coffee" src="../../assets/imgs/coffee.png" alt="" />
          <div class="working-text text-seconed">
            您今天已经工作了<span class="time">{{
              state.workingTimeFormat
            }}</span>
          </div>
          <div @click="onChangeWorkState()" class="working-opt working-rest">
            {{ state.pauseWork ? "继续工作" : "休息片刻" }}
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="mt20">
      <el-row :gutter="20">
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 suspension">
            <div class="fz16 fw700">访问总数</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #8595f4">&#xe634;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="total_number"
                  >{{ BlogInfoList.visitorCount }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{
                  BlogInfoList.todayVisitor
                }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 fw700">用户注册总数</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #ad85f4">&#xe8ca;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="total_register"
                  >{{ BlogInfoList.registerCount }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{
                  BlogInfoList.registerToday
                }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 fw700">文章留言数</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #74a8b5">&#xe8c5;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="article_message"
                  >{{ BlogInfoList.articleCount }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{
                  BlogInfoList.articleToday
                }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 fw700">留言板留言</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #f48595">&#xe608;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="message_board"
                  >{{ BlogInfoList.boardCount }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{ BlogInfoList.boardToday }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="growth-echarts">
      <el-row :gutter="20">
        <el-col class="mb20" :xs="24" :sm="24" :md="12" :lg="9">
          <el-card shadow="hover" header="用户增长情况">
            <div class="userInfo-echarts" :ref="refs.set"></div>
          </el-card>
        </el-col>
        <el-col class="mb20" :xs="24" :sm="24" :md="12" :lg="9">
          <el-card shadow="hover" header="用户访问方式">
            <div class="userInfo-echarts" :ref="refs.set"></div>
          </el-card>
        </el-col>
        <el-col
          class="mb20 new-register-list"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="6"
        >
          <el-card shadow="hover" header="最新注册用户">
            <div class="infinite-list-wrapper por">
              <ul
                v-infinite-scroll="load"
                class="list"
                style="overflow: auto"
                :infinite-scroll-disabled="disabled"
              >
                <li
                  v-for="item in newUserList"
                  :key="item.userId"
                  class="list-item"
                >
                  <div class="new-user-avatar">
                    <img class="avatar" :src="item.avatar" alt="" />
                  </div>
                  <div class="new-user-base">
                    <div class="new-user-name">{{ item.nickname }}</div>
                    <div class="new-user-time">{{ item.createdAt }}</div>
                  </div>
                  <i class="iconfont fz14 new-user-arrow">&#xe775;</i>
                </li>
              </ul>
              <div class="fz12 load-more" v-if="loading">Loading...</div>
              <div class="fz12 load-more" v-if="noMore">No more</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome {
  background: $seconed;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 15px 20px !important;
  box-shadow: 0 0 30px #523f690d;
  height: 130px;
}
.working {
  position: relative;
  height: 130px;
  padding: 15px 20px !important;
  .working-opt {
    position: absolute;
    top: -40px;
    right: 10px;
    background-color: $primary;
    padding: 10px 20px;
    border-radius: 20px;
    color: $main;
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0;
    font-size: 12px;
    z-index: 999;
  }
  .work-coffee {
    width: 80px;
    transition: all 0.3s ease;
  }
  &:hover {
    .work-coffee {
      transform: translateY(-4px) scale(1.02);
    }
    .working-opt {
      opacity: 1;
      top: 0;
    }
  }
}
.panel {
  background-color: #fff;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 4px;
}
.userInfo-echarts {
  height: 370px;
  width: 100%;
}
.infinite-list-wrapper {
  height: 410px;
  background-color: #f9f7f9;
  padding-bottom: 20px;
}
.new-register-list {
  :deep(.el-card__body) {
    padding: 0px;
  }
}
.list {
  height: 380px;
  .list-item {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 10px 15px;
    box-shadow: 0 0 30px #523f690d;
    background-color: #ffffff;
    .new-user-avatar {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      overflow: hidden;
      .avatar {
        height: 48px;
        object-fit: cover;
      }
    }
    .new-user-base {
      margin-left: 10px;
      color: #2c3f5d;
      .new-user-name {
        font-size: 15px;
      }
      .new-user-time {
        font-size: 13px;
      }
    }
    .new-user-arrow {
      margin-left: auto;
    }
  }
}
.load-more {
  height: 30px;
  text-align: center;
  line-height: 30px;
}
:deep(.el-card__header) {
  color: $primary;
  font-weight: 700;
}
</style>
