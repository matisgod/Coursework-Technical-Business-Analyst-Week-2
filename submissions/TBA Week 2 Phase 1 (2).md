## ADKAR Assessment 

## **Collections Agents** 

**Awareness (High):** Agents have an extremely high awareness of the current operational cracks. They live with the reality that the legacy database does not sync with email trackers and explicitly state that the system was built for half the volume they handle today. They know a change is necessary. 

**Desire (High but low trust):** Frontline staff are highly motivated to escape the manual spreadsheet chaos. However, desire is threatened by historical fatigue. Agents note that _"leadership approved the roadmap five years ago and never came back to debt recovery"_ . More importantly, because experienced agents have spent years developing highly efficient custom workarounds to hit their targets, they will actively resist any standard system that initially slows them down. 

**Knowledge (Medium):** Agents are deeply knowledgeable about the intricacies of debt collection, but their systemic knowledge is fragmented. New agents currently take an extra two weeks just to learn the unstandardized spreadsheet system. They will require clear training on the unified UI. 

**Ability (Medium):** High capability to negotiate with customers, but technical ability is constrained by data deficits. Because data quality is historically poor and status tracking lacks standard definitions, agents struggle to see full client histories. 

**Reinforcement (Low):** Currently non-existent. System performance is so disconnected that management teams have stopped running formal tracking reports entirely, meaning agent behavior is reinforced by manual, localized survival tactics rather than structural software loops. 

## **Operations Managers and Team Leaders** 

**Awareness (High):** Managers are fully aware that the operational core is leaking. They openly state that simple cases that should take minutes end up trapped in manual review pipelines for days due to incorrect sorting. 

**Desire (High):** Highly motivated to eliminate structural blind spots. Managers face constant pressure but lack basic visibility, noting they currently have no systemic way to distinguish between a customer experiencing true financial hardship and one who is intentionally avoiding contact. 

**Knowledge (Low to Medium):** While they possess deep strategic expertise, their functional oversight is crippled by the data layout. Because information is scattered across emails, disconnected text templates, and individual spreadsheets, building a comprehensive process map for audits is an ongoing challenge. 

**Ability (Low):** Severely restricted by tools. Managers cannot run reliable capacity planning because there is no standardized agreement across the floor on what different case statuses actually mean. They are forced to manage reactively via manual spreadsheet updates. 

**Reinforcement (Medium):** Highly responsive to executive metrics, but they will need the new automated analytics dashboard to permanently replace their local spreadsheets. If senior leadership pulls focus post-launch, managers will naturally slide back to localized spreadsheets to verify team performance. 

## **IT Team** 

**Awareness (High):** Their awareness of system structural limitations is incredibly high. They are acutely aware that they are buried under a mountain of technical debt and know better than anyone that the core database servers are running at maximum capacity, unable to easily handle modern lending data loads. 

**Desire (Low - Driven by Compliance Anxiety & Server Fear):** Desire to change is severely restricted by historical scars and operational fear. Having come head-to-head with painful compliance issues in the past, they have zero appetite for risk and will instinctively push back on changes without an explicit Compliance sign-off. Furthermore, they are deeply worried about the performance impact of any external integrations (especially a self-service portal) crashing or destabilizing their already vulnerable underlying database servers. 

**Knowledge (High Architectural / Low Process Adaptability):** They possess expert technical knowledge of the current legacy code, schema dependencies, and server limitations. However, because of their debt burden and compliance anxiety, their knowledge is focused on "defensive engineering" (maintaining uptime and blocking unvetted changes) rather than agile operational innovation. 

**Ability (Low to Medium - Constrained by Rigor Timelines):** While they have the engineering skills to build integrations, their operational ability to deliver quickly is intentionally slowed down. They refuse to rush code and will demand highly rigorous, exhaustive technical documentation. They will require significant, extended lead times to thoroughly review architecture designs before allowing a single script to touch production servers. 

