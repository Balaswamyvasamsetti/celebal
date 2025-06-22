const fs = require('fs');

function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function readAndCombineFiles(file1, file2) {
    try {
        const data1 = await readFilePromise(file1);
        console.log("Finished reading first file");
        const data2 = await readFilePromise(file2);
        console.log("Finished reading second file");
        const combined = data1 + " " + data2;
        return combined;
    } catch (error) {
        console.error("Error occurred: " + error.message);
        throw error;
    }
}

async function main() {
    try {
        const result = await readAndCombineFiles('file1.txt', 'file2.txt');
        console.log("Combined result: " + result);
    } catch (error) {
        console.log("Something went wrong in main: " + error.message);
    }
}

main();