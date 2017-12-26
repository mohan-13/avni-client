import EnrolmentFormHandler from "./formFilters/EnrolmentFormHandler";
import FormFilterHelper from "../rules/FormFilterHelper";
import C from "../common";
import {enrolmentDecisions as vulnerabilityEnrolmentDecisions} from './vulnerabilityDecisions';
import VisitScheduleBuilder from "../rules/VisitScheduleBuilder";


const getDecisions = (programEnrolment, context, today) => {
    if (context.usage === 'Exit')
        return {enrolmentDecisions: [], encounterDecisions: []};

    return vulnerabilityEnrolmentDecisions(programEnrolment);
};

const filterFormElements = (programEnrolment, formElementGroup) => {
    let handler = new EnrolmentFormHandler();
    return FormFilterHelper.filterFormElements(handler, programEnrolment, formElementGroup);
};

const getNextScheduledVisits = function (programEnrolment, today, currentEncounter) {
    const scheduleBuilder = new VisitScheduleBuilder({programEnrolment: programEnrolment});
    scheduleBuilder.add({
        name: "Annual Visit",
        encounterType: "Annual Visit",
        earliestDate: programEnrolment.enrolmentDateTime,
        maxDate: C.addDays(C.copyDate(programEnrolment.enrolmentDateTime), 10)
    }).whenItem(programEnrolment.getEncounters().length).equals(0);
    const existingUnfinishedDropoutHomeVisit = programEnrolment.encounters
        .filter(encounter => encounter.encounterType.name === "Dropout Home Visit"
            && _.isNil(encounter.encounterDateTime));
    scheduleBuilder.add({
            name: "Dropout Home Visit",
            encounterType: "Dropout Home Visit",
            earliestDate: programEnrolment.enrolmentDateTime,
            maxDate: C.addDays(C.copyDate(programEnrolment.enrolmentDateTime), 15)
        }
    ).when.valueInEnrolment("School going").containsAnswerConceptName("Dropped Out")
        .and.whenItem(existingUnfinishedDropoutHomeVisit.length).equals(0);
    let all = scheduleBuilder.getAll();
    return all;
};

export {getDecisions, getNextScheduledVisits, filterFormElements};