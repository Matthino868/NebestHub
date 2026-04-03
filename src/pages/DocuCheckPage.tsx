import { useMemo, useState } from "react";
import { runDocuCheckAnalysis } from "../services/docuCheckService";
import type { AnalysisOptionKey, DocuCheckResult } from "../types/docucheck";

type WizardStep = 1 | 2 | 3;

interface AnalysisOption {
	key: AnalysisOptionKey;
	label: string;
}

const OPTIONS: AnalysisOption[] = [
	{ key: "templategebruik", label: "Templategebruik" },
	{ key: "congruentie", label: "Congruentie" },
	{ key: "taalgebruik", label: "Taalgebruik & spelling" },
	{ key: "bedrijfsafspraken", label: "Bedrijfsafspraken" },
];

const STEP_TITLES: Record<WizardStep, string> = {
	1: "Document & opties",
	2: "Analyse",
	3: "Resultaat",
};

export default function DocuCheckPage() {
	const [step, setStep] = useState<WizardStep>(1);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedOptions, setSelectedOptions] = useState<Record<AnalysisOption["key"], boolean>>({
		templategebruik: true,
		congruentie: true,
		taalgebruik: true,
		bedrijfsafspraken: true,
	});
	const [analysisProgress, setAnalysisProgress] = useState(0);
	const [runningStepIndex, setRunningStepIndex] = useState(0);
	const [analysisError, setAnalysisError] = useState<string | null>(null);
	const [result, setResult] = useState<DocuCheckResult | null>(null);

	const chosenOptions = useMemo(
		() => OPTIONS.filter((option) => selectedOptions[option.key]),
		[selectedOptions],
	);


	const canStartAnalysis = Boolean(selectedFile) && chosenOptions.length > 0;

	const readFileContent = async (file: File) => {
		try {
			return await file.text();
		} catch {
			return "";
		}
	};

	const startAnalysis = async () => {
		if (!canStartAnalysis) {
			return;
		}

		setStep(2);
		setAnalysisProgress(0);
		setRunningStepIndex(0);
		setAnalysisError(null);
		setResult(null);

		const stepTimer = window.setInterval(() => {
			setRunningStepIndex((prev) => Math.min(prev + 1, chosenOptions.length - 1));
		}, 850);

		const progressTimer = window.setInterval(() => {
			setAnalysisProgress((prev) => Math.min(prev + 7, 93));
		}, 350);

		try {
			const fileText = await readFileContent(selectedFile as File);
			const analysisResult = await runDocuCheckAnalysis({
				fileName: selectedFile?.name ?? "onbekend document",
				fileText,
				selectedOptions: chosenOptions.map((option) => option.key),
			});

			window.clearInterval(stepTimer);
			window.clearInterval(progressTimer);
			setRunningStepIndex(chosenOptions.length);
			setAnalysisProgress(100);
			setResult(analysisResult);

			window.setTimeout(() => {
				setStep(3);
			}, 300);
		} catch (error) {
			window.clearInterval(stepTimer);
			window.clearInterval(progressTimer);
			setAnalysisProgress(0);
			setRunningStepIndex(0);
			setStep(1);
			setAnalysisError(error instanceof Error ? error.message : "Er ging iets mis tijdens de analyse.");
		}
	};

	const resetWizard = () => {
		setStep(1);
		setSelectedFile(null);
		setAnalysisProgress(0);
		setRunningStepIndex(0);
		setAnalysisError(null);
		setResult(null);
		setSelectedOptions({
			templategebruik: true,
			congruentie: true,
			taalgebruik: true,
			bedrijfsafspraken: true,
		});
	};

	return (
		<main className="docucheck-page">
			<h1 style={{ marginBottom: 8 }}>DocuCheck wizard</h1>
			<p className="docucheck-subtitle">Stap {step} van 3: {STEP_TITLES[step]}</p>

			<div className="docucheck-track">
				{[1, 2, 3].map((item) => {
					const wizardStep = item as WizardStep;
					const className = wizardStep < step
						? "docucheck-track-segment done"
						: wizardStep === step
							? "docucheck-track-segment active"
							: "docucheck-track-segment";

					return (
						<div key={item} className={className} aria-hidden="true" />
					);
				})}
			</div>

			{step === 1 ? (
				<section className="docucheck-card">
					<div>
						<label htmlFor="document" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
							Selecteer document
						</label>
						<input
							className="docucheck-input"
							id="document"
							type="file"
							onChange={(event) => {
								const file = event.target.files?.[0] ?? null;
								setSelectedFile(file);
							}}
							accept=".pdf,.doc,.docx,.txt"
						/>
						{selectedFile ? (
							<p className="docucheck-note" style={{ margin: "10px 0 0" }}>Geselecteerd: {selectedFile.name}</p>
						) : (
							<p className="docucheck-note" style={{ margin: "10px 0 0" }}>Nog geen document geselecteerd.</p>
						)}
						{analysisError ? (
							<p className="docucheck-error" style={{ margin: "10px 0 0" }}>{analysisError}</p>
						) : null}
					</div>

					<div>
						<h2 style={{ margin: "0 0 12px", fontSize: 20 }}>Selecteer controles</h2>
						<div style={{ display: "grid", gap: 10 }}>
							{OPTIONS.map((option) => (
								<label key={option.key} style={{ display: "flex", gap: 10, alignItems: "center" }}>
									<input
										type="checkbox"
										checked={selectedOptions[option.key]}
										onChange={(event) => {
											const isChecked = event.target.checked;
											setSelectedOptions((prev) => ({
												...prev,
												[option.key]: isChecked,
											}));
										}}
									/>
									<span>{option.label}</span>
								</label>
							))}
						</div>
					</div>

					<div style={{ display: "flex", justifyContent: "flex-end" }}>
						<button
							type="button"
							onClick={() => {
								void startAnalysis();
							}}
							className="docucheck-primary-btn"
							disabled={!canStartAnalysis}
						>
							Start analyse
						</button>
					</div>
				</section>
			) : null}

			{step === 2 ? (
				<section className="docucheck-card">
					<h2 style={{ margin: 0, fontSize: 22 }}>Analyse wordt uitgevoerd</h2>
					<p className="docucheck-note" style={{ margin: 0 }}>
						Document: {selectedFile?.name ?? "onbekend"}
					</p>

					<div className="docucheck-progress">
						<div
							className="docucheck-progress-fill"
							style={{ width: `${analysisProgress}%` }}
						/>
					</div>

					<p style={{ margin: 0, fontWeight: 700 }}>{analysisProgress}% voltooid</p>

					<ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
						{chosenOptions.map((option, index) => {
							const status =
								index < runningStepIndex
									? "Klaar"
									: index === runningStepIndex
										? "Bezig..."
										: "Wacht";

							return (
								<li key={option.key}>
									{option.label} - <strong>{status}</strong>
								</li>
							);
						})}
					</ul>
				</section>
			) : null}

			{step === 3 ? (
				<section className="docucheck-card">
					<h2 style={{ margin: 0, fontSize: 22 }}>Resultaat</h2>
					<p style={{ margin: 0 }}>
						Analyse afgerond voor <strong>{selectedFile?.name ?? "document"}</strong>.
					</p>
					<p className="docucheck-note" style={{ margin: 0 }}>
						{result?.summary ?? "Geen samenvatting ontvangen."}
					</p>

					<div>
						<h3 style={{ marginTop: 0 }}>Samenvatting verbeterpunten</h3>
						<ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
							{(result?.improvements.length ?? 0) > 0 ? (
								result?.improvements.map((improvement, index) => (
									<li key={`${improvement.title}-${index}`}>
										<strong>{improvement.title}</strong> ({improvement.category}, {improvement.severity})
										<div className="docucheck-note">{improvement.detail}</div>
									</li>
								))
							) : (
								<li>Geen verbeterpunten ontvangen.</li>
							)}
						</ul>
					</div>

					<div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
						<button
							type="button"
							onClick={() => setStep(1)}
							className="docucheck-secondary-btn"
						>
							Instellingen aanpassen
						</button>
						<button
							type="button"
							onClick={resetWizard}
							className="docucheck-primary-btn"
						>
							Nieuwe controle
						</button>
					</div>
				</section>
			) : null}
		</main>
	);
}
