import fs from 'fs';

export function storeSudoUserInfo() {
    return {
        uid: process.env.SUDO_UID,
        gid: process.env.SUDO_GID,
        username: process.env.SUDO_USER
    };
}

export function checkPermissionError(err) {
    if (err.code === 'EACCES') {
        console.error("Permission denied. Use 'sudo tracker init' to initialize the app.");
        process.exit(1);
    } else {
        throw err;
    }   
}


export function createDirs(dirs, uid, gid) {
    for (let i = 0; i < dirs.length; i++) {
        try {
            fs.mkdirSync(dirs[i], { recursive: true });
            fs.chownSync(dirs[i], parseInt(uid), parseInt(gid));
        } catch (err) {
            checkPermissionError(err);
        }
    }
}


export function deleteDirs(dirs) {
    for (let i = 0; i < dirs.length; i++) {
        if (fs.existsSync(dirs[i])) {
            try {
                fs.rm(dirs[i], { recursive: true });
            } catch (err) {
                console.error(err.message);
                process.exit(1);
            }
        }
    }
}
// export function deleteDirs(dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//         try {
//             fs.rmSync(dirs[i], { recursive: true });
//         } catch (err) {
//             checkPermissionError(err);
//         }
//     }
// }
