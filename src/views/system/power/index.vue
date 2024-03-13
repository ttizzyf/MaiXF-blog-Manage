<script lang="ts" setup>
import {
  getPermissionsList,
  createPermissions,
  updatePermissions,
} from "@/api/permissions.ts";
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme";
import dayjs from "dayjs";
import "@/styles/index.scss";
import { WMessage, WNotification } from "@/utils/toast";

const theme = themeSetting();

const searchPermissionsData = ref({
  params: {
    remark: "",
  },
  list: [],
  total: 0,
});
// 获取权限列表
const getPermissionsListAPI = async () => {
  const res = await getPermissionsList(searchPermissionsData.value.params);
  searchPermissionsData.value.list = res.data.data.rows;
  searchPermissionsData.value.total = res.data.data.count;
  console.log(searchPermissionsData.value.list);
};

// 重置查询条件
const resetSearch = () => {
  searchPermissionsData.value.params = {
    remark: "",
  };
  getPermissionsListAPI();
};

// 加载状态
const loadingStatus = ref();

// 修改权限状态
const userStatusChange = async (scope: any) => {
  loadingStatus.value = scope.row.permissionId;
  try {
    console.log(scope.row.disabled);
    const res = await updatePermissions({
      permissionId: scope.row.permissionId,
      disabled: scope.row.disabled,
    });
    if (res.data.status) {
      setTimeout(() => {
        WNotification.success(res.data.message);
        loadingStatus.value = "";
      }, 1000);
    }
    getPermissionsListAPI();
  } catch (err) {
    let objKey = scope.row.disabled === 1 ? 0 : 1;
    (searchPermissionsData.value.list as any)[scope.$index].disabled = objKey;
    loadingStatus.value = "";
  }
};
// 表单元素绑定
const permissionsData = ref({
  permissionId: "",
  key: "",
  parent_key: "",
  remark: "",
  auth: 0,
});

// 表单规则
const permissionsRules = ref({
  key: [{ required: true, message: "权限关键词不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "权限备注不能为空", trigger: "blur" }],
});

// 控制弹层显示与隐藏
const isShowPermissionsDialog = ref(false);

// 表单dom元素
const permissionsForm = ref<any>();

// 关闭弹窗
const btnClose = () => {
  isShowPermissionsDialog.value = false;
  permissionsData.value = {
    permissionId: "",
    key: "",
    parent_key: "",
    remark: "",
    auth: 0,
  };
  permissionsForm.value.resetFields();
};

// 点击编辑按钮
const editPermissions = (row: any) => {
  isShowPermissionsDialog.value = true;
  permissionsData.value.permissionId = row.permissionId;
  permissionsData.value.key = row.key;
  permissionsData.value.parent_key = row.parent_key;
  permissionsData.value.remark = row.remark;
  permissionsData.value.auth = row.auth;
};

// 提交表单
const onSubmit = async () => {
  await permissionsForm.value.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      if (!permissionsData.value.permissionId) {
        // 新建
        const res = await createPermissions(permissionsData.value);
        if (res.data.status) {
          WMessage.success("词条新建成功");
        }
      } else {
        // 修改
        const res = await updatePermissions(permissionsData.value);
        if (res.data.status) {
          WMessage.success("词条修改成功");
        }
      }
      getPermissionsListAPI();
      btnClose();
    } else {
      let firstKey = Object.keys(fields)[0];
      let message = fields[firstKey][0].message;
      WMessage.error(message);
    }
  });
};

// 删除权限词条
const deletePermisssion = async (row: any) => {
  const res = await updatePermissions({
    permissionId: row.permissionId,
    status: 0,
  });
  if (res.data.status) {
    WMessage.success("词条删除成功");
    getPermissionsListAPI();
  }
};

onMounted(() => {
  getPermissionsListAPI();
});
</script>

