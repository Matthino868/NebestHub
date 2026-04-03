import { useMemo, useState, type FormEvent } from "react";

export default function ProjectAccessPage() {
  const [projectNumber, setProjectNumber] = useState("");
  const [submittedProjectNumber, setSubmittedProjectNumber] = useState<string | null>(null);

  const trimmedInput = projectNumber.trim();

  const explorerTarget = useMemo(() => {
    if (!submittedProjectNumber) {
      return "";
    }

    return `file:///R:/Projecten/${encodeURIComponent(submittedProjectNumber)}`;
  }, [submittedProjectNumber]);

  const sharePointTarget = useMemo(() => {
    if (!submittedProjectNumber) {
      return "";
    }

    return `https://nebest.sharepoint.com/sites/projecten/${encodeURIComponent(submittedProjectNumber)}`;
  }, [submittedProjectNumber]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedInput) {
      return;
    }

    setSubmittedProjectNumber(trimmedInput);
  };

  const openExplorerDemo = () => {
    if (!explorerTarget) {
      return;
    }

    window.location.href = explorerTarget;
  };

  const openSharePointDemo = () => {
    if (!sharePointTarget) {
      return;
    }

    window.open(sharePointTarget, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1>Project toegang</h1>
        <p>Demo: vul een projectnummer in en open daarna Explorer of SharePoint.</p>
      </header>

      <article className="portal-card project-access-card">
        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="project-number" className="project-form-label">
            Projectnummer
          </label>
          <input
            id="project-number"
            className="project-form-input"
            type="text"
            value={projectNumber}
            onChange={(event) => setProjectNumber(event.target.value)}
            placeholder="Bijv. 24-0156"
          />
          <button type="submit" className="portal-button" disabled={!trimmedInput}>
            Zoek projectmap
          </button>
        </form>

        {submittedProjectNumber ? (
          <div className="project-result">
            <h2>Resultaat voor {submittedProjectNumber}</h2>
            <p>Dit is een showcase van wat mogelijk is in productie.</p>

            <div className="project-target-list">
              <div className="project-target-item">
                <strong>Explorer pad</strong>
                <span>{explorerTarget}</span>
                <button type="button" className="portal-button" onClick={openExplorerDemo}>
                  Open Explorer (demo)
                </button>
              </div>

              <div className="project-target-item">
                <strong>SharePoint map</strong>
                <span>{sharePointTarget}</span>
                <button type="button" className="portal-button" onClick={openSharePointDemo}>
                  Open SharePoint (demo)
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
