import { Race, Horse } from "../../../types";

export interface ProgramProps {
  schedule: Race[] | null;
  horses: Horse[];
  currentRoundIndex: number;
}