**Reinforcement (Medium - Heavily Gated by Risk Mitigation):** They cannot be incentivized by standard "speed-to-market" goals. Reinforcement for this group comes entirely from proven system stability, zero server downtime, and a paper trail showing 100% compliance alignment. They will only champion the roadmap if they are given the administrative space to review documentation slowly and safely. 

## Practical Change Risks & Mitigation Actions 

## Risk 1: Agent Workaround Adherence & "Shadow" Spreadsheets 

**The Risk:** Experienced agents who have spent years building custom manual shortcuts to hit their individual collections targets will resist using the new integrated CRM. They may continue 

to run "shadow" tracking spreadsheets on their local desktops to manage their days, breaking the Single Source of Truth (SSOT). 

**Mitigation Action:** Recruit the most senior, respected collections agents who use these workarounds to serve as Co-Designers during the CRM configuration phase. Ensure the new interface directly embeds their best shortcuts into the automated system logic, making the official software faster than their legacy manual methods. 

## Risk 2: Resistance to Retiring Shadow Spreadsheets (Data Mutation) 

**The Risk:** Collections Agents and Team Leaders are deeply dependent on local Excel tracking tools to manage daily performance. If teams secretly maintain their local spreadsheets because they don't fully trust the new centralized CRM workspace, data mutation occurs. The system logs will immediately fall out of sync with real-world activity, completely invalidating management reporting visibility and corrupting the centralized data. 

**Mitigation Action:** Execute a strict, hard-stop **"Spreadsheet Sunset Policy"** tied directly to user access controls. On the day the unified CRM launches, revoke write-access permissions to all shared local collection spreadsheets, rendering them read-only. Concurrently, build custom, localized team "Views" within the new CRM UI that perfectly mimic the visual data layout of the retired spreadsheets, giving Team Leaders their required performance tracking metrics without allowing off-system data hoarding. 

## Risk 3: API Pipeline Straining on Legacy Architecture 

**The Risk:** The deployment of the **Systemic PTP Ledger (OPP-04)** requires constant, automated API calls to parse incoming daily bank transaction statements and update account logs. Because Systems Administrators note that the current core database was built for a fraction of today's volume, this sudden spike in automated API traffic could trigger database timeouts, slow down system performance for live agents, or crash the core legacy environment during peak morning shifts. 

**Mitigation Action:** Design the PTP Ledger engine to run on an asynchronous, batched microservice architecture. Instead of hitting the core transactional database with real-time API inquiries every time a bank statement row updates, ingest bank ledger data into a staging database overnight. Run the payment-matching algorithms and status updates in a low-traffic window (e.g., 02:00 AM) so that clean, consolidated account updates are ready before agents log on for morning shifts. 

## Scope definition 

## Capability A: Centralized CRM Unified Workspace (OPP-03 Architecture) 

**Technical Scope:** Build data pipelines that ingest and harmonize real-time account data from four existing disconnected silos: the Core Legacy Database, local team spreadsheet logs, central email accounts, and telephony interaction logs. 

**Operational Deliverable:** A single, synchronized screen for collections agents that displays a customer's full historical contact string, current delinquency state, and past promise timelines simultaneously. 

**Justification:** The Centralized CRM wipes out the daily practice of manual spreadsheet reconciliation (656.2 hours saved annually), giving IT a clean data cache to safely scale secondary automations. 

## Capability B: Systemic PTP Ledger & Core Transaction Engine (OPP-04 Architecture) 

**Technical Scope:** Build a programmatic, write-protected ledger registry dedicated to tracking Promise-to-Pay (PTP) commitments. Integrate an automated batch microservice that ingests daily bank transaction feeds overnight. 

**Operational Deliverable:** System automatically runs payment-matching logic against active customer promises. 

- _If settled:_ The system logs a success timestamp and updates the account state. 

- _If broken:_ The system immediately drops account protection flags, routes the file to an urgent queue, and queues an outreach trigger. 

## Capability C: Automated Triage Engine & Rules-Based Routing (OPP-05 Architecture) 

