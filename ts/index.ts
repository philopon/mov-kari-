import * as Electron from 'electron';


export class Application {
    static mainWindow: Electron.BrowserWindow|null = null;

    get mainWindow() {
        return Application.mainWindow;
    }

    set mainWindow(v: Electron.BrowserWindow|null) {
        Application.mainWindow = v;
    }

    createWindow() {
        this.mainWindow = new Electron.BrowserWindow({width: 800, height: 600});
        this.mainWindow.loadURL(`file://${__dirname}/client/index.html`);

        if (process.env.NODE_ENV == 'development') {
            this.mainWindow.webContents.openDevTools();
        }

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }

    onWindowAllClosed() {
        if (process.platform === 'darwin') {
            return;
        }

        Electron.app.quit()
    }

    onActivate() {
        if (this.mainWindow === null) {
            this.createWindow();
        }
    }

    start() {
        Electron.app.commandLine.appendSwitch('ignore-gpu-blacklist');

        Electron.app.on('ready', this.createWindow);
        Electron.app.on('window-all-closed', this.onWindowAllClosed);
        Electron.app.on('activate', this.onActivate);
    }
}

const app = new Application();
app.start()
