import * as React from 'react';
import * as model from './model';
import * as action from './action';
import {SidePane} from './sidepane/base';
import {remote} from 'electron';


export class AppController {
    constructor(private model: model.AppModel, private emitter: action.ActionEmitter){
        emitter.onAny(this.listen.bind(this));
    }

    async listen(a: action.Action): Promise<void> {
        switch (a.type) {
            case action.CHANGE_WINDOW_SIZE:
                return this.model.set().windowWidth(a.windowWidth).windowHeight(a.windowHeight).commit();

            case action.TOGGLE_BOTTOM_PANE:
                return this.model.set().bottomPaneShown(!this.model.bottomPaneShown).commit();

            case action.TOGGLE_SIDE_PANE:
                return this.onToggleSidePane(a.pane);

            case action.RESIZE_SIDE_PANE:
                return this.model.set().sidePaneWidth(a.size).commit();

            case action.RESIZE_BOTTOM_PANE:
                return this.model.set().sidePaneWidth(a.size).commit();

            case action.OPEN_FILE_DIALOG:
                return this.onOpenFileDialog();

            case action.OPEN_FILE:
                return await this.onOpenFile(a);

            case action.ADD_OVERLAY:
                return this.onAddOverlay(a);

            default:
                const _v: never = a;
                this.nop(_v);
        }
    }

    nop(_v: any) {}

    async onToggleSidePane(v: SidePane): Promise<void> {
        if(this.model.sidePane !== v && this.model.sidePaneShown) {
            this.model.set().sidePane(v).commit();
        } else {
            this.model.set().sidePaneShown(!this.model.sidePaneShown).sidePane(v).commit();
        }
    }

    onOpenFileDialog(): void {
        remote.dialog.showOpenDialog({}, (paths) => {
            if(paths === undefined) return;

            for (let path of paths) {
                this.emitter.emit({type: action.OPEN_FILE, file: path});
            }
        });
    }

    async onOpenFile({file}: action.OpenFile): Promise<void> {
        const makeMessage = (msg: string) => {
            return (id: number) => {
                const onClick = () => this.model.set().removeOverlay(id).commit();
                return <div onClick={onClick}>{msg}</div>;
            }
        }

        const id = await this.model.set().addOverlay(makeMessage('loading...')).commit();

        try {
            await this.model.set().addStructure(file).commit();
            this.model.set().removeOverlay(id).commit();
        } catch (e) {
            this.model.set().removeOverlay(id).commit();
            this.emitter.emit({
                type: action.ADD_OVERLAY,
                message: makeMessage('Error: ' + (e.message||e)),
                timeout: 5000,
            });
        }
    }

    async onAddOverlay({message, timeout}: action.AddOverlay) {
        const id = await this.model.set().addOverlay(message).commit();

        if(timeout !== undefined) {
            setTimeout(() => this.model.set().removeOverlay(id).commit(), timeout);
        }
    }
}
