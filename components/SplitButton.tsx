import { ArrowDown, ArrowUp } from "@rsuite/icons";
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  IconButton,
  Popover,
  Whisper,
} from "rsuite";

export default function SplitButton({
  options,
  onClick,
  ...buttonProps
}: {
  options: string[];
  onClick: (optionIndex: number) => void;
  [x: string]: any;
}) {
  const [optionIndex, setOptionIndex] = useState(0);

  return (
    <ButtonGroup>
      <Button {...buttonProps} onClick={() => onClick(optionIndex)}>
        {options[optionIndex]}
      </Button>
      {options.length > 1 && (
        <Whisper
          placement="top"
          trigger="click"
          speaker={({ onClose, left, top, className }, ref) => (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu
                onSelect={(eventKey) => {
                  onClose();
                  setOptionIndex(eventKey);
                }}
              >
                {options.map((o, i) => (
                  <Dropdown.Item key={i} eventKey={i}>
                    {o}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Popover>
          )}
        >
          <IconButton
            style={{ borderLeft: "1px solid black" }}
            appearance="primary"
            color={buttonProps.color ?? "blue"}
            icon={<ArrowUp />}
          />
        </Whisper>
      )}
    </ButtonGroup>
  );
}
