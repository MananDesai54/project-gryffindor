import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Agent } from "@gryffindor/client/common/types/agent.type";

type Props = {
  agent?: Agent;
  onChange: (agent: Partial<Agent["configuration"]>) => void;
};

export default function LlmSelection({ agent, onChange }: Props) {
  return (
    <AppCard
      title="LLM"
      description="Select which provider and model to use for the LLM."
      content={<></>}
    />
  );
}
