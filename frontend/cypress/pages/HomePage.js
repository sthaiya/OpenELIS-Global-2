import LoginPage from "./LoginPage";
import PatientEntryPage from "./PatientEntryPage";
import OrderEntityPage from "./OrderEntityPage";
import ModifyOrderPage from "./ModifyOrderPage";
import WorkPlan from "./WorkPlan";
import NonConform from "./NonConformPage";
import Result from "./ResultsPage";
import Validation from "./Validation";
import BatchOrderEntry from "./BatchOrderEntryPage";
import RoutineReportPage from "./RoutineReportPage";
import StudyReportPage from "./StudyReportPage";
import DashBoardPage from "./DashBoard";
import AdminPage from "./AdminPage";

class HomePage {
  constructor() {
    // Removed centralized selectors
  }

  visit() {
    cy.visit("/");
  }

  goToSign() {
    return new LoginPage();
  }

  openNavigationMenu() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
  }

  // Order Entry related functions
  goToOrderPageExt() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_sample_dropdown").click({ force: true });
    cy.get("#menu_sample_add_nav", { timeout: 20000 }).click({ force: true });
    return new OrderEntityPage();
  }

  goToOrderPage() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_sample", { timeout: 20000 }).should("be.visible").click();
    cy.get("#menu_sample_add_nav", { timeout: 20000 }).click();
    return new OrderEntityPage();
  }

  goToBatchOrderEntry() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_sample']").should("exist").click();
    cy.get("#menu_sample_batch_entry", { timeout: 15000 }).click();
    return new BatchOrderEntry();
  }

  // Patient Entry related functions
  goToPatientEntry() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_patient", { timeout: 20000 }).click();
    cy.get("#menu_patient_add_or_edit_nav", { timeout: 20000 }).click();
    return new PatientEntryPage();
  }

  // Modify Order related functions
  goToModifyOrderPage() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_sample", { timeout: 20000 }).should("be.visible").click();
    cy.get("#menu_sample_edit_nav", { timeout: 20000 }).click();
    return new ModifyOrderPage();
  }

  // Work Plan related functions
  goToWorkPlanPlanByTest() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_workplan']", { timeout: 20000 })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-test']").contains("By Test Type").click();
    return new WorkPlan();
  }

  goToWorkPlanPlanByPanel() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_workplan']").should("exist").click();
    cy.get("[data-cy='menu-panel']").contains("By Panel").click();
    return new WorkPlan();
  }

  goToWorkPlanPlanByUnit() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_workplan']", { timeout: 20000 })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-bench']").contains("By Unit").click();
    return new WorkPlan();
  }

  goToWorkPlanPlanByPriority() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_workplan']", { timeout: 20000 })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-priority']").contains("By Priority").click();
    return new WorkPlan();
  }

  // Non-Conforming related functions
  goToReportNCE() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_nonconformity']", {
      timeout: 20000,
    })
      .should("exist")
      .click();
    cy.get("#menu_non_conforming_report", { timeout: 20000 }).click();
    return new NonConform();
  }

  goToViewNCE() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_nonconformity']", {
      timeout: 20000,
    })
      .should("exist")
      .click();
    cy.get("#menu_non_conforming_view", { timeout: 20000 }).click();
    return new NonConform();
  }

  goToCorrectiveActions() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_nonconformity']", {
      timeout: 20000,
    })
      .should("exist")
      .click();
    cy.get("#menu_non_conforming_corrective_actions").click();
    return new NonConform();
  }

  // Results related functions
  goToResultsByUnit() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_results']", { timeout: 15000 })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-logbook']").contains("By Unit").click();
    return new Result();
  }

  goToResultsByOrder() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_results']", { timeout: 15000 })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-accession']").contains("By Order").click();

    return new Result();
  }

  goToResultsByPatient() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_results']", { timeout: 15000 })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-patient']").contains("By Patient").click();

    return new Result();
  }

  goToResultsForRefferedOut() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.contains("span", "Results").click();
    cy.get("[data-cy='menu-referredOut']").contains("Referred Out").click();
    return new Result();
  }

  goToResultsByRangeOrder() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.contains("span", "Results").click();
    cy.get("[data-cy='menu-range']")
      .contains("By Range of Order numbers")
      .click();
    return new Result();
  }

  goToResultsByTestAndStatus() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.contains("span", "Results").click();
    cy.get("[data-cy='menu-status']")
      .contains("By Test, Date or Status")
      .click();
    return new Result();
  }

  // Validation related functions
  goToValidationByRoutine() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_resultvalidation']", {
      timeout: 15000,
    })
      .should("exist")
      .click();
    cy.contains("span", "Routine", { timeout: 15000 }).click();
    return new Validation();
  }

  goToValidationByOrder() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_resultvalidation']", {
      timeout: 15000,
    })
      .should("exist")
      .click();
    cy.get("#menu_accession_validation").click();
    return new Validation();
  }

  goToValidationByRangeOrder() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-parent-menu_resultvalidation']", {
      timeout: 15000,
    })
      .should("exist")
      .click();
    cy.get("[data-cy='menu-range']")
      .contains("By Range of Order Numbers")
      .click();
    return new Validation();
  }

  // Reports related functions
  goToRoutineReports() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_reports", { timeout: 20000 }).click();
    cy.get("#menu_reports_routine", { timeout: 20000 }).click();
    return new RoutineReportPage();
  }

  goToStudyReports() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_reports", { timeout: 20000 }).click();
    cy.get("[data-cy='sidenav-button-menu_reports_study']", {
      timeout: 20000,
    }).click();
    return new StudyReportPage();
  }

  goToReports() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("#menu_reports", { timeout: 15000 }).click();
  }

  // Dashboard related functions
  goToPathologyDashboard() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-pathology']", { timeout: 30000 })
      .contains("Pathology")
      .click();
    return new DashBoardPage();
  }

  goToImmunoChemistryDashboard() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-immunochem']")
      .contains("Immunohistochemistry")
      .click();
    return new DashBoardPage();
  }

  goToCytologyDashboard() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-cytology']", { timeout: 30000 })
      .contains("Cytology")
      .click();
    return new DashBoardPage();
  }

  // Admin related functions
  goToAdminPageProgram() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-administration']", {
      timeout: 30000,
    })
      .should("exist")
      .click();
    return new AdminPage();
  }

  goToAdminPage() {
    cy.get("[data-cy='menuButton']", { timeout: 30000 }).click();
    cy.get("[data-cy='menu-administration']", {
      timeout: 30000,
    })
      .should("exist")
      .click();
    return new AdminPage();
  }

  // UI interaction functions
  afterAll() {
    cy.get("#minimizeIcon").should("be.visible").click();
  }

  searchBar() {
    cy.get("#search-Icon").click();
    cy.get("#searchItem").type("Smith");
    cy.get("#patientSearch").click();
    cy.get("#search-Icon").click();
  }

  clickNotifications() {
    cy.get("#notification-Icon").click();
    cy.get("#notification-Icon").click();
  }

  clickUserIcon() {
    cy.get("#user-Icon").click();
    cy.get("#user-Icon").click();
  }

  clickHelpIcon() {
    cy.get("#user-Help").click();
    cy.get("#user-Help").click();
  }

  selectInProgress() {
    cy.get("#maximizeIcon").click();
  }

  selectReadyforValidation() {
    cy.contains("a.cds--link", "Ready For Validation").click();
  }

  selectOrdersCompletedToday() {
    cy.contains("a.cds--link", "Orders Completed Today").click();
  }

  selectPartiallyCompletedToday() {
    cy.contains("a.cds--link", "Partially Completed Today").click();
  }

  selectOrdersEnteredByUsers() {
    cy.contains("a.cds--link", "Orders Entered By Users").click();
  }

  selectOrdersRejected() {
    cy.contains("a.cds--link", "Orders Rejected").click();
  }

  selectUnPrintedResults() {
    cy.contains("a.cds--link", "UnPrinted Results").click();
  }

  selectElectronicOrders() {
    cy.contains("a.cds--link", "Electronic Orders").click();
  }

  selectAverageTurnAroundTime() {
    cy.contains("a.cds--link", "Average Turn Around time").click();
  }

  selectDelayedTurnAround() {
    cy.contains("a.cds--link", "Delayed Turn Around").click();
  }
}

export default HomePage;
