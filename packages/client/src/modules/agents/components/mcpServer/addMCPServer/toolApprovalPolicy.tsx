import AppCard from '@gryffindor/client/common/components/app/appCard/appCard';
import { MCPServerApprovalPolicy } from '@gryffindor/client/common/types/agent/mcpServer.type';
import { ShieldCheck, ShieldOff, SlidersHorizontal } from 'lucide-react';
import React from 'react';

//  Types

type Props = {
  policy: MCPServerApprovalPolicy;
  onChange: (policy: MCPServerApprovalPolicy) => void;
};

//  Global Constants & Functions
const POLICIES = [
  {
    id: MCPServerApprovalPolicy.ALWAYS_ASK,
    label: 'Always Ask',
    description:
      'Maximum security. The agent will request your permission before each tool use.',
    Icon: ShieldCheck,
  },
  {
    id: MCPServerApprovalPolicy.FINE_GRAINED,
    label: 'Never Ask',
    description:
      'Disable & pre-select tools which can run automatically & those requiring approval.',
    Icon: SlidersHorizontal,
  },
  {
    id: MCPServerApprovalPolicy.NO_APPROVAL,
    label: 'Always Approve',
    description: 'The assistant can use any tool without approval.',
    Icon: ShieldOff,
  },
];

const ToolApprovalPolicy = (props: Props) => {
  //  Props Destructure
  const { policy, onChange } = props;

  //  State Variables

  //  Queries and Mutations

  //  Constant, Refs and Memo Constant

  //  Helper Functions

  //  Handlers

  //  Effects

  return (
    <AppCard
      title="Tool Approval Mode"
      description="Control how the agent requests permission to use tools from this MCP server."
      content={
        <div className="bg-background p-4 rounded-xl border">
          {POLICIES.map((p) => (
            <div
              key={p.id}
              className={`p-4 border rounded-lg mb-3 cursor-pointer ${
                policy === p.id ? 'bg-accent' : ''
              }`}
              onClick={() => onChange(p.id)}
            >
              <div className="flex items-center">
                <p.Icon size={18} />
                <h3 className="ml-3 text-base font-medium">{p.label}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default React.memo(ToolApprovalPolicy);
