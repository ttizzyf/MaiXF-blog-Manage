<script lang="ts" setup>
import { loadWebSetting, updateWebSetting } from "@/api/common.ts";
import { WMessage, WNotification } from "@/utils/toast";
import { ref, onMounted, nextTick } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme";
import WmdEdit from "@/components/WmdEdit.vue";
import storage from "@/utils/storage";
import type { UploadUserFile } from "element-plus";
import { useUserStore } from "@/store/user.ts";

const userStore = useUserStore();

const headers = {
  authorization: storage.get("userInfo").token,
};

const theme = themeSetting();

interface selfIntroduceType {
  selfSkill: string[] | string;
  webSkill: string[] | string;
  time: string;
  projectNum: string;
}

const webSetting = ref({
  footerFiling: {
    auther: "",
    authorizationUrl: "",
    number: "",
  },
  selfIntroduce: {
    selfSkill: "",
    webSkill: "",
    time: "",
    projectNum: "",
  } as selfIntroduceType,
  theme: [
    {
      main: "#000000",
      seconed: "#ffffff",
      primary: "#109b45",
    },
  ],
  webInfo: {
    webName: "",
    webVersion: "",
    aboutMe: "",
    aboutWxUrl: "",
    homeSaying: "",
    webConnect: "",
    webIntroduce: "",
  },
});

// 网站信息Dom
const webInfoFormDOM = ref();

// 上传微信图片成功
const handleWxImageSuccess = (file: any) => {
  webSetting.value.webInfo.aboutWxUrl = file.data.fileUrl;
  wxImagefileList.value = [];
};

// 上传微信图片失败
const handleWxImageError = () => {
  WNotification.error("上传图片失败");
};

// 微信图片数组
const wxImagefileList = ref<UploadUserFile[]>([]);

// 版本号校验规则
function validateWebVersion(_rule: any, value: string, callback: any) {
  const pattern = /^\d+\.\d+\.\d+$/;
  if (pattern.test(value)) {
    callback();
  } else {
    callback(new Error("版本号格式不正确,正确格式如下: 1.0.0"));
  }
}
// 网站信息规则
const webInfoRules = ref({
  webName: [{ required: true, message: "网站名称不能为空", trigger: "blur" }],
  webVersion: [
    { required: true, message: "网站名称不能为空", trigger: "blur" },
    { validator: validateWebVersion, trigger: "blur" },
  ],
  aboutMe: [{ required: true, message: "关于我不能为空", trigger: "blur" }],
  aboutWxUrl: [
    { required: true, message: "微信图片链接不能为空", trigger: "blur" },
  ],
  homeSaying: [
    { required: true, message: "微信图片链接不能为空", trigger: "blur" },
  ],
  webConnect: [
    { required: true, message: "站点链接不能为空", trigger: "blur" },
  ],
  webIntroduce: [
    { required: true, message: "个人简介不能为空", trigger: "blur" },
  ],
});

// 作者介绍规则
const selfIntroduceRules = ref({
  time: [{ required: true, message: "从业时间不能为空", trigger: "blur" }],
  projectNum: [
    { required: true, message: "项目数量不能为空", trigger: "blur" },
  ],
});

// 自我介绍表单DOM
const selfIntroduceFormDOM = ref();

// 我的技能tag删除
const selfSkillClose = (tag: string) => {
  (webSetting.value.selfIntroduce.selfSkill as Array<string>).splice(
    webSetting.value.selfIntroduce.selfSkill.indexOf(tag),
    1
  );
};

const selfSkillInputRef = ref();

// 是否展示输入框
const selfSkillInputVisible = ref(false);

const selfSkillInputValue = ref();

const selfSkillHandleInputConfirm = () => {
  if (selfSkillInputValue.value) {
    (webSetting.value.selfIntroduce.selfSkill as Array<string>).push(
      selfSkillInputValue.value
    );
  }
  selfSkillInputVisible.value = false;
  selfSkillInputValue.value = "";
  console.log(webSetting.value.selfIntroduce.selfSkill.length);
};

// 是否展示输入框
const selfSkillshowInput = () => {
  selfSkillInputVisible.value = true;
  nextTick(() => {
    selfSkillInputRef.value!.input!.focus();
  });
};

