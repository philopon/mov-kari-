import * as React from 'react';

declare module 'react-color' {
    interface RGB {r: number; g: number; b: number}
    interface HSL {h: number; s: number; l: number}
    interface Alpha {a: number}

    type RGBA = RGB & Alpha
    type HSLA = HSL & Alpha

    interface Color {
        hex: string;
        rgb: RGBA;
        hsl: HSLA;
    }

    interface ChangeHandler {
        (c: Color): any;
    }

    interface CommonProps {
        color?: string|RGB|HSL|RGBA|HSLA;
        onChange?: ChangeHandler;
        onChangeComplete?: ChangeHandler;
    }

    interface SketchProps {
        disableAlpha?: boolean;
        presetColors?: string[];
        width?: number;
    }

    class SketchPicker extends React.Component<CommonProps&SketchProps, {}> {}
}
