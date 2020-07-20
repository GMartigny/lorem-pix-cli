const { access, unlink } = require("fs").promises;
const test = require("ava");
const execa = require("execa");

test("run", async (t) => {
    t.teardown(async () => {
        await unlink("lorem.png");
        await unlink("filename.png");
    });

    try {
        await execa("./cli");
    }
    catch ({ exitCode, stdout }) {
        t.is(exitCode, 2);
        t.snapshot(stdout, "show help");
    }

    {
        await execa("./cli", ["300", "200"]);
        const error = await access("lorem.png");
        t.true(error === undefined);
    }

    {
        await execa("./cli", ["300", "200", "--output", "filename.png"]);
        const error = await access("filename.png");
        t.true(error === undefined);
    }
});
