import type { State, Stage } from "./model";

export type JobSummary = {
  applications: number;
  invited: number;
  conversations: number;
  continued: number;
  /** Whole days from publication to the first held conversation; null when none was held. */
  daysToFirstConversation: number | null;
};

const dayMs = 24 * 60 * 60 * 1000;

/** Counts how many applications ever reached each stage. Stages are read from event history. */
export function jobSummary(state: State, jobId: string): JobSummary {
  const job = state.jobs.find((x) => x.id === jobId);
  const apps = state.applications.filter((x) => x.jobId === jobId);
  const reached = (app: (typeof apps)[number], stages: Stage[]) =>
    app.events.some((event) => stages.includes(event.stage));
  const held = apps
    .flatMap((app) => app.events.filter((event) => event.stage === "first_conversation_held"))
    .map((event) => event.at)
    .sort();
  return {
    applications: apps.length,
    invited: apps.filter((x) => reached(x, ["interview_invited"])).length,
    conversations: apps.filter((x) => reached(x, ["first_conversation_held"])).length,
    continued: apps.filter((x) => reached(x, ["continued", "hired"])).length,
    daysToFirstConversation:
      job && held.length
        ? Math.round((Date.parse(held[0]) - Date.parse(job.publishedAt)) / dayMs)
        : null,
  };
}
