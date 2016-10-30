import {SidePane} from '../sidepane/base';
import {EventEmitter2} from 'eventemitter2';
import {Overlay} from './overlay';
import {Structure, StructureStore} from './structure';

import * as ngl from 'ngl';

export const UPDATE_BACKGROUND_COLOR: 'UPDATE:BACKGROUND_COLOR' = 'UPDATE:BACKGROUND_COLOR'

export const UPDATE_WINDOW_SIZE: 'UPDATE:WINDOW_SIZE' = 'UPDATE:WINDOW_SIZE'

export const UPDATE_SIDE_PANE_STATE: 'UPDATE:SIDE_PANE_STATE' = 'UPDATE:SIDE_PANE_STATE'
export const UPDATE_BOTTOM_PANE_STATE: 'UPDATE:BOTTOM_PANE_STATE' = 'UPDATE:BOTTOM_PANE_STATE'

export const UPDATE_OVERLAY: 'UPDATE:OVERLAY' = 'UPDATE:OVERLAY'

export const ADD_STRUCTURE: 'ADD:STRUCTURE' = 'ADD:STRUCTURE'

export type UPDATE_EVENT
    = typeof UPDATE_BACKGROUND_COLOR
    | typeof UPDATE_WINDOW_SIZE
    | typeof UPDATE_SIDE_PANE_STATE
    | typeof UPDATE_BOTTOM_PANE_STATE
    | typeof UPDATE_OVERLAY

    | typeof ADD_STRUCTURE


export interface StageView {
    viewer: ngl.Viewer;
    handleResize(): void;
    setParameters(ps: ngl.StageParameters): void;
}


export interface AppState {
    readonly backgroundColor: ngl.Color;

    readonly windowHeight: number;
    readonly windowWidth: number;

    readonly sidePane: SidePane;
    readonly sidePanes: SidePane[];
    readonly sidePaneShown: boolean;
    readonly sidePaneWidth: number;

    readonly bottomPaneShown: boolean;
    readonly bottomPaneHeight: number;

    readonly overlay: Overlay;

    readonly structures: StructureStore;
}

export interface AppView extends AppState {
    toState(): AppState;
    onAny(cb: (name: UPDATE_EVENT) => void): any;
}


export interface AppModel extends AppView {
    set(): ModelUpdater<void>;
    emit(name: UPDATE_EVENT): boolean;
}

export class ModelUpdater<R> {
    private _updates: (() => any)[] = []
    private _events: Set<UPDATE_EVENT> = new Set()

    private _setter<T, V>(event: UPDATE_EVENT, f: (m: ModelImpl, v: T) => V): (v: T) => ModelUpdater<V> {
        return function(this: ModelUpdater<R>, v: T): ModelUpdater<V> {
            this._updates.push(() => f(this._parent, v));
            this._events.add(event);
            return this as any;
        }
    }

    constructor(private _parent: ModelImpl) {}

    async commit(): Promise<R> {
        let r: any = undefined;
        for (let upd of this._updates) {
            const v = upd();
            r = (v instanceof Promise)? await v: v;
        }
        for (let ev of this._events) this._parent.emit(ev);
        return r;
    }

    backgroundColor = this._setter<ngl.Color, void>(UPDATE_BACKGROUND_COLOR, (m, v) => {m.backgroundColor = v});

    windowWidth = this._setter<number, void>(UPDATE_WINDOW_SIZE, (m, v) => {m.windowWidth = v});
    windowHeight = this._setter<number, void>(UPDATE_WINDOW_SIZE, (m, v) => {m.windowHeight = v});

    sidePane = this._setter<SidePane, void>(UPDATE_SIDE_PANE_STATE, (m, v) => {m.sidePane = v});
    sidePaneShown = this._setter<boolean, void>(UPDATE_SIDE_PANE_STATE, (m, v) => {m.sidePaneShown = v});
    sidePaneWidth = this._setter<number, void>(UPDATE_SIDE_PANE_STATE, (m, v) => {m.sidePaneWidth = v});

    bottomPaneShown = this._setter<boolean, void>(UPDATE_BOTTOM_PANE_STATE, (m, v) => {m.bottomPaneShown = v});
    bottomPaneHeight = this._setter<number, void>(UPDATE_BOTTOM_PANE_STATE, (m, v) => {m.bottomPaneHeight = v});

    addOverlay = this._setter<JSX.Element|((id: number) => JSX.Element), number>(UPDATE_OVERLAY, (m, msg) => m.overlay.add(msg));

    removeOverlay = this._setter<number, void>(UPDATE_OVERLAY, (m, v) => {m.overlay.remove(v)});

    addStructure = this._setter<string|File|Blob, Promise<Structure>>(ADD_STRUCTURE, (m, v) => m.structures.addStructure(v));
}


class ModelImpl extends EventEmitter2 {
    public backgroundColor: ngl.Color = new ngl.Color(0x000000);
    public windowHeight: number = window.innerHeight;
    public windowWidth: number = window.innerWidth;

    public sidePane: SidePane;
    public sidePaneWidth: number = 200;
    public sidePaneShown: boolean = false;

    public bottomPaneShown: boolean = false;
    public bottomPaneHeight: number = 150;

    public overlay: Overlay = new Overlay();

    public structures: StructureStore = new StructureStore();

    constructor(public sidePanes: SidePane[] = []) {
        super();
        this.sidePane = sidePanes[0];
    }

    toState(): AppState {
        return Object.assign({}, this);
    }

    set(): ModelUpdater<void> {
        return new ModelUpdater<void>(this);
    }
}

export function createModel(sidePanes: SidePane[] = []): AppModel {
    return new ModelImpl(sidePanes);
}
