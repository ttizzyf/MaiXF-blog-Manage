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
import {
  getBlogInfoList,
  getWeekVistorAndRegister,
  getvisitorBrowserType,
  getNewRegisiterList,
} from "api/home.ts";
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
const BlogInfoList: Ref<browsing> | Ref = ref([]);
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
const initUserGrowthEcharts = async () => {
  const res = await getWeekVistorAndRegister();
  let data = res.data.data;
  console.log(data);
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
      data: data.days,
    },
    tooltip: {
      trigger: "axis",
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
        data: data.visitor,
        type: "line",
        smooth: true,
        areaStyle: {
          color: "#8595F4",
        },
      },
      {
        name: "注册量",
        data: data.register,
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
const initUserSourceChart = async () => {
  const res = await getvisitorBrowserType();
  let platformTypes = res.data.data;
  let platforms: string[] = [];
  let nums: Number[] = [];
  platformTypes.forEach((el: { platform: string; platformCount: Number }) => {
    platforms.push(el.platform);
    nums.push(el.platformCount);
  });
  const UserSourceChart = echarts.init(refs.value[1] as HTMLElement);

  const pathSymbols = {
    Chrome:
      "path://M516.224 981.333333l192-332.8a238.933333 238.933333 0 0 0-25.6-307.2h268.8a470.528 470.528 0 0 1-264.533333 610.133334 573.525333 573.525333 0 0 1-170.666667 29.866666z m-72.533333-4.266666a467.925333 467.925333 0 0 1-392.533334-533.333334 410.837333 410.837333 0 0 1 55.466667-157.866666l192 332.8a239.786667 239.786667 0 0 0 281.6 128l-136.533333 230.4z m68.266666-294.4a170.666667 170.666667 0 1 1 170.666667-170.666667 173.994667 173.994667 0 0 1-170.666667 170.666667z m-234.666666-230.4l-132.266667-234.666667a465.066667 465.066667 0 0 1 768 51.2h-405.333333a259.968 259.968 0 0 0-230.4 183.466667z",
    fireFox:
      "path://M399.4 986.566l20.958 14.075c-108.241-23.302-198.559-78.888-275.044-156.985C67.536 764.237 27.67 666.395 12.735 556.179L2.361 587.796c0.167-51.043-1.211-102.031 9.89-152.847-4.084 6.158-8.167 12.32-12.251 18.48 17.923-73.23 35.333-146.416 92.304-201.764 45.179-43.892 98.278-63.538 161.084-55.842 3.47 0.425 6.896 1.271 10.311 2.06 1.658 0.382 3.242 1.085 5.185 1.755l-7.744 45.42c39.717-59.147 84.97-103.519 160.61-98.907-2.245 2.394-4.415 4.861-6.746 7.166-33.178 32.819-56.846 70.812-67.132 117.04-11.12 49.977 1.704 93.613 31.203 133.864 15.188 20.727 9.97 43.565 7.274 66.005a2094.32 2094.32 0 0 0-3.313 1.752c-3.047-3.765-5.72-7.923-9.196-11.239-53.975-51.51-133.616-36.249-163.923 32.196-23.754 53.647-11.504 102.833 22.406 148.209 4.185 5.602 9.085 10.666 15.377 14.804-1.805-2.364-3.598-4.739-5.417-7.093-29.986-38.797-43.755-81.598-30.054-130.202 11.487-40.753 49.569-71.662 86.609-71.896 15.288-0.099 28.135 3.975 40.925 12.798-32.057 36.593-34.148 80.855-29.873 125.51 4.18 43.645 25.684 78.905 60.962 105.396 2.803 2.105 6.221 3.814 8.18 6.55 12.53 17.48 30.839 22.773 50.792 26.345 18.224 3.263 36.074 8.647 54.032 13.321 2.558 0.667 4.788 2.591 9.393 5.186h-33.706c9.563 11.29 22.138 15.768 35.239 19.161 30.228 7.83 60.054 2.579 89.751-3.254 17.734-3.484 35.268-7.982 54.035-12.289l-4.102 14.087c14.35-7.193 25.33-16.033 34.152-27.86 3.965-5.315 8.057-10.724 13.008-15.041 2.982-2.599 7.729-3.18 11.701-4.673 0.965 5.999 1.621 10.079 2.275 14.159 4.457-1.557 9.564-2.195 13.264-4.821 26.01-18.451 41.672-44.669 51.121-74.189 9.258-28.928 15.98-58.667 24.307-89.896 3.984 7.74 8.014 15.57 13.105 25.468 3.961-22.339 10.34-43.531 10.865-64.872 0.742-30.006-2.695-60.128-4.688-90.181-0.879-13.253-2.596-26.45-4.168-41.973 19.729 11.187 32.006 26.298 42.764 43.81 0.541-45.359 0.217-91.214-18.629-133.178-18.713-41.678-44.443-79.57-80.137-109.681 18.217-3.938 40.719 6.123 86.227 37.612-16.805-29.527-37.828-56.032-62.818-78.849-24.686-22.539-51.287-42.977-77.064-65.868 27.838 11.114 55.947 21.605 83.43 33.537 22.717 9.864 42.279 24.704 60.178 41.965 33.049 31.869 67.289 62.575 93.998 100.722-1.486-2.926-2.836-5.928-4.48-8.764-22.393-38.654-51.145-72.24-83.76-102.421-9.193-8.508-12.365-17.059-9.24-30.839 22.793 16.815 45.109 32.586 62.59 55.675l3.211-9.103c79.887 69.995 104.33 158.951 94.088 260.732 1.123 0.239 2.248 0.476 3.369 0.713 5.322-11.799 10.645-23.598 16.896-37.466 3.771 20.564 8.064 39.687 10.672 59.033 6.779 50.281 4.324 99.446-18.965 146.03-8.619 17.238-15.447 35.366-23.547 52.878-4.113 8.896-5.496 17.185-3.025 27.202 7.467 30.248 3.299 59.198-12.785 86.237C931 808.42 889.73 850.922 834.965 879.683c-3.809 2-6.781 5.755-9.83 8.99-1.9 2.021-3.322 4.528-4.766 6.937-26.988 45.06-69.166 66.569-118.482 78.438-56.543 13.607-113.375 23.802-171.771 22.976-1.646-0.022-3.297 0.215-7.514 0.509 5.766 5.271 9.92 9.066 15.578 14.235-49.206 1.042-93.669-11.669-137.486-27.795l-1.294 2.593zM330.551 539.815c30.562 26.677 63.055 44.142 102.401 46.313 19.192 1.061 36.571-3.956 53.109-13.795 35.554-21.146 71.622-18.897 107.308-0.197 11.676 6.119 19.527 16.006 22.369 29.171 2.658 12.324-3.664 19.971-16.018 17.538-16.303-3.208-29.145 1.133-41.633 11.713-11.463 9.715-24.744 17.248-36.953 26.12-31.904 23.187-68.509 26.426-106.295 26.805-14.03 0.14-24.631-4.06-35.124-12.685-41.247-33.916-54.142-78.135-49.164-130.983zM163.19 174.818l-14.089-13.415c144.476-157.965 418.26-207.039 625.337-66.1-7.316-3.004-14.438-6.659-21.98-8.886-21.164-6.249-42.555-11.732-63.762-17.846-25.578-7.375-50.689-16.81-76.645-22.376C444.363 10.229 297.16 50.148 171.319 167.22c-2.307 2.148-4.607 4.306-8.129 7.598zM397.458 393.019c-27.626-35.266-40.626-75.436-26.984-123.71 15.395 17.05 34.979 15.945 54.21 16.513 18.903 0.559 37.863 0.798 56.667 2.562 13.473 1.265 16.823 6.157 15.696 19.729-1.61 19.407-8.152 35.25-27.542 44.831-24.368 12.04-47.613 26.35-72.047 40.075zM62.661 250.576c2.922-51.191 12.769-99.574 50.396-141.279 2.531 32.158 14.329 57.411 38.021 77.834-35.197 14.473-62.952 37.037-88.417 63.445z",
    Edge: "path://M240.185509 74.937259C322.180562 24.520301 415.37494-1.48813 509.969233 0.065776 845.948962 0.065776 1023.938224 247.646839 1023.938224 439.035292c-0.199988 65.396055-25.998431 127.79229-71.795669 174.389479-45.797237 46.397201-107.993485 72.995596-173.389539 73.995536-150.390927 0-182.98896-46.197213-182.98896-63.996139 0-7.599542 2.399855-12.399252 9.599421-18.798866l1.99988-2.399855 0.799951-3.199807c20.998733-22.998612 31.798082-52.396839 31.798082-83.194981 0-157.390504-164.390082-285.382782-367.977799-285.382782-75.075471-0.599964-149.071006 17.798926-215.027027 53.796754 53.996742-115.03306 165.430019-195.188224 182.628981-207.627473 1.599903-1.099934 0.599964-1.679899 0.599964-1.679899z m31.198118 636.081624c-2.799831 59.99638 9.199445 119.992761 32.798021 174.389479 27.198359 52.796815 65.396055 101.993847 112.993183 138.591638-118.992821-22.998612-222.966548-87.794703-298.781974-178.589225C42.237452 752.616373 0 636.823359 0 515.830659c0-102.393822 124.792471-188.78861 271.983591-188.78861 73.195584-1.199928 144.791264 21.798685 203.587717 65.396054l-7.199566 2.399856c-102.993786 35.197876-196.988115 181.389056-196.988115 316.180924zM939.543315 800.013514l-1.399915 0.199987c-23.598576 37.597732-51.796875 70.195765-84.394908 98.994028-61.596284 55.996622-136.191783 90.99451-217.586873 99.793979-37.197756 0.599964-73.59556-6.399614-107.593509-22.798624-51.196911-20.598757-94.194317-59.99638-123.192567-105.993605-28.798263-47.797116-42.197454-103.393762-37.997708-159.190396-1.199928-40.197575 10.799348-80.595138 29.99819-116.392978 27.798323 66.196006 74.995475 122.592604 135.191844 161.590251 60.196368 38.997647 130.992097 58.996441 202.787766 57.196549 61.99626 0.599964 124.192507-13.399192 180.389116-40.997526l3.799771-1.799892c7.799529-4.599722 15.399071-7.799529 23.1986 0 8.999457 9.799409 3.599783 18.39889-2.399855 27.998311-0.399976 0.399976-0.599964 0.99994-0.799952 1.399916z",
    IE: "path://M734.207501 628.8291l236.062911 0c1.823992-16.383924 2.559988-33.087847 2.559988-50.207768 0-80.22363-21.535901-155.455283-59.135727-220.254984 38.879821-103.295524 37.503827-190.975119-14.559933-243.390877-49.503772-49.279773-182.303159-41.27981-332.414467 25.183884-11.103949-0.831996-22.303897-1.279994-33.631845-1.279994-206.04705 0-378.910252 141.791346-426.718032 332.862465C171.010098 388.990206 239.009785 328.990483 329.825366 285.310684c-8.255962 7.743964-56.44774 55.647743-64.575702 63.775706C25.730769 588.541285-49.820883 901.371842 31.490742 982.683467c61.791715 61.759715 173.759199 51.327763 302.366605-11.647946 59.807724 30.463859 127.487412 47.61578 199.231081 47.61578 193.119109 0 356.798354-124.319427 416.094081-297.438628L711.295606 721.212673c-32.735849 60.383721-96.735554 101.471532-170.207215 101.471532-73.471661 0-137.471366-41.08781-170.207215-101.471532-14.559933-27.263874-22.911894-58.55973-22.911894-91.647577l0-0.735997L734.207501 628.8291zM348.289281 512.797635c5.471975-97.119552 86.207602-174.591195 184.767148-174.591195 98.559545 0 179.327173 77.471643 184.767148 174.591195L348.289281 512.797635zM896.95875 163.807244c33.535845 33.887844 32.703849 96.223556 3.999982 174.015197-49.151773-74.911654-120.511444-133.951382-204.799055-167.647227C786.30326 131.551393 859.582922 126.431417 896.95875 163.807244zM93.474456 967.259539c-42.783803-42.783803-29.887862-132.607388 25.215884-240.830889 34.303842 96.255556 101.151533 177.087183 187.327136 229.150943C210.625916 998.875393 132.514276 1006.235359 93.474456 967.259539z",
    Other:
      "path://M87.36 368.27v-63h849V153.85a62.59 62.59 0 0 0-62.59-62.59H149.94a62.59 62.59 0 0 0-62.59 62.59v724.83a62.59 62.59 0 0 0 62.59 62.59h723.83a62.59 62.59 0 0 0 62.59-62.59V368.27zM480.9 163.38a52.16 52.16 0 1 1-52.16 52.16 52.16 52.16 0 0 1 52.16-52.16z m-135.2 0a52.16 52.16 0 1 1-52.16 52.16 52.16 52.16 0 0 1 52.16-52.16z m-135.2 0a52.16 52.16 0 1 1-52.16 52.16 52.16 52.16 0 0 1 52.15-52.16z",
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
      data: platforms,
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
        data: nums,
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
            value: nums[0],
            symbol: pathSymbols.Chrome,
            symbolSize: [40, 40],
          },
          {
            value: nums[1],
            symbol: pathSymbols.fireFox,
            symbolSize: [40, 40],
          },
          {
            value: nums[2],
            symbol: pathSymbols.Edge,
            symbolSize: [40, 40],
          },
          {
            value: nums[3],
            symbol: pathSymbols.IE,
            symbolSize: [40, 40],
          },
          {
            value: nums[4],
            symbol: pathSymbols.Other,
            symbolSize: [40, 40],
          },
        ],
      },
    ],
  };
  UserSourceChart.setOption(option);
  echartsControls.push(UserSourceChart);
};

