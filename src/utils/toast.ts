import { ElMessage, ElNotification } from "element-plus";

class Message {
  success(description: string) {
    return ElMessage.success({
      message: description,
      grouping: true,
      showClose: true,
      center: true,
      duration: 3000,
    });
  }
  warning(description: string) {
    return ElMessage.warning({
      message: description,
      grouping: true,
      showClose: true,
      center: true,
      duration: 3000,
    });
  }
  info(description: string) {
    return ElMessage.info({
      message: description,
      grouping: true,
      showClose: true,
      center: true,
      duration: 3000,
    });
  }
  error(description: string) {
    return ElMessage.error({
      message: description,
      grouping: true,
      showClose: true,
      center: true,
      duration: 3000,
    });
  }
  showMessage(type: any, description: string) {
    return ElMessage({
      message: description,
      grouping: true,
      showClose: true,
      center: true,
      type,
      duration: 3000,
    });
  }
}

class Notification {
  success(description: string, message = "SUCCESS") {
    return ElNotification.success({
      title: message,
      message: description,
      duration: 3000,
    });
  }
  warning(description: string, message = "WARNING") {
    return ElNotification.warning({
      title: message,
      message: description,
      duration: 3000,
    });
  }
  info(description: string, message = "INFO") {
    return ElNotification.info({
      title: message,
      message: description,
      duration: 3000,
    });
  }
  error(description: string, message = "ERROR") {
    return ElNotification.error({
      title: message,
      message: description,
      duration: 3000,
    });
  }
  showNotification(type: any, description: string, msg: string) {
    return ElNotification({
      title: msg,
      message: description,
      type,
      duration: 3000,
    });
  }
}

export const WNotification = new Notification();
export const WMessage = new Message();
