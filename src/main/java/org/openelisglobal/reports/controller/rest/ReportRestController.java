package org.openelisglobal.reports.controller.rest;

import com.itextpdf.text.DocumentException;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import java.util.LinkedHashMap;
import jakarta.validation.Valid;
import net.sf.jasperreports.engine.JRException;
import org.apache.commons.lang3.StringUtils;
import org.openelisglobal.analysis.service.AnalysisService;
import org.openelisglobal.analysis.valueholder.Analysis;
import org.openelisglobal.common.exception.LIMSRuntimeException;
import org.openelisglobal.common.log.LogEvent;
import org.openelisglobal.common.rest.BaseRestController;
import org.openelisglobal.common.services.IStatusService;
import org.openelisglobal.common.services.TableIdService;
import org.openelisglobal.common.util.DateUtil;
import org.openelisglobal.common.util.validator.GenericValidator;
import org.openelisglobal.organization.valueholder.Organization;
import org.openelisglobal.patient.valueholder.Patient;
import org.openelisglobal.reports.action.implementation.IReportCreator;
import org.openelisglobal.reports.action.implementation.ReportImplementationFactory;
import org.openelisglobal.reports.form.ReportForm;
import org.openelisglobal.reports.form.ResultDisplayForm;
import org.openelisglobal.reports.form.ResultRequestForm;
import org.openelisglobal.reports.form.ResultViewBean;
import org.openelisglobal.sample.service.SampleService;
import org.openelisglobal.sample.valueholder.Sample;
import org.openelisglobal.samplehuman.service.SampleHumanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/rest/")
public class ReportRestController extends BaseRestController {

    @Autowired
    private ServletContext context;

    @Autowired
    AnalysisService analysisService;

    @Autowired
    IStatusService iStatusService;

    @Autowired
    SampleHumanService sampleHumanService;

    @Autowired
    SampleService sampleService;

    private static String reportPath = null;

    private static String imagesPath = null;

    @RequestMapping(value = "ReportPrint", method = RequestMethod.POST)
    @ResponseBody
    public void showReportPrint(@RequestBody ReportForm form, HttpServletRequest request, HttpServletResponse response)
            throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {

        LogEvent.logTrace("ReportController", "Log GET ", form.getReport());
        IReportCreator reportCreator = ReportImplementationFactory.getReportCreator(form.getReport());

        if (reportCreator != null) {
            reportCreator.setSystemUserId(getSysUserId(request));
            reportCreator.setRequestedReport(form.getReport());
            reportCreator.initializeReport(form);
            reportCreator.setReportPath(getReportPath());

            HashMap<String, String> parameterMap = (HashMap<String, String>) reportCreator.getReportParameters();
            parameterMap.put("SUBREPORT_DIR", getReportPath());
            parameterMap.put("imagesPath", getImagesPath());

            try {
                response.setContentType(reportCreator.getContentType());
                String responseHeaderName = reportCreator.getResponseHeaderName();
                String responseHeaderContent = reportCreator.getResponseHeaderContent();
                if (!GenericValidator.isBlankOrNull(responseHeaderName)
                        && !GenericValidator.isBlankOrNull(responseHeaderContent)) {
                    response.setHeader(responseHeaderName, responseHeaderContent);
                }

                byte[] bytes = reportCreator.runReport();

                response.setContentLength(bytes.length);

                ServletOutputStream servletOutputStream = response.getOutputStream();

                servletOutputStream.write(bytes, 0, bytes.length);
                servletOutputStream.flush();
                servletOutputStream.close();

            } catch (IOException | SQLException | JRException | DocumentException | ParseException e) {
                LogEvent.logError(e);
            }
        }
    }

    private String getReportPath() {
        String reportPath = getReportPathValue();
        if (reportPath.endsWith(File.separator)) {
            return reportPath;
        } else {
            return reportPath + File.separator;
        }
    }

