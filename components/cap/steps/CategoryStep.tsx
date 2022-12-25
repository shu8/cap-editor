import styles from "../../../styles/components/cap/Step.module.css";
import { classes } from "../../../lib/helpers";
import { AlertData, StepProps } from "../NewAlert";
import { Button, Form } from "rsuite";

const CATEGORIES = [
  { label: "Geophysical (e.g., landslide)", value: "Geo" },
  { label: "Meteorological (inc. flood)", value: "Met" },
  { label: "General emergency & public safety", value: "Safety" },
  {
    label: "Law enforcement, military, homeland & local/private security",
    value: "Security",
  },
  { label: "Rescue & recovery", value: "Rescue" },
  { label: "Fire supression & rescue", value: "Fire" },
  { label: "Medical & public health", value: "Health" },
  { label: "Pollution & other environmental", value: "Env" },
  { label: "Public & private transportation", value: "Transport" },
  {
    label: "Utility, telecommunication & other non-transport infrastructure",
    value: "Infra",
  },
  {
    label:
      "Chemical, Biological, Radiological, Nuclear or High-Yield Explosive threat or attack",
    value: "CBRNE",
  },
  { label: "Other", value: "Other" },
];

export default function CategoryStep({
  onUpdate,
  category,
  event,
}: Partial<AlertData> & StepProps) {
  console.log(event, event?.length);
  return (
    <div>
      <h4>Category</h4>
      <p>Choose a category (or multiple) for the alert.</p>
      <div className={classes(styles.buttonGrid)}>
        {CATEGORIES.map((c) => (
          <Button
            className={classes(styles.button)}
            key={`cat-${c.value}`}
            onClick={() => {
              const index = category?.indexOf(c.value) ?? -1;
              if (index > -1) {
                category?.splice(index, 1);
              } else {
                category?.push(c.value);
              }
              return onUpdate({ category: category });
            }}
            active={category?.includes(c.value)}
            appearance="subtle"
            color="red"
          >
            {c.label}
          </Button>
        ))}
      </div>

      {category?.length > 0 && (
        <>
          <h4>Event</h4>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>
                What is the event this{" "}
                <strong>
                  <i>{category?.join(", ") ?? ""}</i>
                </strong>{" "}
                alert pertains to?
              </Form.ControlLabel>
              <Form.Control
                block
                name="event"
                onChange={(event) => onUpdate({ event })}
                value={event}
              />
              <Form.HelpText
                style={{ color: (event?.length ?? 0) > 15 ? "red" : "unset" }}
              >
                {event?.length ?? 0}/15 characters
              </Form.HelpText>
            </Form.Group>
          </Form>
        </>
      )}
    </div>
  );
}
