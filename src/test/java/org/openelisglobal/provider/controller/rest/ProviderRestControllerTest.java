package org.openelisglobal.provider.controller.rest;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
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
    public void getProvider_shouldReturnProviderGivenId() throws Exception {
        MvcResult urlResult = super.mockMvc.perform(get("/rest/Provider/raw/2").accept(MediaType.APPLICATION_JSON_VALUE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = urlResult.getResponse().getStatus();
        assertEquals(200, status);

        String providerJson = urlResult.getResponse().getContentAsString();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> providerMap = objectMapper.readValue(providerJson,
                new TypeReference<Map<String, Object>>() {
                });

        assertEquals("2", providerMap.get("id"));
        assertEquals("1234567891", providerMap.get("npi"));
        assertEquals("EXT123466", providerMap.get("externalId"));
        assertEquals("S", providerMap.get("providerType"));
        assertEquals(false, providerMap.get("active"));
        assertEquals(true, providerMap.get("desynchronized"));
    }

    @Test
    public void getPerson_shouldReturnPersonInfoByID() throws Exception {
        MvcResult urlResult = super.mockMvc.perform(get("/rest/Provider/Person/2")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        String personJson = urlResult.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> personInfo = objectMapper.readValue(personJson, new TypeReference<Map<String, Object>>() {
        });

        assertEquals("James", personInfo.get("firstName"));
        assertEquals("Mark", personInfo.get("middleName"));
        assertEquals("Orion", personInfo.get("city"));

    }

}
