import { getOne } from "@hlsp/common";

// Oh I don't need to implement a "client" because it's vscode specific?
export function run() {
  console.log("getOne:", getOne());
}
run();
