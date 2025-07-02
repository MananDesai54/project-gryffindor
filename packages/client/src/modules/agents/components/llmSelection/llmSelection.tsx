import {
  FilterBuilder,
  SearchRequestBuilder,
} from "@gryffindor/client/common/api/common/request/requestBuilder";
import { AuthContext } from "@gryffindor/client/common/api/decorators/hoc/authContextProvider";
import useBoolean from "@gryffindor/client/common/api/decorators/hooks/useBoolean";
import { useLLMQuery } from "@gryffindor/client/common/api/serverQueries/agent/useLlmQuery";
import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import AppSelect from "@gryffindor/client/common/components/app/appSelect/appSelect";
import { LLMFields } from "@gryffindor/client/common/constants/agent/llm.constant";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { LLMType } from "@gryffindor/client/common/types/agent/ai.type";
import { IdLabel } from "@gryffindor/client/common/types/idLabel.type";
import { map } from "lodash";
import { useCallback, useContext, useMemo } from "react";
import AddLLM from "./addLLM";
import { LLM } from "@gryffindor/client/common/types/agent/llm.type";

type Props = {
  agent?: Agent;
  onChange: (agent: Partial<Agent["configuration"]>) => void;
};

const CREATE_CUSTOM_LLM_ID = "custom-llm";

const STD_LLM_REQUEST = new SearchRequestBuilder()
  .addFilter(
    new FilterBuilder().field(LLMFields.type).value([LLMType.STANDARD]).build(),
  )
  .build();

export default function LlmSelection({ agent, onChange }: Props) {
  const { setValue: setShowAddCustomLLM, value: showAddCustomLLM } =
    useBoolean();
  const { userId } = useContext(AuthContext);

  const { data: stdLLMs } = useLLMQuery({
    queryParams: STD_LLM_REQUEST,
  });

  const currentUserCustomLLMRequest = useMemo(
    () =>
      new SearchRequestBuilder()
        .addFilter(
          new FilterBuilder()
            .field(LLMFields.type)
            .value([LLMType.CUSTOM])
            .build(),
        )
        .addFilter(
          new FilterBuilder().field(LLMFields.creator).value([userId]).build(),
        )
        .build(),
    [userId],
  );
  const { data: customLLMs } = useLLMQuery({
    queryParams: currentUserCustomLLMRequest,
  });

  const onLLMChange = useCallback(
    (val: string) => {
      if (val === CREATE_CUSTOM_LLM_ID) {
        setShowAddCustomLLM(true);
        return;
      }
      setShowAddCustomLLM(false);
      onChange({
        llm: val,
      });
    },
    [onChange, setShowAddCustomLLM],
  );

  const onCreateLLM = useCallback(
    (llm: LLM) => {
      onChange({ llm: llm._id });
      setShowAddCustomLLM(false);
    },
    [onChange, setShowAddCustomLLM],
  );

  const options = useMemo(
    () =>
      [
        ...map(stdLLMs?.data, (l) => ({
          label: l.modelId,
          id: l._id,
        })),
        ...map(customLLMs?.data, (l) => ({
          label: l.modelId,
          id: l._id,
        })),
        {
          label: "Create Custom LLM",
          id: CREATE_CUSTOM_LLM_ID,
        },
      ] as IdLabel[],
    [customLLMs?.data, stdLLMs?.data],
  );

  return (
    <AppCard
      title="LLM"
      description="Select which provider and model to use for the LLM."
      cardAction={
        <AppSelect
          value={agent?.configuration?.llm}
          options={options}
          onChange={onLLMChange}
          placeholder="Select LLM"
        />
      }
      content={
        showAddCustomLLM ? <AddLLM onCreateLLM={onCreateLLM} /> : undefined
      }
    />
  );
}
