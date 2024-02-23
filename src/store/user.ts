import { ref, watch } from "vue";
import { defineStore } from "pinia";
import storage from "@/utils/storage";

export const useUserStore = defineStore("useUserStore", () => {
  let LoginInfo = ref(storage.get("userInfo"));

  function removeLogin() {
    storage.remove("userInfo");
    storage.remove("perms");
    LoginInfo.value = null;
  }

  watch(
    LoginInfo,
    async () => {
      console.log(LoginInfo.value.roleInfo.perms);
      storage.set("userInfo", LoginInfo.value);
    },
    { deep: true }
  );

  return { LoginInfo, removeLogin };
});
