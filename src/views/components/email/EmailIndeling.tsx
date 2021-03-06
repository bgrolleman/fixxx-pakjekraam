import PropTypes, { ValidationMap } from 'prop-types';
import * as React from 'react';
import EmailBase from '../EmailBase.jsx';
import EmailContent from '../EmailContent.jsx';
import { isVast } from '../../../domain-knowledge.js';
import { EmailVplVoorkeurConfirm } from './EmailVplVoorkeurConfirm';
import { EmailSollNoPlaatsConfirm } from './EmailSollNoPlaatsConfirm';
import { EmailSollPlaatsConfirm } from './EmailSollPlaatsConfirm';
// import { EmailSollRandomPlaatsConfirm } from './components/email/EmailSollRandomPlaatsConfirm';
import { EmailSollVoorkeurConfirm } from './EmailSollVoorkeurConfirm';
import { EmailVplPlaatsConfirm } from './EmailVplPlaatsConfirm';
import { EmailVplDefault } from './EmailVplDefault';
import {
    IAfwijzing,
    IBranche,
    IMarkt,
    IMarktplaats,
    IMarktondernemer,
    IPlaatsvoorkeur,
    IRSVP,
    IToewijzing,
} from '../../../markt.model';

export type EmailIndelingProps = {
    markt: IMarkt;
    marktplaatsen: IMarktplaats[];
    marktDate: string;
    ondernemer: IMarktondernemer;
    toewijzing: IToewijzing;
    afwijzing: IAfwijzing;
    voorkeuren: IPlaatsvoorkeur[];
    aanmeldingen: IRSVP[];
    branches: IBranche[];
    subject: string;
    eggie: boolean;
    telefoonnummer: string;
};

export class EmailIndeling extends React.Component {
    public propTypes: ValidationMap<EmailIndelingProps> = {
        markt: PropTypes.any.isRequired,
        marktplaatsen: PropTypes.array.isRequired,
        marktDate: PropTypes.string.isRequired,
        ondernemer: PropTypes.any.isRequired,
        toewijzing: PropTypes.any,
        afwijzing: PropTypes.any,
        voorkeuren: PropTypes.array,
        aanmeldingen: PropTypes.array,
        branches: PropTypes.array,
        subject: PropTypes.string,
        eggie: PropTypes.bool,
        telefoonnummer: PropTypes.string,
    };

    public render() {
        const { ondernemer, toewijzing, afwijzing, voorkeuren, subject, eggie, telefoonnummer } = this.props as EmailIndelingProps;
        const infoLink = 'https://www.amsterdam.nl/ondernemen/markt-straathandel/digitaal-indelen-plein-40-45/';
        let template;

        if (isVast(ondernemer.status)) {
            template = <EmailVplDefault {...this.props} />;
            if (!voorkeuren.length) {
                template = <EmailVplPlaatsConfirm {...this.props} />;
            } else if (toewijzing) {
                template = <EmailVplVoorkeurConfirm {...this.props} />;
            }
        } else {
            template = <EmailSollNoPlaatsConfirm {...this.props} />;
            if (!afwijzing && !toewijzing) {
                template = <EmailSollPlaatsConfirm {...this.props} />;
            } else if (voorkeuren.length && !afwijzing && toewijzing) {
                template = <EmailSollVoorkeurConfirm {...this.props} />;
            }
        }

        return (
            <EmailBase lang="nl" appName="Kies je kraam" domain="kiesjekraam.amsterdam.nl" subject={subject}>
                {!eggie ? (
                    <EmailContent>
                        <p>Beste {ondernemer.description},</p>
                        <p>
                            Dit is een testmail tijdens de wenperiode van digitaal indelen. U ontvangt deze e-mail omdat
                            u zich digitaal heeft aangemeld.
                        </p>
                        <p>In de toekomst ontvangt u in deze mail uw (toegewezen) plaatsnummers.</p>
                        <p>
                            De loting en de indeling verloopt zoals u nu gewend bent.
                            <br />
                            Er verandert verder niets tijdens de wenperiode.
                        </p>
                        <p>
                            <strong>Meer informatie?</strong>
                            <br />
                            Op deze <a href={infoLink} target="_blank">website</a> kunt u veel informatie vinden over digitaal indelen.
                            Wij raden u aan dit te lezen als u wilt weten hoe het precies werkt.
                        </p>
                        <p>
                            Hebt u daarna nog vragen? Stuur ons dan een e-mail via{' '}
                            <a href="mailto: marktbureau@amsterdam.nl">marktbureau@amsterdam.nl</a> of bel ons via {telefoonnummer}.
                        </p>
                        <p>
                            Met vriendelijke groet,
                            <br />
                            Marktbureau Amsterdam
                        </p>
                    </EmailContent>
                ) : template ? (
                    template
                ) : (
                    <EmailContent />
                )}
            </EmailBase>
        );
    }
}

export default EmailIndeling;
