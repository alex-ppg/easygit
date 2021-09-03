const fs = require("fs");

const isoGit = require("isomorphic-git");

const { info } = require("../utils/msg-utils");

const checkout = async (argv) => {
    try {
        await isoGit.checkout({
            fs,
            dir: process.cwd(),
        });
    } catch (e) {
        console.log(e);
    }
    info("Successfully checked out commit");
};

module.exports = checkout;
