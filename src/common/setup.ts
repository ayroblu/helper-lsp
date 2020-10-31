import path from "path";

import moduleAlias from "module-alias";

const parentDir = path.join(__dirname, "..");

moduleAlias.addAliases({
  "@hlsp": parentDir,
});
