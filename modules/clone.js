const fs = require("fs");
const path = require("path");

const isoGit = require("isomorphic-git");
const http = require("isomorphic-git/http/node");

const { error, info } = require("../utils/msg-utils");
const getAccount = require("../utils/get-account");

const clone = async (argv) => {
    const account = await getAccount(argv);
    const { url, folder = url.split("/").pop().replace(".git", "") } = argv;
    try {
        await isoGit.clone({
            fs,
            http,
            dir: path.join(process.cwd(), folder),
            url,
            onAuth: () => {
                return {
                    username: account.username,
                    password: account.token,
                };
            },
        });
    } catch (e) {
        error(
            "Failed to clone. Make sure the repository is not private / you have access rights to it."
        );
    }
    info(
        `Successfully cloned ${url
            .slice(url.indexOf("com/") + 4)
            .replace(".git", "")} to ${folder}`
    );
};

module.exports = clone;
