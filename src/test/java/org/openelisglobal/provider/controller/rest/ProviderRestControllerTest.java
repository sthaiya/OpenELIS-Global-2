package org.openelisglobal.provider.controller.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

public class ProviderRestControllerTest extends BaseWebContextSensitiveTest {

    @Before
    public void setUp() throws Exception {
        super.setUp();
        executeDataSetWithStateManagement("testdata/provider.xml");
    }

    @Test
    public void getUrl() throws Exception {
        MvcResult urlResult = super.mockMvc.perform(get("/rest/Provider/raw/2").accept(MediaType.APPLICATION_JSON_VALUE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        System.out.println(urlResult.getResponse().getStatus());

    }

}
