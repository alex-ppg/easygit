const store = require("../utils/store")();
const { error } = require("../utils/msg-utils");

const clone = async (argv) => {
    const accounts = store.get("accounts") || [];
    const account = argv.username;
    const found = accounts.findIndex((acc) => acc.username === account);
    if (found === -1) error("Account Not Found!");
    store.set("default-account", account);
};

module.exports = clone;
