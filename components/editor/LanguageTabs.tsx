import ISO6391 from "iso-639-1";
import { ReactNode, useState } from "react";
import { Button, Message, Modal, SelectPicker } from "rsuite";
import CloseOutlineIcon from "@rsuite/icons/CloseOutline";

import styles from "../../styles/components/editor/LanguageTabs.module.css";
import { classes } from "../../lib/helpers.client";
import { t, Trans } from "@lingui/macro";
import { useToasterI18n } from "../../lib/useToasterI18n";

type Props = {
  languages: string[];
  language: string;
  onCreateLanguage: (language: string) => void;
  onDeleteLanguage: (language: string) => void;
  onSetLanguage: (language: string) => void;
  children: ReactNode;
};

export default function LanguageTabs(props: Props) {
  const toaster = useToasterI18n();
  const [showChooseLanguageModal, setShowChooseLanguageModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");

  return (
    <>
      {showChooseLanguageModal && (
        <Modal open>
          <Modal.Title>
            <Trans>Choose language</Trans>
          </Modal.Title>

          <Modal.Body>
            <SelectPicker
              placeholder={t`Select a language`}
              label={t`Language`}
              data={ISO6391.getAllNames().map((l) => ({
                label: l,
                value: ISO6391.getCode(l),
              }))}
              value={newLanguage}
              onChange={(v) => setNewLanguage(v ?? "")}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              appearance="ghost"
              color="red"
              onClick={() => setShowChooseLanguageModal(false)}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                if (!newLanguage) {
                  toaster.push(
                    <Message type="error" closable duration={0}>
                      <Trans>Please choose a language to add</Trans>
                    </Message>
                  );
                  return;
                }

                props.onCreateLanguage(newLanguage);
                setShowChooseLanguageModal(false);
              }}
            >
              <Trans>Add language</Trans>
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <div className={styles.languagesTabs}>
        <Trans>Language</Trans>:
        {props.languages.map((l) => (
          <span
            key={`language-${l}`}
            className={classes(
              styles.languageTab,
              props.language === l && styles.selected
            )}
            onClick={() => props.onSetLanguage(l)}
          >
            {ISO6391.getName(l)}
            <span
              title={t`Delete language?`}
              onClick={() => {
                if (
                  window.confirm(
                    t`Are you sure you want to delete this language and all its contents?`
                  )
                ) {
                  props.onDeleteLanguage(l);
                }
              }}
            >
              <CloseOutlineIcon className={styles.deleteLanguageIcon} />
            </span>
          </span>
        ))}
        <span
          className={classes(styles.languageTab)}
          onClick={() => setShowChooseLanguageModal(true)}
        >
          <Trans>Add another language?</Trans>
        </span>
      </div>

      {props.children}
    </>
  );
}