    private String getReportPathValue() {

        if (reportPath == null) {
            ClassLoader classLoader = getClass().getClassLoader();
            reportPath = classLoader.getResource("reports").getPath();
            try {
                reportPath = URLDecoder.decode(reportPath, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                LogEvent.logError(e);
                throw new LIMSRuntimeException(e);
            }
        }
        return reportPath;
    }

    public String getImagesPath() {
        if (imagesPath == null) {
            imagesPath = context.getRealPath("") + "static" + File.separator + "images" + File.separator;
            try {
                imagesPath = URLDecoder.decode(imagesPath, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                LogEvent.logError(e);
                throw new LIMSRuntimeException(e);
            }
        }
        return imagesPath;
    }

    @GetMapping(value = "report/unprinted-results", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResultDisplayForm showUnprintedResults(HttpServletRequest request,
                                                  @ModelAttribute("form") @Valid ResultRequestForm form, BindingResult result) {

        ResultDisplayForm respForm = new ResultDisplayForm();
        Timestamp tsStartDate;
        Timestamp tsEndDate;

        if (form.getStartDate() == null || form.getEndDate() == null) {
            tsStartDate = DateUtil.getTimestampAtMidnightForDaysAgo(7);
            tsEndDate = new Timestamp(new GregorianCalendar().getTimeInMillis());
        } else {
            tsStartDate = DateUtil.convertStringDateToTimestampWithPatternNoLocale(form.getStartDate() + " 00:00:00", "dd/MM/yyyy HH:mm:ss");
            tsEndDate = DateUtil.convertStringDateToTimestampWithPatternNoLocale(form.getEndDate() + " 23:59:59", "dd/MM/yyyy HH:mm:ss");
        }

        List<Analysis> analyses = analysisService.getAnalysisValidatedInRange(tsStartDate, tsEndDate);
        respForm.setDisplayItems(convertAnalysesToReviewBean(analyses, form));

        return respForm;
    }

    private List<ResultViewBean> convertAnalysesToReviewBean(List<Analysis> analyses, ResultRequestForm form) {
        List<ResultViewBean> resultViewList = new ArrayList<>();
        if (analyses != null) {
            for (Analysis analysis : analyses) {
                if (analysis != null) {
                    ResultViewBean rvb = new ResultViewBean();
                    rvb.setId(analysis.getId());
                    rvb.setTestSectionId(analysis.getTestSection() != null ? analysis.getTestSection().getId() : "");

                    if (form.getTestSection() != null && StringUtils.isNotBlank(form.getTestSection()) && !Objects.equals(rvb.getTestSectionId(), form.getTestSection()))
                        continue; // we only want results for a specific section

                    if (!form.showPrinted() && analysis.getPrintedDate() != null)
                        continue; // we only want unprinted results

                    Sample sample = analysis.getSampleItem() != null ? analysis.getSampleItem().getSample() : null;
                    if (sample != null) {
                        if (form.getReferringSite() != null && StringUtils.isNotBlank(form.getReferringSite())) {
                            Organization referringSite = sampleService.getOrganizationRequester(sample, TableIdService.getInstance().REFERRING_ORG_TYPE_ID);
                            if (referringSite == null ||  !Objects.equals(referringSite.getId(), form.getReferringSite()))
                                continue; // we only want results for a specific site
                        }

                        rvb.setAccessionNumber(sample.getAccessionNumber() != null ? sample.getAccessionNumber() : "");
                        Patient patient = sampleHumanService.getPatientForSample(sample);
                        rvb.setPatientId(patient.getNationalId());
                        rvb.setPatientName(patient.getPerson().getFirstName() + " " + patient.getPerson().getLastName());
                    }
                    rvb.setOrderDate(analysis.getStartedDateForDisplay());
                    rvb.setResultDate(analysis.getCompletedDate());
                    rvb.setResultDateForDisplay(analysis.getCompletedDateForDisplay());
                    rvb.setTestSectionName(analysis.getTestSection() != null ? analysis.getTestSection().getTestSectionName() : "");
                    resultViewList.add(rvb);
                }
            }
        }

        //noinspection UnnecessaryLocalVariable
        List<ResultViewBean> uniqueSortedList = new ArrayList<>(resultViewList.stream()
                .sorted(Comparator.comparing(ResultViewBean::getResultDate).reversed())
                .collect(Collectors.toMap(
                        pojo -> new AbstractMap.SimpleEntry<>(pojo.getAccessionNumber(), pojo.getTestSectionId()),  // Composite unique by key
                        pojo -> pojo,        // value
                        (existing, replacement) -> existing, // keep first occurrence
                        LinkedHashMap::new   // maintain order
                ))
                .values());

        return uniqueSortedList;
    }
}
