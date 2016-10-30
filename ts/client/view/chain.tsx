import * as React from 'react';

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

export function ResidueCell({index, name, onClick}: Residue): JSX.Element {
    return <td className="residue" onClick={onClick} key={index} title={name + ' ' + index}>{name}</td>;
}

export function ChainLine({id, name, residues, skip, onClick}: Chain, header?: JSX.Element): JSX.Element {
    const chainId = <td className="chainName" onClick={onClick}>{name}</td>;
    const spacer = skip ? <td className="spacer" colSpan={skip}></td> : undefined;
    return <tr key={id}>{header}{chainId}{spacer}{residues.map(ResidueCell)}</tr>;
}

export function ChainsLine({name, chains, onClick}: Chains): JSX.Element[] {
    const header = <th rowSpan={chains.length} onClick={onClick}>{name}</th>;
    const l1 = ChainLine(chains[0], header);
    const ls = chains.slice(1).map(c => ChainLine(c));

    return [l1].concat(ls);
}

export interface Props {
    initial: number;
    chains: Chains[];
}


export class ChainPane extends React.Component<Props, {}> {
    render(): JSX.Element {
        // const initial = this.props.initial || 1;
        let [min, max] = [Infinity, -Infinity];

        const chains = this.props.chains.map((chains) => {
            chains.chains.forEach((chain) => {
                chain.residues.forEach((residue) => {
                    if (residue.index < min) min = residue.index;

                    const vmax = residue.index + (chain.skip || 0);
                    if (vmax > max) max = vmax;
                });
            });
            return ChainsLine(chains);
        });

        const indices: JSX.Element[] = [];
        for(let i = min; i < max; i++) {
            indices.push(<th key={i}>{i}</th>);
        }

        const header = <tr><td colSpan={2}/>{indices}</tr>;

       // const chains = this.props.chains.map(ChainsLine);

        return <table id="chains"><tbody>{header}{chains}</tbody></table>;
    }
}
