<script lang="ts" setup>
import "@/styles/index.scss";
import { ref, reactive, onMounted, nextTick } from "vue";
import { useUserStore } from "@/store/user.ts";
import storage from "@/utils/storage";
import { CountUp } from "countup.js";
const userInfo = useUserStore();
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

onMounted(() => {
  startWork();
  initCountUp();
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
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 text-main fw700">访问总数</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #8595f4">&#xe634;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="total_number"
                  >1234</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">24</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 text-main fw700">用户注册总数</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #ad85f4">&#xe8ca;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="total_register"
                  >42</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">12</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 text-main fw700">文章留言数</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #74a8b5">&#xe8c5;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="article_message"
                  >217</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">8</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="panel mb20 bg-seconed suspension">
            <div class="fz16 text-main fw700">留言板留言</div>
            <div class="flex between mt20">
              <div>
                <i class="iconfont fz24" style="color: #f48595">&#xe608;</i>
                <span
                  class="fw700 text-primary ml10"
                  style="font-size: 30px"
                  id="message_board"
                  >513</span
                >
              </div>
              <div class="add_number fz16 fw700">
                今日新增
                <span class="text-primary">31</span>
              </div>
            </div>
          </div>
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
  background-color: $seconed;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 4px;
}
</style>
