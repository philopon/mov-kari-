import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as ngl from 'ngl';

export interface HasViewer {
    handleResize(): void;
    viewer: ngl.Viewer;
}

export interface Props {
    stage: HasViewer;
}

export class Stage extends React.Component<Props & React.HTMLProps<HTMLDivElement>, {}> {
    componentDidMount() {
        const element = ReactDOM.findDOMNode<HTMLElement>(this);
        element.appendChild(this.props.stage.viewer.container);
        this.props.stage.handleResize();
    }

    componentWillUnmount() {
        const element = ReactDOM.findDOMNode<HTMLElement>(this);
        element.removeChild(this.props.stage.viewer.container);
    }

    render() {
        let props = Object.assign({}, this.props);
        delete props['stage'];
        return <div {...props}/>
    }
}
