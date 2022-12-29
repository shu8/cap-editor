import { createContext, useState } from "react";
import { AlertData } from "../components/editor/NewAlert";
import { getStartOfToday } from "./helpers";

const defaultAlertData = {
  category: ["Geo"],
  regions: { "United Kingdom": [] },
  from: getStartOfToday(),
  to: new Date(),
  headline: "",
  description: "",
  instruction: "",
  actions: [],
  certainty: "Likely",
  severity: "Severe",
  urgency: "Immediate",
  status: "Actual",
  msgType: "Alert",
  scope: "Public",
  restriction: "",
  addresses: [],
  references: [],
  event: "Test",
};

const EditorContext = createContext<{
  alertData: AlertData;
  setAlertData: (d: AlertData) => void;
}>({
  alertData: defaultAlertData,
  setAlertData: () => null,
});

export const EditorContextProvider = ({ children }) => {
  const [data, setData] = useState<AlertData>(defaultAlertData);

  return (
    <EditorContext.Provider
      value={{
        alertData: data,
        setAlertData: (d) => setData(d),
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
