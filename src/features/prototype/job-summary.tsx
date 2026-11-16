import { Link, useParams } from "react-router";
import { BackLink } from "@/components/back-link";
import { buttonVariants } from "@/components/ui/button";
import { jobSummary } from "./job-summary-stats";
import { currentPerson } from "./model";
import { NotFound, PageTitle } from "./shell";
import { usePrototype } from "./store";

const dateFormat = new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" });
const statusLabels: Record<string, string> = {
  published: "Opublikowane",
  expired: "Zakończone",
};

function share(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function continuedText(n: number) {
  if (n === 1) return "1 osoba przeszła";
  const last = n % 10;
  return last >= 2 && last <= 4 && (n % 100 < 10 || n % 100 >= 20)
    ? `${n} osoby przeszły`
    : `${n} osób przeszło`;
}

/** Employer-facing effect of a listing: what the purchase produced, up to the first conversation. */
export function JobSummaryPage() {
  const { id } = useParams();
  const { state } = usePrototype();
  const person = currentPerson(state)!;
  const job = state.jobs.find((x) => x.id === id && x.companyId === person.companyId);
  if (!job) return <NotFound />;
  const summary = jobSummary(state, job.id);
  const rows = [
    {
      key: "applications",
      label: "Aplikacje",
      value: summary.applications,
      note: "wysłane na ogłoszenie",
    },
    {
      key: "invited",
      label: "Zaproszenia",
      value: summary.invited,
      note: "osoby zaproszone na rozmowę",
    },
    {
      key: "conversations",
      label: "Rozmowy",
      value: summary.conversations,
      note: "odbyte pierwsze rozmowy",
    },
    {
      key: "continued",
      label: "Kontynuacje",
      value: summary.continued,
      note: "osoby warte dalszej rozmowy",
    },
  ] as const;
  const days = summary.daysToFirstConversation;
  return (
    <>
      <nav aria-label="Ścieżka nawigacji" className="record-breadcrumb">
        <BackLink to="/app/oferty">Moje oferty</BackLink>
      </nav>
      <PageTitle>Podsumowanie ogłoszenia</PageTitle>
      <p className="job-summary-lead">{job.title}</p>
      <dl className="job-summary-facts">
        <div>
          <dt>Okres</dt>
          <dd>
            {dateFormat.format(new Date(job.publishedAt))} –{" "}
            {dateFormat.format(new Date(job.expiryAt))}
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{statusLabels[job.publicationStatus] ?? "Szkic"}</dd>
        </div>
        <div>
          <dt>Pierwsza rozmowa po</dt>
          <dd>{days === null ? "Brak rozmów" : days === 1 ? "1 dniu" : `${days} dniach`}</dd>
        </div>
      </dl>
      <section className="prototype-panel job-summary-board" aria-labelledby="summary-result">
        <h2 id="summary-result">Wynik ogłoszenia</h2>
        <ol className="job-summary-funnel">
          {rows.map((row) => (
            <li key={row.key} data-signal={row.key === "continued" || undefined}>
              <span className="job-summary-label">{row.label}</span>
              <span className="job-summary-number">{row.value}</span>
              <span className="job-summary-percent">{share(row.value, summary.applications)}%</span>
              <span className="job-summary-note">{row.note}</span>
              <span className="job-summary-track" aria-hidden="true">
                <i style={{ width: `${share(row.value, summary.applications)}%` }} />
              </span>
            </li>
          ))}
        </ol>
        <p className="job-summary-sentence">
          {summary.conversations > 0
            ? `Z ${summary.applications} aplikacji ${continuedText(summary.continued)} dalej po pierwszej rozmowie.`
            : "Na to ogłoszenie nie odbyła się jeszcze żadna rozmowa."}
        </p>
        <p className="record-caption">
          Portal widzi etapy do wyniku pierwszej rozmowy. Nie zna decyzji o zatrudnieniu ani jakości
          późniejszej pracy.
        </p>
      </section>
      <section className="prototype-panel job-summary-action" aria-labelledby="summary-next">
        <h2 id="summary-next">Masz kolejną rolę?</h2>
        <p>Opublikuj kolejne ogłoszenie albo wróć do osób z tego ogłoszenia.</p>
        <div className="record-actions">
          <Link to="/app/oferty/nowa" className={buttonVariants()}>
            Opublikuj kolejną rolę
          </Link>
          <Link to="/app/kandydaci" className={buttonVariants({ variant: "outline" })}>
            Zobacz kandydatów
          </Link>
        </div>
      </section>
    </>
  );
}
