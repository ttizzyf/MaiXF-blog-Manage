<script lang="ts" setup>
import "@/styles/index.scss";
import { themeSetting } from "@/store/theme";
import { Search } from "@element-plus/icons-vue";
import { ref, watch, Ref } from "vue";
import { getOptlogsList, delOptlogsList } from "@/api/operate.ts";
import { userOptlogsItem } from "@/types/userOpt.ts";
import dayjs from "dayjs";
import { WNotification } from "@/utils/toast";

const theme = themeSetting();

const getUserOptlogsData = ref({
  params: {
    pageNum: 1,
    pageSize: 10,
    nickname: "",
    module: "",
    platform: "",
    operatorIP: "",
  },
  optlogsList: [],
  total: "",
});
// 获取操作列表
const getOptlogsListAPI = async () => {
  const res = await getOptlogsList(getUserOptlogsData.value.params);
  getUserOptlogsData.value.optlogsList = res.data.data.data;
  getUserOptlogsData.value.total = res.data.data.count;
  console.log(getUserOptlogsData.value.optlogsList);
};

// 搜索
const searchOptlogsListAPI = () => {
  getUserOptlogsData.value.params.pageNum = 1;
  getOptlogsListAPI();
};

// 重置
const cancleOptlogs = () => {
  getUserOptlogsData.value.params = {
    pageNum: 1,
    pageSize: 10,
    nickname: "",
    module: "",
    platform: "",
    operatorIP: "",
  };
  getOptlogsListAPI();
};

// 替换数字中间四位为*保证安全性
const phoneNumberMask = (value: string) => {
  if (value && value.length > 5) {
    return (
      value.substr(0, 3) +
      "*".repeat(value.length - 5) +
      value.substr(value.length - 2)
    );
  } else {
    return value;
  }
};

// 删除元素数组
const deleteList: Ref<Array<userOptlogsItem>> = ref([]);

// 多选框变化
const handleSelectionChange = (val: Array<userOptlogsItem>) => {
  deleteList.value = val;
};

// 删除操作日志记录
const deleteListAPI = async () => {
  let deleteArr: Array<string> = [];
  deleteList.value.forEach((item) => {
    deleteArr.push(item.actionId);
  });
  const res = await delOptlogsList(deleteArr);
  if (res.data.status) {
    WNotification.success(res.data.message);
    let { pageNum, pageSize } = getUserOptlogsData.value.params;
    if (
      (pageNum - 1) * pageSize >=
      +getUserOptlogsData.value.total - deleteArr.length
    ) {
      // 当前为第一页时则不能再将页数减一
      if (pageNum !== 1) {
        getUserOptlogsData.value.params.pageNum--;
      }
    }
    await getOptlogsListAPI();
  }
};

// 控制详情弹窗打开
const isopenDetailsController = ref(false);

// 详情弹窗内容
const detailsData: Ref<userOptlogsItem> | Ref = ref({});

// 查看详情
const openDetails = (row: userOptlogsItem) => {
  isopenDetailsController.value = true;
  detailsData.value = row;
};

const closeDialog = () => {
  detailsData.value = {};
  isopenDetailsController.value = false;
};

// 删除操作日志按钮
const delOptlogs = (row: any) => {
  deleteList.value = [row];
  deleteListAPI();
};

