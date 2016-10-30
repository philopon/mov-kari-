import * as THREE from 'three';
import {Signal} from 'signals';

declare module 'ngl' {
    class Color extends THREE.Color {}

    class Store {
        public length: number;
        public count: number;
    }

    class ResidueStore extends Store {}

    class ResidueProxy {
        structure: Structure;
        index: number;
        resno: number;

        atomCount: number;

        readonly resname: string;
    }

    class ChainProxy {
        chainid: string;
        chainname: string;

        eachResidue(callback: ResidueCallback, selection?: string): void;
    }

    class ModelProxy {
        public index: number;

        eachChain(callback: ChainCallback, selection?: string): void;
    }

    interface ResidueCallback {(residue: ResidueProxy): any}

    interface ChainCallback {(chain: ChainProxy): any}

    interface ModelCallback {(model: ModelProxy): any}

    class Structure {
        public name: string;
        public path: string;
        public id: string;
        public title: string;

        residueStore: ResidueStore;

        getResidueProxy(index: number): ResidueProxy;

        eachResidue(callback: ResidueCallback, selection: string): void;
        eachChain(callback: ChainCallback, selection?: string): void;
        eachModel(callback: ModelCallback, selection?: string): void;
    }

    // TODO: member
    class Component {}

    // TODO: member
    class StructureComponent extends Component {}

    // TODO: member
    class Viewer {
        public container: HTMLElement;
    }

    type CameraType = 'persepective'|'orthographic';

    interface StageParameters {
        backgroundColor?: THREE.Color;
        sampleLevel?: number;
        rotateSpeed?: number;
        zoomSpeed?: number;
        panSpeed?: number;
        clipNear?: number;
        clipFar?: number;
        clipDist?: number;
        fogNear?: number;
        fogFar?: number;
        cameraType?: CameraType;
        cameraFov?: number;
        lightColor?: THREE.Color;
        lightIntensity?: number;
        ambientColor?: THREE.Color;
        ambientIntensity?: number;
        hoverTimeout?: number;
    }

    interface LoadFileParameters {
        ext?: string;
    }

    // TODO: other parameters
    interface StageLoadFileParameters extends LoadFileParameters {
        defaultRepresentation?: boolean;
        asTrajectory?: boolean;
    }

    // TODO: member
    class Stage {
        public viewer: Viewer;

        loadFile(
            path: string|File|Blob,
            params?: StageLoadFileParameters
        ): Promise<StructureComponent>; // TODO: other components

        handleResize(): void;

        setParameters(params: StageParameters): void;

        addComponentFromObject(object: Object, params?: {}): Component;

        defaultFileRepresentation(comp: StructureComponent): void;
    }

    function autoLoad(
        file: string|File|Blob,
        params?: LoadFileParameters,
    ): Promise<Structure>;
}
