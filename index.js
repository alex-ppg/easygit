const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const clone = require("./modules/clone");
const addFiles = require("./modules/add-files");
const setDefault = require("./modules/set-default");

const { argv } = yargs(hideBin(process.argv))
    .command(
        "clone [url] [folder]",
        "clone a particular repository",
        (yargs) =>
            yargs
                .alias("d", "default")
                .describe("d", "use the default defined account")
                .boolean("d")
                .positional("url", {
                    describe: "url to clone",
                })
                .positional("folder", {
                    describe:
                        "folder to clone repository in, defaults to repository name",
                })
                .demandOption("url"),
        clone
    )
    .command(
        "add <files...>",
        "add files to current commit",
        (yargs) =>
            yargs
                .alias("d", "default")
                .describe("d", "use the default defined account")
                .boolean("d")
                .positional("files", {
                    describe: "files to add",
                })
                .demandOption("files"),
        addFiles
    )
    .command(
        "set-default [username]",
        "set the default account",
        (yargs) =>
            yargs.positional("username", {
                describe: "username of the default account",
            }),
        setDefault
    )
    .demandCommand()
    .help();
