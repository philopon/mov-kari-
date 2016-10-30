import * as React from 'react';
import * as SplitPane from 'react-split-pane';
import * as ngl from 'ngl';

import {ChainPane} from './chain';
import {sideBarWidth, bottomBarHeight} from './constants';
import {Icon} from './icon';
import * as model from '../model';
import {Stage} from './stage';

import * as action from '../action';

import {DualBar} from './dual-bar';

export interface Prop {
    model: model.AppView;
    emitter: action.ActionEmitter;
}

export class AppView extends React.Component<Prop, model.AppState> {
    private stage: ngl.Stage = new ngl.Stage();

    constructor(props: Prop) {
        super(props);
        this.state = props.model.toState();
    }

    get emitter(): action.ActionEmitter {
        return this.props.emitter;
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.emitter.emit({
                type: action.CHANGE_WINDOW_SIZE,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            });
        });

        const getCallback: (ev: model.UPDATE_EVENT) => ((() => void) | undefined) = (ev) => {
            switch (ev) {
                case model.UPDATE_WINDOW_SIZE:
                case model.UPDATE_BOTTOM_PANE_STATE:
                case model.UPDATE_SIDE_PANE_STATE:
                    return () => this.stage.handleResize();

                case model.UPDATE_BACKGROUND_COLOR:
                    return () => {
                        this.stage.setParameters({
                            backgroundColor: this.props.model.backgroundColor
                        });
                    }

                case model.ADD_STRUCTURE:
                    for (let s of this.props.model.structures.structures()) {
                        s.staging(this.stage);
                    }
                    return;

                case model.UPDATE_OVERLAY:
                    return;
            }
        }

        this.props.model.onAny((ev) => {
            let callback = getCallback(ev);
            this.setState(this.props.model.toState(), callback);
        });

    }

    mainPane(): JSX.Element {
        const {windowHeight, windowWidth,
            sidePaneWidth, sidePaneShown,
            bottomPaneHeight, bottomPaneShown} = this.state;

        const mainPaneWidth = windowWidth - sideBarWidth - (sidePaneShown?sidePaneWidth:0);
        const mainPaneHeight = windowHeight - bottomBarHeight - (bottomPaneShown?bottomPaneHeight:0);

        const chains = this.props.model.structures.map((s) => s.toState());

        return (
            <SplitPane
                split="vertical"
                allowResize={sidePaneShown}
                defaultSize={sidePaneWidth}
                onChange={(v: number) => {this.emitter.emit({type: action.RESIZE_SIDE_PANE, size: v})}}>

                <div id="side-pane">
                    <div className="title">
                        <h1 className="title">{this.state.sidePane.name}</h1>
                    </div>
                    {this.state.sidePane.content()}
                </div>

                <SplitPane
                    split="horizontal"
                    allowResize={bottomPaneShown}
                    defaultSize={bottomPaneHeight}
                    primary="second"
                    onChange={(v: number) => {this.emitter.emit({type: action.RESIZE_BOTTOM_PANE, size: v})}}>

                        <Stage
                            id="stage"
                            stage={this.stage}
                            style={{width: mainPaneWidth, height: mainPaneHeight}}/>

                        <div id="bottom-pane">
                            <ChainPane initial={4} chains={chains}/>
                    </div>

                </SplitPane>
            </SplitPane>
        )
    }

    sideBarButtoms(): JSX.Element[] {
        const {sidePaneShown, sidePane} = this.state;
        return this.state.sidePanes.map((p) => p.icon(
            sidePaneShown && p.name === sidePane.name,
            () => this.emitter.emit({type: action.TOGGLE_SIDE_PANE, pane: p})
        ))
    }

    bottomBarRightButtons(): JSX.Element {
        return (
            <Icon
                title="chain pane"
                size={bottomBarHeight}
                className="fa-align-justify"
                divStyles={{opacity: this.state.bottomPaneShown?1:0.7}}
                onClick={() => this.emitter.emit({type: action.TOGGLE_BOTTOM_PANE})} />
        )
    }

    overlay(): JSX.Element {
        const {sidePaneShown, sidePaneWidth} = this.state;
        return (
            <div id="overlay" style={{top: 0, left: (sidePaneShown ? sidePaneWidth : 0)}}>
                {this.state.overlay.map((k, e) => <div key={k}>{e}</div>)}
            </div>
        )

    }

    render() {
        const {windowWidth, windowHeight} = this.state;
        return (
            <DualBar
                width={windowWidth} height={windowHeight}
                bottomBarHeight={bottomBarHeight} sideBarWidth={sideBarWidth}
                sideBarButtons={this.sideBarButtoms()}
                bottomBarRightButtons={this.bottomBarRightButtons()}>
                {this.overlay()}
                {this.mainPane()}
            </DualBar>
        )
    }
}
