import * as React from 'react';
import {SidePane} from './base';


export class ConfigPane extends SidePane {
    constructor() {
        super('config');
        this.fontawesome = 'cog';
    }

    content() {
        return <div>xxx</div>
    }
}