watch(
  () => getUserOptlogsData.value.params.pageNum,
  () => {
    getOptlogsListAPI();
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="optlogs-list-box">
    <el-card shadow="hover">
      <el-scrollbar>
        <div class="flex between">
          <div class="flex shrink0">
            <div class="shrink0">
              <el-input
                class="w-50 m-2"
                placeholder="请输入用户昵称"
                :prefix-icon="Search"
                v-model="getUserOptlogsData.params.nickname"
              />
            </div>
            <div class="shrink0 ml10">
              <el-input
                class="w-50 m-2"
                placeholder="请输入用户操作模块"
                :prefix-icon="Search"
                v-model="getUserOptlogsData.params.module"
              />
            </div>
            <div class="shrink0 ml10">
              <el-input
                class="w-50 m-2"
                placeholder="请输入用户操作平台"
                :prefix-icon="Search"
                v-model="getUserOptlogsData.params.platform"
              />
            </div>
            <div class="shrink0 ml10">
              <el-input
                class="w-50 m-2"
                placeholder="请输入用户设备IP"
                :prefix-icon="Search"
                v-model="getUserOptlogsData.params.operatorIP"
              />
            </div>
            <div class="shrink0 ml10">
              <el-button
                :style="{
                  color: theme.theme.list[theme.themeIndex].text,
                }"
                :color="theme.theme.list[theme.themeIndex].primary"
                @click="searchOptlogsListAPI"
                >查询</el-button
              >
            </div>
            <div class="shrink0 cancle-btn ml10">
              <el-button @click="cancleOptlogs">重置</el-button>
            </div>
          </div>
          <el-button class="ml10" type="danger" round @click="deleteListAPI"
            >批量删除</el-button
          >
        </div>
      </el-scrollbar>
      <div class="optlogs-list mt10">
        <el-table
          height="710"
          border
          @selection-change="handleSelectionChange"
          :data="getUserOptlogsData.optlogsList"
          style="width: 100%"
          :header-cell-style="{
            color: `${theme.theme.list[theme.themeIndex].text}`,
            background: `${theme.theme.list[theme.themeIndex].primary}`,
            height: '60px',
          }"
          :row-style="{ height: '65px' }"
        >
          <template #empty>
            <img
              style="width: 400px; height: 400px"
              src="../../../../public/empty.png"
              fit="cover"
            />
          </template>
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column
            align="center"
            min-width="140"
            prop="createdAt"
            label="创建时间"
          >
            <template #default="{ row }">
              {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="operator" label="操作人" />
          <el-table-column align="center" prop="module" label="操作模块" />
          <el-table-column align="center" prop="platform" label="操作平台" />
          <el-table-column align="center" prop="platform" label="IP地址">
            <template #default="{ row }">
              {{ phoneNumberMask(row.operatorIP) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="address" label="设备位置" />
          <el-table-column
            align="center"
            min-width="200"
            prop="content"
            label="操作内容"
          />
          <el-table-column
            prop="action"
            fixed="right"
            label="操作"
            min-width="200"
            align="center"
          >
            <template #default="{ row }">
              <el-button
                @click="openDetails(row)"
                auto-insert-space
                type="success"
                link
                >查看详情</el-button
              >
              <el-button
                auto-insert-space
                type="danger"
                link
                @click="delOptlogs(row)"
                >删除</el-button
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
          v-model:page-size="getUserOptlogsData.params.pageSize"
          v-model:current-page="getUserOptlogsData.params.pageNum"
          :total="parseInt(getUserOptlogsData.total)"
          class="mt-4"
        />
      </div>
      <el-dialog
        v-model="isopenDetailsController"
        title="查看操作日志详情"
        @close="closeDialog"
      >
        <div>
          <span class="fw700">操作人:</span
          ><span class="ml10 fz12">{{ detailsData.operator }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">操作模块:</span
          ><span class="ml10 fz12">{{ detailsData.module }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">操作平台:</span
          ><span class="ml10 fz12">{{ detailsData.platform }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">IP地址:</span
          ><span class="ml10">{{
            phoneNumberMask(detailsData.operatorIP)
          }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">设备位置:</span
          ><span class="ml10 fz12">{{ detailsData.address }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">操作内容:</span
          ><span class="ml10 fz12">{{ detailsData.content }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">操作时间:</span
          ><span class="ml10 fz12">{{
            dayjs(detailsData.createdAt).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </div>
        <div class="mt10">
          <span class="fw700">更新时间:</span
          ><span class="ml10 fz12">{{
            dayjs(detailsData.updatedAt).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
</style>
