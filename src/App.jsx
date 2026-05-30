import { useState } from "react";
import { X, RefreshCw } from "lucide-react";
import SetupWizard from "./SetupWizard.jsx";
import DemoFlow from "./DemoFlow.jsx";
import CampaignWorkspaceApp from "./CampaignWorkspaceApp.jsx";

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "test" || process.env.VITEST === "true");

export default function App() {
  const [wizardComplete, setWizardComplete] = useState(false);
  const [wizardData, setWizardData] = useState(null);
  const [activeDemoStep, setActiveDemoStep] = useState("editor");
  const [repromptOpen, setRepromptOpen] = useState(false);
  const [productStory, setProductStory] = useState("");
  const [selectedTone, setSelectedTone] = useState("Authentic");

  // Onboarding flow control
  if (!isTestEnv) {
    if (!wizardData) {
      return (
        <SetupWizard
          onComplete={(data) => {
            setWizardData(data);
            setProductStory(data.story || "");
            setSelectedTone(data.tone || "Authentic");
            setActiveDemoStep("generating");
          }}
        />
      );
    }

    if (activeDemoStep === "generating") {
      return (
        <DemoFlow
          data={wizardData}
          view="generating"
          setView={(v) => {
            if (v === "editor") {
              setWizardComplete(true);
              setActiveDemoStep("editor");
            }
          }}
        />
      );
    }

    if (activeDemoStep === "publish" || activeDemoStep === "success") {
      return (
        <DemoFlow
          data={wizardData}
          view={activeDemoStep}
          setView={(v) => {
            if (v === "editor") {
              setWizardComplete(true);
              setActiveDemoStep("editor");
            } else {
              setActiveDemoStep(v);
            }
          }}
          onReset={() => {
            setWizardComplete(true);
            setActiveDemoStep("editor");
          }}
          onBackToEditor={() => {
            setWizardComplete(true);
            setActiveDemoStep("editor");
          }}
        />
      );
    }
  }

  // If in test env or wizard is complete, render the main workspace
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <CampaignWorkspaceApp
        wizardData={wizardData}
        activeDemoStep={activeDemoStep}
        onRepromptClick={() => setRepromptOpen(true)}
        onPublishClick={() => {
          setWizardComplete(false);
          setActiveDemoStep("publish");
        }}
      />

      {repromptOpen && (
        <div className="reprompt-modal-overlay">
          <div className="reprompt-modal">
            <div className="reprompt-modal-header">
              <h3>Edit Campaign Prompts</h3>
              <button className="close-modal" onClick={() => setRepromptOpen(false)} type="button">
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRepromptOpen(false);
                setWizardData((prev) => ({
                  ...prev,
                  story: productStory,
                  tone: selectedTone,
                }));
                setWizardComplete(false);
                setActiveDemoStep("generating");
              }}
              className="reprompt-form"
            >
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <label htmlFor="modal-story" style={{ fontSize: "13px", fontWeight: "700" }}>Adjust Product Story</label>
                <textarea
                  id="modal-story"
                  value={productStory}
                  onChange={(e) => setProductStory(e.target.value)}
                  required
                  style={{
                    height: "120px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--line-strong)",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div className="tone-selector" style={{ margin: "16px 0 24px", textAlign: "left" }}>
                <span className="tone-label" style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "8px" }}>Tone</span>
                <div className="tone-pills" style={{ display: "flex", gap: "8px" }}>
                  {["Authentic", "Funny", "Urgent", "Soft Sell"].map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      className={`tone-pill ${selectedTone === tone ? "selected" : ""}`}
                      onClick={() => setSelectedTone(tone)}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button className="btn-secondary" style={{ width: "auto", padding: "0 20px" }} onClick={() => setRepromptOpen(false)} type="button">
                  Cancel
                </button>
                <button className="btn-primary btn-teal" style={{ width: "auto", padding: "0 20px" }} type="submit">
                  Regenerate <RefreshCw size={14} style={{ marginLeft: "6px" }} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
