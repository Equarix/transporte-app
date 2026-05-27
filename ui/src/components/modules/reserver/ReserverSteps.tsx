import { useBooking } from "@/context/BookingProvider";
import StepOne from "./steps/StepOne";
import StepThree from "./steps/StepThree";
import StepTwo from "./steps/StepTwo";
import StepFour from "./steps/StepFour";
import StepFive from "./steps/StepFive";

export default function ReserverSteps() {
  const steps: Record<number, React.ReactNode> = {
    1: <StepOne />,
    2: <StepTwo />,
    3: <StepThree />,
    4: <StepFour />,
    5: <StepFive />,
  };

  const { step } = useBooking();

  return steps[step];
}
