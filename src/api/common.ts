import request from "utils/request.ts";
import { visitor } from "@/types/common.ts";

export const visitorRecord = (data: visitor) => {
  return request.post("/w1/sys/visitor/record", data);
};
