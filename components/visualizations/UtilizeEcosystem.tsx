"use client";
import React, { useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, BackgroundVariant, Position, MarkerType, type Node as FlowNode, type Edge as FlowEdge, type ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  Layers,
  RefreshCcw,
  Bot,
  Gavel,
  Database,
  Building2,
  Factory,
  Megaphone,
  ShieldCheck,
  Users,
  Network,
  Wallet,
  Boxes,
} from "lucide-react";

// Helper components
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
    {children}
  </span>
);

type SectionTitleProps = { icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string };
const SectionTitle = ({ icon: Icon, title, subtitle }: SectionTitleProps) => (
  <div className="flex items-start gap-3">
    <div className="rounded-2xl bg-muted p-2"><Icon className="h-5 w-5" /></div>
    <div>
      <h3 className="text-lg font-semibold leading-tight">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground leading-snug">{subtitle}</p>}
    </div>
  </div>
);

// Generic Dagre layout helper to avoid hook dependency issues
function layoutWithDagreGeneric(
  inputNodes: FlowNode<{ label: string }>[],
  inputEdges: FlowEdge[],
  cfg: { nodesep: number; ranksep: number; marginx: number; marginy: number; baseWidth: number; baseHeight: number }
) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: cfg.nodesep, ranksep: cfg.ranksep, marginx: cfg.marginx, marginy: cfg.marginy });
  g.setDefaultEdgeLabel(() => ({}));

  inputNodes.forEach((n) => {
    const width = (typeof n.style?.width === "number" ? n.style?.width : cfg.baseWidth) as number;
    const height = cfg.baseHeight;
    g.setNode(n.id, { width, height });
  });

  inputEdges.forEach((e) => {
    if (e.source && e.target) g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  const nodes: FlowNode<{ label: string }>[] = inputNodes.map((n) => {
    const dag = g.node(n.id);
    if (!dag) return n;
    const width = (typeof n.style?.width === "number" ? n.style?.width : cfg.baseWidth) as number;
    const height = cfg.baseHeight;
    return {
      ...n,
      position: { x: dag.x - width / 2, y: dag.y - height / 2 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    } as FlowNode<{ label: string }>;
  });

  const edges: FlowEdge[] = inputEdges.map((e) => ({ ...e, type: "smoothstep" }));

  return { nodes, edges };
}

export default function UtilizeEcosystem() {
  const [showExamples, setShowExamples] = useState(true);
  const [showEconomics, setShowEconomics] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [roomyLayout, setRoomyLayout] = useState(true);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // ======= ECOSYSTEM MAP =======
  type AppNode = FlowNode<{ label: string }>;
  type AppEdge = FlowEdge;

  // spacing config
  const spacingCfg = roomyLayout
    ? { nodesep: 240, ranksep: 300, marginx: 160, marginy: 140, baseWidth: 320, baseHeight: 110 }
    : { nodesep: 140, ranksep: 180, marginx: 90, marginy: 70, baseWidth: 260, baseHeight: 90 };

  const { nodes, edges } = useMemo(() => {
    const baseNodes: AppNode[] = [
      { id: "utilize", position: { x: 600, y: 240 }, data: { label: "Utilize\nAI-First Company Builder" }, style: centerStyle, type: "input" },

      // Pillars
      { id: "turnarounds", position: { x: 180, y: 120 }, data: { label: "AI-First Transformations\n(Existing Companies)" }, style: pillarStyle, type: "default" },
      { id: "products", position: { x: 1020, y: 120 }, data: { label: "Digital Employees\n(Productized AI)" }, style: pillarStyle },
      { id: "ventures", position: { x: 180, y: 370 }, data: { label: "VC Gallery / Incubator\n(Pellion-style)" }, style: pillarStyle },
      { id: "rnd", position: { x: 1020, y: 370 }, data: { label: "R&D / Novel Experiments" }, style: pillarStyle },

      // Platform & infra
      { id: "orchestrator", position: { x: 600, y: 80 }, data: { label: "Orchestration Platform\n(Agents, Workflows, HIL)" }, style: infraStyle },
      { id: "library", position: { x: 600, y: 400 }, data: { label: "Agent Library & Templates\n(Re-usable Lego Parts)" }, style: infraStyle },
      { id: "compliance", position: { x: 600, y: 520 }, data: { label: "Compliance & Governance\n(Rules, Audit, Adjudication)" }, style: infraStyle },

      // Enablers
      { id: "opensrc", position: { x: 300, y: 20 }, data: { label: "Open‑Source & Off‑the‑Shelf" }, style: enablerStyle },
      { id: "operators", position: { x: 900, y: 20 }, data: { label: "Operator Talent Network" }, style: enablerStyle },
      { id: "capital", position: { x: 30, y: 260 }, data: { label: "Capital Partners" }, style: enablerStyle },
      { id: "data", position: { x: 1170, y: 260 }, data: { label: "Data Assets & Case Studies" }, style: enablerStyle },
    ];

    const exampleNodes: AppNode[] = showExamples
      ? [
          { id: "vuplicity", position: { x: 60, y: 120 }, data: { label: "Vuplicity / (a.k.a. Vooplicity?)\nAgentic CRA" }, style: exampleStyle },
          { id: "veiled", position: { x: 1020, y: 20 }, data: { label: "Veiled Resin\n(creator-led marketing)" }, style: exampleStyle },
          { id: "creator", position: { x: 1160, y: 240 }, data: { label: "Creator of One\n(Multi‑cam Studio)" }, style: exampleStyle },
          { id: "croone", position: { x: 880, y: 240 }, data: { label: "CRO of One\n(Lead Gen + Outreach)" }, style: exampleStyle },
          { id: "cfoone", position: { x: 1040, y: 460 }, data: { label: "CFO of One\n(FinOps)" }, style: exampleStyle },
          { id: "institute", position: { x: 840, y: 460 }, data: { label: "Institute of One\n(Research Agents)" }, style: exampleStyle },
          { id: "sidekick", position: { x: 980, y: 300 }, data: { label: "Sidekick\n(Deal Broker System)" }, style: exampleStyle },
          { id: "researchsys", position: { x: 760, y: 60 }, data: { label: "Deep Research System\n(24/7 trusted research)" }, style: exampleStyle },
        ]
      : [];

    const allNodes = [...baseNodes, ...exampleNodes];

    const baseEdges: AppEdge[] = [
      { id: "e-utilize-turnarounds", source: "utilize", target: "turnarounds", label: showEconomics ? "Rev‑share / Equity" : undefined, animated: true },
      { id: "e-utilize-products", source: "utilize", target: "products", label: showEconomics ? "SaaS / License" : undefined, animated: true },
      { id: "e-utilize-ventures", source: "utilize", target: "ventures", label: showEconomics ? "Equity / Carry" : undefined, animated: true },
      { id: "e-utilize-rnd", source: "utilize", target: "rnd", label: showEconomics ? "IP / Options" : undefined, animated: true },

      { id: "e-orch-all", source: "orchestrator", target: "utilize", label: "Build & Deploy", animated: false },
      { id: "e-utilize-lib", source: "utilize", target: "library", label: "Harvest & Reuse", animated: false },
      { id: "e-lib-products", source: "library", target: "products", label: "Template to Product", animated: false },
      { id: "e-lib-turn", source: "library", target: "turnarounds", label: "Template to Service", animated: false },
      { id: "e-compliance-all", source: "compliance", target: "turnarounds", label: "Rules / Audit", animated: false },
      { id: "e-compliance-prod", source: "compliance", target: "products", label: "Policy / Guardrails", animated: false },
      { id: "e-opensrc-orch", source: "opensrc", target: "orchestrator", label: "Integrations", animated: false },
      { id: "e-operators-ventures", source: "operators", target: "ventures", label: "Operators", animated: false },
      { id: "e-capital-ventures", source: "capital", target: "ventures", label: "Funding", animated: false },
      { id: "e-turn-data", source: "turnarounds", target: "data", label: "Proof / Cases", animated: false },
      { id: "e-prod-data", source: "products", target: "data", label: "Usage / Metrics", animated: false },
      { id: "e-ventures-utilize", source: "ventures", target: "utilize", label: showEconomics ? "Exits / Dividends" : undefined, animated: true },
      { id: "e-rnd-lib", source: "rnd", target: "library", label: "New Capabilities", animated: false },
      { id: "e-rnd-products", source: "rnd", target: "products", label: "Spin‑outs", animated: false },
    ];

    const exampleEdges: AppEdge[] = showExamples
      ? [
          { id: "e-turn-vuplicity", source: "turnarounds", target: "vuplicity", label: "Use case", animated: false },
          { id: "e-products-creator", source: "products", target: "creator", label: "Module", animated: false },
          { id: "e-products-croone", source: "products", target: "croone", label: "Module", animated: false },
          { id: "e-products-cfoone", source: "products", target: "cfoone", label: "Module", animated: false },
          { id: "e-products-institute", source: "products", target: "institute", label: "Module", animated: false },
          { id: "e-veiled-creator", source: "veiled", target: "creator", label: "Marketing Engine", animated: false },
          { id: "e-products-sidekick", source: "products", target: "sidekick", label: "Product", animated: false },
          { id: "e-rnd-research", source: "rnd", target: "researchsys", label: "Prototype", animated: false },
          { id: "e-research-lib", source: "researchsys", target: "library", label: "Harvest patterns", animated: false },
          { id: "e-vuplicity-lib", source: "vuplicity", target: "library", label: "Reusable components", animated: false },
        ]
      : [];

    const allEdges = [...baseEdges, ...exampleEdges];

    // Filter
    const q = filterQuery.trim().toLowerCase();
    const filteredNodes = q
      ? allNodes.filter((n) => String(n.data?.label ?? n.id).toLowerCase().includes(q))
      : allNodes;
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = allEdges.filter((e) => nodeIds.has(String(e.source)) && nodeIds.has(String(e.target)));

    const { nodes: layoutNodes, edges: layoutEdges } = layoutWithDagreGeneric(filteredNodes, filteredEdges, spacingCfg);
    return { nodes: layoutNodes, edges: layoutEdges };
  }, [showExamples, showEconomics, filterQuery, roomyLayout]);

  // Layout the CRA mini-map as well for cleaner spacing
  const { nodes: craLayoutNodes, edges: craLayoutEdges } = layoutWithDagreGeneric(
    (craNodes as FlowNode<{ label: string }>[]) as FlowNode<{ label: string }>[],
    craEdges as FlowEdge[],
    spacingCfg
  );

  // ======= CANVAS++ DATA =======
  const canvas = {
    partners: ["Operator talent", "Capital partners", "Compliance advisors", "Open‑source communities", "Channel partners"],
    activities: ["Company building", "Agent orchestration", "Compliance automation", "Go‑to‑market (CRO of One)", "Content ops (Creator of One)", "R&D prototypes", "Incubation / coaching"],
    resources: ["Agent library", "Orchestration platform", "Compliance rulebase", "Case studies & playbooks", "Data assets", "Operator network"],
    valueProps: [
      "AI‑first retooling with rev‑share alignment",
      "Composable digital employees (plug‑and‑play)",
      "Faster time‑to‑value via templates",
      "Audit‑ready compliance & governance",
      "Marketing flywheel built‑in",
    ],
    customers: ["Existing SMBs/enterprises needing retool", "Newco operators", "Studios/agencies", "Regulated industries (CRAs, finance, healthcare)"],
    channels: ["Direct consultative sales", "VC Gallery", "Operator network", "Content distribution from Creator of One"],
    relationships: ["Rev‑share + equity", "Long‑term product subscriptions", "Success‑fee pilots", "Operator coaching"],
    costs: ["Core team & operators", "Compute & infra", "Compliance & legal", "R&D / incubation", "Sales & marketing"],
    revenues: [
      "Rev‑share on turnarounds",
      "Equity/carry from incubations",
      "SaaS/licensing (digital employees)",
      "Implementation services",
      "Training & certification",
      "Data/benchmarking products",
    ],
    extensions: [
      { title: "Agent Library & Templates", icon: Boxes, points: ["Reusable workflows", "Verticalized kits", "Brand/skin quickly"] },
      { title: "Orchestration Platform", icon: Layers, points: ["Parallel agents", "HIL controls", "Observability"] },
      { title: "Compliance & Governance", icon: Gavel, points: ["Policy/Reg rules", "Adjudication", "Audit trails"] },
      { title: "Venture Studio Engine", icon: Rocket, points: ["Deal triage", "Operator matching", "Milestone gating"] },
      { title: "Value Capture", icon: Wallet, points: ["Rev‑share", "Equity/carry", "Licensing", "Success fees"] },
    ],
  } as const;

  // ======= FLYWHEEL STEPS =======
  const flywheel: { title: string; text: string }[] = [
    { title: "Acquire", text: "Deal flow (cos to retool) + operators + ideas" },
    { title: "Assemble", text: "Compose agents from library; integrate OSS; wire compliance" },
    { title: "Activate", text: "Launch pilots with success‑fee milestones" },
    { title: "Amplify", text: "Creator of One drives content → demand → case studies" },
    { title: "Archive", text: "Harvest working patterns to library as templates" },
    { title: "Accelerate", text: "Templates shorten next build; scale via CRO of One" },
  ];

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-[1200px] p-4 sm:p-6">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Utilize — Ecosystem & Economic Drivers</h1>
            <p className="text-sm text-muted-foreground max-w-[900px]">
              An interactive map and Canvas++ of how Utilize builds AI‑first companies, productizes digital employees, and compounds value via a reusable agent library,
              compliance governance, and a venture/incubator motion. Toggle examples and economics overlays below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl border p-2 sm:p-3">
            <div className="flex items-center gap-2">
              <Switch checked={showExamples} onCheckedChange={setShowExamples} id="examples" />
              <label htmlFor="examples" className="text-sm">Show examples</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showEconomics} onCheckedChange={setShowEconomics} id="economics" />
              <label htmlFor="economics" className="text-sm">Show economics</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={roomyLayout} onCheckedChange={setRoomyLayout} id="roomy" />
              <label htmlFor="roomy" className="text-sm">Roomy layout</label>
            </div>
          </div>
        </header>

        <Tabs defaultValue="map">
          <TabsList className="flex w-full gap-2 overflow-x-auto rounded-xl p-1">
            <TabsTrigger className="shrink-0" value="map">Ecosystem Map</TabsTrigger>
            <TabsTrigger className="shrink-0" value="canvas">Canvas++</TabsTrigger>
            <TabsTrigger className="shrink-0" value="flywheel">Flywheel</TabsTrigger>
            <TabsTrigger className="shrink-0" value="cra">Agentic CRA (example)</TabsTrigger>
          </TabsList>

          {/* MAP */}
          <TabsContent value="map" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Interactive Ecosystem Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="Filter nodes... (e.g., Vuplicity, Library)"
                        className="w-full sm:w-[320px]"
                      />
                      {filterQuery && (
                        <Button onClick={() => setFilterQuery("")}>Clear</Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => flowInstanceRef.current?.fitView({ padding: 0.2 })}>Fit</Button>
                    </div>
                  </div>
                  <FlowCanvas nodes={nodes} edges={edges} onInit={(inst) => (flowInstanceRef.current = inst)} />
                  <Separator className="my-4" />
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h4 className="mb-1 font-semibold text-foreground">How it works</h4>
                      <p>The center coordinates four pillars (Transformations, Products, Ventures, R&amp;D) on a shared platform (orchestration, library, compliance). Enablers add leverage (OSS, operators, capital, data). Edges show direction of work/value; enable economics to see capture points.</p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-foreground">Value flow</h4>
                      <p>Build on the platform → deploy into turnarounds/newcos with compliance → prove value and capture rev‑share/SaaS/equity → harvest working patterns into the library → faster next build. Cross‑pollination: research components (e.g., Vuplicity&apos;s deep research, compliance orchestration) become reusable digital employees for new domains.</p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-foreground">Compounding loops</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Templates: each win adds reusable modules.</li>
                        <li>Compliance: HIL turns edge cases into rules; audit builds trust.</li>
                        <li>GTM: content and CRO motions (Creator of One) grow demand and deal flow; Sidekick brokers deals.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-foreground">Divisions and strategy</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>R&amp;D</strong>: research to build brand and capabilities (e.g., deep research system).</li>
                        <li><strong>Prod</strong>: digital employees, full companies, and off‑the‑shelf products mixed with open‑source to retool opportunities.</li>
                        <li><strong>MSP</strong>: ongoing technical support and product improvements; consultants at the edge.</li>
                        <li>Strategies: AI‑first newcos; update outdated firms; partner to form new AI businesses; identify automation leads.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Economic Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Rev‑share</Badge>
                    <Badge variant="secondary">Equity / Carry</Badge>
                    <Badge variant="secondary">SaaS Licensing</Badge>
                    <Badge variant="secondary">Implementation</Badge>
                    <Badge variant="secondary">Success Fees</Badge>
                    <Badge variant="secondary">Training</Badge>
                    <Badge variant="secondary">Data Products</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="leading-snug">Overlays appear as edge labels when &quot;Show economics&quot; is enabled.</p>
                    <p className="leading-snug">Examples include <strong>Vuplicity/Vooplicity</strong> (Agentic CRA) and <strong>Veiled Resin</strong> (marketing via Creator of One).</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} /> Center / Pillars</div>
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded" style={{ background: 'hsl(var(--muted))', border: '1px dashed hsl(var(--border))' }} /> Platform & Infra</div>
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded" style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} /> Enablers</div>
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded" style={{ background: 'hsl(var(--accent))', border: '1px solid hsl(var(--border))' }} /> Examples</div>
                    <div className="flex items-center gap-2 col-span-2"><span className="inline-block h-3 w-3 rounded bg-foreground" /> Arrow indicates direction; dotted grid for spatial reference.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CANVAS++ */}
          <TabsContent value="canvas" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <SectionTitle icon={Layers} title="Business Model Canvas++" subtitle="Classic BMC, extended for agentic systems" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <CanvasBlock title="Key Partners" items={canvas.partners} icon={Users} />
                    <CanvasBlock title="Key Activities" items={canvas.activities} icon={Factory} />
                    <CanvasBlock title="Key Resources" items={canvas.resources} icon={Database} />
                    <CanvasBlock title="Value Propositions" items={canvas.valueProps} icon={Rocket} />
                    <CanvasBlock title="Customer Segments" items={canvas.customers} icon={Building2} />
                    <CanvasBlock title="Channels" items={canvas.channels} icon={Megaphone} />
                    <CanvasBlock title="Customer Relationships" items={canvas.relationships} icon={HandshakeIcon} />
                    <CanvasBlock title="Cost Structure" items={canvas.costs} icon={Wallet} />
                    <CanvasBlock title="Revenue Streams" items={canvas.revenues} icon={Wallet} />
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {canvas.extensions.map((ext, i) => (
                      <Card key={i} className="border-dashed">
                        <CardHeader className="pb-2"><SectionTitle icon={ext.icon} title={ext.title} /></CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {ext.points.map((p, idx) => (<li key={idx}>{p}</li>))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <SectionTitle icon={Network} title="Narrative" subtitle="How the parts reinforce each other" />
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    <li><strong>Build</strong> with the orchestration platform using OSS and in‑house templates.</li>
                    <li><strong>Deploy</strong> into turnarounds or newcos with compliance wired from day one.</li>
                    <li><strong>Prove</strong> value; capture rev‑share/SaaS and produce public case studies.</li>
                    <li><strong>Harvest</strong> working patterns into the agent library to speed future builds.</li>
                    <li><strong>Compound</strong> via VC Gallery (operators + capital) → new launches → equity.</li>
                    <li><strong>Amplify</strong> through Creator of One; CRO of One scales pipelines.</li>
                  </ol>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Potential additions: certification program for operators, marketplace for templates, and standardized compliance packs by vertical.</p>
                    <p>Open questions: naming consistency (&quot;Vuplicity&quot; vs &quot;Vooplicity&quot;), product line branding, and success‑fee guardrails.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FLYWHEEL */}
          <TabsContent value="flywheel" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <SectionTitle icon={RefreshCcw} title="Flywheel" subtitle="Every cycle yields templates and reputation that accelerate the next" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {flywheel.map((s, i) => (
                    <div key={i} className="rounded-2xl border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="secondary">Step {i + 1}</Badge>
                        <Pill>Lead time ↓</Pill>
                      </div>
                      <h4 className="font-semibold">{s.title}</h4>
                      <p className="text-sm text-muted-foreground">{s.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border bg-muted/40 p-3 text-xs text-muted-foreground">
                  <p><strong>Economics overlay:</strong> Acquire (services) → Activate (success fees) → Amplify (SaaS + upsell) → Archive (IP) → Accelerate (velocity) → more deal flow.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AGENTIC CRA EXAMPLE */}
          <TabsContent value="cra" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <SectionTitle icon={ShieldCheck} title="Agentic CRA — Reference Architecture" subtitle="Front‑end like TazWorks; back‑end adjudication with rules + HIL" />
                </CardHeader>
                <CardContent>
                  <FlowCanvas nodes={craLayoutNodes} edges={craLayoutEdges} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <SectionTitle icon={Bot} title="Key Loops" subtitle="Where the agent learns and reduces cost" />
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    <li><strong>Pattern harvesting:</strong> recurring adjudication patterns → reusable rules.</li>
                    <li><strong>Human‑in‑the‑loop:</strong> escalations label edge cases → model/tooling updates.</li>
                    <li><strong>Compliance pack:</strong> rulesets per jurisdiction → audit‑ready logs.</li>
                    <li><strong>Latency cuts:</strong> parallel provider calls, retries, fallbacks.</li>
                  </ul>
                  <Separator className="my-4" />
                  <div className="text-xs text-muted-foreground">
                    <p>Outputs: compliant reports, audit trails, template components added to the library, and case studies feeding the flywheel.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

// ======= Styles =======
type FlowCanvasProps = { nodes: FlowNode<{ label: string }>[]; edges: FlowEdge[]; onInit?: (inst: ReactFlowInstance) => void };
function FlowCanvas({ nodes, edges, onInit }: FlowCanvasProps) {
  return (
    <div className="min-h-[360px] h-[60vh] sm:h-[560px] rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        snapToGrid
        snapGrid={[16, 16]}
        minZoom={0.3}
        maxZoom={1.75}
        onInit={onInit}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--foreground))', strokeOpacity: 0.75, strokeWidth: 1.75 },
          labelStyle: { fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 600 },
          labelBgStyle: { fill: 'hsl(var(--card))', fillOpacity: 0.92, stroke: 'hsl(var(--border))', strokeOpacity: 0.5 },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 6,
          markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
        }}
      >
        <Background color="hsl(var(--muted))" variant={BackgroundVariant.Dots} gap={24} size={1} />
        <MiniMap pannable zoomable style={{ height: 120, width: 180, borderRadius: 12, opacity: 0.9 }} />
        <Controls position="bottom-left" />
      </ReactFlow>
    </div>
  );
}

// ======= Styles =======
const centerStyle = {
  borderRadius: 16,
  padding: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
  width: 260,
  textAlign: "center" as const,
  fontWeight: 700,
};
const pillarStyle = {
  borderRadius: 16,
  padding: 10,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
  width: 240,
  textAlign: "center" as const,
  fontWeight: 600,
};
const infraStyle = {
  borderRadius: 16,
  padding: 10,
  border: "1px dashed hsl(var(--border))",
  background: "hsl(var(--muted))",
  color: "hsl(var(--foreground))",
  width: 260,
  textAlign: "center" as const,
};
const enablerStyle = {
  borderRadius: 12,
  padding: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  color: "hsl(var(--foreground))",
  width: 200,
  textAlign: "center" as const,
  fontSize: 12,
};
const exampleStyle = {
  borderRadius: 12,
  padding: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--accent))",
  color: "hsl(var(--foreground))",
  width: 220,
  textAlign: "center" as const,
  fontSize: 12,
};

// ======= Canvas Block =======
function CanvasBlock({ title, items, icon: Icon }: { title: string; items: readonly string[]; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2"><Icon className="h-4 w-4" /><CardTitle className="text-sm">{title}</CardTitle></div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {items.map((i, idx) => (
            <li key={idx} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/40" /><span>{i}</span></li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ======= Icons not in lucide as names we want =======
function HandshakeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path fill="currentColor" d="M3 8l4-2 5 4 5-4 4 2v4l-4 4-5-4-5 4-4-4z" opacity="0.2" />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M3 8l4-2 5 4 5-4 4 2v4l-4 4-5-4-5 4-4-4z" />
    </svg>
  );
}

// ======= Agentic CRA mini‑map =======
const craNodes = [
  { id: "client", position: { x: 40, y: 160 }, data: { label: "Client" }, style: smallNode() },
  { id: "portal", position: { x: 200, y: 140 }, data: { label: "Portal / UI (TazWorks‑like)" }, style: smallNode(220) },
  { id: "orch", position: { x: 480, y: 140 }, data: { label: "Agent Orchestrator" }, style: smallNode() },
  { id: "providers", position: { x: 700, y: 40 }, data: { label: "Data Providers\n(APIs / crawlers)" }, style: smallNode(200) },
  { id: "compliance2", position: { x: 700, y: 180 }, data: { label: "Compliance / Rules Engine\n(Adjudication)" }, style: smallNode(220) },
  { id: "hil", position: { x: 700, y: 320 }, data: { label: "Human‑in‑the‑Loop\n(Analyst / QA)" }, style: smallNode(200) },
  { id: "audit", position: { x: 920, y: 180 }, data: { label: "Audit & Logging" }, style: smallNode() },
  { id: "report", position: { x: 920, y: 320 }, data: { label: "Report Delivery" }, style: smallNode() },
];

const craEdges = [
  { id: "c1", source: "client", target: "portal", label: "Order" },
  { id: "c2", source: "portal", target: "orch", label: "Job" },
  { id: "c3", source: "orch", target: "providers", label: "Queries (parallel)" },
  { id: "c4", source: "orch", target: "compliance2", label: "Normalize → adjudicate" },
  { id: "c5", source: "compliance2", target: "hil", label: "Escalate edge cases" },
  { id: "c6", source: "hil", target: "compliance2", label: "Decisions → rules" },
  { id: "c7", source: "compliance2", target: "audit", label: "Logs" },
  { id: "c8", source: "compliance2", target: "report", label: "Results" },
  { id: "c9", source: "report", target: "client", label: "Deliver" },
];

function smallNode(width: number = 180): React.CSSProperties {
  return {
    borderRadius: 12,
    padding: 8,
    border: "1px solid hsl(var(--border))",
    background: "hsl(var(--card))",
    color: "#ffffff",
    width,
    textAlign: "center" as const,
    fontSize: 12,
  };
}
