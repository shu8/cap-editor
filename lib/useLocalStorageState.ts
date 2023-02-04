import { useLocalStorage } from "usehooks-ts";

export const useAlertingAuthorityLocalStorage = () => {
  return useLocalStorage("alertingAuthorityId", "");
};
