import {remote} from 'electron';
import * as action from '../action';


export class AppMenuBuilder {
    constructor(public emitter: action.ActionEmitter) {

    }

    private darwinMenu: Electron.MenuItemOptions[] = [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'},
    ]

    public fileMenu: Electron.MenuItemOptions[] = [
        {
            label: 'Open',
            accelerator: 'CmdOrCtrl+O',
            click: (_item, focusedWindow) => {
                if (focusedWindow) {
                    this.emitter.emit({type: action.OPEN_FILE_DIALOG});
                }
            }
        }
    ]

    private debugMenu: Electron.MenuItemOptions[] = [
        {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click (_item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload()
            }
        },
        {
            label: 'Toggle Developper Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click (_item, focusedWindow) {
                if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
        }
    ]

    build(): Electron.Menu {
        const template: Electron.MenuItemOptions[] = [
            {label: 'File', submenu: this.fileMenu},
            {label: 'Debug', submenu: this.debugMenu},
        ];

        if (process.platform === 'darwin') {
            template.unshift({label: remote.app.getName(), submenu: this.darwinMenu});
        }

        return remote.Menu.buildFromTemplate(template);
    }

    apply(): void {
        remote.Menu.setApplicationMenu(this.build());
    }
}
