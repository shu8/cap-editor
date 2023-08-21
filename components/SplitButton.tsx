import { ArrowUp, ArrowDown } from "@rsuite/icons";
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
  arrowDirection,
  ...buttonProps
}: {
  options: string[];
  onClick: (optionIndex: number) => void;
  arrowDirection: "up" | "down";
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
          placement={arrowDirection === "up" ? "top" : "bottom"}
          trigger="click"
          speaker={({ onClose, left, top, className }, ref) => (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu
                onSelect={(eventKey) => {
                  onClose();
                  const newIndex = parseInt(eventKey ?? "0", 10);
                  setOptionIndex(newIndex);
                  onClick(newIndex);
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
            size={buttonProps.size ?? "md"}
            color={buttonProps.color ?? "blue"}
            icon={arrowDirection === "up" ? <ArrowUp /> : <ArrowDown />}
          />
        </Whisper>
      )}
    </ButtonGroup>
  );
}
