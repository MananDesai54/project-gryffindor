import { useCreateAgentMutation } from "@gryffindor/client/common/api/serverQueries/agent/useAgentMutation";
import Loader from "@gryffindor/client/common/components/app/loader";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import { Routes } from "@gryffindor/client/route/routes";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

export default function AgentCreateScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutateAsync, isPending } = useCreateAgentMutation();
  const navigate = useNavigate();

  const onCreateAgent = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const agent = await mutateAsync({
        agent: {
          name,
          description,
        },
      });
      navigate({
        to: Routes.AGENT_DETAIL,
        params: {
          id: agent._id,
        },
      });
    },
    [mutateAsync, name, description, navigate],
  );

  const onGoBack = useCallback(() => {
    navigate({
      to: Routes.HOME,
    });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center p-4">
      <motion.div
        exit={{
          opacity: 0,
        }}
      >
        <div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold mt-8">Name your agent</span>
            <span className="font-bold text-gray-600 my-3">
              Choose a name that reflects your agent's purpose
            </span>
            <form
              className="flex flex-col items-center"
              onSubmit={onCreateAgent}
            >
              <div className="my-8">
                <Input
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter agent name..."
                  className="text-center mb-4 w-[25vw] py-5"
                />
                <Textarea
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter agent description..."
                  className="text-center w-[25vw] py-5"
                />
              </div>
              <Button
                type="submit"
                className="mb-8 w-[15vw]"
                disabled={!name || isPending}
              >
                {isPending ? <Loader size={18} /> : <Check />} Create Agent
              </Button>
            </form>
            <Button variant="outline" onClick={onGoBack}>
              Back
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
