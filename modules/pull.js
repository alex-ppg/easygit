const fs = require("fs");

const isoGit = require("isomorphic-git");
const http = require("isomorphic-git/http/node");

const { error, info } = require("../utils/msg-utils");
const getAccount = require("../utils/get-account");

const pull = async (argv) => {
    const account = await getAccount(argv);
    try {
        await isoGit.pull({
            fs,
            http,
            dir: process.cwd(),
            author: {
                name: account.name,
                email: account.email,
            },
            onAuth: () => {
                return {
                    username: account.username,
                    password: account.token,
                };
            },
        });
    } catch (e) {
        console.log(e);
        error("Failed to pull. Make sure you have read access rights to it.");
    }
    info("Successfully pulled all commits");
};

module.exports = pull;
