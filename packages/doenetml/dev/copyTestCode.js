import fs from 'fs'

// File dev/testCode.doenet will be created if it does not already exist.
fs.access('dev/testCode.doenet', fs.constants.F_OK, (fileNotFoundErr) => {
    if (fileNotFoundErr) {
        fs.copyFile('dev/defaultTestCode.doenet', 'dev/testCode.doenet', (copyErr) => {
            if (copyErr) throw copyErr;
        });
    }
});
