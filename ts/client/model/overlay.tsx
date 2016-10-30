import * as React from 'react';

export class Overlay {
    private _lastid: number = 0;
    private _elements: Map<number, JSX.Element> = new Map();

    add(e: JSX.Element|((id: number) => JSX.Element)): number {
        const id = ++this._lastid;
        if (typeof e === 'function') {
            this._elements.set(id, e(id));
        } else {
            this._elements.set(id, e);
        }
        return id;

    }

    remove(id: number): boolean {
        return this._elements.delete(id);
    }

    toArray(): JSX.Element[] {
        return this.map((_, v) => v);
    }

    map<T>(cb: (k: number, e: JSX.Element) => T): T[] {
        const keys: number[] = [];
        for(let key of this._elements.keys()) {
            keys.push(key);
        }
        keys.sort();

        return keys.map((k) => cb(k, this._elements.get(k) || <div/>));
    }
}