// 网站信息删除tag
const webSkillClose = (tag: string) => {
  (webSetting.value.selfIntroduce.webSkill as Array<string>).splice(
    webSetting.value.selfIntroduce.webSkill.indexOf(tag),
    1
  );
};

// 网站信息input框控制
const webSkillInputVisible = ref(false);

// 网站信息input框DOM
const webSkillInputRef = ref();

// 网站信息input框
const webSkillInputValue = ref("");

// 网站信息添加tag
const webSkillHandleInputConfirm = () => {
  if (webSkillInputValue.value) {
    (webSetting.value.selfIntroduce.webSkill as Array<string>).push(
      webSkillInputValue.value
    );
  }
  webSkillInputVisible.value = false;
  webSkillInputValue.value = "";
  console.log(webSetting.value.selfIntroduce.webSkill.length);
};

// 网站信息切换input框
const webSkillshowInput = () => {
  webSkillInputVisible.value = true;
  nextTick(() => {
    webSkillInputRef.value!.input!.focus();
  });
};

// 折叠面板
const collapseIndex = ref(0);

// 删除主题
const deleteTheme = (index: number) => {
  if (webSetting.value.theme.length <= 2) {
    return WMessage.error("主题数量不能小于2");
  }
  webSetting.value.theme.splice(index, 1);
};

// 随机生成颜色
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// 添加主题
const addTheme = () => {
  let theme = {
    primary: generateRandomColor(),
    main: generateRandomColor(),
    seconed: generateRandomColor(),
  };
  webSetting.value.theme.push(theme);
};

// 页脚表单DOM
const footerFormDOM = ref();

const footerRules = ref({
  auther: [
    { required: true, message: "所属名称不能为空", trigger: "blur" },
    { min: 1, max: 10, message: "所属名称应为1-10字", trigger: "blur" },
  ],
  authorizationUrl: [
    { required: true, message: "机构连接不能为空", trigger: "blur" },
  ],
  number: [{ required: true, message: "备案号不能为空", trigger: "blur" }],
});

// 加载站点信息
const loadWebSettingAPI = async () => {
  const res = await loadWebSetting();
  webSetting.value = res.data.data;
  webSetting.value.selfIntroduce.selfSkill = (
    webSetting.value.selfIntroduce.selfSkill as string
  ).split("、");
  webSetting.value.selfIntroduce.webSkill = (
    webSetting.value.selfIntroduce.webSkill as string
  ).split("、");
  console.log(webSetting.value);
};

// 保存站点信息
const keepWebSetting = () => {
  if (userStore.LoginInfo?.roleInfo?.roleAuth !== "SUPER-ADMIN") {
    return WMessage.error("您的权限不足");
  }
  webInfoFormDOM.value.validate((webInfoValid: Boolean, webInfoFields: any) => {
    // 先校验网站信息
    if (webInfoValid) {
      selfIntroduceFormDOM.value.validate(
        (selfValid: Boolean, selfFields: any) => {
          // 再校验作者介绍
          if (selfValid) {
            if (
              webSetting.value.selfIntroduce.selfSkill.length < 2 ||
              webSetting.value.selfIntroduce.webSkill.length < 2
            ) {
              return WMessage.error("网站技术栈或个人技术栈数量不能低于2种");
            }
            // 再校验网站主题
            if (webSetting.value.theme.length <= 1) {
              return WMessage.error("网站主题不能小于2种");
            } else {
              // 最后校验页脚信息
              footerFormDOM.value.validate(
                async (footerValid: Boolean, footerFields: any) => {
                  if (footerValid) {
                    // 校验成功
                    let setting = JSON.parse(JSON.stringify(webSetting.value));
                    setting.selfIntroduce.selfSkill = (
                      setting.selfIntroduce.selfSkill as Array<string>
                    ).join("、");
                    setting.selfIntroduce.webSkill = (
                      setting.selfIntroduce.webSkill as Array<string>
                    ).join("、");
                    const res = await updateWebSetting(setting);
                    console.log(res);
                    // 成功处理
                  } else {
                    let firstKey = Object.keys(footerFields)[0];
                    let message = footerFields[firstKey][0].message;
                    WMessage.error(message);
                  }
                }
              );
            }
          } else {
            let firstKey = Object.keys(selfFields)[0];
            let message = selfFields[firstKey][0].message;
            WMessage.error(message);
          }
        }
      );
    } else {
      let firstKey = Object.keys(webInfoFields)[0];
      let message = webInfoFields[firstKey][0].message;
      WMessage.error(message);
    }
  });
};

