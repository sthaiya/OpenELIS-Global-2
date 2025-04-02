package org.openelisglobal.barcodeLableInfo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;
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

    @Test
    public void get_shouldReturnBarcodeLabelInfoGivenId() {
        BarcodeLabelInfo barcode = barcodeLabelInfoService.get("1");
        assertEquals(100, barcode.getNumPrinted());
        assertEquals("Standard", barcode.getType());

    }

    @Test
    public void getNext_shouldReturnNextBarcodeLabelInfo() {
        BarcodeLabelInfo bLabelInfo = barcodeLabelInfoService.getNext("1");
        assertEquals("2", bLabelInfo.getId());
    }

    @Test
    public void getPrevious_shouldReturnPreviousItem() {
        BarcodeLabelInfo bLabelInfo = barcodeLabelInfoService.getPrevious("2");
        assertEquals("1", bLabelInfo.getId());
    }

    @Test
    public void save_sholdSaveBarcodeLabelInfo() {
        barcodeLabelInfoService.deleteAll(barcodeLabelInfoService.getAll());
        BarcodeLabelInfo barcodeLabelInfo = new BarcodeLabelInfo();
        barcodeLabelInfo.setNumPrinted(300);
        barcodeLabelInfo.setCode("75");
        barcodeLabelInfo.setType("Standard");
        BarcodeLabelInfo barcodeLabelInfo2 = barcodeLabelInfoService.save(barcodeLabelInfo);
        assertNotNull(barcodeLabelInfo2);
        assertEquals(300, barcodeLabelInfo2.getNumPrinted());
    }

    @Test
    public void getAll_sholdReturnAll() {
        List<BarcodeLabelInfo> barcodes = barcodeLabelInfoService.getAll();
        assertEquals(3, barcodes.size());

    }

    @Test
    public void update_shouldUpdateBarcodeLabelInfo() {
        BarcodeLabelInfo bLabelInfo = barcodeLabelInfoService.get("1");
        bLabelInfo.setCode("15");
        BarcodeLabelInfo barcodeLabelInfo2 = barcodeLabelInfoService.update(bLabelInfo);
        assertEquals("1", barcodeLabelInfo2.getId());
        assertEquals("15", barcodeLabelInfo2.getCode());
    }

}
