const chalk = require("chalk");

const error = (v) => {
    console.log(chalk.red("EasyGit: ") + v);
    process.exit(1);
};

const info = (v) => {
    console.log(chalk.cyan("EasyGit: ") + v);
};

module.exports = { error, info };
