const inquirer = require("inquirer");
const crypto = require("crypto");

const { encrypt, decrypt } = require("./cryptography");
const { error } = require("./msg-utils");
const { INCORRECT_DECRYPTION_KEY } = require("./errors");

const store = require("./store")();

const accounts = store.get("accounts") || [];

const encryptionPrompt = [
    {
        type: "password",
        name: "key",
        message:
            "Please type the decryption key to decrypt the account's token: ",
    },
];

const createAccountPrompts = [
    {
        type: "input",
        name: "name",
        message: "What should your account be called?",
    },
    {
        type: "input",
        name: "username",
        message: "What is your git username?",
    },
    {
        type: "input",
        name: "token",
        message:
            "What is your git access token? To generate, go to https://github.com/settings/tokens & select Personal Access Tokens",
    },
    {
        type: "password",
        name: "encryption",
        message:
            "Please type the encryption key (if desired) to encrypt the token with: ",
    },
];

const createSelectAccountPrompt = (accounts) => [
    {
        type: "list",
        name: "account",
        message: "Select account:",
        choices: accounts
            .sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0))
            .map((account) => ({
                name: `${account.name} <${account.username}>`,
                value: account.username,
            }))
            .concat([
                { name: "+ Add Account", value: "new" },
                { name: "x Delete Account", value: "delete" },
            ]),
    },
];

const createDeleteAccountPrompt = (accounts) => [
    {
        type: "list",
        name: "account",
        message: "Select account to delete:",
        choices: accounts
            .sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0))
            .map((account) => ({
                name: `${account.name} <${account.username}>`,
                value: account.username,
            })),
    },
];

let selectAccountPrompt = createSelectAccountPrompt(accounts);
let deleteAccountPrompt = createDeleteAccountPrompt(accounts);

const getAccount = async (argv, decrypt = true) => {
    let account = "new";
    do {
        if (argv.default) {
            account = store.get("default-account");
        } else if (
            accounts.length === 0 ||
            ({ account } = await inquirer.prompt(selectAccountPrompt))
                .account === "new"
        ) {
            const createdAccount = await inquirer.prompt(createAccountPrompts);
            if (createdAccount.encryption) {
                const { encryption, token } = createdAccount;

                const iv = crypto.randomBytes(16);

                delete createdAccount.encryption;

                createdAccount.token = encrypt(token, iv, encryption);
                createdAccount.iv = iv.toString("hex");
            }
            accounts.push(createdAccount);
            store.set("accounts", accounts);
            selectAccountPrompt = createSelectAccountPrompt(accounts);
            deleteAccountPrompt = createDeleteAccountPrompt(accounts);
        } else if (account === "delete") {
            const { account } = await inquirer.prompt(deleteAccountPrompt);
            accounts[accounts.findIndex((a) => a.username === account)] =
                accounts[accounts.length - 1];
            accounts.pop();
            store.set("accounts", accounts);
            selectAccountPrompt = createSelectAccountPrompt(accounts);
            deleteAccountPrompt = createDeleteAccountPrompt(accounts);
        }
    } while (account === "new" || account === "delete");

    account = { ...accounts.find((a) => a.username === account) };

    if (!account.token.startsWith("ghp") && decrypt) {
        const { key } = await inquirer.prompt(encryptionPrompt);
        try {
            account.token = decrypt(
                account.token,
                Buffer.from(account.iv, "hex"),
                key
            );
        } catch (e) {
            error(INCORRECT_DECRYPTION_KEY);
        }

        if (!account.token.startsWith("ghp")) {
            error(INCORRECT_DECRYPTION_KEY);
        }
    }

    return account;
};

module.exports = getAccount;
