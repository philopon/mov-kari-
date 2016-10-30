import * as ngl from 'ngl';


export interface Residue {
    index: number;
    name: string;
    onClick?: () => void;
}

export interface Chain {
    id: string;
    name: string;
    residues: Residue[];
    skip?: number,
    onClick?: () => void;
}

export interface Chains {
    name: string;
    chains: Chain[];
    onClick?: () => void;
}

export class Structure {
    public component?: ngl.StructureComponent

    constructor(public raw: ngl.Structure, public parent: StructureStore, public id: number) {}

    staging(stage: ngl.Stage): void {
        if (this.component !== undefined) return;
        this.component = stage.addComponentFromObject(this.raw);
        stage.defaultFileRepresentation(this.component);
    }

    toState(): Chains {
        const chains: Chain[] = [];
        this.raw.eachChain(chain => {
            const reses: Residue[] = [];
            chain.eachResidue(residue => {
                reses.push({index: residue.resno, name: residue.resname});
            });
            chains.push({id: chain.chainid, name: chain.chainname, residues: reses});
        });
        return {name: this.raw.name, chains: chains};
    }
}


export class StructureStore {
    private store: Map<number, Structure> = new Map();
    private lastId: number = 0;

    constructor() {}

    // TODO: add options
    async addStructure(i: string|File|Blob): Promise<Structure> {
        const s = await ngl.autoLoad(i);
        const w = new Structure(s, this, this.lastId++);
        this.store.set(w.id, w);
        return w;
    }

    get size(): number {
        return this.store.size;
    }

    *structures(): IterableIterator<Structure> {
        for (let s of this.store.values()) {
            yield s;
        }
    }

    map<T>(cb: (s: Structure) => T): T[] {
        const a: T[] = [];
        this.store.forEach((v) => a.push(cb(v)));
        return a;
    }
}
