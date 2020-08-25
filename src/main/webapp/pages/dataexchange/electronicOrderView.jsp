<%@ page language="java" contentType="text/html; charset=UTF-8"%>

<%@ page isELIgnored="false" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%@ taglib prefix="ajax" uri="/tags/ajaxtags" %> 

<script type="text/javascript">
var pageNumber = ${(startIndex / 50) + 1};
var firstPage = pageNumber == 1;
var lastPage = ${total == endIndex};
	
function searchElectronicOrders() {
	var searchValue = jQuery("#searchValue").val();
	var sortOption = jQuery("#sortOption").val();
	const params = new URLSearchParams({
		"sortOrder": sortOption,
		"searchValue": searchValue,
		});
	window.location.href = "ElectronicOrders.do?" + params.toString();
}

function nextPage() {
	var searchValue = jQuery("#searchValue").val();
	var sortOption = jQuery("#sortOption").val();
	const params = new URLSearchParams({
		"sortOrder": sortOption,
		"searchValue": searchValue,
		"page": (pageNumber + 1),
		});
	window.location.href = "ElectronicOrders.do?" + params.toString();
}

function prevPage() {
	var searchValue = jQuery("#searchValue").val();
	var sortOption = jQuery("#sortOption").val();
	const params = new URLSearchParams({
		"sortOrder": sortOption,
		"searchValue": searchValue,
		"page": (pageNumber -1),
		});
	window.location.href = "ElectronicOrders.do?" + params.toString();
}

jQuery(window).load(function(){	
	jQuery('button.prevButton').each(function(){
		jQuery(this).prop('disabled', firstPage);
	});
	jQuery('button.nextButton').each(function(){
		jQuery(this).prop('disabled', lastPage);
	});
});
</script>

<spring:message code="eorder.sort"/>: 
<form:select path="sortOrder" id="sortOption" onchange="searchElectronicOrders()">
	<form:options items="${form.sortOrderOptions}" itemValue="value" itemLabel="label" />
</form:select>
<form:input path="searchValue" id="searchValue" />
<button type="button" onClick="searchElectronicOrders()"><spring:message code="label.button.search" /> </button>
<form:hidden path="page"/>

<c:if test="${empty form.EOrders}">
	<h2><spring:message code="eorder.noresults"/></h2>
</c:if>
<c:if test="${not empty form.EOrders}">
	<h2>
		<spring:message code="eorder.results"/> ${startIndex + 1} -  ${endIndex} <spring:message code="eorder.of"/> ${total}
		<button class="prevButton" onClick="prevPage(); return false;"><spring:message code="label.button.previous"/></button>
		<button class="nextButton" onClick="nextPage(); return false;"><spring:message code="label.button.next"/></button>
	</h2>
	<table style="width:100%">
		<tr>
			<td style="width:1%"></td>
			<td style="width:98%">
				<c:forEach var="eOrder" items="${form.EOrders}">
					
					<h3>
						<span><spring:message code="eorder.externalid"/>: 
						<input type="button" 
							onclick="location.href='https://localhost:8443/OpenELIS-Global/SamplePatientEntry.do?ID=${eOrder.externalId}';" 
							value="${eOrder.externalId}" /></span>
						<span style="float:right"><spring:message code="eorder.lastupdated"/>: <c:out value="${eOrder.lastupdated}"/></span>
					</h3>
					<div id="info" >
						<b><spring:message code="eorder.timestamp"/>:</b> <c:out value="${eOrder.orderTimestamp}"/><br>
						<table>
						<tr>
							<td><b><spring:message code="eorder.patient"/>:</b></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							 <td></td
							 ><td><b><spring:message code="eorder.patient.name"/>: </b><c:out value="${eOrder.patient.person.lastName}"/>, <c:out value="${eOrder.patient.person.firstName}"/></td>
							 <td><b><spring:message code="eorder.patient.gender"/>: </b><c:out value="${eOrder.patient.gender}"/></td>
						</tr>
						<tr>
							 <td></td>
							 <td><b><spring:message code="eorder.patient.birthdate"/>: </b><c:out value="${eOrder.patient.birthDateForDisplay}"/></td>
							 <td><b><spring:message code="eorder.patient.id"/>: </b><c:out value="${eOrder.patient.externalId}"/></td>
						</tr>
						</table>
						<b><spring:message code="eorder.status"/>: </b> <spring:message code="${eOrder.status.nameKey}"/><br>
						<b><spring:message code="eorder.message"/>: </b><br> 
						<div class="colorFill message" style="padding:5px;"><c:out value="${eOrder.data}"/></div>
					</div>
					<hr>
				</c:forEach>
			</td>
			<td style="width:1%"></td>
		</tr>
	</table>
	<h2>
		<spring:message code="eorder.results"/> ${startIndex + 1} -  ${endIndex} <spring:message code="eorder.of"/> ${total}
		<button class="prevButton" onClick="prevPage(); return false;"><spring:message code="label.button.previous"/></button>
		<button class="nextButton" onClick="nextPage(); return false;"><spring:message code="label.button.next"/></button>
	</h2>
</c:if>
