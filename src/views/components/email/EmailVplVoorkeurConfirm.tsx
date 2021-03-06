import PropTypes, { ValidationMap } from 'prop-types';
import * as React from 'react';
import EmailContent from '../EmailContent.jsx';
import EmailTable from '../EmailTable.jsx';
import { formatDate, capitalize, fullRelativeHumanDate, arrayToObject, flatten } from '../../../util';
import { IMarkt, IMarktplaats, IMarktondernemer, IToewijzing, IBranche } from '../../../markt.model';

export type EmailVplVoorkeurConfirmProps = {
    markt: IMarkt;
    marktplaatsen: IMarktplaats[];
    marktDate: string;
    ondernemer: IMarktondernemer;
    toewijzing: IToewijzing;
    branches: IBranche[];
    telefoonnummer: string;
};

export class EmailVplVoorkeurConfirm extends React.Component {
    public propTypes: ValidationMap<EmailVplVoorkeurConfirmProps> = {
        markt: PropTypes.any.isRequired,
        marktplaatsen: PropTypes.array.isRequired,
        marktDate: PropTypes.string.isRequired,
        ondernemer: PropTypes.any.isRequired,
        toewijzing: PropTypes.any,
        branches: PropTypes.array,
        telefoonnummer: PropTypes.string
    };

    public render() {
        // const props:  = this.props;
        const { markt, marktplaatsen, marktDate, ondernemer, toewijzing, branches, telefoonnummer } = this
            .props as EmailVplVoorkeurConfirmProps;
        const fontGray = { color: '#767676' };
        const branchesObj = arrayToObject(branches, 'brancheId');

        const marktBranches = arrayToObject(marktplaatsen.filter(plaats => plaats.branches), 'plaatsId');
        const ondernemerPlaatsBranches = toewijzing.plaatsen.map(plaatsId => {
            const plaatsBranches =
                marktBranches[plaatsId] &&
                marktBranches[plaatsId].branches &&
                marktBranches[plaatsId].branches
                    .map(br => (branchesObj[br] ? branchesObj[br].description : null))
                    .filter(br => br)
                    .join(' ');

            return plaatsBranches ? plaatsBranches : 'geen';
        });

        const bijzonderheden = ondernemer.plaatsen
            .map(plaatsId => marktplaatsen.find(p => p.plaatsId === plaatsId))
            .filter(Boolean)
            .map(plaats => plaats.properties || [])
            .reduce(flatten, []);

        const uitbreiding = toewijzing.plaatsen.length > ondernemer.plaatsen.length;
        const verkleining = toewijzing.plaatsen.length < ondernemer.plaatsen.length;
        const isVastePlaats = toewijzing.plaatsen.sort().join('-') === ondernemer.plaatsen.sort().join('-');
        const uitbreidingVastePlaatsen = toewijzing.plaatsen
            .sort()
            .join('-')
            .includes(ondernemer.plaatsen.sort().join('-'));
        const verkleiningVastePlaatsen = ondernemer.plaatsen
            .sort()
            .join('-')
            .includes(toewijzing.plaatsen.sort().join('-'));

        const defaultText = 'Dit zijn uw vaste plaatsen. u hebt helaas geen van uw voorkeursplaats(en) gekregen.';
        const verplaatsText = 'Dit is een voorkeursplaats die u hebt aangevraagd.';
        const vekleiningText = 'Dit is een verkleining van uw vaste plaats die u hebt aangevraagd';
        const vekleiningVerplaatsText = 'Dit is een verplaatsing en verkleining die u hebt aangevraagd';
        const uitbreidingVerplaatsText = 'Dit is een voorkeursplaats met extra plaats(en) die u hebt aangevraagd';
        const uitbreidingNietVerplaatsText = 'Dit is uw vaste plaats met extra plaats(en) die u hebt aangevraagd';

        let toewijzingsText = isVastePlaats ? defaultText : verplaatsText;

        if (uitbreiding) {
            toewijzingsText = uitbreidingVastePlaatsen ? uitbreidingNietVerplaatsText : uitbreidingVerplaatsText;
        } else if (verkleining) {
            toewijzingsText = verkleiningVastePlaatsen ? vekleiningText : vekleiningVerplaatsText;
        }

        const tableData = [
            [
                'Plaats nrs:',
                <span key="plaats">
                    <strong>{toewijzing.plaatsen.join(', ')}</strong>
                    <br />
                    {toewijzingsText}
                </span>,
            ],
            ['Soortplaats:', <strong key="Soortplaats">{ondernemerPlaatsBranches.join(', ')}</strong>],
            [
                'Bijzonderheden:',
                <strong key="remarks">{bijzonderheden.length ? bijzonderheden.join(' ') : 'geen'}</strong>,
            ],
            ['Markt:', <strong key="markt">{markt.naam}</strong>],
            ['Datum:', <strong key="date">{formatDate(marktDate)}</strong>],
        ];

        return (
            <EmailContent>
                <p>Beste {ondernemer.description},</p>

                <EmailContent>
                    <p>
                        {capitalize(fullRelativeHumanDate(marktDate))} is uw plaats op de markt {markt.naam}
                    </p>
                    <EmailTable data={tableData} />
                </EmailContent>
                <EmailContent>
                    <p style={fontGray}>
                        Als u onverwachts toch niet kunt komen verzoeken wij u dit uiterlijk 08.45 uur aan de
                        marktmeester te melden zodat een andere koopman uw plaats kan krijgen.
                    </p>
                    {telefoonnummer ? (
                    <p style={fontGray}>
                        Dit kan telefonisch via: {telefoonnummer}.
                    </p>) : null }
                </EmailContent>
                <p>
                    Met vriendelijke groet,
                    <br />
                    Marktbureau Amsterdam
                </p>
            </EmailContent>
        );
    }
}
