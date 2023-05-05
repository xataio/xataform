import clsx from "clsx";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { useFormSummary } from "hooks/useFormSummary";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Position,
  applyNodeChanges,
  NodeChange,
  Edge,
  EdgeChange,
  applyEdgeChanges,
  Handle,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { RouterOutputs } from "utils/trpc";

export type LogicFlowProps = {
  formId: string;
  onNodeSelection: (node?: NodeData) => void;
};

type NodeData = RouterOutputs["form"]["summary"][number];

export function LogicFlow({ formId, onNodeSelection }: LogicFlowProps) {
  const { questions } = useFormSummary({ formId });
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (!questions) return;
    const titles = questions.map((q) => q.title);
    setNodes(
      questions.map((q) => ({
        id: q.id,
        data: q,
        type: "question",
        position: {
          x: titles.slice(0, q.order).join("").length * 5 + q.order * 200,
          y: 0,
        },
        selectable: true,
        selected: q.order === 0,
      }))
    );
  }, [questions]);

  useEffect(() => {
    if (!questions) return;
    setEdges(
      questions.slice(0, -1).map((q) => ({
        id: `${q.id}-${questions[q.order + 1].id}`,
        source: q.id,
        target: questions[q.order + 1].id,
      }))
    );
  }, [questions]);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={(e) => {
          if (e.nodes.length === 1) {
            onNodeSelection(e.nodes[0].data);
          } else {
            onNodeSelection();
          }
        }}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function QuestionNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div
      className={clsx(
        "flex gap-2 rounded-md border border-indigo-300 bg-white p-4",
        selected && "outline outline-indigo-500"
      )}
    >
      <QuestionIcon type={data.type} order={data.order + 1} />
      <h2>{data.title}</h2>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-none !bg-indigo-400"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-none !bg-indigo-400"
      />
    </div>
  );
}

const nodeTypes = { question: QuestionNode };
