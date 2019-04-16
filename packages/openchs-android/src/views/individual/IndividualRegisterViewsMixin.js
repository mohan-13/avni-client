import TypedTransition from "../../framework/routing/TypedTransition";
import IndividualRegisterFormView from "./IndividualRegisterFormView";
import {Actions} from "../../action/individual/IndividualRegisterActions";
import AbstractDataEntryState from "../../state/AbstractDataEntryState";
import {BaseEntity} from "openchs-models";
import CHSNavigator from "../../utility/CHSNavigator";

class Mixin {
    static next(view) {
        if (view.scrollToTop)
            view.scrollToTop();

        const {stitches} = view.props.params;

        view.dispatchAction(Actions.NEXT, {
            completed: (state, decisions, ruleValidationErrors, checklists, nextScheduledVisits, context) => {
                const onSaveCallback = ((source) => {
                    CHSNavigator.onSaveGoToProgramEnrolmentDashboardView(source, view.state.individual.uuid);
                });
                const headerMessage = `${view.I18n.t('registration', {type: view.registrationType})} - ${view.I18n.t('summaryAndRecommendations')}`;
                CHSNavigator.navigateToSystemsRecommendationView(view, decisions, ruleValidationErrors, view.state.individual, state.individual.observations, Actions.SAVE, onSaveCallback, headerMessage, null, null, null, stitches);
            },
            movedNext: (state) => {
                if (state.wizard.isFirstFormPage())
                    TypedTransition.from(view).with({stitches}).to(IndividualRegisterFormView);
            },
            validationFailed: (newState) => {
                if (AbstractDataEntryState.hasValidationError(view.state, BaseEntity.fieldKeys.EXTERNAL_RULE)) {
                    view.showError(newState.validationResults[0].message);
                }
            }
        });
    }

}

export default Mixin;
