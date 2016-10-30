import {EventEmitter2} from 'eventemitter2';
import {SidePane} from './sidepane/base';


export const CHANGE_WINDOW_SIZE: 'CHANGE_WINDOW_SIZE' = 'CHANGE_WINDOW_SIZE'

export const TOGGLE_BOTTOM_PANE: 'TOGGLE_BOTTOM_PANE' = 'TOGGLE_BOTTOM_PANE'
export const RESIZE_BOTTOM_PANE: 'RESIZE_BOTTOM_PANE' = 'RESIZE_BOTTOM_PANE'

export const TOGGLE_SIDE_PANE: 'TOGGLE_SIDE_PANE' = 'TOGGLE_SIDE_PANE'
export const RESIZE_SIDE_PANE: 'RESIZE_SIDE_PANE' = 'RESIZE_SIDE_PANE'

export const OPEN_FILE_DIALOG: 'OPEN_FILE_DIALOG' = 'OPEN_FILE_DIALOG'
export const OPEN_FILE: 'OPEN_FILE' = 'OPEN_FILE'

export const ADD_OVERLAY: 'ADD_OVERLAY' = 'ADD_OVERLAY'

export interface ChangeWindowSize {type: typeof CHANGE_WINDOW_SIZE, windowWidth: number, windowHeight: number}
export interface ToggleBottomPane {type: typeof TOGGLE_BOTTOM_PANE}
export interface ResizeBottomPane {type: typeof RESIZE_BOTTOM_PANE, size: number}
export interface ToggleSidePane {type: typeof TOGGLE_SIDE_PANE, pane: SidePane}
export interface ResizeSidePane {type: typeof RESIZE_SIDE_PANE, size: number}
export interface OpenFileDialog {type: typeof OPEN_FILE_DIALOG}
export interface OpenFile {type: typeof OPEN_FILE, file: string|File|Blob}
export interface AddOverlay {type: typeof ADD_OVERLAY, message: JSX.Element|((id: number) => JSX.Element), timeout?: number}

export type Action
    = ChangeWindowSize
    | ToggleBottomPane
    | ResizeBottomPane
    | ToggleSidePane
    | ResizeSidePane
    | OpenFileDialog
    | OpenFile
    | AddOverlay

export class ActionEmitter {
    private _emitter: EventEmitter2 = new EventEmitter2();

    emit(a: Action): boolean {
        return this._emitter.emit(a.type, a);
    }

    onAny(cb: (a: Action) => void): void {
        this._emitter.onAny((_t: string, v: Action) => cb(v));
    }
}
