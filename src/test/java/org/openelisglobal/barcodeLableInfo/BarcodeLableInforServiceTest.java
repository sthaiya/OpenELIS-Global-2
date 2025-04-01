package org.openelisglobal.barcodeLableInfo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.barcode.service.BarcodeLabelInfoService;
import org.openelisglobal.barcode.valueholder.BarcodeLabelInfo;
import org.springframework.beans.factory.annotation.Autowired;

public class BarcodeLableInforServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private BarcodeLabelInfoService barcodeLabelInfoService;

    @Before
    public void setup() throws Exception {
        executeDataSetWithStateManagement("testdata/barcode-lable-info.xml");

    }

    @Test
    public void getDataByCode() {
        BarcodeLabelInfo info = barcodeLabelInfoService.getDataByCode("ABC123");
        assertNotNull(info);
        assertEquals("1", info.getId());
        assertEquals(100, info.getNumPrinted());
        assertEquals("Standard", info.getType());

        BarcodeLabelInfo info2 = barcodeLabelInfoService.getDataByCode("XYZ456");
        assertNotNull(info2);
        assertEquals("2", info2.getId());
        assertEquals(150, info2.getNumPrinted());
        assertEquals("Custom", info2.getType());
        BarcodeLabelInfo info3 = barcodeLabelInfoService.getDataByCode("LMN789");
        assertNotNull(info3);
        assertEquals("3", info3.getId());
        assertEquals(200, info3.getNumPrinted());
        assertEquals("Standard", info3.getType());

    }

}
