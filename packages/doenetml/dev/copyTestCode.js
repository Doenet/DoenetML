import fs from 'fs'

// File dev/testCode.doenet will be created if it does not already exist.
fs.access('dev/testCode.doenet', fs.constants.F_OK, (err) => {
    if (err) {
        fs.copyFile('dev/defaultTestCode.doenet', 'dev/testCode.doenet', (err) => {
            if (err) throw err;
        });
    }
});
