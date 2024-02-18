<script lang="ts" setup>
import "@/styles/index.scss";
import { themeSetting } from "@/store/theme";
import { Search } from "@element-plus/icons-vue";
import { ref, watch, Ref } from "vue";
import { getOptlogsList } from "@/api/operate.ts";
import { userOptlogsItem } from "@/types/userOpt.ts";
import dayjs from "dayjs";

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
          <div class="flex">
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
          <div class="shrink0">
            <!-- <el-button>批量删除</el-button> -->
            123456
          </div>
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
              src="../../../assets/imgs/empty.png"
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
              <el-button auto-insert-space type="success" link
                >查看详情</el-button
              >
              <el-button auto-insert-space type="danger" link>删除</el-button>
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
</style>
