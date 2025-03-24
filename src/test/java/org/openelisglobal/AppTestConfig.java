package org.openelisglobal;

import static org.mockito.Mockito.mock;

import ca.uhn.fhir.context.FhirContext;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;
import lombok.NonNull;
import org.jasypt.util.text.TextEncryptor;
import org.apache.http.impl.client.CloseableHttpClient;
import org.openelisglobal.audittrail.dao.AuditTrailService;
import org.openelisglobal.citystatezip.service.CityStateZipService;
import org.openelisglobal.common.services.IStatusService;
import org.openelisglobal.common.services.PluginAnalyzerService;
import org.openelisglobal.common.util.Versioning;
import org.openelisglobal.dataexchange.fhir.FhirConfig;
import org.openelisglobal.dataexchange.fhir.FhirUtil;
import org.openelisglobal.dataexchange.fhir.service.FhirPersistanceService;
import org.openelisglobal.dataexchange.fhir.service.FhirTransformService;
import org.openelisglobal.dataexchange.service.order.ElectronicOrderService;
import org.openelisglobal.externalconnections.service.BasicAuthenticationDataService;
import org.openelisglobal.externalconnections.service.ExternalConnectionService;
import org.openelisglobal.internationalization.MessageUtil;
import org.openelisglobal.notification.service.AnalysisNotificationConfigService;
import org.openelisglobal.notification.service.TestNotificationConfigService;
import org.openelisglobal.observationhistory.service.ObservationHistoryService;
import org.openelisglobal.organization.service.OrganizationTypeService;
import org.openelisglobal.referral.service.ReferralResultService;
import org.openelisglobal.referral.service.ReferralService;
import org.openelisglobal.referral.service.ReferralSetService;
import org.openelisglobal.reports.service.WHONetReportServiceImpl;
import org.openelisglobal.requester.service.RequesterTypeService;
import org.openelisglobal.sampleqaevent.service.SampleQaEventService;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import org.openelisglobal.systemusersection.service.SystemUserSectionService;
=======
import org.openelisglobal.siteinformation.service.SiteInformationService;
>>>>>>> d50799cb3 (system user section integration test)
=======
import org.openelisglobal.siteinformation.service.SiteInformationService;
>>>>>>> 82a75ca0f (resolving the merge conflict)
=======
>>>>>>> 2198bae6c (Add Integration Test and site_information.xml)
import org.openelisglobal.testanalyte.service.TestAnalyteService;
import org.openelisglobal.testresult.service.TestResultService;
import org.openelisglobal.typeofsample.service.TypeOfSampleService;
import org.openelisglobal.typeofsample.service.TypeOfSampleTestService;
import org.springframework.beans.factory.UnsatisfiedDependencyException;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ComponentScan(basePackages = { "org.openelisglobal.spring", "org.openelisglobal.patient",
        "org.openelisglobal.patientidentity", "org.openelisglobal.gender", "org.openelisglobal.patientidentitytype",
        "org.openelisglobal.patienttype", "org.openelisglobal.address", "org.openelisglobal.dictionary",
        "org.openelisglobal.person", "org.openelisglobal.audittrail", "org.openelisglobal.referencetables",
        "org.openelisglobal.history", "org.openelisglobal.menu", "org.openelisglobal.login",
        "org.openelisglobal.systemusermodule", "org.openelisglobal.rolemodule", "org.openelisglobal.view",
        "org.openelisglobal.search", "org.openelisglobal.common.util", "org.openelisglobal.view",
        "org.openelisglobal.sample", "org.openelisglobal.sampleitem", "org.openelisglobal.analysis",
        "org.openelisglobal.result", "org.openelisglobal.resultlimit", "org.openelisglobal.resultlimits",
        "org.openelisglobal.typeoftestresult", "org.openelisglobal.samplehuman", "org.openelisglobal.provider",
        "org.openelisglobal.role", "org.openelisglobal.organization", "org.openelisglobal.region",
        "org.openelisglobal.program", "org.openelisglobal.note", "org.openelisglobal.requester",
        "org.openelisglobal.method", "org.openelisglobal.sampleorganization", "org.openelisglobal.analyte",
        "org.openelisglobal.panel", "org.openelisglobal.panelitem", "org.openelisglobal.reports",
        "org.openelisglobal.userrole", "org.openelisglobal.unitofmeasure", "org.openelisglobal.testtrailer",
        "org.openelisglobal.scriptlet", "org.openelisglobal.localization", "org.openelisglobal.systemuser",
        "org.openelisglobal.systemmodule", "org.openelisglobal.testdictionary", "org.openelisglobal.dictionarycategory",
<<<<<<< HEAD
        "org.openelisglobal.observationhistorytype", "org.openelisglobal.statusofsample",
        "org.openelisglobal.test", "org.openelisglobal.systemusersection", "org.openelisglobal.analyzerimport", 
        "org.openelisglobal.analyzer", "org.openelisglobal.siteinformation", "org.openelisglobal.config" }, excludeFilters = {
=======
        "org.openelisglobal.observationhistorytype", "org.openelisglobal.statusofsample", "org.openelisglobal.test",
        "org.openelisglobal.analyzerimport", "org.openelisglobal.analyzer", "org.openelisglobal.systemusersection",
        "org.openelisglobal.siteinformation", "org.openelisglobal.config" }, excludeFilters = {
>>>>>>> 2198bae6c (Add Integration Test and site_information.xml)
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.patient.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.organization.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.sample.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.result.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.login.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.program.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.siteinformation.controller.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.config.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.fhir.*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.openelisglobal.*.fhir.*"),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WHONetReportServiceImpl.class) })
@EnableWebMvc
public class AppTestConfig implements WebMvcConfigurer {

    // mock Beans
    @Bean 
    @Profile("test") 
    public TextEncryptor textEncryptor() {
        return mock(TextEncryptor.class);
    }

    @Bean()
    @Profile("test")
    public PluginAnalyzerService pluginAnalyzerService() {
        return mock(PluginAnalyzerService.class);
    }

    @Bean()
    @Profile("test")
    public FhirPersistanceService fhirPesistence() {
        return mock(FhirPersistanceService.class);
    }

    @Bean()
    @Profile("test")
    public FhirUtil fhirUtil() {
        return mock(FhirUtil.class);
    }

    @Bean()
    @Profile("test")
    public FhirConfig fhirConfig() {
        return mock(FhirConfig.class);
    }

    @Bean()
    @Profile("test")
    public CloseableHttpClient closeableHttpClient() {
        return mock(CloseableHttpClient.class);
    }

    @Bean()
    @Profile("test")
    public FhirContext fhirContext() {
        return mock(FhirContext.class);
    }

    @Bean()
    @Profile("test")
    public FhirTransformService fhirTransformServicehirTransformService() {
        return mock(FhirTransformService.class);
    }

    @Bean()
    @Profile("test")
    public FhirTransformService fhirTransformService() {
        return mock(FhirTransformService.class);
    }

    @Bean()
    @Profile("test")
    public TestAnalyteService testAnalyteService() {
        return mock(TestAnalyteService.class);
    }

    @Bean()
    @Profile("test")
    public ExternalConnectionService externalConnectService() {
        return mock(ExternalConnectionService.class);
    }

    @Bean()
    @Profile("test")
    public BasicAuthenticationDataService basicAuthDataService() {
        return mock(BasicAuthenticationDataService.class);
    }

    @Bean()
    @Profile("test")
    public SampleQaEventService sampleQaEventService() {
        return mock(SampleQaEventService.class);
    }

    @Bean()
    @Profile("test")
    public BasicAuthenticationDataService basicAuthenticationDataService() {
        return mock(BasicAuthenticationDataService.class);
    }

    @Bean()
    @Profile("test")
    public ObservationHistoryService observationHistoryService() {
        return mock(ObservationHistoryService.class);
    }

    @Bean()
    @Profile("test")
    public TestNotificationConfigService testNotificationConfigService() {
        return mock(TestNotificationConfigService.class);
    }

    @Bean()
    @Profile("test")
    public UnsatisfiedDependencyException unsatisfiedDependencyException() {
        return mock(UnsatisfiedDependencyException.class);
    }

    @Bean()
    @Profile("test")
    public ElectronicOrderService electronicOrderService() {
        return mock(ElectronicOrderService.class);
    }

    @Bean()
    @Profile("test")
    public AnalysisNotificationConfigService analysisNotificationConfigService() {
        return mock(AnalysisNotificationConfigService.class);
    }

    @Bean()
    @Profile("test")
    public ReferralResultService ReferralResultService() {
        return mock(ReferralResultService.class);
    }

    @Bean()
    @Profile("test")
    public CityStateZipService cityStateZipService() {
        return mock(CityStateZipService.class);
    }

    @Bean()
    @Profile("test")
    public ReferralService referralService() {
        return mock(ReferralService.class);
    }

    @Bean()
    @Profile("test")
    public ReferralSetService ReferralSetService() {
        return mock(ReferralSetService.class);
    }

    @Bean()
    @Profile("test")
    public AuditTrailService auditTrailService() {
        return mock(AuditTrailService.class);
    }

    @Bean()
    @Profile("test")
    public TestResultService testResultService() {
        return mock(TestResultService.class);
    }

    @Bean()
    @Profile("test")
    public TypeOfSampleTestService typeOfSampleTestService() {
        return mock(TypeOfSampleTestService.class);
    }

    @Bean()
    @Profile("test")
    public TypeOfSampleService typeOfSample() {
        return mock(TypeOfSampleService.class);
    }

    @Bean()
    @Profile("test")
    public Versioning versioning() {
        return mock(Versioning.class);
    }

    @Bean
    @Profile("test")
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:/languages/message");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setUseCodeAsDefaultMessage(true);
        MessageUtil.setMessageSource(messageSource);
        return messageSource;
    }

    @Bean
    public MappingJackson2HttpMessageConverter jsonConverter() {
        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);

        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.serializationInclusion(JsonInclude.Include.NON_NULL);

        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter(builder.build());
        jsonConverter.setSupportedMediaTypes(supportedMediaTypes);
        return jsonConverter;
    }

    @Bean()
    @Profile("test")
    public IStatusService iStatusService() {
        return mock(IStatusService.class);
    }

    @Bean()
    @Profile("Test")
    public RequesterTypeService RequesterTypeService() {
        return mock(RequesterTypeService.class);
    }

    @Bean()
    @Profile("Test")
    public OrganizationTypeService OrganizationTypeService() {
        return mock(OrganizationTypeService.class);
    }

    @Override
    public void configureMessageConverters(@NonNull List<HttpMessageConverter<?>> converters) {
        WebMvcConfigurer.super.configureMessageConverters(converters);
        converters.add(new StringHttpMessageConverter());
        converters.add(jsonConverter());
    }

}
