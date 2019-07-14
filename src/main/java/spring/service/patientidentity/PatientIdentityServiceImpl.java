package spring.service.patientidentity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import spring.service.common.BaseObjectServiceImpl;
import us.mn.state.health.lims.patientidentity.dao.PatientIdentityDAO;
import us.mn.state.health.lims.patientidentity.valueholder.PatientIdentity;

@Service
public class PatientIdentityServiceImpl extends BaseObjectServiceImpl<PatientIdentity, String>
		implements PatientIdentityService {
	@Autowired
	protected PatientIdentityDAO baseObjectDAO;

	PatientIdentityServiceImpl() {
		super(PatientIdentity.class);
	}

	@Override
	protected PatientIdentityDAO getBaseObjectDAO() {
		return baseObjectDAO;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PatientIdentity> getPatientIdentitiesForPatient(String id) {
		return baseObjectDAO.getAllMatching("patientId", id);
	}

	@Override
	@Transactional(readOnly = true)
	public PatientIdentity getPatitentIdentityForPatientAndType(String patientId, String identityTypeId) {
		return getBaseObjectDAO().getPatitentIdentityForPatientAndType(patientId, identityTypeId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<PatientIdentity> getPatientIdentitiesByValueAndType(String value, String identityType) {
		return getBaseObjectDAO().getPatientIdentitiesByValueAndType(value, identityType);
	}
}