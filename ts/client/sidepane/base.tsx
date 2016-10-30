import * as React from 'react';
import * as classNames from 'classnames';

import {sideBarWidth} from '../view/constants';
import {Icon} from '../view/icon';

export class SidePane {
    protected fontawesome: string = 'question';

    constructor(public name: string) {}

    icon(enabled: boolean, onClick: () => any): JSX.Element {
        return <Icon
            size={sideBarWidth}
            key={this.name}
            title={this.name}
            className={classNames('fa', 'fa-2x', 'fa-' + this.fontawesome)}
            scale={0.7}
            divStyles={{opacity: enabled ? 1 : 0.5}}
            onClick={onClick} />
    }

    content(): JSX.Element {
        return <div>content</div>
    }
}
