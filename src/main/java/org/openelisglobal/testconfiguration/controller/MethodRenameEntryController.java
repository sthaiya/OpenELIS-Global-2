package org.openelisglobal.testconfiguration.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.hibernate.HibernateException;
import org.openelisglobal.common.controller.BaseController;
import org.openelisglobal.common.log.LogEvent;
import org.openelisglobal.common.services.DisplayListService;
import org.openelisglobal.localization.service.LocalizationService;
import org.openelisglobal.localization.valueholder.Localization;
import org.openelisglobal.test.service.TestSectionService;
import org.openelisglobal.test.valueholder.TestSection;
import org.openelisglobal.testconfiguration.form.MethodRenameEntryForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

public class MethodRenameEntryController extends BaseController {
    private static final String[] ALLOWED_FIELDS = new String[] { "methodSectionId", "nameEnglish", "nameFrench" };

    @Autowired
    LocalizationService localizationService;
    @Autowired
    TestSectionService testSectionService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.setAllowedFields(ALLOWED_FIELDS);
    }

    @RequestMapping(value = "/MethodRenameEntry", method = RequestMethod.GET)
    public ModelAndView showMethodRenameEntry(HttpServletRequest request) {
        MethodRenameEntryForm form = new MethodRenameEntryForm();

        form.setMethodSectionList(DisplayListService.getInstance().getList(DisplayListService.ListType.TEST_SECTION));

        return findForward(FWD_SUCCESS, form);
    }

    @Override
    protected String findLocalForward(String forward) {
        if (FWD_SUCCESS.equals(forward)) {
            return "methodRenameDefinition";
        } else if (FWD_SUCCESS_INSERT.equals(forward)) {
            return "redirect:/MethodRenameEntry";
        } else if (FWD_FAIL_INSERT.equals(forward)) {
            return "methodRenameDefinition";
        } else {
            return "PageNotFound";
        }
    }

    @RequestMapping(value = "/MethodRenameEntry", method = RequestMethod.POST)
    public ModelAndView updateMethodRenameEntry(HttpServletRequest request,
            @ModelAttribute("form") @Valid MethodRenameEntryForm form, BindingResult result) {
        if (result.hasErrors()) {
            saveErrors(result);
            form.setMethodSectionList(DisplayListService.getInstance().getList(DisplayListService.ListType.TEST_SECTION));
            return findForward(FWD_FAIL_INSERT, form);
        }

        String methodId = form.getMethodSectionId();
        String nameEnglish = form.getNameEnglish();
        String nameFrench = form.getNameFrench();
        String userId = getSysUserId(request);

        updateMethodNames(methodId, nameEnglish, nameFrench, userId);

        return findForward(FWD_SUCCESS_INSERT, form);
    }

    private void updateMethodNames(String methodId, String nameEnglish, String nameFrench, String userId) {
        TestSection testSection = testSectionService.getTestSectionById(methodId);

        if (testSection != null) {

            Localization name = testSection.getLocalization();
            name.setEnglish(nameEnglish.trim());
            name.setFrench(nameFrench.trim());
            name.setSysUserId(userId);

            try {
                localizationService.update(name);
            } catch (HibernateException e) {
                LogEvent.logDebug(e);
            }

        }

        // Refresh Test Section names
        DisplayListService.getInstance().getFreshList(DisplayListService.ListType.TEST_SECTION);
    }

    @Override
    protected String getPageTitleKey() {
        return null;
    }

    @Override
    protected String getPageSubtitleKey() {
        return null;
    }
    
}
