"use client";

import { useState, useTransition } from "react";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepReview from "./StepReview";
import SuccessScreen from "./SuccessScreen";
import { useDraft } from "../useDraft";
import { submitGrievance } from "../actions";
import { StepOneData, StepTwoData, GrievanceFormData } from "@/lib/schema";
import { appendGrievanceHistory } from "@/lib/storage";

const steps = ["Your Details", "Grievance Details", "Review & Submit"];

const emptyData: Partial<GrievanceFormData> = {
  submitterName: "",
  email: "",
  relation: undefined,
  roomNumber: "",
  contactPhone: "",
  category: undefined,
  priority: undefined,
  description: "",
};

export default function GrievanceForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [draftSavedOpen, setDraftSavedOpen] = useState(false);

  const { data, save, clear, loaded } = useDraft<Partial<GrievanceFormData>>(emptyData);

  const handleSaveDraft = (stepData: Partial<GrievanceFormData>) => {
    save({ ...data, ...stepData });
    setDraftSavedOpen(true);
  };

  const handleStepOneNext = (values: StepOneData) => {
    save({ ...data, ...values });
    setActiveStep(1);
  };

  const handleStepTwoNext = (values: StepTwoData) => {
    save({ ...data, ...values });
    setActiveStep(2);
  };

  const handleStepTwoBack = (values: StepTwoData) => {
    save({ ...data, ...values });
    setActiveStep(0);
  };

  const handleBack = () => setActiveStep((step) => Math.max(0, step - 1));

  const handleSubmit = () => {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitGrievance(data);
      if (result.success) {
        appendGrievanceHistory({
          referenceCode: result.referenceCode,
          createdAt: new Date().toISOString(),
          submitterName: (data.submitterName || "Unknown") as string,
          category: (data.category || "other") as string,
          description: (data.description || "") as string,
        });
        clear();
        setSubmittedCode(result.referenceCode);
      } else {
        setSubmitError(result.error);
      }
    });
  };

  // Avoid a flash of empty fields while the draft is read from localStorage.
  if (!loaded) return null;

  if (submittedCode) {
    return <SuccessScreen referenceCode={submittedCode} />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      {activeStep === 0 && (
        <StepOne defaultValues={data} onNext={handleStepOneNext} onSaveDraft={handleSaveDraft} />
      )}

      {activeStep === 1 && (
        <StepTwo
          defaultValues={data}
          onNext={handleStepTwoNext}
          onBack={handleStepTwoBack}
          onSaveDraft={handleSaveDraft}
        />
      )}

      {activeStep === 2 && (
        <StepReview
          data={data as GrievanceFormData}
          onBack={handleBack}
          onEditStep={setActiveStep}
          onSubmit={handleSubmit}
          submitting={isPending}
          onSaveDraft={() => handleSaveDraft(data)}
        />
      )}

      <Snackbar
        open={draftSavedOpen}
        autoHideDuration={3000}
        onClose={() => setDraftSavedOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setDraftSavedOpen(false)} severity="success" variant="filled" sx={{ width: "100%", borderRadius: 2 }}>
          Draft saved successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
}
