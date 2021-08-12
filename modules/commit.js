const fs = require("fs");

const isoGit = require("isomorphic-git");

const { error, info } = require("../utils/msg-utils");
const getAccount = require("../utils/get-account");

const commit = async (argv) => {
    const account = await getAccount(argv, false);
    const { message } = argv;

    await isoGit.commit({
        fs,
        dir: process.cwd(),
        message,
        author: {
            name: account.username,
        },
    });

    info("Successfully committed staged files");
};

module.exports = commit;
