import General from "../utility/General";
import ResourceUtil from "../utility/ResourceUtil";
import ProgramEnrolment from "./ProgramEnrolment";
import AbstractEncounter from "./AbstractEncounter";
import _ from 'lodash';
import moment from "moment";
import ValidationResult from "./application/ValidationResult";

class ProgramEncounter extends AbstractEncounter {
    static fieldKeys = {
        SCHEDULED_DATE_TIME: 'SCHEDULED_DATE_TIME',
        MAX_DATE_TIME: 'MAX_DATE_TIME'
    };

    static schema = {
        name: 'ProgramEncounter',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: {type: 'string', optional: true},
            encounterType: 'EncounterType',
            scheduledDateTime: {type: 'date', optional: true},
            maxDateTime: {type: 'date', optional: true},
            encounterDateTime: {type: 'date', optional: true},
            programEnrolment: 'ProgramEnrolment',
            observations: {type: 'list', objectType: 'Observation'}
        }
    };

    static fromResource(resource, entityService) {
        const programEncounter = AbstractEncounter.fromResource(resource, entityService, new ProgramEncounter());

        programEncounter.programEnrolment = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(resource, "programEnrolmentUUID"), ProgramEnrolment.schema.name);
        programEncounter.scheduledDateTime = resource.scheduledDateTime;
        programEncounter.maxDateTime = resource.maxDateTime;
        programEncounter.name = resource.name;
        return programEncounter;
    }

    get toResource() {
        const resource = super.toResource;
        resource.programEnrolmentUUID = this.programEnrolment.uuid;
        resource.name = this.programEnrolment.name;
        if (!_.isNil(this.scheduledDateTime))
            resource.scheduledDateTime = moment(this.scheduledDateTime).format();
        if (!_.isNil(this.maxDateTime))
            resource.maxDateTime = moment(this.maxDateTime).format();
        return resource;
    }

    static createEmptyInstance() {
        const programEncounter = new ProgramEncounter();
        programEncounter.uuid = General.randomUUID();
        programEncounter.observations = [];
        return programEncounter;
    }

    cloneForEdit() {
        const programEncounter = super.cloneForEdit(new ProgramEncounter());
        programEncounter.programEnrolment = this.programEnrolment;
        programEncounter.name = this.name;
        programEncounter.scheduledDateTime = this.scheduledDateTime;
        programEncounter.maxDateTime = this.maxDateTime;
        return programEncounter;
    }

    getEncounterDateValues() {
        const encounterDateValues = super.getEncounterDateValues();
        encounterDateValues[ProgramEncounter.fieldKeys.SCHEDULED_DATE_TIME] = this.scheduledDateTime;
        encounterDateValues[ProgramEncounter.fieldKeys.MAX_DATE_TIME] = this.maxDateTime;
        return encounterDateValues;
    }

    validate() {
        const validationResults = super.validate();
        if (!_.isNil(this.encounterDateTime) &&
            (General.dateAIsBeforeB(this.encounterDateTime, this.programEnrolment.enrolmentDateTime) || General.dateAIsAfterB(this.encounterDateTime, this.programEnrolment.programExitDateTime)))
            validationResults.push(new ValidationResult(false, AbstractEncounter.fieldKeys.ENCOUNTER_DATE_TIME, 'encounterDateNotInBetweenEnrolmentAndExitDate'));
        return validationResults;
    }

    static createFromScheduledVisit(nextScheduledVisit, encounterType, programEnrolment) {
        const programEncounter = ProgramEncounter.createEmptyInstance();
        programEncounter.encounterType = encounterType;
        programEncounter.scheduledDateTime = nextScheduledVisit.dueDate;
        programEncounter.maxDateTime = nextScheduledVisit.maxDate;

        programEncounter.name = nextScheduledVisit.name;
        programEncounter.programEnrolment = programEnrolment;
        return programEncounter;
    }

    getName() {
        return 'ProgramEncounter';
    }
}

export default ProgramEncounter;