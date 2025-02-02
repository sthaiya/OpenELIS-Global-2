import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  Column,
  Grid,
  Heading,
  Section,
  Select,
  SelectItem,
} from "@carbon/react";
import ExistingOrder from "./ExistingOrder";
import PrePrint from "./PrePrint";
import PageBreadCrumb from "../common/PageBreadCrumb.js";
import { BarcodeContext } from "./BarcodeContext";

let breadcrumbs = [{ label: "home.label", link: "/" }];

const PrintBarcode = () => {
  const [barcodeFormat, setBarcodeFormat] = useState("barcode");

  return (
    <BarcodeContext.Provider
      value={{ format: barcodeFormat, setFormat: setBarcodeFormat }}
    >
      <div>
        <PageBreadCrumb breadcrumbs={breadcrumbs} />
        <Grid fullWidth={true}>
          <Column lg={16} md={8} sm={4}>
            <Section>
              <Section>
                <Heading>
                  <FormattedMessage id="barcode.print.title" />
                </Heading>
              </Section>
            </Section>
          </Column>
        </Grid>
        <Grid>
          <Column lg={8} md={4} sm={4}>
            <Select
              id="barcodeFormat"
              labelText="Barcode Format:"
              value={barcodeFormat}
              onChange={(e) => setBarcodeFormat(e.target.value)}
            >
              <SelectItem text="Barcode (Classic)" value="barcode" />
              <SelectItem text="QR Code" value="qr" />
            </Select>
          </Column>
        </Grid>
        <PrePrint />
        <ExistingOrder />
      </div>
    </BarcodeContext.Provider>
  );
};

export default PrintBarcode;
