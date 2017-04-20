import AbstractDataEntryState from "../../state/AbstractDataEntryState";
import Wizard from "../../state/Wizard";
import ObservationsHolder from "../../models/ObservationsHolder";
import AbstractEncounter from "../../models/AbstractEncounter";
import _ from 'lodash';
import ConceptService from "../../service/ConceptService";

class ProgramEncounterState extends AbstractDataEntryState {
    constructor(formElementGroup, wizard, isNewEntity, programEncounter) {
        super([], formElementGroup, wizard, isNewEntity);
        this.programEncounter = programEncounter;
    }

    static createOnLoad(programEncounter, form, isNewEntity) {
        return new ProgramEncounterState(form.firstFormElementGroup, new Wizard(form.numberOfPages, 1), isNewEntity, programEncounter);
    }

    clone() {
        return new ProgramEncounterState(this.formElementGroup, this.wizard.clone(), this.isNewEntity, this.programEncounter.cloneForEdit(), this.nextButtonLabelMap);
    }

    get observationsHolder() {
        return new ObservationsHolder(this.programEncounter.observations);
    }

    validateEntity() {
        return this.programEncounter.validate();
    }

    get staticFormElementIds() {
        return this.wizard.isFirstPage() ? [AbstractEncounter.fieldKeys.ENCOUNTER_DATE_TIME] : [];
    }

    static hasEncounterChanged(state, programEncounter) {
        if (_.isNil(state.programEncounter)) return true;
        return state.programEncounter.uuid === programEncounter.uuid;
    }

    validateEntityAgainstRule(ruleService) {
        return ruleService.validateAgainstRule(this.programEncounter, this.formElementGroup.form, 'ProgramEncounter');
    }

    executeRule(ruleService, context) {
        const decisions = ruleService.getDecisions(this.programEncounter, 'ProgramEncounter');
        context.get(ConceptService).addDecisions(this.programEncounter.observations, decisions);
        return decisions;
    }
}

export default ProgramEncounterState;