onMounted(() => {
  loadWebSettingAPI();
});
</script>

<template>
  <div class="setting-box">
    <div class="setting-list mr20">
      <el-card class="card-box" shadow="hover">
        <div class="mb20 fw700 fz20 primary-color pointer">网站信息设置</div>
        <el-collapse v-model="collapseIndex">
          <el-collapse-item title="网站设置" name="1">
            <div>
              <el-form
                label-width="100"
                label-position="right"
                ref="webInfoFormDOM"
                :model="webSetting.webInfo"
                :rules="webInfoRules"
              >
                <el-form-item label="网站名称" prop="webName">
                  <el-input
                    v-model="webSetting.webInfo.webName"
                    placeholder="请输入网站名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="网站名称" prop="homeSaying">
                  <el-input
                    v-model="webSetting.webInfo.homeSaying"
                    placeholder="请输入首页名言"
                  ></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="webVersion">
                  <el-input
                    v-model="webSetting.webInfo.webVersion"
                    placeholder="请输入版本号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="关于我" prop="aboutMe">
                  <WmdEdit
                    :mode="'edit'"
                    :type="'other'"
                    style="width: 90%"
                    v-model:value="webSetting.webInfo.aboutMe"
                    :mdContent="webSetting.webInfo.aboutMe"
                  ></WmdEdit>
                </el-form-item>
                <el-form-item label="我的微信" prop="aboutWxUrl">
                  <el-input v-model="webSetting.webInfo.aboutWxUrl"></el-input>
                  <div class="flex mt10">
                    <el-image
                      class="mr10"
                      style="width: 100px; height: 100px"
                      :src="webSetting.webInfo.aboutWxUrl"
                      fit="cover"
                    />
                    <el-upload
                      class="mt20"
                      :headers="headers"
                      v-model:file-list="wxImagefileList"
                      accept=".jpg,.jpeg,.png,.image"
                      @success="handleWxImageSuccess"
                      @error="handleWxImageError"
                      :show-file-list="false"
                      :limit="1"
                      action="/w1/w1/common/upload"
                    >
                      <el-button
                        :color="theme.theme.list[theme.themeIndex].primary"
                      >
                        <span
                          :style="{
                            color: theme.theme.list[theme.themeIndex].text,
                          }"
                          >上传微信图片</span
                        ></el-button
                      >
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="站点链接" prop="webConnect">
                  <el-input
                    v-model="webSetting.webInfo.webConnect"
                    placeholder="请输入网站链接"
                  ></el-input>
                </el-form-item>
                <el-form-item label="个人简介" prop="webIntroduce">
                  <el-input
                    v-model="webSetting.webInfo.webIntroduce"
                    placeholder="请输入个人简介"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item title="作者介绍" name="2">
            <div class="intro flex">
              <el-form
                label-width="100"
                label-position="right"
                ref="selfIntroduceFormDOM"
                :model="webSetting.selfIntroduce"
                :rules="selfIntroduceRules"
              >
                <el-form-item label="个人技能" prop="selfSkill">
                  <el-tag
                    class="mr10 mt5"
                    v-for="tag in webSetting.selfIntroduce.selfSkill"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="selfSkillClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="selfSkillInputVisible"
                    ref="selfSkillInputRef"
                    v-model="selfSkillInputValue"
                    class="w-20 mt5"
                    size="small"
                    style="width: 100px"
                    @keyup.enter="selfSkillHandleInputConfirm"
                    @blur="selfSkillHandleInputConfirm"
                  />
                  <el-button
                    v-else
                    class="button-new-tag mt5"
                    size="small"
                    @click="selfSkillshowInput"
                  >
                    添加标签
                  </el-button>
                </el-form-item>
                <el-form-item label="网站技术" prop="webSkill">
                  <el-tag
                    class="mr10 mt5"
                    v-for="tag in webSetting.selfIntroduce.webSkill"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="webSkillClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="webSkillInputVisible"
                    ref="webSkillInputRef"
                    v-model="webSkillInputValue"
                    class="w-20 mt5"
                    size="small"
                    style="width: 100px"
                    @keyup.enter="webSkillHandleInputConfirm"
                    @blur="webSkillHandleInputConfirm"
                  />
                  <el-button
                    v-else
                    class="button-new-tag mt5"
                    size="small"
                    @click="webSkillshowInput"
                  >
                    添加标签
                  </el-button>
                </el-form-item>
                <el-form-item label="从业时间" prop="time">
                  <el-input v-model="webSetting.selfIntroduce.time"></el-input>
                </el-form-item>
                <el-form-item label="项目数量" prop="projectNum">
                  <el-input
                    v-model="webSetting.selfIntroduce.projectNum"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item title="网站主题" name="3">
            <div class="theme-box">
              <div
                v-for="(item, index) in webSetting.theme"
                :key="item.primary"
                class="theme-item"
              >
                <div class="show-color-box">
                  <div
                    :style="{ 'background-color': item.primary }"
                    class="primary-color"
                  >
                    <span class="mr10">primary:</span>
                    <span class="mr10">{{ item.primary }}</span>
                    <span class="mr10">main:</span>
                    <span class="mr10">{{ item.main }}</span>
                    <span class="mr10">secoed:</span>
                    <span class="mr10">{{ item.seconed }}</span>
                  </div>
                  <div class="other-color flex">
                    <div
                      :style="{ 'background-color': item.main }"
                      class="main-color"
                    ></div>
                    <div
                      :style="{ 'background-color': item.seconed }"
                      class="seconed-color"
                    ></div>
                  </div>
                </div>
                <div class="input-list mt5">
                  <div class="flex between">
                    <div class="flex">
                      <div class="item mr10">
                        <span class="mr5">primary:</span>
                        <el-color-picker
                          v-model="webSetting.theme[index].primary"
                          color-format="hex"
                        />
                      </div>
                      <div class="item mr10">
                        <span class="mr5">main:</span>
                        <el-color-picker
                          color-format="hex"
                          v-model="webSetting.theme[index].main"
                        />
                      </div>
                      <div class="item mr10">
                        <span class="mr5">seconed:</span>
                        <el-color-picker
                          color-format="hex"
                          v-model="webSetting.theme[index].seconed"
                        />
                      </div>
                    </div>
                    <el-popconfirm
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      title="请确认是否删除该主题?"
                      :icon="InfoFilled"
                      icon-color="#626AEF"
                      @confirm="deleteTheme(index)"
                    >
                      <template #reference>
                        <el-button link type="danger">删除主题</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
              <div class="mt20 flex jcenter">
                <el-button
                  :style="{
                    color: theme.theme.list[theme.themeIndex].text,
                  }"
                  :color="theme.theme.list[theme.themeIndex].primary"
                  @click="addTheme"
                  >添加主题</el-button
                >
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="页脚信息" name="4">
            <div class="form">
              <el-form
                label-width="100"
                label-position="right"
                ref="footerFormDOM"
                :model="webSetting.footerFiling"
                :rules="footerRules"
              >
                <el-form-item label="所属名称" prop="auther">
                  <el-input v-model="webSetting.footerFiling.auther"></el-input>
                </el-form-item>
                <el-form-item label="备案号" prop="number">
                  <el-input v-model="webSetting.footerFiling.number"></el-input>
                </el-form-item>
                <el-form-item label="所属地址" prop="authorizationUrl">
                  <el-input
                    type="textarea"
                    rows="3"
                    v-model="webSetting.footerFiling.authorizationUrl"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="flex jcenter">
          <div @click="keepWebSetting" class="animationBtn pointer mt20">
            保存站点信息
          </div>
        </div>
      </el-card>
    </div>
    <div class="admin-box">
      <el-card class="card-box" shadow="hover"> </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-box {
  display: flex;
  min-height: calc(100vh - 104px);
  .setting-list {
    width: 40%;
    .card-box {
      height: 100%;
      .form {
        width: 70%;
      }
    }
  }
  .admin-box {
    width: calc(60% - 20px);
    height: 100%;
  }
}
.theme-box {
  .theme-item {
    margin-top: 20px;
    .show-color-box {
      height: 100px;
      width: 100%;
      border-radius: 10px;
      overflow: hidden;
      .primary-color {
        padding: 10px 0 0 10px;
        color: #ffffff;
        font-weight: 700;
        height: 60px;
      }
      .other-color {
        height: 40px;
        .main-color {
          height: 100%;
          width: 60%;
        }
        .seconed-color {
          height: 100%;
          width: 40%;
        }
      }
    }
  }
}
</style>
