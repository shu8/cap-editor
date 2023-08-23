import { CheckPicker, DatePicker, Form, Input, SelectPicker } from "rsuite";
import { FormAlertData } from "../EditorSinglePage";
import { ReactNode, forwardRef } from "react";
import { Trans } from "@lingui/macro";
import { DateTime } from "luxon";
import { RangeType } from "rsuite/esm/DatePicker";

const predefinedTimeRanges: RangeType<Date>[] = [
  {
    label: "now",
    value: new Date(),
    placement: "left",
  },
  {
    label: "today, end",
    value: DateTime.now().endOf("day").toJSDate(),
    placement: "left",
  },
  {
    label: "tomorrow, start",
    value: DateTime.now().plus({ days: 1 }).startOf("day").toJSDate(),
    placement: "left",
  },
  {
    label: "tomorrow, end",
    value: DateTime.now().plus({ days: 1 }).endOf("day").toJSDate(),
    placement: "left",
  },
  {
    label: "in one hour",
    value: DateTime.now().plus({ hours: 1 }).toJSDate(),
    placement: "left",
  },
];

type FieldProps = {
  onUpdate: (data: Partial<FormAlertData>) => void;
  alertData: FormAlertData;
};

const Textarea = forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

const TextField = ({
  onUpdate,
  alertData,
  label,
  fieldName,
  maxLength,
  textarea,
  help,
}: {
  label: string;
  fieldName: keyof FormAlertData;
  maxLength?: number;
  textarea?: boolean;
  help?: string | ReactNode;
} & FieldProps) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      onChange={(v) => onUpdate({ [fieldName]: v })}
      value={alertData[fieldName]}
      accepter={textarea ? Textarea : Input}
    />
    {!!maxLength && (
      <Form.HelpText
        style={{
          color:
            (alertData[fieldName]?.length ?? 0) > maxLength ? "red" : "unset",
        }}
      >
        {alertData[fieldName]?.length ?? 0}/{maxLength}{" "}
        <Trans>characters</Trans>
      </Form.HelpText>
    )}
    {!!help && <Form.HelpText>{help}</Form.HelpText>}
  </Form.Group>
);

const DropdownField = ({
  onUpdate,
  alertData,
  label,
  options,
  fieldName,
  searchable,
  onOpen,
  multi,
}: {
  label: string;
  fieldName: keyof FormAlertData;
  options: string[] | { label: string; value: any }[];
  searchable?: boolean;
  onOpen?: () => void;
  multi?: boolean;
} & FieldProps) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      accepter={multi ? CheckPicker : SelectPicker}
      data={
        typeof options[0] === "string"
          ? options.map((t) => ({
              label: t,
              value: t,
            }))
          : options
      }
      block
      cleanable={false}
      searchable={searchable ?? false}
      value={alertData[fieldName]}
      onChange={(v) => onUpdate({ [fieldName]: v! })}
      onOpen={() => onOpen?.()}
    />
  </Form.Group>
);

const DateTimeField = ({
  onUpdate,
  alertData,
  label,
  fieldName,
}: {
  label: string;
  fieldName: keyof FormAlertData;
} & FieldProps) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      accepter={DatePicker}
      oneTap
      format="yyyy-MM-dd HH:mm:ss"
      block
      ranges={predefinedTimeRanges}
      cleanable={false}
      value={alertData[fieldName] as Date}
      onChange={(v) => onUpdate({ [fieldName]: v! })}
    />
  </Form.Group>
);

export { Textarea, TextField, DropdownField, DateTimeField };
export type { FieldProps };
