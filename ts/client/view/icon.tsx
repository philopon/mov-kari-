import * as React from 'react';
import * as classNames from 'classnames';

export interface Props {
    title?: string;
    size: number;
    className?: string;
    scale?: number;
    onClick?: () => any;
    divStyles?: React.CSSProperties;
}

export function Icon({title, size, className, scale=1, onClick, divStyles={}}: Props) {
    const divStyle=Object.assign({width: size, height: size, textAlign: 'center'}, divStyles);

    return (
        <div onClick={onClick} title={title} style={divStyle}>
            <i className={classNames('fa', className)} style={{transform: "scale("+(scale)+")", verticalAlign: 'middle'}}/>
        </div>
    );
}

