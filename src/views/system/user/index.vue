<script lang="ts" setup>
import {
  getUserList,
  resetUserPassword,
  userIsEnable,
  getUserOptLogs,
} from "@/api/user.ts";
import { userOptLogsDataType } from "@/types/userInfo";
import { ref, watch, Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme";
import "@/styles/index.scss";
import dayjs from "dayjs";
import { WNotification } from "@/utils/toast";
const theme = themeSetting();
// 获取用户列表参数
const getUserListParams = ref({
  pageNum: 1,
  pageSize: 10,
  email: "",
  nickname: "",
});

// 用户列表
const userList = ref([]);

// 用户总数
const total = ref();

// 获取用户列表
const getUserListAPI = async () => {
  const res = await getUserList(getUserListParams.value);
  userList.value = res.data.data.data;
  total.value = res.data.data.count;
  console.log(userList.value);
};
// 清除查询条件
const cancleSearch = () => {
  getUserListParams.value = {
    pageNum: 1,
    pageSize: 10,
    email: "",
    nickname: "",
  };
  getUserListAPI();
};

// 重置密码
const resetPassword = async (id: string) => {
  const res = await resetUserPassword({ userId: id });
  if (res.data.status) {
    WNotification.success(res.data.message);
  }
};

// 加载状态id
const loadingStatus = ref();

// 用户状态改变
const userStatusChange = async (scope: any) => {
  loadingStatus.value = scope.row.userId;
  try {
    const res = await userIsEnable({
      userId: scope.row.userId,
      status: scope.row.status,
    });
    if (res.data.status) {
      setTimeout(() => {
        WNotification.success(res.data.message);
        loadingStatus.value = "";
      }, 1000);
    }
  } catch (err) {
    let objKey;
    objKey = scope.row.status === 1 ? 0 : 1;
    (userList.value as any)[scope.$index].status = objKey;
    loadingStatus.value = "";
  }
};

const userOptLogsData: Ref<userOptLogsDataType> = ref({
  params: {
    pageSize: 5,
    pageNum: 1,
    userId: "",
  },
  username: "",
  // 用户操作总数
  userOptlogsTotal: null,
  // 用户操作列表
  userOptLogsList: [],
});

// 是否打开用户操作弹层
const isOpenUserOptLogs = ref(false);

const getUserOptLogsAPI = async () => {
  const res = await getUserOptLogs(userOptLogsData.value.params);
  userOptLogsData.value.userOptLogsList = res.data.data.data;
  userOptLogsData.value.userOptlogsTotal = res.data.data.count;
};

// 查看用户操作记录
const openUserOptLogsDialog = (id: string, nickname: string) => {
  isOpenUserOptLogs.value = true;
  userOptLogsData.value.params.userId = id;
  userOptLogsData.value.username = nickname;
  getUserOptLogsAPI();
};

// 关闭操作记录弹层
const closeOptlogsDialog = () => {
  isOpenUserOptLogs.value = false;
  userOptLogsData.value.params = {
    pageSize: 5,
    pageNum: 1,
    userId: "",
  };
  userOptLogsData.value.userOptLogsList = [];
  userOptLogsData.value.userOptlogsTotal = null;
  userOptLogsData.value.username = "";
};

watch(
  () => getUserListParams.value.pageNum,
  () => {
    getUserListAPI();
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="user-list-box">
    <el-card shadow="hover">
      <el-scrollbar>
        <div class="flex start pb5">
          <div class="shrink0">
            <el-input
              class="w-50 m-2"
              placeholder="请输入用户昵称"
              :prefix-icon="Search"
              v-model="getUserListParams.nickname"
            />
          </div>
          <div class="shrink0 ml10">
            <el-input
              class="w-50 m-2"
              placeholder="请输入用户邮箱"
              :prefix-icon="Search"
              v-model="getUserListParams.email"
            />
          </div>
          <div class="shrink0 ml10">
            <el-button
              :style="{
                color: theme.theme.list[theme.themeIndex].text,
              }"
              :color="theme.theme.list[theme.themeIndex].primary"
              @click="getUserListAPI"
              >查询</el-button
            >
          </div>
          <div class="shrink0 cancle-btn ml10">
            <el-button @click="cancleSearch">重置</el-button>
          </div>
        </div>
      </el-scrollbar>
      <div class="user-list mt10">
        <el-table
          height="710"
          border
          :data="userList"
          style="width: 100%"
          :header-cell-style="{
            color: `${theme.theme.list[theme.themeIndex].text}`,
            background: `${theme.theme.list[theme.themeIndex].primary}`,
            height: '60px',
          }"
          :row-style="{ height: '30px' }"
        >
          <template #empty>
            <img
              style="width: 400px; height: 400px"
              src="../../../assets/imgs/empty.png"
              fit="cover"
            />
          </template>
          <el-table-column
            align="center"
            min-width="200"
            prop="avatar"
            label="用户头像"
          >
            <template #default="scope">
              <div class="flex jcenter">
                <div class="w48 h48 bdrs hidden">
                  <el-image
                    class="pointer"
                    fit="cover"
                    :hide-on-click-modal="true"
                    :src="scope.row.avatar"
                    :initial-index="0"
                    :min-scale="2"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            align="center"
            prop="role"
            label="用户角色"
          >
            <template #default="{ row }">
              <el-tag
                :type="
                  row.roleInfo.roleName === '超级管理员' ? 'primary' : 'info'
                "
                >{{ row.roleInfo.roleName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            align="center"
            prop="nickname"
            label="用户昵称"
          />
          <el-table-column
            min-width="200"
            align="center"
            prop="email"
            label="用户邮箱"
          />
          <el-table-column
            min-width="200"
            align="center"
            prop="status"
            label="账号状态"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                class="ml-2"
                inline-prompt
                :loading="scope.row.userId === loadingStatus"
                @change="userStatusChange(scope)"
                :active-value="1"
                :inactive-value="0"
                :active-color="theme.theme.list[theme.themeIndex].primary"
                :inactive-color="theme.theme.list[theme.themeIndex].bg"
                active-text="启用"
                inactive-text="禁用"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            align="center"
            prop="remark"
            label="备注"
          />
          <el-table-column
            min-width="200"
            align="center"
            prop="createdAt"
            label="创建时间"
          >
            <template #default="{ row }">
              {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            prop="action"
            fixed="right"
            label="操作"
            min-width="200"
            align="center"
          >
            <template #default="{ row }">
              <el-popconfirm
                @confirm="resetPassword(row.userId)"
                title="请确认是否重置密码?"
                confirm-button-text="确认"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button auto-insert-space type="warning" link
                    >重置密码</el-button
                  >
                </template>
              </el-popconfirm>
              <el-button
                @click="openUserOptLogsDialog(row.userId, row.nickname)"
                auto-insert-space
                type="success"
                link
                >用户操作</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex end mt10">
        <el-pagination
          small
          background
          layout="prev, pager, next"
          v-model:page-size="getUserListParams.pageSize"
          v-model:current-page="getUserListParams.pageNum"
          :total="parseInt(total)"
          class="mt-4"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="isOpenUserOptLogs"
      width="800"
      :title="userOptLogsData.username + '的操作日志记录'"
      @close="closeOptlogsDialog"
    >
      <div
        class="flex jcenter"
        v-if="userOptLogsData.userOptLogsList.length === 0"
      >
        <img
          style="width: 400px; height: 400px"
          src="../../../assets/imgs/empty.png"
          fit="cover"
        />
      </div>
      <el-timeline v-else>
        <el-timeline-item
          v-for="(activity, index) in userOptLogsData.userOptLogsList"
          placement="top"
          :key="index"
          :timestamp="`${dayjs(activity.createdAt).format(
            'YYYY-MM-DD HH:mm:ss'
          )}`"
        >
          <el-card>
            <div class="flex">
              <div class="mr20 w50">
                <span class="mr5">内容:</span
                ><span>{{ activity.content }}</span>
              </div>
              <div>
                <span class="mr5 w50">模块:</span
                ><span>{{ activity.module }}</span>
              </div>
            </div>
            <div class="flex">
              <div class="mr20 w50">
                <span class="mr5">地址:</span
                ><span>{{ activity.address }}</span>
              </div>
              <div>
                <span class="mr5 w50">平台:</span
                ><span>{{ activity.platform }}</span>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div class="flex end mt10">
        <el-pagination
          small
          background
          hide-on-single-page
          layout="prev, pager, next"
          v-model:page-size="userOptLogsData.params.pageSize"
          v-model:current-page="userOptLogsData.params.pageNum"
          :total="userOptLogsData.userOptlogsTotal"
          @change="getUserOptLogsAPI"
          class="mt-4"
        />
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-list {
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
:deep(.el-pager li:hover) {
  color: $primary;
}
:deep(.el-timeline) {
  --el-timeline-node-color: rgba(0, 0, 0, 0.2);
}
</style>
