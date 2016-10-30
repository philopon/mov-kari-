import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {ActionEmitter} from './action';
import {AppView} from './view';

import {AppMenuBuilder} from './menu/application';
import {createModel} from './model';
import {AppController} from './controller';

import {DownloadPane} from './sidepane/download';
import {ConfigPane} from './sidepane/config';

const model = createModel([
    new DownloadPane(),
    new ConfigPane(),
]);

const actionEmitter = new ActionEmitter();

new AppMenuBuilder(actionEmitter).apply();

new AppController(model, actionEmitter);


document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    if (main === undefined) {
        throw Error('#main not found');
    }

    ReactDOM.render(
        <AppView model={model} emitter={actionEmitter} />,
        main
    )

    /*
    const fn = async () => {
        // const mol = await ngl.autoLoad("rcsb://1fkb");
        // mol.eachResidue((res) => {console.log(res.resname)}, 'all');

        await stage.loadFile("rcsb://1fkb", { defaultRepresentation: true });
        // console.log(mol);
    };
    fn();
    */

    // console.log((stage as any).signals.clicked.add((d: any) => console.log(d)));
    // model.set().backgroundColor(new ngl.Color(0xffffff)).commit();
});
