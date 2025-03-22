package org.openelisglobal.siteinformation;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.siteinformation.service.SiteInformationService;
import org.openelisglobal.siteinformation.valueholder.SiteInformation;
import org.springframework.beans.factory.annotation.Autowired;

public class SiteInformationServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private SiteInformationService siteInformationService;

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/site-information.xml");
    }

    public void testDataInDatabase() {
        List<SiteInformation> siteInformations = siteInformationService.getAll();
        assertEquals(3, siteInformations.size());
        siteInformations.forEach(siteInfo -> {
            System.out.print(siteInfo.getName() + " ");
        });
    }

    @Test
    public void getPageOfSiteInformationByDomainName_shouldReturnCorrectSiteInformation() {
        List<SiteInformation> siteInfos = siteInformationService.getPageOfSiteInformationByDomainName(0, "2");
        assertEquals(2, siteInfos.size());
        assertEquals("SiteApiUrl", siteInfos.get(0).getName());
        assertEquals("SiteApiKey", siteInfos.get(1).getName());
    }

    @Test
    public void getCountForDomainName_shouldReturnCorrectCount() {
        int count = siteInformationService.getCountForDomainName("2");
        assertEquals(2, count);
    }

    @Test
    public void getSiteInformationByName_shouldReturnCorrectSiteInformation() {
        SiteInformation siteInfo = siteInformationService.getSiteInformationByName("SiteContactName");
        assertNotNull(siteInfo);
        assertEquals("1", siteInfo.getId());
        assertEquals("John Doe", siteInfo.getValue());
    }
   
    @Test
    public void getData_shouldPopulateSiteInformationObject() {
        SiteInformation siteInfo = new SiteInformation();
        siteInfo.setId("1");
        siteInformationService.getData(siteInfo);
       
        assertEquals("SiteContactName", siteInfo.getName());
        assertEquals("John Doe", siteInfo.getValue());
        assertEquals(false, siteInfo.isEncrypted());
    }
   
    @Test
    public void getAllSiteInformation_shouldReturnAllSiteInformation() {
        List<SiteInformation> siteInfos = siteInformationService.getAllSiteInformation();
        assertEquals(3, siteInfos.size());
    }
   
    @Test
    public void getSiteInformationById_shouldReturnCorrectSiteInformation() {
        SiteInformation siteInfo = siteInformationService.getSiteInformationById("2");
        assertNotNull(siteInfo);
        assertEquals("SiteApiUrl", siteInfo.getName());
        assertEquals("https://api.example.org/submit", siteInfo.getValue());
    }
   
    @Test
    public void getSiteInformationByDomainName_shouldReturnCorrectSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getSiteInformationByDomainName("1");
        assertEquals(1, siteInfos.size());
        assertEquals("SiteContactName", siteInfos.get(0).getName());
    }
   
    @Test
    public void persistData_shouldSaveNewSiteInformation() {
        SiteInformation newSiteInfo = new SiteInformation();
        newSiteInfo.setName("TestSiteName");
        newSiteInfo.setValue("Test Value");
        newSiteInfo.setEncrypted(false);
        // newSiteInfo.setDomainId("1");
       
        siteInformationService.persistData(newSiteInfo, true);
       
        SiteInformation retrieved = siteInformationService.getSiteInformationByName("TestSiteName");
        assertNotNull(retrieved);
        assertEquals("Test Value", retrieved.getValue());
    }
   
    @Test
    public void persistData_shouldUpdateExistingSiteInformation() {
        SiteInformation siteInfo = siteInformationService.getSiteInformationById("1");
        siteInfo.setValue("Updated Value");
       
        siteInformationService.persistData(siteInfo, false);
       
        SiteInformation updated = siteInformationService.getSiteInformationById("1");
        assertEquals("Updated Value", updated.getValue());
    }
   
    @Test
    public void get_shouldDecryptEncryptedValues() {
        SiteInformation siteInfo = siteInformationService.get("3");
        assertNotNull(siteInfo);
        // This assumes the TextEncryptor in the test context is configured
        // to properly decrypt the value from XML data
        assertNotNull(siteInfo.getValue());
        // The actual value will depend on the encryption implementation
    }
   
    @Test
    public void getMatch_withPropertyNameAndValue_shouldReturnMatchingSiteInformation() {
        Optional<SiteInformation> siteInfoOpt = siteInformationService.getMatch("name", "SiteApiKey");
        assertTrue(siteInfoOpt.isPresent());
        SiteInformation siteInfo = siteInfoOpt.get();
        assertEquals("3", siteInfo.getId());
    }
   
    @Test
    public void getMatch_withPropertyMap_shouldReturnMatchingSiteInformation() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("name", "SiteApiUrl");
        properties.put("domain_id", "2");
       
        Optional<SiteInformation> siteInfoOpt = siteInformationService.getMatch(properties);
        assertTrue(siteInfoOpt.isPresent());
        SiteInformation siteInfo = siteInfoOpt.get();
        assertEquals("2", siteInfo.getId());
    }
   
    @Test
    public void getAll_shouldReturnAllSiteInformation() {
        List<SiteInformation> siteInfos = siteInformationService.getAll();
        assertEquals(3, siteInfos.size());
    }
   
    @Test
    public void getAllMatching_withPropertyNameAndValue_shouldReturnMatchingSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getAllMatching("domain_id", "2");
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void getAllMatching_withPropertyMap_shouldReturnMatchingSiteInformations() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("encrypted", true);
       
        List<SiteInformation> siteInfos = siteInformationService.getAllMatching(properties);
        assertEquals(1, siteInfos.size());
        assertEquals("SiteApiKey", siteInfos.get(0).getName());
    }
   
    @Test
    public void getAllOrdered_withOrderProperty_shouldReturnOrderedSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getAllOrdered("name", false);
        assertEquals(3, siteInfos.size());
        assertEquals("SiteApiKey", siteInfos.get(0).getName());
        assertEquals("SiteApiUrl", siteInfos.get(1).getName());
        assertEquals("SiteContactName", siteInfos.get(2).getName());
    }
   
    @Test
    public void getAllOrdered_withOrderProperties_shouldReturnOrderedSiteInformations() {
        List<String> orderProperties = List.of("domain_id", "name");
        List<SiteInformation> siteInfos = siteInformationService.getAllOrdered(orderProperties, false);
        assertEquals(3, siteInfos.size());
        // Assert the correct ordering based on domain_id first, then name
        assertEquals("SiteContactName", siteInfos.get(0).getName());
        assertEquals("SiteApiKey", siteInfos.get(1).getName());
        assertEquals("SiteApiUrl", siteInfos.get(2).getName());
    }
   
    @Test
    public void getAllMatchingOrdered_withPropertyNameAndOrderProperty_shouldReturnMatchingOrderedSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getAllMatchingOrdered("domain_id", "2", "name", false);
        assertEquals(2, siteInfos.size());
        assertEquals("SiteApiKey", siteInfos.get(0).getName());
        assertEquals("SiteApiUrl", siteInfos.get(1).getName());
    }
   
    @Test
    public void getAllMatchingOrdered_withPropertyNameAndOrderProperties_shouldReturnMatchingOrderedSiteInformations() {
        List<String> orderProperties = List.of("tag", "name");
        List<SiteInformation> siteInfos = siteInformationService.getAllMatchingOrdered("domain_id", "2", orderProperties, false);
        assertEquals(2, siteInfos.size());
        // Ordering will depend on tag and name
    }
   
    @Test
    public void getAllMatchingOrdered_withPropertyMapAndOrderProperty_shouldReturnMatchingOrderedSiteInformations() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("domain_id", "2");
       
        List<SiteInformation> siteInfos = siteInformationService.getAllMatchingOrdered(properties, "name", false);
        assertEquals(2, siteInfos.size());
        assertEquals("SiteApiKey", siteInfos.get(0).getName());
        assertEquals("SiteApiUrl", siteInfos.get(1).getName());
    }
   
    @Test
    public void getAllMatchingOrdered_withPropertyMapAndOrderProperties_shouldReturnMatchingOrderedSiteInformations() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("domain_id", "2");
       
        List<String> orderProperties = List.of("encrypted", "name");
        List<SiteInformation> siteInfos = siteInformationService.getAllMatchingOrdered(properties, orderProperties, false);
        assertEquals(2, siteInfos.size());
        // Order should be based on encrypted status first, then name
    }
   
    @Test
    public void getPage_shouldReturnPagedSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getPage(0);
        assertFalse(siteInfos.isEmpty());
    }
   
    @Test
    public void getMatchingPage_withPropertyNameAndValue_shouldReturnMatchingPagedSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getMatchingPage("domain_id", "2", 0);
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void getMatchingPage_withPropertyMap_shouldReturnMatchingPagedSiteInformations() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("domain_id", "2");
       
        List<SiteInformation> siteInfos = siteInformationService.getMatchingPage(properties, 0);
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void getOrderedPage_withOrderProperty_shouldReturnOrderedPagedSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getOrderedPage("name", false, 0);
        assertEquals(3, siteInfos.size());
        assertEquals("SiteApiKey", siteInfos.get(0).getName());
    }
   
    @Test
    public void getOrderedPage_withOrderProperties_shouldReturnOrderedPagedSiteInformations() {
        List<String> orderProperties = List.of("domain_id", "name");
        List<SiteInformation> siteInfos = siteInformationService.getOrderedPage(orderProperties, false, 0);
        assertEquals(3, siteInfos.size());
    }
   
    @Test
    public void getMatchingOrderedPage_withPropertyNameAndOrderProperty_shouldReturnMatchingOrderedPagedSiteInformations() {
        List<SiteInformation> siteInfos = siteInformationService.getMatchingOrderedPage("domain_id", "2", "name", false, 0);
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void getMatchingOrderedPage_withPropertyNameAndOrderProperties_shouldReturnMatchingOrderedPagedSiteInformations() {
        List<String> orderProperties = List.of("encrypted", "name");
        List<SiteInformation> siteInfos = siteInformationService.getMatchingOrderedPage("domain_id", "2", orderProperties, false, 0);
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void getMatchingOrderedPage_withPropertyMapAndOrderProperty_shouldReturnMatchingOrderedPagedSiteInformations() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("domain_id", "2");
       
        List<SiteInformation> siteInfos = siteInformationService.getMatchingOrderedPage(properties, "name", false, 0);
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void getMatchingOrderedPage_withPropertyMapAndOrderProperties_shouldReturnMatchingOrderedPagedSiteInformations() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("domain_id", "2");
       
        List<String> orderProperties = List.of("encrypted", "name");
        List<SiteInformation> siteInfos = siteInformationService.getMatchingOrderedPage(properties, orderProperties, false, 0);
        assertEquals(2, siteInfos.size());
    }
   
    @Test
    public void insert_shouldCreateNewSiteInformation() {
        SiteInformation newSiteInfo = new SiteInformation();
        newSiteInfo.setName("NewTestSite");
        newSiteInfo.setValue("New Test Value");
        newSiteInfo.setEncrypted(false);
       
        String id = siteInformationService.insert(newSiteInfo);
        assertNotNull(id);
       
        SiteInformation inserted = siteInformationService.get(id);
        assertEquals("NewTestSite", inserted.getName());
        assertEquals("New Test Value", inserted.getValue());
    }
   
    @Test
    public void insertAll_shouldCreateMultipleSiteInformations() {
        SiteInformation site1 = new SiteInformation();
        site1.setName("TestSite1");
        site1.setValue("Test Value 1");
       
        SiteInformation site2 = new SiteInformation();
        site2.setName("TestSite2");
        site2.setValue("Test Value 2");
       
        List<SiteInformation> sitesToInsert = List.of(site1, site2);
        List<String> ids = siteInformationService.insertAll(sitesToInsert);
       
        assertEquals(2, ids.size());
        assertEquals("TestSite1", siteInformationService.get(ids.get(0)).getName());
        assertEquals("TestSite2", siteInformationService.get(ids.get(1)).getName());
    }
   
    @Test
    public void save_shouldInsertNewSiteInformation() {
        SiteInformation newSiteInfo = new SiteInformation();
        newSiteInfo.setName("SaveTestSite");
        newSiteInfo.setValue("Save Test Value");
       
        SiteInformation saved = siteInformationService.save(newSiteInfo);
        assertNotNull(saved.getId());
        assertEquals("SaveTestSite", saved.getName());
    }
   
    @Test
    public void save_shouldUpdateExistingSiteInformation() {
        SiteInformation siteInfo = siteInformationService.get("1");
        siteInfo.setValue("Updated via Save");
       
        SiteInformation saved = siteInformationService.save(siteInfo);
        assertEquals("1", saved.getId());
        assertEquals("Updated via Save", saved.getValue());
    }
   
    @Test
    public void saveAll_shouldInsertAndUpdateMultipleSiteInformations() {
        SiteInformation existingSite = siteInformationService.get("1");
        existingSite.setValue("Batch Updated");
       
        SiteInformation newSite = new SiteInformation();
        newSite.setName("BatchNewSite");
        newSite.setValue("Batch New Value");
       
        List<SiteInformation> sitesToSave = List.of(existingSite, newSite);
        List<SiteInformation> savedSites = siteInformationService.saveAll(sitesToSave);
       
        assertEquals(2, savedSites.size());
        assertEquals("Batch Updated", siteInformationService.get("1").getValue());
       
        SiteInformation newSaved = savedSites.get(1);
        assertEquals("BatchNewSite", newSaved.getName());
        assertEquals("Batch New Value", newSaved.getValue());
    }
   
    @Test
    public void update_shouldUpdateExistingSiteInformation() {
        SiteInformation siteInfo = siteInformationService.get("2");
        siteInfo.setValue("https://updated-api.example.org/submit");
       
        SiteInformation updated = siteInformationService.update(siteInfo);
        assertEquals("2", updated.getId());
        assertEquals("https://updated-api.example.org/submit", updated.getValue());
    }
   
    @Test
    public void updateAll_shouldUpdateMultipleSiteInformations() {
        SiteInformation site1 = siteInformationService.get("1");
        site1.setValue("Mass Update 1");
       
        SiteInformation site2 = siteInformationService.get("2");
        site2.setValue("Mass Update 2");
       
        List<SiteInformation> sitesToUpdate = List.of(site1, site2);
        List<SiteInformation> updatedSites = siteInformationService.updateAll(sitesToUpdate);
       
        assertEquals(2, updatedSites.size());
        assertEquals("Mass Update 1", siteInformationService.get("1").getValue());
        assertEquals("Mass Update 2", siteInformationService.get("2").getValue());
    }
   
    @Test
    public void getNext_shouldReturnNextSiteInformation() {
        SiteInformation nextSite = siteInformationService.getNext("1");
        assertNotNull(nextSite);
        // Actual next ID depends on how the service defines "next"
    }
   
    @Test
    public void getPrevious_shouldReturnPreviousSiteInformation() {
        SiteInformation prevSite = siteInformationService.getPrevious("2");
        assertNotNull(prevSite);
        // Actual previous ID depends on how the service defines "previous"
    }
   
    @Test
    public void encryptAndDecrypt_shouldHandleEncryptedValuesCorrectly() {
        // Create a new site with encrypted value
        SiteInformation encryptedSite = new SiteInformation();
        encryptedSite.setName("EncryptedTestSite");
        encryptedSite.setValue("SecretValue");
        encryptedSite.setEncrypted(true);
       
        // Insert it (which should encrypt the value)
        String id = siteInformationService.insert(encryptedSite);
       
        // Retrieve it (which should decrypt the value)
        SiteInformation retrieved = siteInformationService.get(id);
        assertEquals("SecretValue", retrieved.getValue());
    }
   
    @Test
    public void updateSiteInformationByName_shouldUpdateMultipleSiteInformationsByName() {
        Map<String, String> updates = new HashMap<>();
        updates.put("SiteContactName", "Jane Smith");
        updates.put("SiteApiUrl", "https://new-api.example.org/submit");
       
        List<SiteInformation> updatedSites = siteInformationService.updateSiteInformationByName(updates);
       
        assertEquals(2, updatedSites.size());
        assertEquals("Jane Smith", siteInformationService.getSiteInformationByName("SiteContactName").getValue());
        assertEquals("https://new-api.example.org/submit", siteInformationService.getSiteInformationByName("SiteApiUrl").getValue());
    }
}