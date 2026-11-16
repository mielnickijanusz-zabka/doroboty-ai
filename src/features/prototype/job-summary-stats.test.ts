import { describe, expect, it } from "vitest";
import { jobSummary } from "./job-summary-stats";
import { initialState, transition, type State } from "./model";

const closed = (s: State) => s.jobs.find((x) => x.slug === "automatyzacja-obslugi-zgloszen")!;
const as = (s: State, id: string) => transition(s, { type: "select_person", id });

describe("job summary", () => {
  it("counts the prepared closed listing (47 applications, 9 conversations, 5 continued)", () => {
    const s = initialState();
    expect(jobSummary(s, closed(s).id)).toEqual({
      applications: 47,
      invited: 9,
      conversations: 9,
      continued: 5,
      daysToFirstConversation: 11,
    });
  });
  it("hides prepared cohort candidates from the person picker data set by flag", () => {
    const s = initialState();
    expect(s.people.filter((x) => x.hidden)).toHaveLength(47);
    expect(s.people.filter((x) => !x.hidden)).toHaveLength(5);
  });
  it("follows live stage changes for an open listing", () => {
    let s = as(initialState(), "employer-brightlabs");
    const id = "application-example";
    const job = s.jobs[0];
    expect(jobSummary(s, job.id)).toMatchObject({ applications: 1, invited: 0, conversations: 0 });
    for (const stage of ["reviewed", "interview_invited", "first_conversation_held"] as const) {
      s = transition(
        s,
        { type: "stage", applicationId: id, stage, note: "" },
        "2026-11-10T10:00:00.000Z",
      );
    }
    const summary = jobSummary(s, job.id);
    expect(summary).toMatchObject({ applications: 1, invited: 1, conversations: 1, continued: 0 });
    expect(summary.daysToFirstConversation).not.toBeNull();
  });
  it("has no first-conversation time without conversations", () => {
    const s = initialState();
    expect(jobSummary(s, s.jobs[0].id).daysToFirstConversation).toBeNull();
  });
});
