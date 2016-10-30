import * as React from 'react';


interface Props {
    width: number,
    height: number,

    sideBarWidth: number,
    bottomBarHeight: number,

    sideBarButtons: JSX.Element|JSX.Element[],
    bottomBarRightButtons: JSX.Element|JSX.Element[],

    children?: JSX.Element|JSX.Element[],
}

export function DualBar({width, height, sideBarWidth, bottomBarHeight, sideBarButtons, bottomBarRightButtons, children}: Props) {
    const mainHeight = height - bottomBarHeight;

    return (
        <div id="app-box" style={{width: width, height: height}}>
            <div id="side-bar" style={{top: 0, left: 0, width: sideBarWidth, height: mainHeight}}>
                {sideBarButtons}
            </div>
            <div id="bottom-bar" style={{bottom: 0, right: 0, width: width, height: bottomBarHeight}}>
                <div className="right">
                    {bottomBarRightButtons}
                </div>
            </div>
            <div id="main-box" style={{position: 'absolute', right:0, top: 0, width: width - sideBarWidth, height: mainHeight}}>
                {children}
            </div>
        </div>
    )
}
