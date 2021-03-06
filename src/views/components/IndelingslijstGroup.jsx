const ObstakelList = require('./ObstakelList');
const Plaats = require('./Plaats.tsx').default;
// const PlaatsVPH = require('./PlaatsVPH');
const PropTypes = require('prop-types');
const React = require('react');
const { ondernemerIsAfgemeld, ondernemerIsAfgemeldPeriode, vphIsGewisseld, vphIsUitgebreid } = require('../../model/ondernemer.functions');

const IndelingslijstGroup = ({
    page,
    plaatsList,
    vphl,
    obstakelList,
    markt,
    ondernemers,
    aanmeldingen,
    toewijzingen,
    datum,
    voorkeuren,
    plaatsvoorkeuren,
    branches,
}) => {
    let first = true;

    const classes = page.class.split(' ').map(cl => {
        return 'IndelingslijstGroup--markt-' + markt.id + ' IndelingslijstGroup--' + cl.trim();
    });

    return (
        <div className={'IndelingslijstGroup ' + classes}>
            <h4 className="IndelingslijstGroup__title">{page.title}</h4>
            {page.landmarkTop && (
                <p className="IndelingslijstGroup__landmark IndelingslijstGroup__landmark-top">{page.landmarkTop}</p>
            )}

            <table className="IndelingslijstGroup__table" cellPadding="0" cellSpacing="0">
                <thead className="IndelingslijstGroup__wrapper">
                    <tr className="IndelingslijstGroup__header-row">
                        <th
                            className="IndelingslijstGroup__header
                                       IndelingslijstGroup__header-properties
                                       Plaats__prop Plaats__prop-properties"
                        />
                        <th className="IndelingslijstGroup__header IndelingslijstGroup__header-plaats Plaats__prop Plaats__prop-plaats-nr">
                            nr.
                        </th>
                        <th className="IndelingslijstGroup__header IndelingslijstGroup__vph Plaats__prop Plaats__prop-soll">
                            vph
                        </th>
                        <th className="IndelingslijstGroup__header IndelingslijstGroup__vph Plaats__prop Plaats__prop-naam" />
                        <th className="IndelingslijstGroup__header IndelingslijstGroup__empty-field Plaats__prop Plaats__prop-soll" />
                        <th className="IndelingslijstGroup__header IndelingslijstGroup__empty-field Plaats__prop Plaats__prop-naam" />
                        <th className="IndelingslijstGroup__header IndelingslijstGroup__status Plaats__prop Plaats__prop-status" />
                    </tr>
                </thead>
                <tbody className="IndelingslijstGroup__wrapper">
                    {page.plaatsList.map((plaatsNr, i) => {
                        let originelePlaatshouder = vphl[plaatsNr];
                        let voorkeurOp = null;

                        if (originelePlaatshouder) {
                            originelePlaatshouder = ondernemers.find(ondernemer => ondernemer.erkenningsNummer == originelePlaatshouder.erkenningsNummer);
                            voorkeurOp = voorkeuren.find(voorkeur => voorkeur.erkenningsNummer == originelePlaatshouder.erkenningsNummer);
                        }

                        const aanmeldingVph = originelePlaatshouder ? aanmeldingen.find(rsvp => rsvp.erkenningsNummer === originelePlaatshouder.erkenningsNummer) : null;

                        const toewijzing = (toewijzingen || []).find(({ plaatsen }) => plaatsen.includes(plaatsNr));

                        const ingedeeldeOndernemer = toewijzing ? ondernemers.find(
                            ({ erkenningsNummer }) => erkenningsNummer === toewijzing.erkenningsNummer,
                        ) : null;

                        const plaats = plaatsList[plaatsNr];
                        let color = null;
                        if (plaats.branches) {
                            const plaatsBranche = branches.find(branche => branche.brancheId === plaats.branches[0]);
                            plaatsBranche && plaatsBranche.color ? color = plaatsBranche.color : null;
                        }

                        const plaatsProps = {
                            first,
                            key: plaatsNr,
                            plaats: plaatsList[plaatsNr],
                            obstakels: obstakelList,
                            ondernemer: ingedeeldeOndernemer,
                            vph: originelePlaatshouder,
                            opUitgebreid: originelePlaatshouder && toewijzingen ? vphIsUitgebreid(originelePlaatshouder, toewijzingen) : false,
                            opGewisseld: originelePlaatshouder && toewijzingen ? vphIsGewisseld(originelePlaatshouder, toewijzingen) : false,
                            opAfgemeld: aanmeldingVph ? ondernemerIsAfgemeld(originelePlaatshouder, [aanmeldingVph], datum) : false,
                            opAfgemeldPeriode: originelePlaatshouder && voorkeurOp ? ondernemerIsAfgemeldPeriode(voorkeurOp, datum) : false,
                            ondernemerUitgebreid: ingedeeldeOndernemer && ingedeeldeOndernemer.status == 'vpl' ? vphIsUitgebreid(ingedeeldeOndernemer, toewijzingen) : false,
                            ondernemerGewisseld: ingedeeldeOndernemer && ingedeeldeOndernemer.status == 'vpl' ? vphIsGewisseld(ingedeeldeOndernemer, toewijzingen) : false,
                            aanmelding: aanmeldingVph,
                            markt,
                            datum,
                            toewijzing,
                            plaatsvoorkeuren,
                            color,
                        };

                        if (plaatsList[plaatsNr]) {
                            if (obstakelList[plaatsNr] && obstakelList[plaatsNr].length > 0) {
                                return (
                                    <React.Fragment key={plaatsNr}>
                                        <Plaats {...plaatsProps} />
                                        <ObstakelList obstakelList={obstakelList[plaatsNr]} />
                                        {(first = true)}
                                    </React.Fragment>
                                );
                            } else {
                                return (
                                    <React.Fragment key={plaatsNr}>
                                        <Plaats {...plaatsProps} />
                                        {(first = false)}
                                    </React.Fragment>
                                );
                            }
                        } else {
                            return <Plaats key={i} />;
                        }
                    })}
                </tbody>
            </table>
            {page.landmarkBottom && (
                <p className="IndelingslijstGroup__landmark IndelingslijstGroup__landmark-bottom">
                    {page.landmarkBottom}
                </p>
            )}
        </div>
    );
};

IndelingslijstGroup.propTypes = {
    aanmeldingen: PropTypes.array.isRequired,
    toewijzingen: PropTypes.array,
    page: PropTypes.object,
    plaatsList: PropTypes.object,
    vphl: PropTypes.object,
    obstakelList: PropTypes.object,
    ondernemers: PropTypes.array.isRequired,
    markt: PropTypes.object.isRequired,
    datum: PropTypes.string,
    plaatsvoorkeuren: PropTypes.object,
    voorkeuren: PropTypes.array,
    branches: PropTypes.array.isRequired
};

module.exports = IndelingslijstGroup;
