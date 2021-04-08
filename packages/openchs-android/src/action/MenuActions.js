import UserInfoService from "../service/UserInfoService";
import SettingsService from "../service/SettingsService";
import moment from "moment";
import BackupRestoreRealmService from "../service/BackupRestoreRealm";

const reservedChars = /[|\\?*<":>+\[\]/']/g;

class MenuActions {
    static getInitialState() {
        return {
            userInfo: null,
            serverURL: null,
            backupInProgress: false,
            backupProgressUserMessage: null,
            percentDone: 0
        }
    }

    static onLoad(state, action, context) {
        const settings = context.get(SettingsService).getSettings();
        let newState = MenuActions.clone(state);
        newState.userInfo = context.get(UserInfoService).getUserInfo();
        newState.serverURL = settings.serverURL;
        return newState;
    }

    static clone(state) {
        return {...state};
    }

    static onBackupDump(state, action, context) {
        let newState = MenuActions.clone(state);
        const {organisationName, username} = state.userInfo;
        const fileName = `${organisationName}_${username}_${moment().format('DD-MM-YYYY_HH-mm-ss')}.realm`;
        let backupAndRestoreRealmService = context.get(BackupRestoreRealmService);
        backupAndRestoreRealmService.backup(fileName.replace(reservedChars, ''), (percentage, message) => {
            action.cb(percentage, message);
        });
        newState.backupInProgress = true;
        newState.backupProgressUserMessage = "Starting backup";
        return newState;
    }

    static onBackupProgress(state, action) {
        let newState = MenuActions.clone(state);
        newState.percentDone = action.percentDone;
        newState.backupProgressUserMessage = action.message;
        newState.backupInProgress = action.percentDone !== 100;
        return newState;
    }
}

const ActionPrefix = 'Menu';

const MenuActionNames = {
    ON_LOAD: `${ActionPrefix}.ON_LOAD`,
    ON_BACKUP_DUMP: `${ActionPrefix}.ON_BACKUP_DUMP`,
    ON_BACKUP_PROGRESS: `${ActionPrefix}.ON_BACKUP_PROGRESS`
};

const MenuActionMap = new Map([
    [MenuActionNames.ON_LOAD, MenuActions.onLoad],
    [MenuActionNames.ON_BACKUP_DUMP, MenuActions.onBackupDump],
    [MenuActionNames.ON_BACKUP_PROGRESS, MenuActions.onBackupProgress]
]);

export {MenuActions, MenuActionNames, MenuActionMap}
