package org.openelisglobal.sampleorganization;

import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.sampleorganization.service.SampleOrganizationService;
import org.openelisglobal.sampleorganization.valueholder.SampleOrganization;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class SampleOrganizationServiceTest extends BaseWebContextSensitiveTest {
    @Autowired
    SampleOrganizationService sampleOrganizationService;
    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/sample-organization.xml");
    }

    @Test
    public void verifyTestData() {
        List<SampleOrganization> sampleOrganizationList = sampleOrganizationService.getAll();
        System.out.println("sample organization we have in db: " + sampleOrganizationList.size());
        sampleOrganizationList.forEach(sampleOrganization -> System.out.println(sampleOrganization.getId() + " - "
                + sampleOrganization.getSample().getAccessionNumber()));
    }
}
