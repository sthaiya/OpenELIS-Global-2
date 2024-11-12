import React, { useContext, useState, useEffect } from "react";
import { AlertDialog } from "../../common/CustomNotification";
import { NotificationContext } from "../../layout/Layout";
import { injectIntl, FormattedMessage, useIntl } from "react-intl";
import PageBreadCrumb from "../../common/PageBreadCrumb";
import { Loading } from "@carbon/react";

const ResultDispatchReportIndex = () => {
  return (
    <>
      <Grid fullWidth={true}>
        <Column lg={16} md={8} sm={4}>
          <Section>
            <Section>
              <Heading>
                <FormattedMessage id="eorder.header" />
              </Heading>
            </Section>
          </Section>
        </Column>
      </Grid>
      <div className="orderLegendBody">
        <ResultDispatchReport
          report={"resultDispatch"}
          id={"reports.resultDispatch"}
        />
      </div>
    </>
  );
};

export default injectIntl(ResultDispatchReportIndex);
