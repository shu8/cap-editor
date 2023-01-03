import ISO6391 from "iso-639-1";

import styles from "../../styles/components/cap/LanguageTabs.module.css";
import { classes } from "../../lib/helpers";
import { ReactNode, useState } from "react";
import { Button, Message, Modal, SelectPicker, useToaster } from "rsuite";

type Props = {
  languages: string[];
  language: string;
  onCreateLanguage: (language: string) => void;
  onSetLanguage: (language: string) => void;
  children: ReactNode;
};

export default function LanguageTabs(props: Props) {
  const toaster = useToaster();
  const [showChooseLanguageModal, setShowChooseLanguageModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");

  return (
    <>
      {showChooseLanguageModal && (
        <Modal open>
          <Modal.Title>Choose language</Modal.Title>

          <Modal.Body>
            <SelectPicker
              placeholder="Select a language"
              label="Language"
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
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                if (!newLanguage) {
                  toaster.push(
                    <Message type="error" closable duration={0}>
                      Please choose a language to add
                    </Message>
                  );
                  return;
                }

                props.onCreateLanguage(newLanguage);
                setShowChooseLanguageModal(false);
              }}
            >
              Add language
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <div className={styles.languagesTabs}>
        Language:
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
          </span>
        ))}
        <span
          className={classes(styles.languageTab)}
          onClick={() => setShowChooseLanguageModal(true)}
        >
          Add another language?
        </span>
      </div>

      {props.children}
    </>
  );
}
