package org.openelisglobal.systemUser;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.systemuser.service.SystemUserService;
import org.openelisglobal.systemuser.valueholder.SystemUser;
import org.springframework.beans.factory.annotation.Autowired;

public class SystemUserServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private SystemUserService systemUserService;

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/system-user.xml");
    }

    @Test
    public void testDataInDataBase() {
        List<SystemUser> systemUsers = systemUserService.getAll();
        systemUsers.forEach(systemUser -> {
            System.out.print(systemUser.getLastName() + " ");
        });
    }

    @Test
    public void getAllSystemUsers_shouldReturnAllSystemUsers() {
        List<SystemUser> systemUsers = systemUserService.getAllSystemUsers();
        assertTrue(systemUsers.size() == 3);
    }

    @Test
    public void delete_shouldInactivateUser() {
        SystemUser systemUser = systemUserService.get("3");
        systemUserService.delete(systemUser);
        SystemUser updatedUser = systemUserService.getUserById("3");
        assertEquals("N", updatedUser.getIsActive());
    }

    @Test
    public void saveSystemUser_shouldSaveSystemUser() {
        SystemUser systemUser = new SystemUser();
        systemUser.setFirstName("Robert");
        systemUser.setLastName("Derick");
        systemUser.setLoginName("Debert");
        systemUser.setIsActive("Y");
        systemUser.setExternalId("1234EXT");
        systemUser.setIsEmployee("Y");
        systemUserService.save(systemUser);
        List<SystemUser> systemUsers = systemUserService.getAllSystemUsers();
        assertTrue(systemUsers.size() == 4);

    }

    @Test
    public void getData_shouldReturnSystemUser() {
        SystemUser systemUser = systemUserService.get("3");
        systemUserService.getData(systemUser);
        assertEquals("John", systemUser.getFirstName());
        assertEquals("Doe", systemUser.getLastName());
        assertEquals("jdoe", systemUser.getLoginName());
    }
}
