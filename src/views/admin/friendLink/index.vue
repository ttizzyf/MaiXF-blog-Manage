<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme";
import { manageFriendList, updateFriendLink } from "@/api/friendLink.ts";
import { FriendLinkItem } from "@/types/friendLink";
import dayjs from "dayjs";
import { WMessage } from "@/utils/toast";

const theme = themeSetting();

const friendLinkParams = ref({
  id: "",
  email: "",
  linkName: "",
  pageSize: 10,
  pageNum: 1,
});

const friendLinkList: Ref<Array<FriendLinkItem>> = ref([]);

const friendListTotal = ref(0);

const manageFriendListAPI = async () => {
  const res = await manageFriendList(friendLinkParams.value);
  friendLinkList.value = res.data.data.data;
  friendListTotal.value = res.data.data.count;
  console.log(friendLinkList.value);
};
// 重置按钮
const cancleSearch = () => {
  friendLinkParams.value.email = "";
  friendLinkParams.value.linkName = "";
  manageFriendListAPI();
};
// 从列表中删除友链
const deleteFriendLink = (id: string) => {
  console.log(id);
};

// switch按钮控制loading
const loading = ref("");

// 是否前台展示友链
const handleStatusChange = async (scope: any, status: number) => {
  try {
    loading.value = scope.row.id;
    console.log(scope, status);
    const res = await updateFriendLink({ id: scope.row.id, isShow: status });
    if (res.data.status) {
      setTimeout(() => {
        loading.value = "";
        WMessage.success("状态更新成功");
      }, 1000);
    }
  } catch (err) {
    let objKey = scope.row.isShow ? 0 : 1;
    friendLinkList.value[scope.$index].isShow = objKey;
    loading.value = "";
  }
};

// 新建友链弹层控制
const isShowDialog = ref(false);

watch(
  () => friendLinkParams.value.pageNum,
  () => {
    manageFriendListAPI();
  },
  { immediate: true }
);
</script>

<template>
  <div class="friend-link-box">
    <el-card class="card-box" shadow="hover">
      <el-scrollbar>
        <div class="flex between pb5">
          <div class="shrink0 flex start">
            <div class="ml10">
              <el-input
                class="w-50 m-2"
                placeholder="请输入友链邮箱"
                :prefix-icon="Search"
                v-model="friendLinkParams.email"
              />
            </div>
            <div class="ml10">
              <el-input
                class="w-50 m-2"
                placeholder="请输入友链名称"
                :prefix-icon="Search"
                v-model="friendLinkParams.linkName"
              />
            </div>
            <div class="ml10">
              <el-button
                :style="{
                  color: theme.theme.list[theme.themeIndex].text,
                }"
                :color="theme.theme.list[theme.themeIndex].primary"
                @click="manageFriendListAPI"
                >查询</el-button
              >
            </div>
            <div class="cancle-btn ml10">
              <el-button @click="cancleSearch">重置</el-button>
            </div>
          </div>
          <div class="shrink0 ml10">
            <el-button
              :style="{
                color: theme.theme.list[theme.themeIndex].text,
              }"
              :color="theme.theme.list[theme.themeIndex].primary"
              @click="isShowDialog = true"
              round
              >新增友链</el-button
            >
          </div>
        </div>
      </el-scrollbar>
      <div class="friend-link-list mt10">
        <el-table
          height="710"
          border
          :data="friendLinkList"
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
          <el-table-column
            align="center"
            min-width="200"
            prop="email"
            label="友链邮箱"
          />
          <el-table-column
            align="center"
            min-width="200"
            prop="linkName"
            label="友链名称"
          />
          <el-table-column
            align="center"
            min-width="200"
            prop="link"
            label="友链地址"
          >
            <template #default="{ row }">
              <a :href="row.link" target="_blank">{{ row.link }}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="200"
            prop="describe"
            :show-overflow-tooltip="true"
            label="友链描述"
          />
          <el-table-column
            prop="isShow"
            label="是否前台展示"
            align="center"
            width="120"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.isShow"
                :loading="scope.column.id === loading"
                @change="handleStatusChange(scope, $event)"
                class="ml-2"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                :active-color="theme.theme.list[theme.themeIndex].primary"
                :inactive-color="theme.theme.list[theme.themeIndex].bg"
                active-text="是"
                inactive-text="否"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="200"
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
                @confirm="deleteFriendLink(row.id)"
                title="请确认是否删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button auto-insert-space type="danger" link
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex end mt10">
        <el-pagination
          small
          background
          layout="prev, pager, next"
          v-model:page-size="friendLinkParams.pageSize"
          v-model:current-page="friendLinkParams.pageNum"
          :total="friendListTotal"
          class="mt-4"
        />
      </div>
    </el-card>
    <el-dialog v-model="isShowDialog"></el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.friend-link-box {
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
:deep(.el-pager li:hover) {
  color: $primary;
}
</style>
