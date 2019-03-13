package spring.generated.testconfiguration.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import spring.generated.forms.SampleTypeTestAssignForm;
import spring.mine.common.controller.BaseController;
import spring.mine.common.form.BaseForm;
import spring.mine.common.validator.BaseErrors;

@Controller
public class SampleTypeTestAssignUpdateController extends BaseController {
  @RequestMapping(
      value = "/SampleTypeTestAssignUpdate",
      method = RequestMethod.GET
  )
  public ModelAndView showSampleTypeTestAssignUpdate(HttpServletRequest request,
      @ModelAttribute("form") SampleTypeTestAssignForm form) {
    String forward = FWD_SUCCESS;
    if (form == null) {
    	form = new SampleTypeTestAssignForm();
    }
        form.setFormAction("");
    Errors errors = new BaseErrors();
    

    return findForward(forward, form);}

  protected String findLocalForward(String forward) {
    if (FWD_SUCCESS.equals(forward)) {
      return "/SampleTypeTestAssign.do";
    } else {
      return "PageNotFound";
    }
  }

  protected String getPageTitleKey() {
    return null;
  }

  protected String getPageSubtitleKey() {
    return null;
  }
}
