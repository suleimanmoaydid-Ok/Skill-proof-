/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { AssessorDashboard } from "./components/assessor/AssessorDashboard";
import { AssessmentSection } from "./components/candidate/AssessmentSection";
import { BridgingPathwaysSection } from "./components/candidate/BridgingPathwaysSection";
import { CredentialMapperSection } from "./components/candidate/CredentialMapperSection";
import { DigitalPassportSection } from "./components/candidate/DigitalPassportSection";
import { EvidenceEngineSection } from "./components/candidate/EvidenceEngineSection";
import { OverviewSection } from "./components/candidate/OverviewSection";
import { ProfileSection } from "./components/candidate/ProfileSection";
import { ProjectsSection } from "./components/candidate/ProjectsSection";
import { QualificationsSection } from "./components/candidate/QualificationsSection";
import { SettingsSection } from "./components/candidate/SettingsSection";
import { SkillsSection } from "./components/candidate/SkillsSection";
import { DashboardLayout } from "./components/DashboardLayout";
import { LandingPage } from "./components/LandingPage";
import { createBlankPersonalCandidate, DEMO_CANDIDATES } from "./data/demoData";
import { CandidateAccount, DashboardSection, SkillProofState } from "./types/skillproof";
import {
  loadSkillProofState,
  resetSkillProofState,
  saveSkillProofState,
} from "./utils/storage";

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("landing");
  const [state, setState] = useState<SkillProofState>(() => loadSkillProofState());
  const [evidenceProjectId, setEvidenceProjectId] = useState<string | null>(null);

  useEffect(() => {
    saveSkillProofState(state);
  }, [state]);

  const activeCandidate =
    state.candidates.find((c) => c.id === state.activeCandidateId) ||
    state.candidates[0] ||
    DEMO_CANDIDATES[0];

  const demoPreviewCandidate =
    state.candidates.find((c) => c.isDemoAccount) || DEMO_CANDIDATES[0];

  function updateCandidate(updated: CandidateAccount) {
    setState((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => (c.id === updated.id ? updated : c)),
    }));
  }

  function handleEnterDemo(section: DashboardSection = "overview") {
    setState((prev) => ({
      ...prev,
      activeCandidateId: demoPreviewCandidate.id,
      activeRole: "candidate",
      activeSection: section,
    }));
    setViewMode("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStartPersonalProfile() {
    const existingPersonal = state.candidates.find((c) => !c.isDemoAccount);
    if (existingPersonal) {
      setState((prev) => ({
        ...prev,
        activeCandidateId: existingPersonal.id,
        activeRole: "candidate",
        activeSection: "profile",
      }));
    } else {
      const fresh = createBlankPersonalCandidate("Candidate Profile");
      setState((prev) => ({
        ...prev,
        candidates: [fresh, ...prev.candidates],
        activeCandidateId: fresh.id,
        activeRole: "candidate",
        activeSection: "profile",
      }));
    }
    setViewMode("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenAssessorConsole() {
    setState((prev) => ({
      ...prev,
      activeRole: "assessor",
    }));
    setViewMode("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCreatePersonalCandidate(fullName: string) {
    const fresh = createBlankPersonalCandidate(fullName);
    setState((prev) => ({
      ...prev,
      candidates: [fresh, ...prev.candidates],
      activeCandidateId: fresh.id,
      activeSection: "profile",
    }));
  }

  function handleResetDemoData() {
    const restored = resetSkillProofState();
    setState({
      ...restored,
      activeSection: state.activeSection,
      activeRole: state.activeRole,
    });
  }

  if (viewMode === "landing") {
    return (
      <LandingPage
        demoCandidate={demoPreviewCandidate}
        onEnterDemo={handleEnterDemo}
        onStartPersonalProfile={handleStartPersonalProfile}
        onOpenAssessorConsole={handleOpenAssessorConsole}
      />
    );
  }

  return (
    <DashboardLayout
      candidate={activeCandidate}
      activeRole={state.activeRole}
      activeSection={state.activeSection}
      onSelectSection={(section) =>
        setState((prev) => ({ ...prev, activeSection: section }))
      }
      onSwitchRole={(role) => setState((prev) => ({ ...prev, activeRole: role }))}
      onBackToLanding={() => {
        setViewMode("landing");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {state.activeRole === "assessor" ? (
        <AssessorDashboard
          candidates={state.candidates}
          onUpdateCandidate={updateCandidate}
        />
      ) : (
        <>
          {state.activeSection === "overview" && (
            <OverviewSection
              candidate={activeCandidate}
              onNavigate={(section) =>
                setState((prev) => ({ ...prev, activeSection: section }))
              }
            />
          )}
          {state.activeSection === "profile" && (
            <ProfileSection
              key={activeCandidate.id}
              candidate={activeCandidate}
              onUpdateCandidate={updateCandidate}
            />
          )}
          {state.activeSection === "qualifications" && (
            <QualificationsSection
              candidate={activeCandidate}
              onUpdateCandidate={updateCandidate}
              onOpenMapper={() =>
                setState((prev) => ({ ...prev, activeSection: "credential-mapper" }))
              }
            />
          )}
          {state.activeSection === "skills" && (
            <SkillsSection
              candidate={activeCandidate}
              onUpdateCandidate={updateCandidate}
            />
          )}
          {state.activeSection === "projects" && (
            <ProjectsSection
              candidate={activeCandidate}
              onUpdateCandidate={updateCandidate}
              onAnalyzeProject={(projectId) => {
                setEvidenceProjectId(projectId);
                setState((prev) => ({ ...prev, activeSection: "evidence" }));
              }}
            />
          )}
          {state.activeSection === "evidence" && (
            <EvidenceEngineSection
              candidate={activeCandidate}
              initialProjectId={evidenceProjectId}
              onUpdateCandidate={updateCandidate}
              onGoToAssessment={() =>
                setState((prev) => ({ ...prev, activeSection: "assessment" }))
              }
            />
          )}
          {state.activeSection === "assessment" && (
            <AssessmentSection
              candidate={activeCandidate}
              onUpdateCandidate={updateCandidate}
              onNavigateToBridging={() =>
                setState((prev) => ({ ...prev, activeSection: "bridging" }))
              }
            />
          )}
          {state.activeSection === "credential-mapper" && (
            <CredentialMapperSection
              candidate={activeCandidate}
              onGoToQualifications={() =>
                setState((prev) => ({ ...prev, activeSection: "qualifications" }))
              }
              onGoToBridging={() =>
                setState((prev) => ({ ...prev, activeSection: "bridging" }))
              }
            />
          )}
          {state.activeSection === "bridging" && (
            <BridgingPathwaysSection
              candidate={activeCandidate}
              onUpdateCandidate={updateCandidate}
            />
          )}
          {state.activeSection === "passport" && (
            <DigitalPassportSection candidate={activeCandidate} />
          )}
          {state.activeSection === "settings" && (
            <SettingsSection
              activeCandidate={activeCandidate}
              allCandidates={state.candidates}
              onSwitchCandidate={(candidateId) =>
                setState((prev) => ({ ...prev, activeCandidateId: candidateId }))
              }
              onCreatePersonalCandidate={handleCreatePersonalCandidate}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