// 请求最新用户参数
const NewUser = reactive({
  Params: {
    pageSize: 5,
    pageNum: 1,
  },
  pageTotal: 1,
});

// 最新注册用户列表
const newUserList: any = ref([]);

// 控制是否加载更多状态
const loading = ref(false);

// 数据加载完毕
const noMore = computed(() => newUserList.value.length >= NewUser.pageTotal);

// 是否禁用无限滚动
const disabled = computed(() => loading.value && noMore.value);

// 加载更多
const load = async () => {
  if (loading.value || noMore.value) {
    return;
  }
  loading.value = true;
  const res = await getNewRegisiterList(NewUser.Params);
  newUserList.value.push(...res.data.data.data);
  NewUser.pageTotal = res.data.data.count;
  NewUser.Params.pageNum++;
  console.log(newUserList.value.length);
  loading.value = false;
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
              {{ userInfo.LoginInfo?.nickname }},{{ timeState }},欢迎到来!
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
                  >{{ BlogInfoList[0] || 0 }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{ BlogInfoList[1] || 0 }}</span>
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
                  >{{ BlogInfoList[2] || 0 }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{ BlogInfoList[3] || 0 }}</span>
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
                  >{{ BlogInfoList[4] || 0 }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{ BlogInfoList[5] || 0 }}</span>
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
                  >{{ BlogInfoList[6] || 0 }}</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">{{ BlogInfoList[7] || 0 }}</span>
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
                  class="list-item pointer"
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
              <div class="fz12 load-more" v-if="!noMore">No more</div>
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
