import { useState } from "react";

export default function HomePage() {
    const [infoMessage, setInfoMessage] = useState<string>("");

    const openLocalApp = (protocol: "ms-excel:" | "ms-word:", params: string = "") => {
        window.location.href = protocol + params;
    };

    const openExternal = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const showNotConfigured = (appName: string) => {
        setInfoMessage(`${appName} is nog niet gekoppeld aan een interne link.`);
    };

    const appShortcuts = [
        {
            name: "Word",
            icon: "/word.png",
            onClick: () => openLocalApp("ms-word:", "nft|u|"),
        },
        {
            name: "Excel",
            icon: "/excel.png",
            onClick: () => openLocalApp("ms-excel:", "ofe|u|"),
        },
        { name: "OneNote", icon: "/onenote.png", onClick: () => openExternal("https://www.onenote.com") },
        { name: "Outlook", icon: "/outlook.png", onClick: () => openExternal("https://outlook.office.com") },
        { name: "Teams", icon: "/teams.png", onClick: () => openExternal("https://teams.microsoft.com") },
        { name: "GO App", icon: "/go.png", onClick: () => showNotConfigured("GO App") },
        { name: "AFAS Insite", icon: "/afas-inside.png", onClick: () => showNotConfigured("AFAS Insite") },
        { name: "AFAS", icon: "/afas.png", onClick: () => showNotConfigured("AFAS") },
        { name: "Inspectietool", icon: "/inspectietool.png", onClick: () => openExternal("https://inspectie.nebest.nl") },
        { name: "VLC", icon: "/VLC.png", onClick: () => showNotConfigured("VLC") },
    ];

    return (
        <section className="page home-page">
            <header className="page-header">
                <h1>Nebest Portal</h1>
                <p>Welkom. Kies een tool of check de laatste bedrijfsupdates.</p>
            </header>

            <div className="cards-grid">
                <article className="portal-card">
                    <h2>Microsoft Apps</h2>
                    <p>Open je tools via tegels zoals op je werkplek.</p>
                    <div className="app-shortcuts-grid">
                        {appShortcuts.map((app) => (
                            <button
                                key={app.name}
                                type="button"
                                className="app-shortcut"
                                onClick={app.onClick}
                                title={`Open ${app.name}`}
                            >
                                <span className="app-icon-wrap">
                                    <img src={app.icon} alt={`${app.name} icon`} className="app-icon" />
                                </span>
                                <span className="app-label">{app.name}</span>
                            </button>
                        ))}
                    </div>
                    {infoMessage ? <p style={{ marginTop: 10 }}>{infoMessage}</p> : null}

                </article>

                <article className="portal-card">
                    <h2>Company News</h2>
                    <ul className="news-list news-scroll">
                        <li>
                            <strong>Feest:</strong> Team QA verwelkomt een nieuwe baby,
                            gefeliciteerd met de geboorte.
                        </li>
                        <li>
                            <strong>Software update:</strong> Nieuw intern planningssysteem
                            wordt maandag uitgerold.
                        </li>
                        <li>
                            <strong>IT:</strong> Onderhoud aan fileserver gepland op vrijdag om
                            18:00.
                        </li>
                        <li>
                            <strong>HR:</strong> Nieuwe onboarding-gids staat live in het
                            intranet.
                        </li>
                        <li>
                            <strong>Project:</strong> Inspectie dashboard v2 is vanaf volgende
                            week beschikbaar.
                        </li>
                        <li>
                            <strong>Veiligheid:</strong> Herinnering BHV-oefening op dinsdag om
                            09:00.
                        </li>
                        <li>
                            <strong>Kantoor:</strong> Nieuwe vergaderruimtes zijn nu boekbaar via
                            Outlook.
                        </li>
                        <li>
                            <strong>Software update:</strong> Teams en Office clients worden
                            vannacht automatisch bijgewerkt.
                        </li>
                    </ul>
                </article>
            </div>
        </section>
    );
}
