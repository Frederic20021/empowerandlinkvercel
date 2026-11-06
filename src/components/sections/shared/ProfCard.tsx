import { Reveal } from "@/components/flow/Reveal";
import { Photo } from "./Photo";
import { Rich } from "./text";

export type Person = {
  readonly name: string;
  readonly kana: string;
  readonly image: string;
  readonly sections: ReadonlyArray<{ readonly title: string; readonly items: ReadonlyArray<string> }>;
};

/** Instructor card (`.prof`). With `onOpen` the card is a button (opens the course modal), otherwise a plain block. */
export function ProfCard({
  person,
  suffix,
  chip,
  onOpen,
}: {
  person: Person;
  suffix: string;
  chip?: string;
  onOpen?: () => void;
}) {
  const inner = (
    <>
      <div className="prof-ph">
        <Photo src={person.image} alt={person.name} sizes="(min-width: 760px) 33vw, 100vw" />
      </div>
      <div className="prof-b">
        {chip ? <span className="chip">{chip}</span> : null}
        <h3>
          {person.name}
          <small>{suffix}</small>
        </h3>
        <p className="kana">{person.kana}</p>
        {person.sections.map((s) => (
          <div className="psec" key={s.title}>
            <h4>{s.title}</h4>
            <ul>
              {s.items.map((x) => (
                <li key={x}>
                  <Rich text={x} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
  return (
    <Reveal as="article" className="prof">
      {onOpen ? (
        <button type="button" className="prof-in" aria-haspopup="dialog" onClick={onOpen}>
          {inner}
        </button>
      ) : (
        <div className="prof-in">{inner}</div>
      )}
    </Reveal>
  );
}
