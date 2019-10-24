const ObstakelList = require('./ObstakelList');
const Plaats = require('./Plaats.tsx').default;
const PlaatsVPH = require('./PlaatsVPH');
const PropTypes = require('prop-types');
const React = require('react');
const { ondernemerIsAfgemeld, ondernemerIsAfgemeldPeriode, vphIsGewisseld } = require('../../model/ondernemer.functions');

const IndelingslijstGroup = ({
    page,
    plaatsList,
    vphl,
    obstakelList,
    markt,
    ondernemers,
    aanmeldingen,
    toewijzingen,
    type,
    datum,
    plaatsvoorkeuren,
}) => {
    let first = true;

    // const renderPlaats = props => {
    //     return type === 'vasteplaatshouders' ? <Plaats {...props} /> : <Plaats {...props} />;
    // };

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
                        const vph = vphl[plaatsNr];

                        const aanmeldingVph = vph ? aanmeldingen.find(rsvp => rsvp.erkenningsNummer === vph.erkenningsNummer) : null;

                        const toewijzing = (toewijzingen || []).find(({ plaatsen }) => plaatsen.includes(plaatsNr));

                        const ondernemer = toewijzing ? ondernemers.find(
                            ({ erkenningsNummer }) => erkenningsNummer === toewijzing.erkenningsNummer,
                        ) : null;

                        const plaatsProps = {
                            first,
                            key: plaatsNr,
                            plaats: plaatsList[plaatsNr],
                            obstakels: obstakelList,
                            ondernemer,
                            ondernemerIsGewisseld: ondernemer && ondernemer.status === 'vpl' ? vphIsGewisseld(ondernemer, toewijzingen) : false,
                            vph,
                            vphIsGewisseld: vph ? vphIsGewisseld(vph, toewijzingen) : false,
                            vphIsAfgemeld: aanmeldingVph ? ondernemerIsAfgemeld(vph, [aanmeldingVph], datum) : false,
                            vphIsAfgemeldPeriode: vph ? ondernemerIsAfgemeldPeriode(vph, datum) : false,
                            aanmelding: aanmeldingVph,
                            markt,
                            datum,
                            type,
                            toewijzing,
                            plaatsvoorkeuren,
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
    type: PropTypes.string,
    datum: PropTypes.string,
    plaatsvoorkeuren: PropTypes.object,
};

module.exports = IndelingslijstGroup;
