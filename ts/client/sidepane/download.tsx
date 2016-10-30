import * as React from 'react';
import {SidePane} from './base';


export class DownloadPane extends SidePane {
    constructor() {
        super('download');
        this.fontawesome = 'download';
    }

    content() {
        return <div>XXXXXXX</div>
    }
}
