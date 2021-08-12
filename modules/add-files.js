const fs = require("fs");

const isoGit = require("isomorphic-git");

const { info } = require("../utils/msg-utils");

const addFiles = async (argv) => {
    const { files } = argv;
    for (let filepath of files) {
        await isoGit.add({
            fs,
            dir: process.cwd(),
            filepath,
        });
        info(`Successfully added ${filepath} to the index`);
    }
};

module.exports = addFiles;