<template>
  <div class="permissions-list-box">
    <el-card shadow="hover">
      <el-scrollbar>
        <div class="flex between">
          <div class="flex shrink0">
            <div class="flex start shrink0">
              <el-input
                class="w-50 m-2"
                placeholder="请输入权限名称"
                :prefix-icon="Search"
                v-model="searchPermissionsData.params.remark"
              />
              <el-button
                class="ml10"
                :style="{
                  color: theme.theme.list[theme.themeIndex].text,
                }"
                :color="theme.theme.list[theme.themeIndex].primary"
                @click="getPermissionsListAPI"
                >查询</el-button
              >
              <div class="cancle-btn ml20">
                <el-button @click="resetSearch">重置</el-button>
              </div>
            </div>
          </div>
          <div class="shrink0 ml10">
            <el-button
              :style="{
                color: theme.theme.list[theme.themeIndex].text,
              }"
              :color="theme.theme.list[theme.themeIndex].primary"
              @click="isShowPermissionsDialog = true"
              round
              >新增权限</el-button
            >
          </div>
        </div>
      </el-scrollbar>
      <div class="permissions-list mt10">
        <el-table
          height="710"
          border
          :data="searchPermissionsData.list"
          style="width: 100%"
          :header-cell-style="{
            color: `${theme.theme.list[theme.themeIndex].text}`,
            background: `${theme.theme.list[theme.themeIndex].primary}`,
            height: '60px',
          }"
          row-key="key"
          :row-style="{ height: '30px' }"
        >
          <template #empty>
            <img
              style="width: 400px; height: 400px"
              src="../../../assets/imgs/empty.png"
              fit="cover"
            />
          </template>
          <el-table-column min-width="200" prop="remark" label="权限备注" />
          <el-table-column
            min-width="200"
            align="center"
            prop="key"
            label="权限标识"
          >
            <template #default="{ row }">
              <el-tag type="success">{{ row.key }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            align="center"
            prop="parent_key"
            label="父级权限标识"
          >
            <template #default="{ row }">
              <el-tag v-if="row.parent_key" type="success">
                {{ row.parent_key }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="80"
            align="center"
            prop="auth"
            label="按键权限"
          >
            <template #default="{ row }">
              <el-tag v-if="row.auth" type="success">是</el-tag>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            align="center"
            prop="disabled"
            label="状态"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.disabled"
                class="ml-2"
                inline-prompt
                :loading="scope.row.permissionId === loadingStatus"
                @change="userStatusChange(scope)"
                :active-value="0"
                :inactive-value="1"
                :active-color="theme.theme.list[theme.themeIndex].primary"
                :inactive-color="theme.theme.list[theme.themeIndex].bg"
                active-text="正常"
                inactive-text="禁用"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
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
              <el-button
                auto-insert-space
                type="success"
                @click="editPermissions(row)"
                link
                >编辑</el-button
              >
              <el-popconfirm
                @confirm="deletePermisssion(row)"
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
    </el-card>
    <el-dialog
      :title="permissionsData.permissionId ? '编辑权限' : '新建权限'"
      v-model="isShowPermissionsDialog"
      @close="btnClose"
      width="40%"
    >
      <el-form
        :model="permissionsData"
        :rules="permissionsRules"
        :close-on-click-modal="false"
        ref="permissionsForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="权限备注" prop="remark">
          <el-input
            v-model="permissionsData.remark"
            placeholder="请输入权限备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="key">
          <el-input
            v-model="permissionsData.key"
            placeholder="权限标识:blog:blog_article"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级标识" prop="parent_key">
          <el-input
            v-model="permissionsData.parent_key"
            placeholder="父级标识:blog"
          ></el-input>
        </el-form-item>
        <el-form-item label="按键权限" prop="auth">
          <el-radio-group v-model="permissionsData.auth" class="ml-4">
            <el-radio :label="1" size="large">是</el-radio>
            <el-radio :label="0" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            :style="{
              color: theme.theme.list[theme.themeIndex].text,
            }"
            :color="theme.theme.list[theme.themeIndex].primary"
            @click="onSubmit"
            >确认</el-button
          >
          <div class="cancle-btn ml20">
            <el-button @click="btnClose">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
:deep(.el-pager li:hover) {
  color: $primary;
}
</style>
