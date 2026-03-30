const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const babelParser = require("@babel/parser");
const escomplexModule = require("typhonjs-escomplex-module");

const ROOT = "src";
const OUTPUT_JSON = "metrics-front.json";

function parseCode(code, filePath) {
    return babelParser.parse(code, {
        sourceType: "module",
        sourceFilename: filePath,
        errorRecovery: true,
        plugins: [
            "jsx",
            "classProperties",
            "objectRestSpread",
            "optionalChaining",
            "nullishCoalescingOperator",
            "dynamicImport",
            "topLevelAwait",
        ],
    });
}

function round(value, digits = 3) {
    return typeof value === "number" && Number.isFinite(value)
        ? Number(value.toFixed(digits))
        : null;
}

function pickMaintainability(report) {
    if (typeof report?.maintainability === "number") return report.maintainability;
    if (typeof report?.aggregate?.maintainability === "number") return report.aggregate.maintainability;
    return null;
}

function pickCyclomatic(report) {
    if (typeof report?.aggregate?.cyclomatic === "number") return report.aggregate.cyclomatic;
    return null;
}

function pickSloc(report) {
    const sloc = report?.aggregate?.sloc;
    if (typeof sloc === "number") return sloc;
    if (sloc && typeof sloc.physical === "number") return sloc.physical;
    return null;
}

function pickHalstead(report) {
    const h = report?.aggregate?.halstead || {};
    return {
        volume: round(h.volume),
        difficulty: round(h.difficulty),
        effort: round(h.effort),
    };
}

function analyseFile(file) {
    const code = fs.readFileSync(file, "utf8");
    const ast = parseCode(code, file);

    // حسب النسخة قد تكون analyze أو analyse
    const report =
        typeof escomplexModule.analyze === "function"
            ? escomplexModule.analyze(ast)
            : escomplexModule.analyse(ast);

    const methods = Array.isArray(report?.methods) ? report.methods : [];

    return {
        file,
        sloc: pickSloc(report),
        cyclomatic: round(pickCyclomatic(report)),
        halstead: pickHalstead(report),
        maintainability: round(pickMaintainability(report)),
        functionsCount: methods.length,
    };
}

async function main() {
    const files = await fg([`${ROOT}/**/*.{js,jsx}`], { onlyFiles: true });

    const results = [];
    const errors = [];

    for (const file of files) {
        try {
            results.push(analyseFile(file));
        } catch (error) {
            errors.push({
                file,
                message: error.message,
            });
        }
    }

    const valid = results.filter((r) => r);

    const summary = {
        totalFilesFound: files.length,
        analysedFiles: valid.length,
        failedFiles: errors.length,
        avgSloc: round(valid.reduce((s, r) => s + (r.sloc || 0), 0) / Math.max(valid.length, 1)),
        avgCyclomatic: round(valid.reduce((s, r) => s + (r.cyclomatic || 0), 0) / Math.max(valid.length, 1)),
        avgMaintainability: round(
            valid.reduce((s, r) => s + (r.maintainability || 0), 0) / Math.max(valid.length, 1)
        ),
    };

    const topCyclomatic = [...valid]
        .sort((a, b) => (b.cyclomatic || 0) - (a.cyclomatic || 0))
        .slice(0, 10);

    const topSloc = [...valid]
        .sort((a, b) => (b.sloc || 0) - (a.sloc || 0))
        .slice(0, 10);

    const topHalsteadVolume = [...valid]
        .sort((a, b) => (b.halstead?.volume || 0) - (a.halstead?.volume || 0))
        .slice(0, 10);

    const output = {
        summary,
        topCyclomatic,
        topSloc,
        topHalsteadVolume,
        results: valid,
        errors,
    };

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2), "utf8");

    console.log("Analyse terminée.");
    console.log(`Fichiers trouvés: ${summary.totalFilesFound}`);
    console.log(`Fichiers analysés: ${summary.analysedFiles}`);
    console.log(`Fichiers en erreur: ${summary.failedFiles}`);
    console.log(`Résultat écrit dans: ${OUTPUT_JSON}`);

    console.log("\nTop 10 complexité cyclomatique:");
    console.table(
        topCyclomatic.map((r) => ({
            file: r.file,
            cyclomatic: r.cyclomatic,
            sloc: r.sloc,
            maintainability: r.maintainability,
        }))
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});