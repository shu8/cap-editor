import { Trans } from "@lingui/macro";
import { ArrowUp } from "@rsuite/icons";
import Link from "next/link";
import { Button, Dropdown } from "rsuite";

const LanguageSelector = () => (
  <Dropdown
    placement="topStart"
    renderToggle={(props, ref) => (
      <Button {...props} ref={ref} appearance="ghost" size="sm" color="violet">
        <Trans>Language</Trans>
        <ArrowUp />
      </Button>
    )}
  >
    <Link href="#" locale="en">
      <Dropdown.Item>English</Dropdown.Item>
    </Link>
    <Link href="#" locale="fr">
      <Dropdown.Item>Français</Dropdown.Item>
    </Link>
    <Link href="#" locale="es">
      <Dropdown.Item>Español</Dropdown.Item>
    </Link>
  </Dropdown>
);

export default LanguageSelector;
