import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { flattenMessages } from "../../js/components/common/messageUtils";
import inltMessages from "../../js/components/common/intlMessages";

const DEFAULT_LOCALE = "en";

const enMessagesRecords = flattenMessages(inltMessages[DEFAULT_LOCALE]);

export const renderWithReactIntl = component => {
  return render(
    <IntlProvider locale={DEFAULT_LOCALE} messages={enMessagesRecords}>
      {component}
    </IntlProvider>
  );
};
