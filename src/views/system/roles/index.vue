<script lang="ts" setup>
import "@/styles/index.scss";
import {
  getRolesList,
  createRoles,
  updateRoles,
  deleteRoleById,
  getRolesPerms,
} from "@/api/roles.ts";
import { getPermissionsList } from "@/api/permissions.ts";
import { ref, onMounted } from "vue";
import { themeSetting } from "@/store/theme";
import { Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { WMessage } from "@/utils/toast";
import storage from "@/utils/storage";

const theme = themeSetting();
// 列表数据
const searchData = ref({
  params: {
    pageSize: 10,
    pageNum: 1,
    roleName: "",
  },
  list: [],
  total: 0,
});

const getRolesListAPI = async () => {
  const res = await getRolesList(searchData.value.params);
  searchData.value.list = res.data.data.data;
  searchData.value.total = res.data.data.count;
};
// 重置列表
const resetSearch = () => {
  searchData.value.params = {
    pageSize: 10,
    pageNum: 1,
    roleName: "",
  };
  getRolesListAPI();
};

// 控制角色弹窗
const isRoelssDialog = ref(false);
// 新增角色表单
const createRolesData = ref({
  roleId: "",
  roleName: "",
  roleAuth: "",
  remark: "",
  perms: "",
});

// 新增角色表单规则
const createRolesRules = ref({
  roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  roleAuth: [{ required: true, message: "角色标识不能为空", trigger: "blur" }],
});

// 新增角色表单DOM
const createRolesDom = ref();

// 关闭弹窗
const btnClose = () => {
  isRoelssDialog.value = false;
  createRolesData.value = {
    roleId: "",
    roleName: "",
    roleAuth: "",
    remark: "",
    perms: "",
  };
  defaultCheckedKeys.value = [];
  createRolesDom.value.resetFields();
};

// 权限树状列表
const permsTreeData = ref([]);

// 默认选中节点
const defaultCheckedKeys = ref([]);

// 树状结构节点被选中时
const handleCheckChange = (_data: any, keys: any) => {
  createRolesData.value.perms = keys.checkedKeys
    .map((key: any) => `${key}`)
    .join("、");
};

// 保存角色
const onSubmit = async () => {
  await createRolesDom.value.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      let res;
      if (!createRolesData.value.roleId) {
        // 新增角色
        res = await createRoles(createRolesData.value);
      } else {
        // 编辑角色
        res = await updateRoles(createRolesData.value);
        const userInfo = storage.get("userInfo");
        console.log(userInfo.roleInfo.roleAuth);
        // 如果修改的权限是当前登录用户，则重新获取权限
        if (userInfo.roleInfo.roleAuth === createRolesData.value.roleAuth) {
          const perms = await getRolesPerms({
            roleAuth: createRolesData.value.roleAuth,
          });
          storage.set("perms", perms.data.data.perms);
          let userInfo = storage.get("userInfo");
          userInfo.roleInfo.perms = perms.data.data.perms;
          storage.set("userInfo", userInfo);
        }
      }
      if (res.data.status) {
        WMessage.success(res.data.message);
      } else {
        WMessage.error(res.data.message);
      }
      btnClose();
      getRolesListAPI();
    } else {
      let firstKey = Object.keys(fields)[0];
      let message = fields[firstKey][0].message;
      WMessage.error(message);
    }
  });
};

// 编辑角色
const editRoles = async (row: any) => {
  createRolesData.value.roleName = row.roleName;
  createRolesData.value.roleId = row.roleId;
  createRolesData.value.roleAuth = row.roleAuth;
  createRolesData.value.remark = row.remark;
  createRolesData.value.perms = row.perms;
  isRoelssDialog.value = true;
  if (row.perms) {
    defaultCheckedKeys.value = row.perms.split("、");
  }
  const res = await getPermissionsList({ remark: "" });
  permsTreeData.value = res.data.data.rows;
};

// 删除角色
const deleteRoles = async (row: any) => {
  if (row.roleAuth === "SUPER-ADMIN") {
    return WMessage.error("超级管理员角色不能删除");
  }
  const res = await deleteRoleById({ roleId: row.roleId });
  if (res.data.status) {
    WMessage.success(res.data.message);
  } else {
    WMessage.error(res.data.message);
  }
  getRolesListAPI();
};

onMounted(() => {
  getRolesListAPI();
});
</script>

<template>
  <div class="role-list-box">
    <el-card shadow="hover">
      <el-scrollbar>
        <div class="flex between">
          <div class="flex shrink0">
            <div class="flex start shrink0">
              <el-input
                class="w-50 m-2"
                placeholder="请输入角色名称"
                :prefix-icon="Search"
                v-model="searchData.params.roleName"
              />
              <el-button
                class="ml10"
                :style="{
                  color: theme.theme.list[theme.themeIndex].text,
                }"
                :color="theme.theme.list[theme.themeIndex].primary"
                @click="getRolesListAPI"
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
              @click="isRoelssDialog = true"
              round
              >新增角色</el-button
            >
          </div>
        </div>
      </el-scrollbar>
      <div class="roles-list mt10">
        <el-table
          height="710"
          border
          :data="searchData.list"
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
          <el-table-column
            align="center"
            min-width="200"
            prop="roleName"
            label="角色名称"
          />
          <el-table-column
            align="center"
            min-width="200"
            prop="roleAuth"
            label="角色标识"
          />
          <el-table-column
            align="center"
            min-width="200"
            prop="remark"
            label="角色备注"
          />
          <el-table-column
            align="center"
            min-width="200"
            :show-overflow-tooltip="true"
            prop="perms"
            label="权限列表"
          />
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
              <el-button
                auto-insert-space
                type="success"
                link
                @click="editRoles(row)"
                >编辑角色</el-button
              >
              <el-popconfirm
                @confirm="deleteRoles(row)"
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
          hide-on-single-page
          layout="prev, pager, next"
          v-model:page-size="searchData.params.pageSize"
          v-model:current-page="searchData.params.pageNum"
          :total="searchData.total"
          class="mt-4"
        />
      </div>
    </el-card>
    <el-dialog
      title="新增角色"
      v-model="isRoelssDialog"
      @close="btnClose"
      width="600"
    >
      <el-form
        :model="createRolesData"
        :rules="createRolesRules"
        :close-on-click-modal="false"
        ref="createRolesDom"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="createRolesData.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="roleAuth">
          <el-input
            v-model="createRolesData.roleAuth"
            placeholder="权限标识:SUPER-ADMIN"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input
            v-model="createRolesData.remark"
            placeholder="请输入角色备注"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="createRolesData.roleId"
          label="角色权限设置"
          prop="perms"
        >
          <el-tree
            :data="permsTreeData"
            show-checkbox
            :default-checked-keys="defaultCheckedKeys"
            node-key="permissionId"
            @check="handleCheckChange"
          >
            <template #default="{ data }">
              <span class="custom-tree-node">
                <span>{{ data.remark }}</span>
                <el-tag class="ml10 tac" type="success"
                  ><i v-if="data.auth" class="iconfont">&#xe642;</i
                  >{{ data.key }}</el-tag
                >
              </span>
            </template>
          </el-tree>
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
