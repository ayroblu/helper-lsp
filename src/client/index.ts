import "module-alias/register";
import { getOne } from "@common";

export function run() {
  console.log("getOne:", getOne());
}
run();
