const fs = require("fs");

const isoGit = require("isomorphic-git");
const http = require("isomorphic-git/http/node");

const { error, info } = require("../utils/msg-utils");
const getAccount = require("../utils/get-account");

const push = async (argv) => {
    const account = await getAccount(argv);
    try {
        await isoGit.push({
            fs,
            http,
            dir: process.cwd(),
            onAuth: () => {
                return {
                    username: account.username,
                    password: account.token,
                };
            },
        });
    } catch (e) {
        error("Failed to push. Make sure you have write access rights to it.");
    }
    info("Successfully pushed all commits");
};

module.exports = push;
