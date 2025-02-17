package org.openelisglobal.provider;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.person.service.PersonService;
import org.openelisglobal.person.valueholder.Person;
import org.openelisglobal.provider.service.ProviderService;
import org.openelisglobal.provider.valueholder.Provider;
import org.springframework.beans.factory.annotation.Autowired;

public class ProviderServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private ProviderService providerService;

    @Autowired
    private PersonService personServive;

    private static final UUID FH_UUID1 = UUID.fromString("f2cdeff8-8d5b-4023-bd7c-932b4b98b6d2");
    private static final UUID FH_UUID2 = UUID.fromString("f1cdeff8-8d5b-4023-bd7c-932b4b98b6d2");

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/provider.xml");
    }

    @Test
    public void providerInThDataBase() {
        List<Provider> providers = providerService.getAll();
        providers.forEach(provider -> System.out.print(provider.getProviderType() + " "));
    }

    @Test
    public void getAllProviders_shouldReturnAllProvders() {
        List<Provider> providers = providerService.getAllProviders();
        assertNotNull("should return providers", providers);
        assertEquals("should return 2 providers", 2, providers.size());

    }

    @Test
    public void getProviderByPerson_shouldReturnProviderGivenThePerson() {
        Person person1 = personServive.getPersonByLastName("Doe");
        Person person2 = personServive.getPersonByLastName("Mulizi");
        Provider provider1 = providerService.getProviderByPerson(person1);
        Provider provider2 = providerService.getProviderByPerson(person2);
        assertNotNull("Should have return privider1", provider1);
        assertNotNull("Should have return privider2", provider2);
        assertEquals("provider1 should have an External id EXT123456", "EXT123456", provider1.getExternalId());
        assertEquals("provider2 should have an External id EXT123466", "EXT123466", provider2.getExternalId());
    }

    @Test
    public void getProviderByFhirUuid_shouldReturnTheProviderGivenFhirUUID() {

        Provider provider1 = providerService.getProviderByFhirId(FH_UUID1);
        Provider provider2 = providerService.getProviderByFhirId(FH_UUID2);
        assertNotNull("should return provider", provider1);
        assertNotNull("should return provider", provider2);
        assertEquals("provider1 should have an External id EXT123456", "EXT123456", provider1.getExternalId());
        assertEquals("provider2 should have an External id EXT123466", "EXT123466", provider2.getExternalId());
        assertEquals("provider1 should have an provider type G", "G", provider1.getProviderType());
        assertEquals("provider2 should have an provider type s", "S", provider2.getProviderType());
    }
}