**Technical Scope:** Establish an algorithmic ingestion gate that evaluates metadata tags (days past due, balance scale, product type, compliance history) on incoming delinquent records. 

**Operational Deliverable:** Automatically splits and isolates the 38% share of straightforward accounts, pushing them directly into a fast-track automated queue. This drops simple 

investigation cycles from an 18-minute manual lookup down to a 10-minute automated assignment. 

## Exclusion A: Unified Digital Self-Service Portal (OPP-01) 

**Justification:** Attempting to build an external portal while internal agent data is still fractured across four disconnected systems introduces severe security risks and data synchronization errors. Deferring the **£85,000 cost of OPP-01** allows your IT team to first stabilize your internal data infrastructure via the Phase 1 CRM. 

## Exclusion B: Partial exclusion of Automated Multi-Channel Outreach Engine (OPP-02) 

High-exposure portfolios—specifically **Auto Finance** ($15.5\%$ of active volume involving physical asset repossession) and **Late Delinquency** ($15.9\%$ of active volume heading toward legal action)—are completely excluded from automated messaging, automated settlement paths, or hands-off system logic. 

**Justification:** While OPP-02 safely dispatches automated text and email alerts to early-stage or simple accounts, it is barred from communicating with late-stage or asset-backed accounts. Because repossession notices and legal collection paths carry intense regulatory and reputational risk, the outreach engine must prevent automated message fires on these accounts, leaving all correspondence to be verified and sent manually by senior collections specialists. 

## Exclusion C: Automated Compliance Logging Engine (OPP-06) 

**Justification:** Excluding OPP-06 (Automated Compliance Logging) from Phase 1 reduces required capital expenditure from £215,000 to £170,000 and accelerates the program's payback period to just 25 days, all while preserving 99% (£2.44M) of the target cash returns. Architecturally, this deferral is justified because building automated audit trails is impossible until the underlying data is standardized via the Phase 1 CRM; forcing it now would only strain the fragile legacy database with heavy background tracking scripts. In the interim, compliance risk is safely managed by enforcing mandatory drop-down notes within the new centralized interface and relying on standard database backups for manual audits when required. 

||**Required Output /**<br>**Task**<br>**Target**<br>**Completion /**<br>**Estimated Effort**<br>**Estimated Effort /**<br>**Potential Blockers**<br>**Strategic Justification**<br>**To-Be Workflow &**<br>**Exception Path**<br>**Architecture**<br>**Day 2**<br>**~5 Hours**<br>**Blocker:**Unclear<br>routing logic<br>parameters for<br>separating the 38%<br>straightforward cases<br>from protected tracks.<br>Must be mapped first to establish<br>the precise system logic<br>boundaries before writing Jira<br>user stories or layout designs.<br>**Prioritized Jira**<br>**Backlog (Technical**<br>**Stories & AC)**<br>**Day 3**<br>**~7 Hours**<br>**Blocker:**<br>Disagreements on<br>MVP boundary lines<br>or missing data fields<br>within legacy<br>database export<br>pipelines.<br>Translates the process map into<br>actionable, estimation-ready<br>developer tasks. Acceptance<br>Criteria (AC) protect against<br>scope creep.<br>**Low-Fidelity Figma**<br>**Wireframe**<br>**Workspace**<br>**Day 4**<br>**~6 Hours**<br>**Blocker:**Delayed<br>confirmation of the<br>minimum fields<br>agents need to see to<br>manage a PTP ledger<br>event.<br>Provides reviewers with a<br>tangible visual reference for the<br>unified workspace, proving the<br>elimination of "shadow<br>spreadsheets."<br>**State of the Product**<br>**Executive Briefing**<br>**Deck**<br>**Day 5**<br>**~6 Hours**<br>**Blocker:**Polishing<br>the narrative to<br>ensure financial<br>metrics perfectly<br>match the lean £170k<br>budget footprint.<br>Synthesizes the engineering<br>plans, costs, feasibility, and<br>adoption risks into a top-down<br>executive narrative for immediate<br>budget sign-off.|
|---|---|



