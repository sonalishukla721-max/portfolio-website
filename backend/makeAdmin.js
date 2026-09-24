const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const User = require("./models/User");

dotenv.config({ path: path.join(__dirname, ".env") });

async function makeAdmin() {
    const input = readline.createInterface({ input: stdin, output: stdout });
    let email = process.argv[2]?.trim().toLowerCase();

    try {
        if (!email) {
            email = (await input.question("Registered account email to promote: "))
                .trim()
                .toLowerCase();
        }
    } finally {
        input.close();
    }

    if (!email) {
        throw new Error("An email address is required");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { $set: { role: "admin" } },
            { new: true, runValidators: true, projection: "name email role" }
        );

        if (!user) {
            console.error(`No account found for ${email}`);
            process.exitCode = 1;
            return;
        }

        console.log(`Admin role granted to ${user.email}`);
    } finally {
        await mongoose.disconnect();
    }
}

makeAdmin().catch(async (error) => {
    console.error(`Could not grant admin role: ${error.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
});
